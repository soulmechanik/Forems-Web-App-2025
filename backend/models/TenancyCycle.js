import mongoose from "mongoose";

const TenancyCycleSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    landlordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,

    status: {
      type: String,
      enum: ["active", "ended", "terminated"],
      default: "active",
    },

    rentAmount: Number,
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
    leaseAgreementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeaseAgreement",
    },
  },
  { timestamps: true }
);

export default mongoose.model("TenancyCycle", TenancyCycleSchema);
