const jwt = require("jsonwebtoken");
const User = require("../models/User");
const jwtConfig = require("../config/jwt");
const { errorResponse } = require("../utils/responseHandler");

/**
 * Protect routes - Verify JWT token
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Check for token in cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
      return errorResponse(res, "Not authorized to access this route", 401);
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, jwtConfig.jwtSecret);

      // Get user from token
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return errorResponse(res, "User not found", 404);
      }

      if (!user.isActive) {
        return errorResponse(res, "User account is deactivated", 403);
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return errorResponse(res, "Token has expired", 401);
      }
      return errorResponse(res, "Not authorized to access this route", 401);
    }
  } catch (error) {
    return errorResponse(res, "Authentication error", 500);
  }
};

/**
 * Admin only access
 */
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return errorResponse(res, "Access denied. Admin privileges required.", 403);
  }
};
