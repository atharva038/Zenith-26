import express from "express";
import {body, query} from "express-validator";
import * as mediaController from "../controllers/media.controller.js";
import {authMiddleware, isAdmin} from "../middleware/auth.middleware.js";
import {upload, handleMulterError} from "../middleware/media.middleware.js";
import validate from "../middleware/validate.js";

const router = express.Router();

// Validation rules
const uploadValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({max: 100})
    .withMessage("Title cannot exceed 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({max: 500})
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
    .isLength({max: 100})
    .withMessage("Title cannot exceed 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({max: 500})
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
    .isInt({min: 1})
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({min: 1, max: 100})
    .withMessage("Limit must be between 1 and 100"),
];

// Routes
// Public routes
router.get("/", queryValidation, validate, mediaController.getAllMedia);

// Protected routes (Admin only) - These must come before /:id to avoid route conflicts
router.get(
  "/admin/stats",
  authMiddleware,
  isAdmin,
  mediaController.getMediaStats
);

// Reorder media route (Drag and Drop)
const reorderValidation = [
  body("mediaOrder")
    .isArray({min: 1})
    .withMessage("mediaOrder must be a non-empty array"),
  body("mediaOrder.*.id").notEmpty().withMessage("Each item must have an id"),
  body("mediaOrder.*.order")
    .isInt({min: 0})
    .withMessage("Order must be a non-negative integer"),
];

router.put(
  "/reorder",
  authMiddleware,
  isAdmin,
  reorderValidation,
  validate,
  mediaController.reorderMedia
);

// Public route with ID parameter - must come after specific routes
router.get("/:id", mediaController.getMediaById);

// Protected routes (Admin only)
router.post(
  "/upload",
  authMiddleware,
  isAdmin,
  upload.single("file"),
  handleMulterError,
  uploadValidation,
  validate,
  mediaController.uploadMedia
);

router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  updateValidation,
  validate,
  mediaController.updateMedia
);

router.delete("/:id", authMiddleware, isAdmin, mediaController.deleteMedia);

export default router;
