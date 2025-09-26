import mongoose from "mongoose";

const propertyManagerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // List of properties managed by this property manager
    managedProperties: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Property" }
    ],

    // Reference to landlord (so we know who they work under)
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Landlord",
    },

    // Verification workflow
    verifiedByStaff: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verifiedAt: { type: Date },
    approvedByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("PropertyManager", propertyManagerSchema);
