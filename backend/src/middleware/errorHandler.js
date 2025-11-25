const { errorResponse } = require("../utils/responseHandler");

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    return errorResponse(res, message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${
      field.charAt(0).toUpperCase() + field.slice(1)
    } already exists`;
    return errorResponse(res, message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    return errorResponse(res, message, 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return errorResponse(res, "Invalid token", 401);
  }

  if (err.name === "TokenExpiredError") {
    return errorResponse(res, "Token expired", 401);
  }

  // Default error
  return errorResponse(
    res,
    error.message || "Server Error",
    err.statusCode || 500
  );
};

module.exports = errorHandler;
