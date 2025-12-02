import express from "express";
import {authMiddleware} from "../middleware/auth.middleware.js";
import {
  getDashboardStats,
  getAllAdmins,
  deleteAdmin,
} from "../controllers/admin.controller.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get("/dashboard/stats", getDashboardStats);
router.get("/admins", getAllAdmins);
router.delete("/admins/:id", deleteAdmin);

export default router;
