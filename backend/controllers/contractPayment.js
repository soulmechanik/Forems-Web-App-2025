import asyncHandler from "express-async-handler";
import TenancyApplication from "../models/TenancyApplication.js";
import crypto from "crypto";
import Tenant from "../models/Tenant.js";
import Property from "../models/Property.js";



export const initiateLandlordContractPayment = asyncHandler(async (req, res) => {
  const { applicationId, amount } = req.body;

  console.log("🚀 [initiateLandlordContractPayment] Request received");
  console.log("➡️ applicationId:", applicationId, "amount:", amount);

  if (!applicationId || !amount) {
    console.log("❌ Missing required fields");
    res.status(400);
    throw new Error("Both applicationId and amount are required");
  }

  // 🔍 Fetch tenancy application and populate relationships
  const application = await TenancyApplication.findById(applicationId)
    .populate("tenant")
    .populate({
      path: "property",
      populate: {
        path: "landlord",
        populate: { path: "userId" }, // landlord user info
      },
    });

  if (!application) {
    console.log("❌ Tenancy application not found");
    res.status(404);
    throw new Error("Tenancy application not found");
  }

  const { tenant, property } = application;
  const landlord = property?.landlord;

  if (!tenant || !property || !landlord) {
    console.log("❌ Missing tenant/property/landlord info");
    res.status(404);
    throw new Error("Tenant, property, or landlord info missing in application");
  }

  // ✅ Handle different payment states
  if (application.contractPaymentInfo?.status === "successful") {
    console.log("⛔ Payment already completed");
    return res.status(400).json({
      success: false,
      message: "Contract payment already completed for this application.",
    });
  }

  let paymentReference;

  if (application.contractPaymentInfo?.status === "pending") {
    // Use existing reference if it exists, otherwise generate a new one
    if (!application.contractPaymentInfo.reference) {
      paymentReference = crypto.randomBytes(8).toString("hex");
      application.contractPaymentInfo.reference = paymentReference;
      await application.save();
      console.log("🆕 Pending payment had no reference. Generated new reference:", paymentReference);
    } else {
      paymentReference = application.contractPaymentInfo.reference;
      console.log("⏳ Payment already pending, reusing reference:", paymentReference);
    }

    return res.status(200).json({
      success: true,
      message: "Contract payment already pending. Use existing reference.",
      paymentReference,
      applicationId: application._id,
      landlord: {
        name: landlord.userId?.name || "Landlord",
        email: landlord.userId?.email || "",
      },
    });
  }

  // 🆕 New payment reference (first time or after failure)
  paymentReference = crypto.randomBytes(8).toString("hex");
  console.log("🆕 Creating new contractPaymentInfo with reference:", paymentReference);

  application.contractPaymentInfo = {
    reference: paymentReference,
    amount,
    status: "pending",
    initiatedAt: new Date(),
  };

  await application.save();
  console.log("💾 contractPaymentInfo saved to application:", application._id, "with reference:", paymentReference);

  res.status(201).json({
    success: true,
    message: "Contract payment initiated. Ready for Bani checkout.",
    paymentReference,
    applicationId: application._id,
    landlord: {
      name: landlord.userId?.name || "Landlord",
      email: landlord.userId?.email || "",
    },
  });
});






// ------------------------
// Bani Webhook for Contract Payment
// ------------------------


export const landlordContractPaymentWebhook = asyncHandler(async (req, res) => {
  console.log("📌 [Webhook] Incoming Bani payload:", JSON.stringify(req.body, null, 2));

  try {
    const { event, data = {} } = req.body;
    const customData = data.custom_data || {};
    const paymentReference = customData.paymentReference;

    // Step 1: Validate reference
    if (!paymentReference) {
      console.error("❌ [Webhook] Missing paymentReference in custom_data");
      return res.status(400).json({
        success: false,
        message: "Missing paymentReference in custom_data",
      });
    }

    // Step 2: Map Bani status to local status
    let newStatus;
    switch ((data.pay_status || "").toLowerCase()) {
      case "paid":
        newStatus = "successful";
        break;
      case "failed":
        newStatus = "failed";
        break;
      case "cancelled":
        newStatus = "cancelled";
        break;
      default:
        newStatus = "pending";
    }
    console.log(`ℹ️ [Webhook] Mapped Bani status '${data.pay_status}' → '${newStatus}'`);

    // Step 3: Find application by payment reference
    const application = await TenancyApplication.findOne({
      "contractPaymentInfo.reference": paymentReference,
    }).populate("tenant").populate("property");

    if (!application) {
      console.error("❌ [Webhook] No application found for reference:", paymentReference);
      return res.status(404).json({
        success: false,
        message: "Application with this payment reference not found",
      });
    }
    console.log("✅ [Webhook] Found application:", application._id);

    // Step 4: Handle idempotency + upgrade rules
    const currentStatus = application.contractPaymentInfo.status;
    console.log(`ℹ️ [Webhook] Current status: '${currentStatus}', Incoming: '${newStatus}'`);

    if (currentStatus === "successful") {
      console.log("⚠️ [Webhook] Already marked successful → ignoring downgrade attempt.");
      return res.status(200).json({ success: true, message: "Already processed" });
    }

    if (newStatus === "successful") {
      application.contractPaymentInfo.status = "successful";
      application.contractPaymentInfo.paidAt = new Date();
      console.log("✅ [Webhook] Upgrading payment status to successful.");
    } else {
      application.contractPaymentInfo.status = newStatus;
      console.log(`ℹ️ [Webhook] Updating status → '${newStatus}'`);
    }

    // Save raw payload for auditing
    application.contractPaymentInfo.metadata = data;

    // Step 5: Approve tenancy application if successful
    if (application.contractPaymentInfo.status === "successful" && application.status !== "approved") {
      application.status = "approved";
      application.logs = application.logs || [];
      application.logs.push({
        stage: "approved",
        message: "Tenancy application approved automatically after successful payment",
      });
      console.log("✅ [Webhook] Tenancy application approved:", application._id);
    }

    // Step 6: Update tenant profile
    if (application.tenant) {
      application.tenant.hasActiveTenancy = true;
      await application.tenant.save();
      console.log(`✅ [Webhook] Tenant ${application.tenant._id} marked as having active tenancy`);
    }

    // Step 7: Add tenant to property's tenants array if not already there
    if (application.property && application.tenant) {
      const property = await Property.findById(application.property._id);
      if (property && !property.tenants.includes(application.tenant._id)) {
        property.tenants.push(application.tenant._id);
        await property.save();
        console.log(`✅ [Webhook] Tenant ${application.tenant._id} added to property ${property._id}`);
      }
    }

    // Step 8: Placeholder for sending contract PDF
    console.log(`📄 [Webhook] Placeholder: Send signed contract PDF to tenant ${application.tenant?._id} and landlord ${application.property?.landlord}`);

    // Step 9: Save application updates
    await application.save();
    console.log("💾 [Webhook] Application saved with updated payment status:", application.contractPaymentInfo.status);

    res.status(200).json({ success: true, message: "Webhook processed successfully" });
  } catch (err) {
    console.error("❌ [Webhook] Error processing Bani webhook:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



