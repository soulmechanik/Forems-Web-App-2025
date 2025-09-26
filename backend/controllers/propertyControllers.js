import asyncHandler from "express-async-handler";
import Property from "../models/Property.js";
import Landlord from "../models/Landlord.js";
import PropertyManager from "../models/PropertyManager.js";
import Tenant from "../models/Tenant.js";
import TenancyApplication from "../models/TenancyApplication.js";
import User from "../models/User.js";
import { calculateApplicationScore } from "../utils/calculateTenantScore.js";


import { generateTenancyApplicationPDF } from "../utils/applicationpdfGenerator.js";
import { sendEmail } from "../utils/sendEmail.js";


// @desc    Create a new property
// @route   POST /api/properties
// @access  Private (Landlord or PropertyManager)

export const createProperty = asyncHandler(async (req, res) => {
  console.log("➡️ Starting property creation...");

  const role = req.user.lastActiveRole;
  const { bankDetails, landlordId, managerId, ...propertyData } = req.body;

  console.log("👤 User ID:", req.user._id.toString());
  console.log("👤 User Role (lastActiveRole):", role);

  let landlordDoc = null;
  let managerDoc = null;

  // Fetch user
  const userDoc = await User.findById(req.user._id);
  if (!userDoc) {
    console.log("❌ User not found in DB.");
    return res.status(404).json({ message: "User not found" });
  }

  // ------------------------------
  // 1. Handle bank details setup
  // ------------------------------
  if (!userDoc.hasCreatedBankAccount) {
    if (!bankDetails?.accountNumber || !bankDetails?.bankName) {
      console.log("⚠️ Bank details required for first property creation.");
      return res.status(400).json({ message: "Bank details required." });
    }

    console.log("💾 Saving bank details for user...");
    userDoc.bankDetails = bankDetails;
    userDoc.hasCreatedBankAccount = true;
    await userDoc.save();
    console.log("✅ Bank details saved for user:", userDoc._id);
  } else {
    console.log("ℹ️ User already has bank account setup.");
  }

  // ------------------------------
  // 2. Handle landlord role
  // ------------------------------
  if (role === "landlord") {
    console.log("🔍 Fetching landlord profile...");
    landlordDoc = await Landlord.findOne({ userId: req.user._id });
    if (!landlordDoc) {
      console.log("❌ Landlord profile not found.");
      return res.status(404).json({ message: "Landlord profile not found" });
    }

    propertyData.landlord = landlordDoc._id;

    // Optional manager assignment
    if (managerId) {
      managerDoc = await PropertyManager.findById(managerId);
      if (managerDoc) {
        propertyData.propertyManager = managerDoc._id;
        console.log("👔 Linking property to chosen property manager:", managerDoc._id);
      } else {
        console.log("⚠️ Manager ID provided but not found.");
      }
    }
  }

  // ------------------------------
  // 3. Handle property manager role
  // ------------------------------
  else if (role === "propertyManager") {
    console.log("🔍 Fetching property manager profile...");
    managerDoc = await PropertyManager.findOne({ userId: req.user._id });
    if (!managerDoc) {
      console.log("❌ Property manager profile not found.");
      return res.status(404).json({ message: "Property manager profile not found" });
    }

    propertyData.propertyManager = managerDoc._id;

    // Optional landlord assignment
    if (landlordId) {
      landlordDoc = await Landlord.findById(landlordId);
      if (landlordDoc) {
        propertyData.landlord = landlordDoc._id;
        console.log("👔 Linking property to chosen landlord:", landlordDoc._id);
      } else {
        console.log("⚠️ Landlord ID provided but not found.");
      }
    }
  }

  // ------------------------------
  // 4. Reject unauthorized roles
  // ------------------------------
  else {
    console.log("❌ Unauthorized role trying to create property.");
    return res.status(403).json({
      message: "Only landlords or property managers can create properties.",
    });
  }

  // ------------------------------
  // 5. Set default fields for new property
  // ------------------------------

 propertyData.requiresGuarantorForm = propertyData.requiresGuarantorForm ?? true;
propertyData.requiresVerification = propertyData.requiresVerification ?? true;


  // ------------------------------
  // 6. Create property
  // ------------------------------
  console.log("🛠 Creating new property with data:", propertyData);
  const newProperty = await Property.create(propertyData);

  // Link property back
  if (landlordDoc) {
    landlordDoc.properties.push(newProperty._id);
    if (managerDoc && !landlordDoc.propertyManagers.includes(managerDoc._id)) {
      landlordDoc.propertyManagers.push(managerDoc._id);
    }
    await landlordDoc.save();
    console.log("✅ Property linked to landlord:", landlordDoc._id);
  }

  if (managerDoc) {
    managerDoc.managedProperties.push(newProperty._id);
    if (landlordDoc && !managerDoc.landlord) {
      managerDoc.landlord = landlordDoc._id;
    }
    await managerDoc.save();
    console.log("✅ Property linked to property manager:", managerDoc._id);
  }

  console.log("🏠 Property created successfully with ID:", newProperty._id);

  res.status(201).json({
    message: "Property created successfully",
    property: newProperty,
  });
});





export const getUserProperties = asyncHandler(async (req, res) => {
  console.log("📌 [getUserProperties] Request started");

  console.log("👤 Authenticated user:", {
    id: req.user._id,
    role: req.user.lastActiveRole,
  });

  const role = req.user.lastActiveRole;
  let properties = [];

  if (role === "landlord") {
    console.log("➡️ User is a landlord, fetching landlord profile...");

    const landlordDoc = await Landlord.findOne({ userId: req.user._id });

    if (!landlordDoc) {
      console.error("❌ No landlord profile found for user:", req.user._id);
      return res.status(404).json({ message: "Landlord profile not found" });
    }

    console.log("✅ Landlord profile found:", landlordDoc._id);

    properties = await Property.find({ landlord: landlordDoc._id })
      .populate({
        path: "landlord",
        populate: { path: "userId", select: "name email" }, // 👈 get landlord name & email
      })
      .populate({
        path: "propertyManager",
        populate: { path: "userId", select: "name email" }, // 👈 get manager name & email
      })
      .lean();

    console.log(`🏘️ Found ${properties.length} properties for landlord`);
  } else if (role === "propertyManager") {
    console.log("➡️ User is a property manager, fetching manager profile...");

    const managerDoc = await PropertyManager.findOne({ userId: req.user._id });

    if (!managerDoc) {
      console.error("❌ No property manager profile found for user:", req.user._id);
      return res.status(404).json({ message: "Property manager profile not found" });
    }

    console.log("✅ Property manager profile found:", managerDoc._id);

    properties = await Property.find({ propertyManager: managerDoc._id })
      .populate({
        path: "landlord",
        populate: { path: "userId", select: "name email" },
      })
      .populate({
        path: "propertyManager",
        populate: { path: "userId", select: "name email" },
      })
      .lean();

    console.log(`🏘️ Found ${properties.length} properties for property manager`);
  } else {
    console.warn("⚠️ Unauthorized role:", role);
    return res.status(403).json({ message: "Unauthorized role" });
  }

  // 🛠️ Transform so you get either landlord name or manager name clearly
  const formatted = properties.map((p) => {
    let ownerName = null;
    let ownerRole = null;

    if (p.landlord?.userId?.name) {
      ownerName = p.landlord.userId.name;
      ownerRole = "landlord";
    } else if (p.propertyManager?.userId?.name) {
      ownerName = p.propertyManager.userId.name;
      ownerRole = "propertyManager";
    }

    return {
      ...p,
      ownerName,
      ownerRole,
    };
  });

  console.log("📤 Sending response with properties + ownerName...");
  res.status(200).json(formatted);

  console.log("✅ [getUserProperties] Request finished successfully");
});


export const getPropertyById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("➡️ [getPropertyById] Request started for property ID:", id);

  // ------------------------------
  // 1. Fetch property with relations
  // ------------------------------
  console.log("🔍 Fetching property and populating relations...");
  const property = await Property.findById(id)
    .populate({
      path: "landlord",
      populate: {
        path: "userId",
        select: "name email telegramId",
      },
    })
    .populate({
      path: "propertyManager", // singular, matches schema
      populate: {
        path: "userId",
        select: "name email telegramId",
      },
    })
    .populate({
      path: "tenants",
      populate: {
        path: "userId",
        select: "name email phoneNumber",
      },
    });

  if (!property) {
    console.log("❌ Property not found with ID:", id);
    res.status(404);
    throw new Error("Property not found");
  }
  console.log("✅ Property found:", property._id.toString());

  // ------------------------------
  // 2. Authorization check
  // ------------------------------
  console.log("🔑 Checking if user is authorized to view property...");
  const userId = req.user._id.toString();
  const landlordId = property.landlord?.userId?._id?.toString();
  const managerId = property.propertyManager?.userId?._id?.toString();

  console.log("👤 Requesting user:", userId);
  console.log("🏠 Landlord user ID:", landlordId || "None");
  console.log("👔 Property manager user ID:", managerId || "None");

  if (landlordId !== userId && managerId !== userId) {
    console.log("⛔ User is NOT authorized to view this property.");
    res.status(403);
    throw new Error("Not authorized to view this property");
  }

  console.log("✅ User is authorized to view this property.");

  // ------------------------------
  // 3. Send response
  // ------------------------------
  console.log("📤 Sending property data in response...");
  res.json(property);
  console.log("🏁 [getPropertyById] Request completed successfully.");
});



// @desc    Get properties that a tenant has NOT joined yet
// @route   GET /api/properties/joinable
// @access  Private (tenant must be logged in)
export const getJoinableProperties = asyncHandler(async (req, res) => {
  console.log("📌 [getJoinableProperties] Request started");

  try {
    console.log("🔍 Fetching all properties from database with landlord & propertyManager info...");

    const properties = await Property.find()
      .populate({
        path: "landlord",
        populate: {
          path: "userId", // correct path
          select: "name email",
        },
      })
      .populate({
        path: "propertyManager",
        populate: {
          path: "userId", // correct path
          select: "name email",
        },
      });

    console.log(`✅ Fetched ${properties.length} properties from DB`);

    const formattedProperties = properties.map((p) => {
      console.log(`📄 Formatting property: ${p.propertyName} (${p._id})`);

      return {
        id: p._id,
        name: p.propertyName,
        address: p.address,
        state: p.state,
        landlord: p.landlord?.userId?.name || "No landlord assigned",
        manager: p.propertyManager?.userId?.name || "No manager assigned",
        uniqueKey: p.uniqueKey || p._id,
      };
    });

    console.log("📤 Sending joinable properties to client");
    res.json(formattedProperties);
    console.log("🏁 [getJoinableProperties] Request completed successfully.");
  } catch (error) {
    console.error("❌ Error fetching joinable properties:", error);
    res.status(500);
    throw new Error("Failed to fetch joinable properties");
  }
});

export const getPropertyApplicationRequirements = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400);
    throw new Error("Property ID is required");
  }

  // Fetch property with landlord & propertyManager references
  const property = await Property.findById(id)
    .populate({
      path: "landlord",
      populate: { path: "userId", select: "name" } // get landlord's user name
    })
    .populate({
      path: "propertyManager",
      populate: { path: "userId", select: "name" } // get manager's user name
    })
    .select(
      "propertyName requiresTenancyContract requiresInventoryReport requiresGuarantorForm requiresVerification landlord propertyManager"
    );

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  // Prepare response
  const response = {
    success: true,
    data: {
      requirements: {
        requiresTenancyContract: property.requiresTenancyContract || false,
        requiresInventoryReport: property.requiresInventoryReport || false,
        requiresGuarantorForm: property.requiresGuarantorForm || false,
        requiresVerification: property.requiresVerification || false,
      },
      landlordName: property.landlord?.userId?.name || "No landlord assigned",
      managerName: property.propertyManager?.userId?.name || "No manager assigned",
    },
  };

  res.status(200).json(response);
});





export const submitTenancyApplication = asyncHandler(async (req, res) => {
  console.log("📌 [submitTenancyApplication] Request started...");

  try {
    // 1️⃣ Extract tenant user info from JWT
    const userId = req.user._id;
    console.log("👤 Tenant User ID:", userId);

    // 2️⃣ Debug incoming request
    console.log("📥 req.body keys:", Object.keys(req.body || {}));
    console.log("📥 req.files keys:", Object.keys(req.files || {}));

    // 3️⃣ Validate passport photo
    const passportPhotos = req.files?.passportPhoto;
    const guarantorPhotos = req.files?.guarantorPassportPhotos;
    if (!passportPhotos || passportPhotos.length === 0) {
      console.error("❌ Missing passport photo");
      res.status(400);
      throw new Error("Passport photo is required");
    }
    const passportPhoto = passportPhotos[0].path;
    console.log("📷 Tenant passport uploaded:", passportPhoto);

    // 4️⃣ Parse formData JSON
    let formData = {};
    try {
      formData = JSON.parse(req.body.formData);
      console.log("📝 Parsed formData keys:", Object.keys(formData));
    } catch (error) {
      console.error("❌ Error parsing formData:", error.message);
      res.status(400);
      throw new Error("Invalid formData format");
    }

    // 5️⃣ Validate propertyId
    const propertyId = formData?.propertyId;
    if (!propertyId) {
      console.warn("⚠️ No propertyId received in formData!");
      res.status(400);
      throw new Error("Property ID is required");
    }
    console.log("🏠 propertyId received:", propertyId);

    // 6️⃣ Fetch property (with landlord + manager → nested populate to get User info)
    const property = await Property.findById(propertyId)
      .populate({
        path: "landlord",
        populate: { path: "userId", model: "User", select: "name email" },
      })
      .populate({
        path: "propertyManager",
        populate: { path: "userId", model: "User", select: "name email" },
      });

    if (!property) {
      res.status(404);
      throw new Error("Property not found");
    }
    console.log("🏠 Property found:", property.propertyName);

    // 7️⃣ Extract landlord + manager details properly
    const landlordName = property.landlord?.userId?.name || "Unknown";
    const landlordEmail = property.landlord?.userId?.email || null;

    const managerName = property.propertyManager?.userId?.name || "Not assigned";
    const managerEmail = property.propertyManager?.userId?.email || null;

    console.log("👤 Landlord:", landlordName, landlordEmail || "❌ No email found");
    if (property.propertyManager) {
      console.log("👨‍💼 Manager:", managerName, managerEmail || "❌ No email found");
    } else {
      console.log("ℹ️ Manager not assigned for this property.");
    }

    // 8️⃣ Guarantor check
    let guarantorPassportPhotos = [];
    if (property.requiresGuarantorForm) {
      if (!guarantorPhotos || guarantorPhotos.length === 0) {
        console.error("❌ Missing guarantor photos");
        res.status(400);
        throw new Error("At least one guarantor photo is required");
      }
      guarantorPassportPhotos = guarantorPhotos.map(f => f.path);
      console.log("📷 Guarantor photos uploaded:", guarantorPassportPhotos.length);
    }

    // 9️⃣ Fetch tenant snapshot
    const tenantUser = await User.findById(userId).select("name email signature");
    if (!tenantUser) {
      res.status(404);
      throw new Error("Tenant user profile not found");
    }
    const tenantName = tenantUser.name;
    console.log("👤 Tenant name:", tenantName);

    // 🔟 Prevent duplicate applications
    const tenantDoc = await Tenant.findOne({ userId });
    if (!tenantDoc) {
      res.status(404);
      throw new Error("Tenant profile not found");
    }

    const existingApplication = await TenancyApplication.findOne({
      tenant: tenantDoc._id,
      property: propertyId,
    }).sort({ createdAt: -1 });

    if (existingApplication) {
      console.log("🔍 Existing application:", existingApplication._id);
      if (existingApplication.status === "pending") {
        return res.status(400).json({
          success: false,
          message: "You already have a pending application for this property.",
        });
      } else if (existingApplication.status === "approved") {
        return res.status(400).json({
          success: false,
          message: "You already have an active tenancy for this property.",
        });
      }
      console.log("♻️ Previous application was rejected → new one allowed.");
    }

    // 1️⃣1️⃣ Save signature if present
    const signatureDataUrl = formData.tenancyContract?.signature;
    if (signatureDataUrl) {
      await User.findByIdAndUpdate(userId, { signature: signatureDataUrl });
      console.log("✍️ Signature saved");
    }

    // 1️⃣2️⃣ Create and save application
    const application = new TenancyApplication({
      tenant: tenantDoc._id,
      tenantName,
      property: property._id,
      passportPhoto,
      guarantorPassportPhotos,
      formData,
      signature: signatureDataUrl || tenantUser.signature || null,
      fastTrack: { paid: false, paymentReference: null, datePaid: null },
      status: "pending",
    });
    await application.save();
    console.log("✅ Application saved:", application._id);

    // 1️⃣3️⃣ Link application to tenant doc
    tenantDoc.tenancyApplications.push(application._id);
    await tenantDoc.save();
    console.log("🗂 Application linked to Tenant doc");

    // 1️⃣4️⃣ Generate PDF
    let pdfBuffer;
    try {
      pdfBuffer = await generateTenancyApplicationPDF(application, tenantUser, property);
      console.log("📄 PDF generated");
    } catch (err) {
      console.error("❌ PDF generation failed:", err);
    }

    // 1️⃣5️⃣ Send emails
    if (pdfBuffer) {
      // Tenant confirmation
      try {
        await sendEmail({
          to: tenantUser.email,
          subject: "Your Tenancy Application - Forems Africa",
          text: `Hello ${tenantUser.name},\n\nThank you for submitting your tenancy application for ${property.propertyName}.\nPlease find your application PDF attached.`,
          html: `<p>Hello <strong>${tenantUser.name}</strong>,</p>
                 <p>Thank you for submitting your tenancy application for <strong>${property.propertyName}</strong>.</p>
                 <p>Please find your application PDF attached.</p>`,
          attachments: [
            { filename: `Tenancy_Application_${application._id}.pdf`, content: pdfBuffer },
          ],
        });
        console.log("📧 Confirmation email sent to tenant:", tenantUser.email);
      } catch (err) {
        console.error("❌ Failed to send tenant email:", err);
      }

      // Landlord notification
      if (landlordEmail) {
        try {
          await sendEmail({
            to: landlordEmail,
            subject: `New Tenancy Application - ${property.propertyName}`,
            text: `Hello ${landlordName},\n\nA new tenancy application has been submitted for your property (${property.propertyName}) by ${tenantUser.name}.\nSee attached application PDF.`,
            html: `<p>Hello <strong>${landlordName}</strong>,</p>
                   <p>A new tenancy application has been submitted for your property <strong>${property.propertyName}</strong> by <strong>${tenantUser.name}</strong>.</p>
                   <p>Please see the attached application PDF.</p>`,
            attachments: [
              { filename: `Tenancy_Application_${application._id}.pdf`, content: pdfBuffer },
            ],
          });
          console.log("📧 Notification sent to landlord:", landlordEmail);
        } catch (err) {
          console.error("❌ Failed to send landlord email:", err);
        }
      } else {
        console.log("ℹ️ Landlord email not found.");
      }

      // Manager notification
      if (managerEmail) {
        try {
          await sendEmail({
            to: managerEmail,
            subject: `New Tenancy Application - ${property.propertyName}`,
            text: `Hello ${managerName},\n\nA new tenancy application has been submitted for the property (${property.propertyName}) you manage by ${tenantUser.name}.\nSee attached application PDF.`,
            html: `<p>Hello <strong>${managerName}</strong>,</p>
                   <p>A new tenancy application has been submitted for the property <strong>${property.propertyName}</strong> that you manage by <strong>${tenantUser.name}</strong>.</p>
                   <p>Please see the attached application PDF.</p>`,
            attachments: [
              { filename: `Tenancy_Application_${application._id}.pdf`, content: pdfBuffer },
            ],
          });
          console.log("📧 Notification sent to manager:", managerEmail);
        } catch (err) {
          console.error("❌ Failed to send manager email:", err);
        }
      } else {
        console.log("ℹ️ Manager not assigned for this property.");
      }

      // Internal copy to Forems Africa
      try {
        await sendEmail({
          to: "forems.africa@gmail.com",
          subject: `COPY: Tenancy Application - ${property.propertyName}`,
          text: `A tenancy application was submitted for ${property.propertyName} by ${tenantUser.name}.\nSee attached PDF.`,
          html: `<p>A tenancy application was submitted for <strong>${property.propertyName}</strong> by <strong>${tenantUser.name}</strong>.</p>
                 <p>See attached PDF for full details.</p>`,
          attachments: [
            { filename: `Tenancy_Application_${application._id}.pdf`, content: pdfBuffer },
          ],
        });
        console.log("📧 Internal copy sent to forems.africa@gmail.com");
      } catch (err) {
        console.error("❌ Failed to send internal copy email:", err);
      }
    }

    // 1️⃣6️⃣ Final response
    res.status(201).json({
      success: true,
      message: "Tenancy application submitted. Emails sent with PDF attached.",
      data: {
        applicationId: application._id,
        status: application.status,
      },
    });

  } catch (err) {
    console.error("🔥 Unhandled error in submitTenancyApplication:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
});










/**
 * @desc    Get all applications for tenant, landlord, or property manager
 * @route   GET /api/applications
 * @access  Private
 */




// ------------------------------
// Controller: Get Tenant Applications
// ------------------------------


// Utility function (assume you already have this)




export const getTenantApplications = asyncHandler(async (req, res) => {
  const user = req.user;
  console.log(`➡️ [getTenantApplications] Request started by ${user.lastActiveRole}: ${user.name} (${user._id})`);

  let applications = [];

  // ------------------------------
  // 1️⃣ Fetch applications based on role
  // ------------------------------
  if (user.lastActiveRole === "tenant") {
    const tenantDoc = await Tenant.findOne({ userId: user._id }).populate({
      path: "tenancyApplications",
      populate: [
        {
          path: "property",
          populate: [
            {
              path: "landlord",
              populate: { path: "userId", select: "name email whatsappNumber state gender roles" }
            },
            {
              path: "propertyManager",
              populate: { path: "userId", select: "name email whatsappNumber state gender roles" }
            }
          ]
        }
      ],
      options: { sort: { createdAt: -1 } } // newest first
    });

    if (!tenantDoc) {
      return res.status(404).json({ success: false, message: "Tenant profile not found." });
    }

    applications = tenantDoc.tenancyApplications;

  } else if (user.lastActiveRole === "landlord") {
    applications = await TenancyApplication.find()
      .populate({
        path: "property",
        match: { landlord: user._id },
        populate: [
          {
            path: "landlord",
            populate: { path: "userId", select: "name email whatsappNumber state gender roles" }
          },
          {
            path: "propertyManager",
            populate: { path: "userId", select: "name email whatsappNumber state gender roles" }
          }
        ]
      })
      .populate({
        path: "tenant",
        populate: { path: "userId", select: "name email whatsappNumber state gender roles" }
      });

    // filter out applications where property populate failed (not belonging to this landlord)
    applications = applications.filter(app => app.property);

  } else if (user.lastActiveRole === "propertyManager") {
    applications = await TenancyApplication.find()
      .populate({
        path: "property",
        match: { propertyManager: user._id },
        populate: [
          {
            path: "landlord",
            populate: { path: "userId", select: "name email whatsappNumber state gender roles" }
          },
          {
            path: "propertyManager",
            populate: { path: "userId", select: "name email whatsappNumber state gender roles" }
          }
        ]
      })
      .populate({
        path: "tenant",
        populate: { path: "userId", select: "name email whatsappNumber state gender roles" }
      });

    applications = applications.filter(app => app.property);
  }

  console.log(`✅ Fetched ${applications.length} applications`);

  // ------------------------------
  // 2️⃣ Calculate scores
  // ------------------------------
  const applicationsWithScore = applications.map(app => ({
    ...app.toObject(), // convert Mongoose doc to plain object
    score: calculateApplicationScore(app),
  }));

  // ------------------------------
  // 3️⃣ Rank applications per property
  // ------------------------------
  const applicationsByProperty = {};
  applicationsWithScore.forEach(app => {
    const propertyId = app.property?._id?.toString() || "unknown";
    if (!applicationsByProperty[propertyId]) applicationsByProperty[propertyId] = [];
    applicationsByProperty[propertyId].push(app);
  });

  Object.values(applicationsByProperty).forEach(apps => {
    apps.sort((a, b) => b.score - a.score);
    apps.forEach((app, index) => {
      app.rank = index + 1;
    });
  });

  // ------------------------------
  // 4️⃣ Send response
  // ------------------------------
  res.status(200).json({
    success: true,
    count: applicationsWithScore.length,
    data: applicationsWithScore,
  });

  console.log("🏁 [getTenantApplications] Request completed successfully.");
});



/**
 * Get all tenancy applications for a landlord or property manager
 */
export const getApplicationsForUser = asyncHandler(async (req, res) => {
  try {
    console.log("➡️ [getApplicationsForUser] Controller started");

    const userId = req.user._id;
    const role = req.user.lastActiveRole;
    console.log("👤 Authenticated User:", { userId, role });

    let propertyIds = [];

    // --- Role check & property ownership ---
    if (role === "landlord") {
      const landlord = await Landlord.findOne({ userId }).lean();
      if (!landlord) {
        return res.status(404).json({
          success: false,
          message: "Landlord profile not found",
        });
      }
      propertyIds = landlord.properties || [];
    } else if (role === "propertyManager") {
      const manager = await PropertyManager.findOne({ userId }).lean();
      if (!manager) {
        return res.status(404).json({
          success: false,
          message: "Property Manager profile not found",
        });
      }
      propertyIds = manager.properties || [];
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized role for this operation",
      });
    }

    // --- Fetch applications for the properties ---
    let applications = await TenancyApplication.find({
      property: { $in: propertyIds },
    })
      .populate({
        path: "tenant",
        select: "userId kycVerified hasActiveTenancy tenantName",
        populate: {
          path: "userId",
          select: "name email whatsappNumber",
        },
      })
      .populate({
        path: "property",
        select: "propertyName address state propertyType numberOfUnits landlord",
        populate: {
          path: "landlord",
          select: "userId",
          populate: { path: "userId", select: "name email whatsappNumber" },
        },
      })
      .populate("reviewedBy", "name email") // optional, in case you want to show reviewer
      .lean();

    // --- Flatten tenant & landlord info for frontend ---
    applications = applications.map((app) => {
      const tenantUser = app.tenant?.userId || {};
      const landlordUser = app.property?.landlord?.userId || {};

      return {
        ...app,
        tenantName: tenantUser.name || app.tenantName,
        tenantEmail: tenantUser.email || null,
        tenantWhatsapp: tenantUser.whatsappNumber || null,
        landlordName: landlordUser.name || null,
        landlordEmail: landlordUser.email || null,
        landlordWhatsapp: landlordUser.whatsappNumber || null,
        kycVerified: app.tenant?.kycVerified || false,
        hasActiveTenancy: app.tenant?.hasActiveTenancy || false,
      };
    });

    // --- Calculate scores ---
    applications = applications.map((app) => ({
      ...app,
      score: calculateApplicationScore(app),
    }));

    return res.json({
      success: true,
      applications,
      applicationsCount: applications.length,
      message:
        applications.length > 0
          ? "Applications retrieved successfully"
          : "No applications found",
    });
  } catch (error) {
    console.error("❌ Error in [getApplicationsForUser]:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});









// @desc    Get landlord's tenants with stats
// @route   GET /api/landlord/my-tenants
// @access  Private (landlord)


export const getMyTenants = asyncHandler(async (req, res) => {
  console.log("📌 [MyTenants] Starting fetch for user:", req.user.id);

  // 1️⃣ Fetch landlord document linked to the logged-in user
  const landlord = await Landlord.findOne({ userId: req.user.id });
  if (!landlord) {
    console.error("❌ [MyTenants] Landlord not found for user:", req.user.id);
    return res.status(404).json({ message: "Landlord not found" });
  }
  console.log("ℹ️ [MyTenants] Landlord found:", landlord._id);

  // 2️⃣ Fetch all properties for this landlord
  const properties = await Property.find({ landlord: landlord._id });
  console.log(`ℹ️ [MyTenants] Found ${properties.length} properties for landlord`);

  // Stats placeholders
  let totalUnits = 0;
  let totalTenants = 0;

  // 3️⃣ Iterate through properties to get tenants and calculate stats
  const propertyData = await Promise.all(
    properties.map(async (property) => {
      console.log(`📌 [MyTenants] Processing property: ${property.propertyName} (${property._id})`);

      totalUnits += property.numberOfUnits;

      // Fetch tenants for this property and populate name/email/phone/gender
      const tenants = await Tenant.find({ _id: { $in: property.tenants } })
        .populate("userId", "name email whatsappNumber gender"); 

      console.log(`ℹ️ [MyTenants] Found ${tenants.length} tenants for property`);

      totalTenants += tenants.length;

      // Map tenants to simplified format including gender and passport photo
      const tenantList = await Promise.all(
        tenants.map(async (t) => {
          // Fetch the tenancy application to get passport photo
          const tenancyApp = await TenancyApplication.findOne({ tenant: t._id, property: property._id });
          
          return {
            tenantId: t._id,
            name: t.userId?.name || "N/A",
            email: t.userId?.email || "N/A",
            phone: t.userId?.whatsappNumber || "N/A",
            gender: t.userId?.gender || "N/A",
            passportPhoto: tenancyApp?.passportPhoto || null,
            hasActiveTenancy: t.hasActiveTenancy,
          };
        })
      );

      return {
        propertyId: property._id,
        propertyName: property.propertyName,
        numberOfUnits: property.numberOfUnits,
        tenants: tenantList,
      };
    })
  );

  // 4️⃣ Calculate average vacancy rate
  const averageVacancyRate =
    totalUnits > 0 ? ((totalUnits - totalTenants) / totalUnits) * 100 : 0;

  console.log("✅ [Stats] Total properties:", properties.length);
  console.log("✅ [Stats] Total units:", totalUnits);
  console.log("✅ [Stats] Total tenants:", totalTenants);
  console.log("✅ [Stats] Average vacancy rate:", averageVacancyRate.toFixed(2) + "%");

  // 5️⃣ Return response
  res.json({
    totalProperties: properties.length,
    totalUnits,
    totalTenants,
    averageVacancyRate: averageVacancyRate.toFixed(2),
    properties: propertyData,
  });
});
