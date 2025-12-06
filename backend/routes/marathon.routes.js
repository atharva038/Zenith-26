import express from "express";
import {
  registerMarathon,
  getAllRegistrations,
  getRegistrationById,
  updateRegistrationStatus,
  deleteRegistration,
  exportRegistrations,
  getMarathonStats,
} from "../controllers/marathon.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public route - Marathon registration
router.post("/register", registerMarathon);

// Admin routes - Protected
router.get("/registrations", authMiddleware, getAllRegistrations);
router.get("/registrations/:id", authMiddleware, getRegistrationById);
router.put("/registrations/:id", authMiddleware, updateRegistrationStatus);
router.delete("/registrations/:id", authMiddleware, deleteRegistration);
router.get("/export", authMiddleware, exportRegistrations);
router.get("/stats", authMiddleware, getMarathonStats);

export default router;
