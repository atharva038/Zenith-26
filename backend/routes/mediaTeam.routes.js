import express from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.js";
import * as mediaTeamController from "../controllers/mediaTeam.controller.js";
import { verifyMediaTeamToken } from "../middleware/mediaTeam.middleware.js";

const router = express.Router();

// Validation schemas
const loginValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters")
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error("New password must be different from current password");
      }
      return true;
    }),
];

// Public routes
router.post(
  "/login",
  loginValidation,
  validate,
  mediaTeamController.loginMediaTeam
);

// Protected routes
router.get(
  "/profile",
  verifyMediaTeamToken,
  mediaTeamController.getMediaTeamProfile
);

router.put(
  "/change-password",
  verifyMediaTeamToken,
  changePasswordValidation,
  validate,
  mediaTeamController.changePassword
);

router.get(
  "/stats",
  verifyMediaTeamToken,
  mediaTeamController.getMediaTeamStats
);

export default router;
