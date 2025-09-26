import User from "../models/User.js";
import Tenant from "../models/Tenant.js";
import Landlord from "../models/Landlord.js";
import Agent from "../models/Agent.js";
import PropertyManager from "../models/PropertyManager.js";

/**
 * Update the user's last active role
 */
export const updateLastActiveRole = (user, role) => {
  if (!role) throw new Error("Last active role must be provided");
  user.lastActiveRole = role;
  return user;
};

/**
 * Completes user onboarding
 * @param {String} userId - ID of the user to update
 * @param {Object} onboardingData - Data from onboarding form
 * @returns {Object} - Updated user info
 */




export const completeUserOnboardingService = async (userId, onboardingData) => {
  const {
    whatsappNumber,
    gender,
    country,
    state,
    agreedToTerms,
    roles,
    lastActiveRole,
  } = onboardingData;

  // --- Role Validation ---
  const validRoles = ["landlord", "agent", "tenant", "propertyManager"];
  if (!roles || !Array.isArray(roles) || roles.some(r => !validRoles.includes(r))) {
    throw new Error("Invalid role(s) selected");
  }
  if (!lastActiveRole || !validRoles.includes(lastActiveRole)) {
    throw new Error("Invalid lastActiveRole selected");
  }

  // --- Find user ---
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // --- Update user onboarding fields ---
  user.whatsappNumber = whatsappNumber;
  user.gender = gender;
  user.country = country;
  user.state = state;
  user.agreedToTerms = agreedToTerms;
  if (agreedToTerms) user.agreedToTermsAt = new Date();

  // --- Roles & Access ---
  roles.forEach(role => {
    if (!user.roles.includes(role)) user.roles.push(role);
  });
  updateLastActiveRole(user, lastActiveRole);
  user.onboarded = true;

  await user.save();

  // --- Create Role Documents ---
  for (const role of roles) {
    if (role === "tenant") {
      const exists = await Tenant.findOne({ userId: user._id });
      if (!exists) await Tenant.create({ userId: user._id });
    }

    if (role === "landlord") {
      const exists = await Landlord.findOne({ userId: user._id });
      if (!exists) await Landlord.create({ userId: user._id });
    }

    if (role === "agent") {
      const exists = await Agent.findOne({ userId: user._id });
      if (!exists) await Agent.create({ userId: user._id });
    }

    if (role === "propertyManager") {
      const exists = await PropertyManager.findOne({ userId: user._id });
      if (!exists) await PropertyManager.create({ userId: user._id });
    }
  }

  return {
    _id: user._id,
    email: user.email,
    name: user.name,
    roles: user.roles,
    lastActiveRole: user.lastActiveRole,
    onboarded: user.onboarded,
  };
};

