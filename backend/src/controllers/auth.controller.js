const authService = require("../services/auth.service");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const jwtConfig = require("../config/jwt");

/**
 * @desc    Register admin user
 * @route   POST /api/auth/register
 * @access  Public (but should be restricted in production)
 */
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const result = await authService.register({ username, email, password });

    // Set JWT token in cookie
    res.cookie("token", result.token, jwtConfig.getCookieOptions());

    successResponse(
      res,
      { user: result.user, token: result.token },
      "Registration successful",
      201
    );
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

/**
 * @desc    Login admin user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    // Set JWT token in cookie
    res.cookie("token", result.token, jwtConfig.getCookieOptions());

    successResponse(
      res,
      { user: result.user, token: result.token },
      "Login successful",
      200
    );
  } catch (error) {
    errorResponse(res, error.message, 401);
  }
};

/**
 * @desc    Logout admin user
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = async (req, res, next) => {
  try {
    // Clear cookie
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    successResponse(res, null, "Logout successful", 200);
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);

    successResponse(res, { user }, "User profile retrieved", 200);
  } catch (error) {
    errorResponse(res, error.message, 404);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    const user = await authService.updateProfile(req.user.id, {
      username,
      email,
    });

    successResponse(res, { user }, "Profile updated successfully", 200);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    await authService.changePassword(req.user.id, currentPassword, newPassword);

    successResponse(res, null, "Password changed successfully", 200);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};
