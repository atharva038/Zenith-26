const User = require("../models/User");
const jwtConfig = require("../config/jwt");

class AuthService {
  /**
   * Register a new admin user
   */
  async register(userData) {
    try {
      const { username, email, password } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });
      if (existingUser) {
        if (existingUser.email === email) {
          throw new Error("Email already registered");
        }
        if (existingUser.username === username) {
          throw new Error("Username already taken");
        }
      }

      // Create user
      const user = await User.create({
        username,
        email,
        password,
        role: "admin",
      });

      // Generate token
      const token = user.generateAuthToken();

      return {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login admin user
   */
  async login(email, password) {
    try {
      // Find user with password field
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error("Account is deactivated");
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      // Update last login
      await user.updateLastLogin();

      // Generate token
      const token = user.generateAuthToken();

      return {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getProfile(userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      return {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, updateData) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      // Update allowed fields
      if (updateData.username) user.username = updateData.username;
      if (updateData.email) user.email = updateData.email;

      await user.save();

      return {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId).select("+password");

      if (!user) {
        throw new Error("User not found");
      }

      // Verify current password
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        throw new Error("Current password is incorrect");
      }

      // Update password
      user.password = newPassword;
      await user.save();

      return { message: "Password changed successfully" };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();
