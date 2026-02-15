import express from "express";
import {
  login,
  getDashboardStats,
  getRegistrations,
  getRegistrationById,
  getProfile,
} from "../controllers/gameCoordinator.controller.js";
import { coordinatorAuthMiddleware } from "../middleware/coordinatorAuth.middleware.js";

const router = express.Router();

// Public routes
router.post("/login", login);

// Protected routes
router.use(coordinatorAuthMiddleware);

router.get("/profile", getProfile);
router.get("/dashboard/stats", getDashboardStats);
router.get("/registrations", getRegistrations);
router.get("/registrations/:id", getRegistrationById);

export default router;
