const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

// Validation rules
const registerValidation = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
];

const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

const updateProfileValidation = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
];

const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
];

// Routes
router.post("/register", registerValidation, validate, authController.register);
router.post("/login", loginValidation, validate, authController.login);
router.post("/logout", protect, authController.logout);
router.get("/me", protect, authController.getMe);
router.put(
  "/profile",
  protect,
  updateProfileValidation,
  validate,
  authController.updateProfile
);
router.put(
  "/change-password",
  protect,
  changePasswordValidation,
  validate,
  authController.changePassword
);

module.exports = router;
