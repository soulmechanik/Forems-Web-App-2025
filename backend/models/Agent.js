import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    // Verification workflow
    verifiedByStaff: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verifiedAt: { type: Date },
    approvedByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Agent", agentSchema);
