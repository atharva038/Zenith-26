const express = require("express");
const { body, query } = require("express-validator");
const mediaController = require("../controllers/media.controller");
const { protect, adminOnly } = require("../middleware/auth");
const { upload, handleMulterError } = require("../middleware/upload");
const validate = require("../middleware/validate");

const router = express.Router();

// Validation rules
const uploadValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("category")
    .optional()
    .isIn(["event", "sports", "ceremony", "participants", "other"])
    .withMessage("Invalid category"),
  body("tags").optional().trim(),
];

const updateValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("category")
    .optional()
    .isIn(["event", "sports", "ceremony", "participants", "other"])
    .withMessage("Invalid category"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

const queryValidation = [
  query("type")
    .optional()
    .isIn(["image", "video"])
    .withMessage("Type must be either image or video"),
  query("category")
    .optional()
    .isIn(["event", "sports", "ceremony", "participants", "other"])
    .withMessage("Invalid category"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

// Routes
// Public routes
router.get("/", queryValidation, validate, mediaController.getAllMedia);
router.get("/:id", mediaController.getMediaById);

// Protected routes (Admin only)
router.post(
  "/upload",
  protect,
  adminOnly,
  upload.single("file"),
  handleMulterError,
  uploadValidation,
  validate,
  mediaController.uploadMedia
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateValidation,
  validate,
  mediaController.updateMedia
);

router.delete("/:id", protect, adminOnly, mediaController.deleteMedia);

router.get("/admin/stats", protect, adminOnly, mediaController.getMediaStats);

module.exports = router;
