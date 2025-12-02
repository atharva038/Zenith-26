import express from "express";
import {body} from "express-validator";
import {
  signup,
  login,
  getProfile,
  updateProfile,
} from "../controllers/auth.controller.js";
import {authMiddleware} from "../middleware/auth.middleware.js";

const router = express.Router();

// Validation rules
const signupValidation = [
  body("username")
    .trim()
    .isLength({min: 3})
    .withMessage("Username must be at least 3 characters"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({min: 6})
    .withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Public routes
router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);

// Protected routes
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

export default router;
