// models/contractPaymentInfoModel.js
import mongoose from "mongoose";

const contractPaymentInfoSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant", // ✅ references the Tenant model
    required: true,
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Landlord",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentReference: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["pending", "successful", "failed", "cancelled"],
    default: "pending",
  },
  paymentGatewayData: {
    type: mongoose.Schema.Types.Mixed,
  },
  logs: [
    {
      stage: { type: String }, // e.g., "initiated", "verified", "completed"
      message: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

const ContractPaymentInfo = mongoose.model(
  "ContractPaymentInfo",
  contractPaymentInfoSchema
);

export default ContractPaymentInfo;
