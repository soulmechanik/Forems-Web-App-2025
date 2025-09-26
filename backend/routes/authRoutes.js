import express from "express";
import {getMe, googleAuth, getBanks, verifyBankAccount, switchRole, register,  verifyEmail, resendVerificationEmail,requestPasswordResetController, resetPasswordController, completeOnboarding } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/googleAuth", googleAuth);

router.post("/resend-verification", resendVerificationEmail);



router.get("/verify-email", verifyEmail);



router.post("/request-password-reset", requestPasswordResetController);


router.post("/reset-password", resetPasswordController);

// ✅ Protected route
router.get("/me", protect, getMe);


router.post("/onboarding", protect, completeOnboarding);

router.post("/switch-role", protect, switchRole);


router.get('/banks', getBanks);

// Verify bank account
router.post('/verify-bank', verifyBankAccount);

export default router;
