import { validationResult } from "express-validator";
import { errorResponse } from "../utils/responseHandler.js";

/**
 * Validation middleware
 * Checks for validation errors from express-validator
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.param,
      message: err.msg,
    }));

    return errorResponse(res, "Validation failed", 400, formattedErrors);
  }

  next();
};

export default validate;
