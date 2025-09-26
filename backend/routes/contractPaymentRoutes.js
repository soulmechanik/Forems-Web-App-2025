import express from "express";
import {
  initiateLandlordContractPayment,
  landlordContractPaymentWebhook
} from "../controllers/contractPayment.js";
import { protect } from "../middleware/authMiddleware.js"; // middleware to check if landlord is logged in

const router = express.Router();

// ------------------------
// Initiate landlord payment (protected route)
// ------------------------
router.post(
  "/initiate",
  protect, // ensures only authenticated landlords can call this
  initiateLandlordContractPayment
);

// ------------------------
// Bani webhook (public route - Bani server calls this)
// ------------------------
router.post(
  "/payments",
  landlordContractPaymentWebhook
);

export default router;
