import express from "express";
import { 
  createProperty, 
  getPropertyById, 
  getUserProperties, 
  getJoinableProperties, getMyTenants,
  getPropertyApplicationRequirements 
} from "../controllers/propertyControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create property
router.post("/", protect, createProperty);

// Static routes first
router.get("/userproperty", protect, getUserProperties);
router.get("/joinable", protect, getJoinableProperties);
router.get("/my-tenants", protect, getMyTenants);

// More specific dynamic route before generic
router.get('/:id/application-requirements', protect, getPropertyApplicationRequirements);

// Generic dynamic route
router.get("/:id", protect, getPropertyById);

export default router;
