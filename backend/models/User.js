import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    googleId: { type: String, required: true }, // required for Google OAuth users

    // --- Onboarding ---
    onboarded: { type: Boolean, default: false },
    whatsappNumber: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    country: { type: String },
    state: { type: String },
    agreedToTerms: { type: Boolean, default: false },
    agreedToTermsAt: { type: Date },

    // --- Banking ---
    hasCreatedBankAccount: { type: Boolean, default: false },
    bankDetails: {
      bankName: { type: String },
      accountNumber: { type: String },
      accountName: { type: String },
    },

    verified: { type: Boolean, default: false },

signature: {
  type: String, // store as base64 or a file URL
  default: null,
},

    // --- Roles & Access ---
    roles: {
      type: [String],
      enum: ["landlord", "agent", "tenant", "propertyManager", "staff"],
      default: [],
    },
    lastActiveRole: {
      type: String,
      enum: ["landlord", "agent", "tenant", "propertyManager"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
