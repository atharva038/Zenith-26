import MediaTeam from "../models/MediaTeam.js";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "7d",
  });
};

// @desc    Media team login
// @route   POST /api/media-team/auth/login
// @access  Public
export const loginMediaTeam = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find media team member
    const mediaTeam = await MediaTeam.findOne({ username });

    if (!mediaTeam) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if account is active
    if (!mediaTeam.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated. Contact admin.",
      });
    }

    // Check password
    const isMatch = await mediaTeam.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Update last login
    mediaTeam.lastLogin = new Date();
    await mediaTeam.save();

    // Generate token
    const token = generateToken(mediaTeam._id, "media_team");

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        mediaTeam: {
          id: mediaTeam._id,
          username: mediaTeam.username,
          email: mediaTeam.email,
          fullName: mediaTeam.fullName,
          role: mediaTeam.role,
          permissions: mediaTeam.permissions,
          uploadCount: mediaTeam.uploadCount,
          lastLogin: mediaTeam.lastLogin,
        },
      },
    });
  } catch (error) {
    console.error("Media team login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// @desc    Get media team profile
// @route   GET /api/media-team/auth/profile
// @access  Private (Media Team)
export const getMediaTeamProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.mediaTeam,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get profile",
      error: error.message,
    });
  }
};

// @desc    Change password
// @route   PUT /api/media-team/auth/change-password
// @access  Private (Media Team)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Find media team member with password
    const mediaTeam = await MediaTeam.findById(req.mediaTeam._id);

    // Verify current password
    const isMatch = await mediaTeam.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    mediaTeam.password = newPassword;
    await mediaTeam.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error.message,
    });
  }
};

// @desc    Get media team stats
// @route   GET /api/media-team/auth/stats
// @access  Private (Media Team)
export const getMediaTeamStats = async (req, res) => {
  try {
    const Media = (await import("../models/media.js")).default;

    // Get media uploaded by this team member
    const uploadedMedia = await Media.countDocuments({
      uploadedBy: req.mediaTeam._id,
      uploadedByModel: "MediaTeam",
    });

    // Get recent uploads
    const recentUploads = await Media.find({
      uploadedBy: req.mediaTeam._id,
      uploadedByModel: "MediaTeam",
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title category cloudinaryUrl createdAt");

    res.json({
      success: true,
      data: {
        totalUploads: uploadedMedia,
        recentUploads,
        permissions: req.mediaTeam.permissions,
        memberSince: req.mediaTeam.createdAt,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get stats",
      error: error.message,
    });
  }
};
