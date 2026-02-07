import express from "express";
import {
  registerMarathon,
  getAllRegistrations,
  getRegistrationById,
  updateRegistrationStatus,
  exportRegistrations,
  getMarathonStats,
  markTshirtDistributed,
  undoTshirtDistribution,
  getTshirtDistributionStats,
} from "../controllers/marathon.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { uploadPaymentScreenshot } from "../middleware/cloudinaryUpload.middleware.js";

const router = express.Router();

// Public route - Marathon registration (no global registration check)
router.post("/register", registerMarathon);

// Public route - Upload payment screenshot to Cloudinary
router.post(
  "/upload-payment-screenshot",
  uploadPaymentScreenshot,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      // Cloudinary URL is in req.file.path (secure_url)
      const fileUrl = req.file.path;

      res.status(200).json({
        success: true,
        message: "Payment screenshot uploaded successfully to Cloudinary",
        filename: req.file.filename,
        url: fileUrl,
        cloudinaryId: req.file.filename, // public_id for future deletion
      });
    } catch (error) {
      console.error("Marathon Screenshot Upload Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload screenshot",
        error: error.message,
      });
    }
  }
);

// Admin routes - Protected
router.get("/registrations", authMiddleware, getAllRegistrations);
router.get("/registrations/:id", authMiddleware, getRegistrationById);
router.put("/registrations/:id", authMiddleware, updateRegistrationStatus);
router.get("/export", authMiddleware, exportRegistrations);
router.get("/stats", authMiddleware, getMarathonStats);

// T-shirt distribution routes
router.get("/tshirt-distribution/stats", getTshirtDistributionStats);
router.patch("/:id/tshirt-distributed", markTshirtDistributed);
router.patch("/:id/undo-tshirt-distribution", undoTshirtDistribution);

export default router;
