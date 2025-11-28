/**
 * Standard success response format
 */
exports.successResponse = (
  res,
  data = null,
  message = "Success",
  statusCode = 200
) => {
  const response = {
    success: true,
    message,
    ...(data && { data }),
  };

  return res.status(statusCode).json(response);
};

/**
 * Standard error response format
 */
exports.errorResponse = (
  res,
  message = "Error",
  statusCode = 500,
  errors = null
) => {
  const response = {
    success: false,
    message: Array.isArray(message) ? message.join(", ") : message,
    ...(errors && { errors }),
  };

  return res.status(statusCode).json(response);
};
