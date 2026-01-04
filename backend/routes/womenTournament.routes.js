import express from "express";
import WomenTournament from "../models/WomenTournament.js";
import {authMiddleware} from "../middleware/auth.middleware.js";
import {uploadPaymentScreenshot} from "../middleware/cloudinaryUpload.middleware.js";
import {
  sendPendingWomenTournamentEmail,
  sendApprovedWomenTournamentEmail,
} from "../services/email.service.js";

const router = express.Router();

// Public route - Submit registration
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      registrationNumber,
      mobileNumber,
      selectedCategory,
      selectedSports,
      category3TeamName,
      paymentScreenshot,
    } = req.body;

    // Validation
    if (
      !name ||
      !email ||
      !registrationNumber ||
      !mobileNumber ||
      !selectedCategory
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    if (!selectedSports || selectedSports.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one sport",
      });
    }

    // Validate team name for category 3
    const hasCategory3Sports = selectedSports.some((sport) => {
      const category3Sports = [
        "Tug of War",
        "Volleyball",
        "Cricket",
        "Basketball",
        "Football",
        "Box Cricket",
      ];
      return category3Sports.includes(sport);
    });

    if (hasCategory3Sports && !category3TeamName) {
      return res.status(400).json({
        success: false,
        message: "Team name is required for Category 3 sports",
      });
    }

    // Create new registration (allowing multiple registrations per user)
    const registration = new WomenTournament({
      name,
      email: email.toLowerCase(),
      registrationNumber,
      mobileNumber,
      selectedCategory,
      selectedSports,
      category3TeamName: category3TeamName || undefined,
      paymentScreenshot: paymentScreenshot || undefined,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    await registration.save();

    // Send pending registration email (non-blocking)
    sendPendingWomenTournamentEmail({
      name: registration.name,
      email: registration.email,
      registrationNumber: registration.registrationNumber,
      selectedSports: registration.selectedSports,
      selectedCategory: registration.selectedCategory,
      totalAmount: registration.totalAmount,
    }).catch((err) => {
      console.error(
        "Failed to send women tournament pending email:",
        err.message
      );
    });

    res.status(201).json({
      success: true,
      message: "Registration submitted successfully!",
      data: {
        registrationId: registration._id,
        name: registration.name,
        registrationNumber: registration.registrationNumber,
        selectedSports: registration.selectedSports,
        totalAmount: registration.totalAmount,
        status: registration.status,
      },
    });
  } catch (error) {
    console.error("Women Tournament Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit registration",
      error: error.message,
    });
  }
});

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
      console.error("Screenshot Upload Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload screenshot",
        error: error.message,
      });
    }
  }
);

// Public route - Update registration with payment screenshot
router.patch("/registrations/:id/payment-screenshot", async (req, res) => {
  try {
    const {paymentScreenshot} = req.body;

    if (!paymentScreenshot) {
      return res.status(400).json({
        success: false,
        message: "Payment screenshot URL is required",
      });
    }

    const registration = await WomenTournament.findByIdAndUpdate(
      req.params.id,
      {
        paymentScreenshot,
        paymentStatus: "pending", // Set to pending for admin review
      },
      {new: true}
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    res.json({
      success: true,
      message: "Payment screenshot updated successfully",
      data: registration,
    });
  } catch (error) {
    console.error("Update Payment Screenshot Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update payment screenshot",
      error: error.message,
    });
  }
});

// Admin route - Get all registrations
router.get("/admin/registrations", authMiddleware, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      status,
      category,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (category) {
      query.selectedCategory = category;
    }

    if (search) {
      query.$or = [
        {name: {$regex: search, $options: "i"}},
        {registrationNumber: {$regex: search, $options: "i"}},
        {mobileNumber: {$regex: search, $options: "i"}},
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [registrations, total] = await Promise.all([
      WomenTournament.find(query)
        .sort({[sortBy]: sortOrder === "desc" ? -1 : 1})
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),
      WomenTournament.countDocuments(query),
    ]);

    // Calculate statistics
    const stats = await WomenTournament.aggregate([
      {
        $group: {
          _id: null,
          totalRegistrations: {$sum: 1},
          category1Count: {
            $sum: {$cond: [{$eq: ["$selectedCategory", "category1"]}, 1, 0]},
          },
          category2Count: {
            $sum: {$cond: [{$eq: ["$selectedCategory", "category2"]}, 1, 0]},
          },
          category3Count: {
            $sum: {$cond: [{$eq: ["$selectedCategory", "category3"]}, 1, 0]},
          },
          totalRevenue: {$sum: "$totalAmount"},
          confirmedCount: {
            $sum: {$cond: [{$eq: ["$status", "confirmed"]}, 1, 0]},
          },
          pendingCount: {
            $sum: {$cond: [{$eq: ["$status", "pending"]}, 1, 0]},
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        registrations,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
        statistics: stats[0] || {
          totalRegistrations: 0,
          category1Count: 0,
          category2Count: 0,
          category3Count: 0,
          totalRevenue: 0,
          confirmedCount: 0,
          pendingCount: 0,
        },
      },
    });
  } catch (error) {
    console.error("Get Women Tournament Registrations Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch registrations",
      error: error.message,
    });
  }
});

// Admin route - Get single registration
router.get("/admin/registrations/:id", authMiddleware, async (req, res) => {
  try {
    const registration = await WomenTournament.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    res.json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error("Get Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch registration",
      error: error.message,
    });
  }
});

// Admin route - Update registration status
router.patch(
  "/admin/registrations/:id/status",
  authMiddleware,
  async (req, res) => {
    try {
      const {status, paymentStatus, notes} = req.body;

      // First, get the current registration to check previous status
      const currentRegistration = await WomenTournament.findById(req.params.id);
      if (!currentRegistration) {
        return res.status(404).json({
          success: false,
          message: "Registration not found",
        });
      }

      const previousStatus = currentRegistration.status;

      const updateData = {};
      if (status) updateData.status = status;
      if (paymentStatus) updateData.paymentStatus = paymentStatus;
      if (notes !== undefined) updateData.notes = notes;

      const registration = await WomenTournament.findByIdAndUpdate(
        req.params.id,
        updateData,
        {new: true, runValidators: true}
      );

      // Send approval email if status changed to confirmed
      if (
        status === "confirmed" &&
        previousStatus !== "confirmed" &&
        registration.email
      ) {
        sendApprovedWomenTournamentEmail({
          name: registration.name,
          email: registration.email,
          registrationNumber: registration.registrationNumber,
          selectedSports: registration.selectedSports,
          selectedCategory: registration.selectedCategory,
          totalAmount: registration.totalAmount,
        }).catch((err) => {
          console.error(
            "Failed to send women tournament approval email:",
            err.message
          );
        });
      }

      res.json({
        success: true,
        message: "Registration updated successfully",
        data: registration,
      });
    } catch (error) {
      console.error("Update Registration Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update registration",
        error: error.message,
      });
    }
  }
);

// Admin route - Delete registration
router.delete("/admin/registrations/:id", authMiddleware, async (req, res) => {
  try {
    const registration = await WomenTournament.findByIdAndDelete(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    res.json({
      success: true,
      message: "Registration deleted successfully",
    });
  } catch (error) {
    console.error("Delete Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete registration",
      error: error.message,
    });
  }
});

// Admin route - Export registrations to CSV
router.get(
  "/admin/registrations/export/csv",
  authMiddleware,
  async (req, res) => {
    try {
      const {category, status} = req.query;
      const query = {};

      if (category) query.selectedCategory = category;
      if (status) query.status = status;

      const registrations = await WomenTournament.find(query)
        .sort({createdAt: -1})
        .lean();

      // Create CSV content
      const headers = [
        "Registration Date",
        "Name",
        "Registration Number",
        "Mobile Number",
        "Category",
        "Selected Sports",
        "Team Name",
        "Total Amount",
        "Status",
        "Payment Status",
        "Payment Screenshot",
      ];

      const csvRows = [headers.join(",")];

      registrations.forEach((reg) => {
        const row = [
          new Date(reg.createdAt).toLocaleDateString("en-IN"),
          reg.name,
          reg.registrationNumber,
          reg.mobileNumber,
          reg.selectedCategory,
          `"${reg.selectedSports.join(", ")}"`,
          reg.category3TeamName || "N/A",
          reg.totalAmount,
          reg.status,
          reg.paymentStatus,
          reg.paymentScreenshot || "Not uploaded",
        ];
        csvRows.push(row.join(","));
      });

      const csvContent = csvRows.join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=women-tournament-registrations-${Date.now()}.csv`
      );
      res.send(csvContent);
    } catch (error) {
      console.error("Export CSV Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to export registrations",
        error: error.message,
      });
    }
  }
);

export default router;
