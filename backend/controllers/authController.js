

import jwt from "jsonwebtoken";
import User from "../models/User.js"

import Tenant from "../models/Tenant.js";
import Landlord from "../models/Landlord.js";
import PropertyManager from "../models/PropertyManager.js";
import Agent from "../models/Agent.js";


import asyncHandler from "express-async-handler";
import { registerUserService, registerGoogleUserService,  sendVerificationEmailService, verifyEmailService, resendVerificationEmailService, requestPasswordResetService,  resetPasswordService, } from "../services/authServices.js";

import { completeUserOnboardingService } from "../services/userService.js";

import { generateToken } from "../utils/tokenUtils.js";

import axios from 'axios';


/**
 * Send token in HTTP-only cookie
 */
const sendTokenCookie = (res, token) => {
  res.cookie("foremsToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/**
 * Register a new user
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Call service to create user
    const { user } = await registerUserService({ name, email, password });

    // Remove sensitive fields
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      onboarded: user.onboarded,
      createdAt: user.createdAt,
    };

    // Send verification email
    try {
      await sendVerificationEmailService(user);
    } catch (emailErr) {
      console.error("[REGISTER] Email sending failed:", emailErr.message);
      // Do not throw here — user is still registered
    }

    // Respond
    res.status(201).json({
      message: `Successfully registered! A verification email has been sent to ${email}. Please click the link to verify your account and then login.`,
      user: safeUser,
    });
  } catch (err) {
    console.error("[CONTROLLER REGISTER] Error:", err.message);

    // Respond with JSON error for frontend
    res.status(400).json({
      message: err.message || "Registration failed",
    });
  }
});






export const googleAuth = asyncHandler(async (req, res) => {
  const { email, name, googleId } = req.body;

  if (!email || !name || !googleId) {
    console.warn("[GOOGLE AUTH] Missing fields:", { email, name, googleId });
    return res.status(400).json({ error: "Missing required fields: email, name, googleId" });
  }

  try {
    let user = await User.findOne({ email });

    if (user) {
      // Existing user
      console.log(`[GOOGLE AUTH] Existing user found: ${email}`);

      // Link Google ID if missing
      if (!user.googleId) {
        user.googleId = googleId;
        console.log(`[GOOGLE AUTH] Linked Google ID for ${email}`);
      }

      // Ensure verified = true for Google users
      if (user.verified !== true) {
        user.verified = true;
        console.log(`[GOOGLE AUTH] Set verified=true for existing Google user`);
      }

      await user.save();
    } else {
      // New user
      user = await User.create({
        email,
        name,
        googleId,
        onboarded: false,
        roles: [],         // default empty roles
        verified: true,    // Google users are auto-verified
      });
      console.log(`[GOOGLE AUTH] Created new Google user with verified=true: ${email}`);
    }

    // Log DB values for debugging
    console.log("[GOOGLE AUTH] DB values:", {
      onboarded: user.onboarded,
      verified: user.verified,
      roles: user.roles,
      lastActiveRole: user.lastActiveRole,
    });

    // Generate JWT token for frontend
    const token = generateToken(user._id);

    // Set cookie for optional frontend use
    res.cookie("foremsToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Prepare safe user object for frontend / NextAuth
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      onboarded: Boolean(user.onboarded),
      verified: Boolean(user.verified), // always boolean
      roles: user.roles ?? [],
      lastActiveRole: user.lastActiveRole ?? null,
      createdAt: user.createdAt,
    };

    console.log("[GOOGLE AUTH] Sending user to frontend:", safeUser);

    res.status(200).json({ user: safeUser, token });
  } catch (err) {
    console.error("[GOOGLE AUTH ERROR]", err.message, err.stack);
    res.status(500).json({ error: "google-auth-failed", message: err.message });
  }
});












/**
 * Logout user
 */
export const logout = asyncHandler(async (req, res) => {
  res.cookie("foremsToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: "Logged out successfully" });
});







// verifyEmailController.js
export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ success: false, message: "No token provided." });

  try {
    const result = await verifyEmailService(token);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    console.error("[VERIFY EMAIL ERROR]", err);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// resendVerificationEmailController.js
export const resendVerificationEmail = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ success: false, message: "User ID required." });

  try {
    await resendVerificationEmailService(userId);
    return res.status(200).json({ success: true, message: "Verification email resent." });
  } catch (err) {
    console.error("[RESEND VERIFICATION ERROR]", err);
    return res.status(400).json({ success: false, message: err.message });
  }
};



export const requestPasswordResetController = async (req, res) => {
  const { email } = req.body;
  try {
    await requestPasswordResetService(email);
    res.status(200).json({ success: true, message: "Password reset email sent." });
  } catch (err) {
    console.error("[REQUEST PASSWORD RESET ERROR]", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};



export const resetPasswordController = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const result = await resetPasswordService(token, newPassword);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    console.error("[RESET PASSWORD CONTROLLER ERROR]", err.message);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};




// @desc   Get logged-in user info
// @route  GET /api/auth/me
// @access Private

// src/app/api/auth/me.js

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  if (!user) return res.status(404).json({ message: "User not found" });

  let roleData = null;

  switch (user.lastActiveRole) {
    case "tenant": {
      const tenantDoc = await Tenant.findOne({ userId: user._id }).lean();
      roleData = { hasActiveTenancy: tenantDoc?.hasActiveTenancy || false };
      break;
    }
    case "landlord": {
      const landlordDoc = await Landlord.findOne({ userId: user._id }).lean();
      roleData = { landlordId: landlordDoc?._id || null };
      break;
    }
    case "propertyManager": {
      const managerDoc = await PropertyManager.findOne({ userId: user._id }).lean();
      roleData = { managerId: managerDoc?._id || null };
      break;
    }
    default:
      roleData = null;
  }

  // Return full safe user info + role data
res.json({
  _id: user._id,
  name: user.name,
  email: user.email,
  onboarded: user.onboarded ?? false,
  agreedToTerms: user.agreedToTerms ?? false,
  agreedToTermsAt: user.agreedToTermsAt ?? null,
  lastActiveRole: user.lastActiveRole ?? null,
  roles: user.roles ?? [],
  country: user.country ?? null,
  state: user.state ?? null,
  gender: user.gender ?? null,
  whatsappNumber: user.whatsappNumber ?? null,
  hasCreatedBankAccount: user.hasCreatedBankAccount ?? false,
  bankDetails: user.bankDetails ?? null,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  roleData,
});

});





/**
 * @desc Complete user onboarding flow
 * @route POST /api/onboarding/complete
 * @access Private
 */
/**
 * @desc Onboard a user (after registration)
 * @route POST /api/onboard
 * @access Private (requires auth)
 */
export const completeOnboarding = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id; // Comes from auth middleware
    const updatedUser = await completeUserOnboardingService(userId, req.body);

    res.json({
      message: "Onboarding completed successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Onboarding Error:", error.message);
    res.status(400).json({ message: error.message });
  }
});




// Switch role controller
// backend/controllers/authController.js

/**
 * @desc Switch user role
 * @route POST /api/auth/switch-role
 * @access Private (user must be authenticated)
 */
export const switchRole = asyncHandler(async (req, res) => {
  const userId = req.user._id; // from auth middleware
  const { role } = req.body;

  console.log(`🔄 [SwitchRole] User ${userId} requested role switch to: ${role}`);

  const validRoles = ["landlord", "tenant", "agent", "propertyManager"];
  if (!validRoles.includes(role)) {
    console.warn(`⚠️ [SwitchRole] Invalid role requested: ${role}`);
    return res.status(400).json({ success: false, message: "Invalid role" });
  }

  // 1️⃣ Fetch user from DB
  const user = await User.findById(userId);
  if (!user) {
    console.error(`❌ [SwitchRole] User not found: ${userId}`);
    return res.status(404).json({ success: false, message: "User not found" });
  }
  console.log(`👤 [SwitchRole] Fetched user:`, { email: user.email, roles: user.roles });

  // 2️⃣ Add role if missing
  if (!user.roles.includes(role)) {
    user.roles.push(role);
    console.log(`✅ [SwitchRole] Added role ${role} to user ${userId}`);

    // Ensure related collection document exists
    switch (role) {
      case "tenant":
        if (!(await Tenant.findOne({ userId }))) {
          await Tenant.create({ userId });
          console.log(`📄 [SwitchRole] Tenant document created for ${userId}`);
        }
        break;
      case "landlord":
        if (!(await Landlord.findOne({ userId }))) {
          await Landlord.create({ userId });
          console.log(`📄 [SwitchRole] Landlord document created for ${userId}`);
        }
        break;
      case "agent":
        if (!(await Agent.findOne({ userId }))) {
          await Agent.create({ userId });
          console.log(`📄 [SwitchRole] Agent document created for ${userId}`);
        }
        break;
      case "propertyManager":
        if (!(await PropertyManager.findOne({ userId }))) {
          await PropertyManager.create({ userId });
          console.log(`📄 [SwitchRole] PropertyManager document created for ${userId}`);
        }
        break;
    }
  } else {
    console.log(`ℹ️ [SwitchRole] User already has role ${role}`);
  }

  // 3️⃣ Update active role
  user.lastActiveRole = role;
  await user.save();
  console.log(`🔑 [SwitchRole] Active role updated to ${role} for user ${userId}`);

  // 4️⃣ Generate new backendToken (JWT) for frontend
  const backendToken = jwt.sign(
    {
      id: user._id,
      roles: user.roles,
      lastActiveRole: user.lastActiveRole,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  console.log(`🪙 [SwitchRole] New backendToken generated for user ${userId}`);

  // 5️⃣ Return response to frontend
  console.log(`📤 [SwitchRole] Sending updated user and token to frontend`);
  return res.json({
    success: true,
    message: `Switched to ${role}`,
    user: {
      _id: user._id,
      roles: user.roles,
      lastActiveRole: user.lastActiveRole,
      backendToken,
    },
  });
});




export const getBanks = asyncHandler(async (req, res) => {
  const response = await axios.get(
    `${process.env.BANI_BASE_URL}/partner/list_banks/NG/`,
    {
      headers: {
        Authorization: `Bearer ${process.env.BANI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.data?.data) {
    res.json({ success: true, banks: response.data.data });
  } else {
    res.status(400).json({
      success: false,
      message: "Failed to fetch banks from Bani API",
    });
  }
});

/**
 * Verify bank account using Bani API
 */

export const verifyBankAccount = asyncHandler(async (req, res) => {
  const { bankCode, accountNumber } = req.body;

  if (!bankCode || !accountNumber) {
    return res.status(400).json({
      success: false,
      message: "Bank code and account number are required",
    });
  }

  try {
    console.log("🔍 Fetching banks from Bani...");

    // Fetch list of banks
    const banksResponse = await axios.get(
      `${process.env.BANI_BASE_URL}/partner/list_banks/NG/`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BANI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const banks = banksResponse.data?.data || [];
    const bank = banks.find((b) => b.bank_code === bankCode);

    if (!bank) {
      return res.status(400).json({
        success: false,
        message: "Invalid or unsupported bank code",
      });
    }

    const payload = {
      list_code: bank.list_code,
      bank_code: bankCode,
      country_code: "NG",
      account_number: accountNumber,
    };

    console.log("📤 Sending verification request:", payload);

    const verifyResponse = await axios.post(
      `${process.env.BANI_BASE_URL}/partner/payout/verify_bank_account/`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.BANI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Verification response:", verifyResponse.data);

    const responseData = verifyResponse.data;

    if (responseData?.status) {
      res.json({
        success: true,
        accountName: responseData.account_name,
        accountNumber: responseData.account_number,
        bankName: responseData.bank_name,
      });
    } else {
      res.status(400).json({
        success: false,
        message: responseData?.message || "Account verification failed",
      });
    }
  } catch (error) {
    console.error("🔥 Error verifying bank account:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong verifying account",
      error: error.response?.data || error.message,
    });
  }
});


