import express from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.js";
import {authMiddleware, isAdmin} from "../middleware/auth.middleware.js";
import {
  getDashboardStats,
  getAllAdmins,
  deleteAdmin,
} from "../controllers/admin.controller.js";
import * as adminMediaTeamController from "../controllers/adminMediaTeam.controller.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);
router.use(isAdmin);

// Admin dashboard routes
router.get("/dashboard/stats", getDashboardStats);
router.get("/admins", getAllAdmins);
router.delete("/admins/:id", deleteAdmin);

// Media Team Management Routes
const createMediaTeamValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),
  body("permissions")
    .optional()
    .isArray()
    .withMessage("Permissions must be an array"),
];

const updateMediaTeamValidation = [
  body("fullName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Full name cannot be empty"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("permissions")
    .optional()
    .isArray()
    .withMessage("Permissions must be an array"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

const resetPasswordValidation = [
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

router.post(
  "/media-team",
  createMediaTeamValidation,
  validate,
  adminMediaTeamController.createMediaTeamMember
);

router.get("/media-team", adminMediaTeamController.getAllMediaTeamMembers);

router.get("/media-team/:id", adminMediaTeamController.getMediaTeamMemberById);

router.put(
  "/media-team/:id",
  updateMediaTeamValidation,
  validate,
  adminMediaTeamController.updateMediaTeamMember
);

router.delete("/media-team/:id", adminMediaTeamController.deleteMediaTeamMember);

router.patch(
  "/media-team/:id/toggle-status",
  adminMediaTeamController.toggleMediaTeamMemberStatus
);

router.post(
  "/media-team/:id/reset-password",
  resetPasswordValidation,
  validate,
  adminMediaTeamController.resetMediaTeamMemberPassword
);

export default router;
