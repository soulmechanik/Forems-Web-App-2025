import mongoose from "mongoose";

const TenantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one tenant profile per user
    },

    tenancyApplications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TenancyApplication",
      },
    ],

    hasActiveTenancy: {
      type: Boolean,
      default: false,
    },

    currentTenancyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TenancyCycle",
      default: null,
    },

    tenancyHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TenancyCycle",
      },
    ],

    // ✅ KYC verification status
    kycVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Tenant", TenantSchema);
