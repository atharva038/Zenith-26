import Marathon from "../models/Marathon.js";
import { Parser } from "json2csv";

// @desc    Register for marathon
// @route   POST /api/marathon/register
// @access  Public
export const registerMarathon = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      age,
      gender,
      college,
      category,
      tshirtSize,
      emergencyContact,
      medicalConditions,
    } = req.body;

    // Check if user already registered with this email
    const existingRegistration = await Marathon.findOne({ email });
    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "You have already registered for the marathon",
      });
    }

    // Create marathon registration
    const registration = await Marathon.create({
      fullName,
      email,
      phone,
      age,
      gender,
      college,
      category,
      tshirtSize,
      emergencyContact,
      medicalConditions,
    });

    res.status(201).json({
      success: true,
      message: "Marathon registration successful!",
      data: {
        registrationNumber: registration.registrationNumber,
        fullName: registration.fullName,
        email: registration.email,
        category: registration.category,
      },
    });
  } catch (error) {
    console.error("Marathon registration error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

// @desc    Get all marathon registrations (Admin)
// @route   GET /api/marathon/registrations
// @access  Private/Admin
export const getAllRegistrations = async (req, res) => {
  try {
    const { category, status, search } = req.query;

    // Build filter
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { registrationNumber: { $regex: search, $options: "i" } },
      ];
    }

    const registrations = await Marathon.find(filter).sort({ createdAt: -1 });

    // Get statistics
    const stats = {
      total: await Marathon.countDocuments(),
      pending: await Marathon.countDocuments({ status: "pending" }),
      confirmed: await Marathon.countDocuments({ status: "confirmed" }),
      cancelled: await Marathon.countDocuments({ status: "cancelled" }),
      byCategory: {
        "5K": await Marathon.countDocuments({ category: "5K" }),
        "10K": await Marathon.countDocuments({ category: "10K" }),
        "Half Marathon": await Marathon.countDocuments({
          category: "Half Marathon",
        }),
      },
    };

    res.json({
      success: true,
      count: registrations.length,
      stats,
      data: registrations,
    });
  } catch (error) {
    console.error("Get registrations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch registrations",
    });
  }
};

// @desc    Get single marathon registration
// @route   GET /api/marathon/registrations/:id
// @access  Private/Admin
export const getRegistrationById = async (req, res) => {
  try {
    const registration = await Marathon.findById(req.params.id);

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
    console.error("Get registration error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch registration",
    });
  }
};

// @desc    Update marathon registration status
// @route   PUT /api/marathon/registrations/:id
// @access  Private/Admin
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const registration = await Marathon.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    if (status) registration.status = status;
    if (paymentStatus) registration.paymentStatus = paymentStatus;

    await registration.save();

    res.json({
      success: true,
      message: "Registration updated successfully",
      data: registration,
    });
  } catch (error) {
    console.error("Update registration error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update registration",
    });
  }
};

// @desc    Delete marathon registration
// @route   DELETE /api/marathon/registrations/:id
// @access  Private/Admin
export const deleteRegistration = async (req, res) => {
  try {
    const registration = await Marathon.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    await Marathon.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Registration deleted successfully",
    });
  } catch (error) {
    console.error("Delete registration error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete registration",
    });
  }
};

// @desc    Export marathon registrations to CSV
// @route   GET /api/marathon/export
// @access  Private/Admin
export const exportRegistrations = async (req, res) => {
  try {
    const { category, status } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const registrations = await Marathon.find(filter).sort({ createdAt: -1 });

    if (registrations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No registrations found to export",
      });
    }

    // Prepare data for CSV
    const data = registrations.map((reg) => ({
      "Registration Number": reg.registrationNumber,
      "Full Name": reg.fullName,
      Email: reg.email,
      Phone: reg.phone,
      Age: reg.age,
      Gender: reg.gender,
      College: reg.college,
      Category: reg.category,
      "T-Shirt Size": reg.tshirtSize,
      "Emergency Contact Name": reg.emergencyContact.name,
      "Emergency Contact Phone": reg.emergencyContact.phone,
      "Medical Conditions": reg.medicalConditions || "None",
      Status: reg.status,
      "Payment Status": reg.paymentStatus,
      "Registered On": new Date(reg.createdAt).toLocaleString("en-IN"),
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=marathon-registrations-${Date.now()}.csv`
    );
    res.send(csv);
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export registrations",
    });
  }
};

// @desc    Get marathon statistics
// @route   GET /api/marathon/stats
// @access  Private/Admin
export const getMarathonStats = async (req, res) => {
  try {
    const stats = {
      total: await Marathon.countDocuments(),
      pending: await Marathon.countDocuments({ status: "pending" }),
      confirmed: await Marathon.countDocuments({ status: "confirmed" }),
      cancelled: await Marathon.countDocuments({ status: "cancelled" }),
      byCategory: {
        "5K": await Marathon.countDocuments({ category: "5K" }),
        "10K": await Marathon.countDocuments({ category: "10K" }),
        "Half Marathon": await Marathon.countDocuments({
          category: "Half Marathon",
        }),
      },
      byGender: {
        Male: await Marathon.countDocuments({ gender: "Male" }),
        Female: await Marathon.countDocuments({ gender: "Female" }),
        Other: await Marathon.countDocuments({ gender: "Other" }),
      },
      recentRegistrations: await Marathon.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("fullName email category registrationNumber createdAt"),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
    });
  }
};
