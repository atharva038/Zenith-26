import express from "express";
import {
  getSettings,
  updateSettings,
  toggleRegistration,
  toggleCricketRegistration,
  toggleOtherSportsRegistration,
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
router.post("/toggle", toggleRegistration); // Legacy endpoint
router.post("/toggle-cricket", toggleCricketRegistration);
router.post("/toggle-other-sports", toggleOtherSportsRegistration);

export default router;
