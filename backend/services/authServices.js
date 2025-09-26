import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/tokenUtils.js";


import { sendEmail } from "../utils/sendEmail.js";



/**
 * Register a new user and set JWT cookie
 * @param {Object} userData - { name, email, password }
 * @param {Object} res - Express response object (for setting cookie)
 * @returns {Object} user
 */






export const registerGoogleUserService = async ({ email, name, googleId }) => {
  let user = await User.findOne({ email });

  if (!user) {
    // Create new Google user
    user = await User.create({
      email,
      name,
      googleId,
      onboarded: false,
      isVerified: true,
    });
  } else {
    // Existing Google user: update googleId if missing
    if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }
  }

  const token = generateToken({ id: user._id, onboarded: user.onboarded });
  return { token, user };
};



/**
 * Handles user-related business logic
 * Provides reusable functions for onboarding, role management, etc.
 */



/**
 * Updates user onboarding details
 * - Sets onboarding fields (whatsapp, gender, location, etc.)
 * - Adds role(s) to the user
 * - Marks user as onboarded
 * - Updates terms agreement status
 *
 * @param {String} userId - MongoDB ObjectId of user
 * @param {Object} onboardingData - Data from onboarding form
 * @returns {Promise<User>} Updated user document
 */
export const onboardUserService = async (userId, onboardingData) => {
  const {
    whatsappNumber,
    gender,
    country,
    state,
    roles,
    agreedToTerms,
  } = onboardingData;

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Update onboarding info
  user.whatsappNumber = whatsappNumber;
  user.gender = gender;
  user.country = country;
  user.state = state;

  // Add roles (ensures no duplicates)
  if (roles && Array.isArray(roles)) {
    user.roles = [...new Set([...user.roles, ...roles])];
  }

  // Mark onboarding complete
  user.onboarded = true;

  // Terms agreement
  if (agreedToTerms) {
    user.agreedToTerms = true;
    user.agreedToTermsAt = new Date();
  }

  await user.save();
  return user;
};






export const registerUserService = async ({ name, email, password }) => {
  console.log("[SERVICE REGISTER] Checking if user exists:", email);
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    console.log("[SERVICE REGISTER] User already exists:", email);
    throw new Error("User already exists");
  }

  console.log("[SERVICE REGISTER] Hashing password...");
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log("[SERVICE REGISTER] Creating user in DB...");
  const user = await User.create({ name, email, password: hashedPassword });

  if (!user) {
    console.log("[SERVICE REGISTER] Failed to create user!");
    throw new Error("Invalid user data");
  }

  console.log("[SERVICE REGISTER] User created:", user._id);

  const token = generateToken(user._id);

  return { user, token };
};

export const sendVerificationEmailService = async (user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  const frontendUrl =
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : process.env.FRONTEND_URL.replace(/^https:/, "http:");

  const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;

  const html = `
    <h2>Email Verification</h2>
    <p>Hello ${user.name},</p>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${verificationUrl}" target="_blank">Verify Email</a>
  `;

  await sendEmail({
    to: user.email,
    subject: "Verify Your Email",
    text: `Verify your email: ${verificationUrl}`,
    html,
  });

  return token;
};

// Resend verification email service
export const resendVerificationEmailService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.isVerified) throw new Error("Email already verified");

  return sendVerificationEmailService(user);
};

// Verify email service
export const verifyEmailService = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error("User not found");

    if (user.isVerified) {
      return { success: true, alreadyVerified: true, message: "Email already verified." };
    }

    user.isVerified = true;
    await user.save();

    return { success: true, alreadyVerified: false, message: "Email successfully verified!" };
  } catch (err) {
    // Token expired or invalid
    const decoded = jwt.decode(token);
    let resendUserId = null;

    if (decoded?.id) {
      const user = await User.findById(decoded.id);
      if (user && !user.isVerified) resendUserId = user._id;
    }

    return { success: false, message: "Token is invalid or expired.", resendUserId };
  }
};


export const requestPasswordResetService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  // Generate a reset token, expires in 15 minutes
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

  const frontendUrl =
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : process.env.FRONTEND_URL.replace(/^https:/, "http:");

  const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

  const html = `
    <h2>Password Reset Request</h2>
    <p>Hello ${user.name},</p>
    <p>Click the link below to reset your password. The link expires in 15 minutes.</p>
    <a href="${resetUrl}" target="_blank">Reset Password</a>
  `;

  await sendEmail({
    to: user.email,
    subject: "Reset Your Password",
    text: `Reset your password: ${resetUrl}`,
    html,
  });

  console.log(`[SEND EMAIL] Password reset sent to ${user.email} | token: ${token}`);
  return token; // optional, for logging
};


export const resetPasswordService = async (token, newPassword) => {
  try {
    console.log("Verifying reset token:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // throws if invalid/expired
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.id);
    if (!user) throw new Error("User not found");

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return { success: true, message: "Password has been reset successfully" };
  } catch (err) {
    console.error("[RESET PASSWORD ERROR]", err.message);

    // Decode without verifying to see if we can suggest resend
    const decoded = jwt.decode(token);
    let resendUserId = null;
    if (decoded?.id) {
      const user = await User.findById(decoded.id);
      if (user) resendUserId = user._id;
    }

    return {
      success: false,
      message: "Token is invalid or expired",
      resendUserId, // optional: allow frontend to resend
    };
  }
};





