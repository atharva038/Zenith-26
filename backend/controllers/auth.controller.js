import jwt from "jsonwebtoken";
import {validationResult} from "express-validator";
import Admin from "../models/Admin.js";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "30d",
  });
};

// @desc    Register new admin
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const {username, email, password} = req.body;

    // Check if admin exists
    const existingAdmin = await Admin.findOne({
      $or: [{email}, {username}],
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email or username already exists",
      });
    }

    // Create admin
    const admin = await Admin.create({
      username,
      email,
      password,
    });

    // Generate token
    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: {
        admin: admin.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating admin account",
      error: error.message,
    });
  }
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const {email, password} = req.body;

    // Find admin
    const admin = await Admin.findOne({email});

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if active
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        admin: admin.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
};

// @desc    Get admin profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        admin: req.admin,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
    });
  }
};

// @desc    Update admin profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const {username, email} = req.body;
    const admin = await Admin.findById(req.admin._id);

    if (username) admin.username = username;
    if (email) admin.email = email;

    await admin.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        admin: admin.toJSON(),
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
    });
  }
};
