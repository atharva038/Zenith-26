import MediaTeam from "../models/MediaTeam.js";
import jwt from "jsonwebtoken";

// @desc    Create new media team member (Admin only)
// @route   POST /api/admin/media-team
// @access  Private (Admin)
export const createMediaTeamMember = async (req, res) => {
  try {
    const { username, email, password, fullName, permissions } = req.body;

    // Check if username or email already exists
    const existingMember = await MediaTeam.findOne({
      $or: [{ username }, { email }],
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    // Create new media team member
    const mediaTeamMember = await MediaTeam.create({
      username,
      email,
      password,
      fullName,
      permissions: permissions || ["upload_media", "view_media", "delete_own_media"],
      createdBy: req.admin._id,
    });

    res.status(201).json({
      success: true,
      message: "Media team member created successfully",
      data: {
        member: {
          id: mediaTeamMember._id,
          username: mediaTeamMember.username,
          email: mediaTeamMember.email,
          fullName: mediaTeamMember.fullName,
          permissions: mediaTeamMember.permissions,
          isActive: mediaTeamMember.isActive,
          createdAt: mediaTeamMember.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Create media team member error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create media team member",
      error: error.message,
    });
  }
};

// @desc    Get all media team members (Admin only)
// @route   GET /api/admin/media-team
// @access  Private (Admin)
export const getAllMediaTeamMembers = async (req, res) => {
  try {
    const members = await MediaTeam.find()
      .select("-password")
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        members,
        count: members.length,
      },
    });
  } catch (error) {
    console.error("Get media team members error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch media team members",
      error: error.message,
    });
  }
};

// @desc    Get single media team member (Admin only)
// @route   GET /api/admin/media-team/:id
// @access  Private (Admin)
export const getMediaTeamMemberById = async (req, res) => {
  try {
    const member = await MediaTeam.findById(req.params.id)
      .select("-password")
      .populate("createdBy", "username email");

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Media team member not found",
      });
    }

    // Get media uploaded by this member
    const Media = (await import("../models/media.js")).default;
    const uploadedMedia = await Media.find({
      uploadedBy: member._id,
      uploadedByModel: "MediaTeam",
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title category type cloudinaryUrl createdAt");

    res.json({
      success: true,
      data: {
        member,
        recentUploads: uploadedMedia,
        totalUploads: member.uploadCount,
      },
    });
  } catch (error) {
    console.error("Get media team member error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch media team member",
      error: error.message,
    });
  }
};

// @desc    Update media team member (Admin only)
// @route   PUT /api/admin/media-team/:id
// @access  Private (Admin)
export const updateMediaTeamMember = async (req, res) => {
  try {
    const { fullName, email, permissions, isActive } = req.body;

    const member = await MediaTeam.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Media team member not found",
      });
    }

    // Update fields
    if (fullName) member.fullName = fullName;
    if (email) member.email = email;
    if (permissions) member.permissions = permissions;
    if (isActive !== undefined) member.isActive = isActive;

    await member.save();

    res.json({
      success: true,
      message: "Media team member updated successfully",
      data: {
        member: {
          id: member._id,
          username: member.username,
          email: member.email,
          fullName: member.fullName,
          permissions: member.permissions,
          isActive: member.isActive,
        },
      },
    });
  } catch (error) {
    console.error("Update media team member error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update media team member",
      error: error.message,
    });
  }
};

// @desc    Delete media team member (Admin only)
// @route   DELETE /api/admin/media-team/:id
// @access  Private (Admin)
export const deleteMediaTeamMember = async (req, res) => {
  try {
    const member = await MediaTeam.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Media team member not found",
      });
    }

    await member.deleteOne();

    res.json({
      success: true,
      message: "Media team member deleted successfully",
    });
  } catch (error) {
    console.error("Delete media team member error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete media team member",
      error: error.message,
    });
  }
};

// @desc    Toggle media team member active status (Admin only)
// @route   PATCH /api/admin/media-team/:id/toggle-status
// @access  Private (Admin)
export const toggleMediaTeamMemberStatus = async (req, res) => {
  try {
    const member = await MediaTeam.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Media team member not found",
      });
    }

    member.isActive = !member.isActive;
    await member.save();

    res.json({
      success: true,
      message: `Media team member ${member.isActive ? "activated" : "deactivated"} successfully`,
      data: {
        member: {
          id: member._id,
          username: member.username,
          isActive: member.isActive,
        },
      },
    });
  } catch (error) {
    console.error("Toggle status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle status",
      error: error.message,
    });
  }
};

// @desc    Reset media team member password (Admin only)
// @route   POST /api/admin/media-team/:id/reset-password
// @access  Private (Admin)
export const resetMediaTeamMemberPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    const member = await MediaTeam.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Media team member not found",
      });
    }

    member.password = newPassword;
    await member.save();

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: error.message,
    });
  }
};
