import jwt from "jsonwebtoken";
import GameCoordinator from "../models/GameCoordinator.js";

export const coordinatorAuthMiddleware = async (req, res, next) => {
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
      process.env.JWT_SECRET || "your-secret-key",
    );

    // Verify role
    if (decoded.role !== "game-coordinator") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Not authorized as game coordinator.",
      });
    }

    // Find coordinator
    const coordinator = await GameCoordinator.findById(decoded.id).select(
      "-password",
    );

    if (!coordinator) {
      return res.status(401).json({
        success: false,
        message: "Coordinator not found",
      });
    }

    if (!coordinator.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    // Attach coordinator to request
    req.coordinator = coordinator;
    next();
  } catch (error) {
    console.error("Coordinator auth middleware error:", error);
    res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};
