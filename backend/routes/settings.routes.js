import express from "express";
import {
  getSettings,
  updateSettings,
  toggleRegistration,
  checkRegistrationStatus,
} from "../controllers/settings.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public route - Check registration status
router.get("/status", checkRegistrationStatus);

// Admin routes (protected)
router.use(verifyToken);
router.use(isAdmin);

router.get("/", getSettings);
router.put("/", updateSettings);
router.post("/toggle", toggleRegistration);

export default router;
