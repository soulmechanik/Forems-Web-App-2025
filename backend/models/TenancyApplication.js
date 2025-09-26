import mongoose from "mongoose";

const tenancyApplicationSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    // snapshot of User.name at time of application
    tenantName: {
      type: String,
      required: true,
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    passportPhoto: {
      type: String,
      required: true,
    },

    guarantorPassportPhotos: [
      { type: String, required: true }
    ],

    // all other form fields serialized
    formData: {
      type: Object,
      required: true,
    },

    // landlord or property manager who reviewed the application
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // could be landlord or property manager user
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // ---------------------------
    // Contract payment tracking
    // ---------------------------
    contractPaymentInfo: {
      reference: { type: String },       // Bani payment reference
      amount: { type: Number },          // Amount paid
      currency: { type: String, default: "NGN" },
      status: {                          // e.g., "pending", "successful", "failed", "cancelled"
        type: String,
        enum: ["pending", "successful", "failed", "cancelled"],
        default: "pending",
      },
      metadata: { type: Object },        // full payload from Bani
      initiatedAt: { type: Date },       // when payment was started
      paidAt: { type: Date },            // when payment was successful
    },

    // ---------------------------
    // Fast-track payment tracking (optional)
    // ---------------------------
    fastTrack: {
      paid: { type: Boolean, default: false },
      paymentReference: { type: String, default: null },
      datePaid: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

export default mongoose.model("TenancyApplication", tenancyApplicationSchema);
