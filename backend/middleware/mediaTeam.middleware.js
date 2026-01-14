import jwt from "jsonwebtoken";
import MediaTeam from "../models/MediaTeam.js";

// Middleware to verify media team token
export const verifyMediaTeamToken = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token, access denied",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    // Check if token is for media team
    if (decoded.role !== "media_team") {
      return res.status(403).json({
        success: false,
        message: "Invalid token type. Media team access required.",
      });
    }

    // Find media team member
    const mediaTeam = await MediaTeam.findById(decoded.id).select("-password");

    if (!mediaTeam) {
      return res.status(401).json({
        success: false,
        message: "Media team member not found",
      });
    }

    if (!mediaTeam.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    // Attach media team member to request
    req.mediaTeam = mediaTeam;
    next();
  } catch (error) {
    console.error("Media team auth middleware error:", error);
    res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};

// Middleware to check specific permission
export const hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.mediaTeam) {
      return res.status(403).json({
        success: false,
        message: "Media team authentication required",
      });
    }

    if (!req.mediaTeam.hasPermission(permission)) {
      return res.status(403).json({
        success: false,
        message: `Permission '${permission}' required`,
      });
    }

    next();
  };
};

// Middleware to allow both admin and media team access
export const verifyAdminOrMediaTeam = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token, access denied",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    // Check if admin or media team
    if (decoded.role === "media_team") {
      const mediaTeam = await MediaTeam.findById(decoded.id).select(
        "-password"
      );
      if (!mediaTeam || !mediaTeam.isActive) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
      req.mediaTeam = mediaTeam;
      req.userType = "media_team";
    } else {
      const Admin = (await import("../models/Admin.js")).default;
      const admin = await Admin.findById(decoded.id).select("-password");
      if (!admin || !admin.isActive) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
      req.admin = admin;
      req.userType = "admin";
    }

    next();
  } catch (error) {
    console.error("Combined auth middleware error:", error);
    res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};
