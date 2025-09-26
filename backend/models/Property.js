import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    propertyName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    propertyType: {
      type: String,
      enum: ["residential", "commercial", "hotel", "shortlet"],
      required: true,
    },
    numberOfUnits: {
      type: Number,
      required: true,
      min: 1,
    },
    requiresTenancyContract: {
      type: Boolean,
      default: false,
    },
    requiresInventoryReport: {
      type: Boolean,
      default: false,
    },
    requiresGuarantorForm: {      
      type: Boolean,
      default: false,
    },
    requiresVerification: {         
      type: Boolean,
      default: false,
    },
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Landlord",
      required: true,
    },
    propertyManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PropertyManager",
    },

    // ✅ Add tenants reference here
    tenants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant",
      },
    ],

    maintenanceRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MaintenanceRequest",
      },
    ],
    description: {
      type: String,
      trim: true,
    },
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Property", propertySchema);
