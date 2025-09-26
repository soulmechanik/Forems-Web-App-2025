// routes/tenancyApplicationRoutes.js
import express from "express";
import { submitTenancyApplication, getApplicationsForUser, getTenantApplications } from "../controllers/propertyControllers.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../utils/multer.js";

const router = express.Router();

/**
 * @route   POST /api/tenancy-applications
 * @desc    Submit a tenancy application with passport + guarantor photos + formData
 * @access  Private (Tenant only)
 */
router.post(
  "/",
  (req, res, next) => {
    console.log("🛣️ Route hit: POST /api/tenancy-applications");
    console.log("🛣️ Content-Type:", req.headers['content-type']);
    next();
  },
  protect,
  (req, res, next) => {
    console.log("🔐 Passed protect middleware");
    next();
  },
  upload.fields([
    { name: "passportPhoto", maxCount: 1 },
    { name: "guarantorPassportPhotos", maxCount: 5 },
  ]),
  (req, res, next) => {
    console.log("📤 Passed upload middleware");
    console.log("📁 Files received:", Object.keys(req.files || {}));
    console.log("📄 Body keys:", Object.keys(req.body || {}));
    next();
  },
  submitTenancyApplication
);


router.get("/", protect, getTenantApplications);
router.get("/managed", protect, getApplicationsForUser);


export default router;