import mongoose from "mongoose";

const TenantKYCSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      unique: true,
    },

    idType: {
      type: String,
      enum: ["National ID", "Passport", "Driver's License", "Voter's Card"],
      required: true,
    },

    idNumber: {
      type: String,
      required: true,
    },

    idDocumentUrl: {
      type: String,
      required: true,
    },

    proofOfAddressUrl: {
      type: String,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "approved", "rejected"],
      default: "pending",
    },

    // Verified by staff
    verifiedByStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // staff user
    },
    verifiedAt: {
      type: Date,
    },

    // Approved by admin/supervisor
    approvedByAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin user
    },
    approvedAt: {
      type: Date,
    },

    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TenantKYC", TenantKYCSchema);
