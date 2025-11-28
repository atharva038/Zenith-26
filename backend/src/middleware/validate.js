const { validationResult } = require("express-validator");
const { errorResponse } = require("../utils/responseHandler");

/**
 * Validate request based on express-validator rules
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    return errorResponse(res, errorMessages, 400);
  }

  next();
};

module.exports = validate;
