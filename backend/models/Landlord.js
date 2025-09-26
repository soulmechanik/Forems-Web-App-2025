import mongoose from "mongoose";

const landlordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // List of properties owned by this landlord
    properties: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Property" }
    ],

    // List of property managers assigned by this landlord
    propertyManagers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "PropertyManager" }
    ],

    // Verification workflow
    verifiedByStaff: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verifiedAt: { type: Date },
    approvedByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Landlord", landlordSchema);
