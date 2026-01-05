import TeamMember from "../models/TeamMember.js";
import cloudinary from "../config/cloudinary.js";

// @desc    Create a new team member
// @route   POST /api/team-members
// @access  Private (Admin only)
export const createTeamMember = async (req, res) => {
  try {
    const { name, committee, position, phoneNumber } = req.body;

    // Check if photo was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Photo is required",
      });
    }

    // Create team member with Cloudinary photo URL
    const teamMember = new TeamMember({
      name,
      committee,
      position,
      phoneNumber,
      photo: req.file.path, // Cloudinary URL
      photoPublicId: req.file.filename, // Cloudinary public ID
    });

    await teamMember.save();

    res.status(201).json({
      success: true,
      message: "Team member created successfully",
      data: { teamMember },
    });
  } catch (error) {
    console.error("Create team member error:", error);

    // If there's an error and file was uploaded, clean up Cloudinary
    if (req.file) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (cloudinaryError) {
        console.error("Error cleaning up uploaded file:", cloudinaryError);
      }
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating team member",
    });
  }
};

// @desc    Get all team members
// @route   GET /api/team-members
// @access  Public
export const getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({ isActive: true }).sort({
      committee: 1,
      position: 1,
      createdAt: -1,
    });

    // Group team members by committee
    const groupedMembers = teamMembers.reduce((groups, member) => {
      const committee = member.committee;
      if (!groups[committee]) {
        groups[committee] = [];
      }
      groups[committee].push(member);
      return groups;
    }, {});

    res.json({
      success: true,
      data: {
        teamMembers,
        groupedMembers,
        count: teamMembers.length,
      },
    });
  } catch (error) {
    console.error("Get team members error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching team members",
    });
  }
};

// @desc    Get team member by ID
// @route   GET /api/team-members/:id
// @access  Public
export const getTeamMemberById = async (req, res) => {
  try {
    const teamMember = await TeamMember.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    res.json({
      success: true,
      data: { teamMember },
    });
  } catch (error) {
    console.error("Get team member error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching team member",
    });
  }
};

// @desc    Update team member
// @route   PUT /api/team-members/:id
// @access  Private (Admin only)
export const updateTeamMember = async (req, res) => {
  try {
    const { name, committee, position, phoneNumber } = req.body;

    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    // Update basic fields
    if (name) teamMember.name = name;
    if (committee) teamMember.committee = committee;
    if (position) teamMember.position = position;
    if (phoneNumber) teamMember.phoneNumber = phoneNumber;

    // Handle photo update if new file is uploaded
    if (req.file) {
      // Delete old photo from Cloudinary
      try {
        await cloudinary.uploader.destroy(teamMember.photoPublicId);
      } catch (cloudinaryError) {
        console.error("Error deleting old photo:", cloudinaryError);
      }

      // Update with new photo
      teamMember.photo = req.file.path;
      teamMember.photoPublicId = req.file.filename;
    }

    await teamMember.save();

    res.json({
      success: true,
      message: "Team member updated successfully",
      data: { teamMember },
    });
  } catch (error) {
    console.error("Update team member error:", error);

    // If there's an error and new file was uploaded, clean up
    if (req.file) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (cloudinaryError) {
        console.error("Error cleaning up uploaded file:", cloudinaryError);
      }
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating team member",
    });
  }
};

// @desc    Delete team member (soft delete)
// @route   DELETE /api/team-members/:id
// @access  Private (Admin only)
export const deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    // Soft delete - set isActive to false
    teamMember.isActive = false;
    await teamMember.save();

    res.json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    console.error("Delete team member error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting team member",
    });
  }
};

// @desc    Permanently delete team member
// @route   DELETE /api/team-members/:id/permanent
// @access  Private (Admin only)
export const permanentlyDeleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    // Delete photo from Cloudinary
    try {
      await cloudinary.uploader.destroy(teamMember.photoPublicId);
    } catch (cloudinaryError) {
      console.error("Error deleting photo from Cloudinary:", cloudinaryError);
    }

    // Permanently delete from database
    await teamMember.deleteOne();

    res.json({
      success: true,
      message: "Team member permanently deleted",
    });
  } catch (error) {
    console.error("Permanent delete team member error:", error);
    res.status(500).json({
      success: false,
      message: "Error permanently deleting team member",
    });
  }
};

// @desc    Clear all team members and their Cloudinary photos
// @route   DELETE /api/team-members/clear-all-data
// @access  Private (Admin only)
export const clearAllTeamData = async (req, res) => {
  try {
    // Get all team members
    const allTeamMembers = await TeamMember.find({});

    let deletedCount = 0;
    let cloudinaryDeletedCount = 0;
    let errors = [];

    // Delete photos from Cloudinary and records from database
    for (const member of allTeamMembers) {
      try {
        // Delete photo from Cloudinary
        if (member.photoPublicId) {
          await cloudinary.uploader.destroy(member.photoPublicId);
          cloudinaryDeletedCount++;
        }

        // Delete from database
        await member.deleteOne();
        deletedCount++;
      } catch (memberError) {
        console.error(`Error deleting member ${member.name}:`, memberError);
        errors.push({
          member: member.name,
          error: memberError.message,
        });
      }
    }

    // Also try to delete the entire team photos folder from Cloudinary
    try {
      await cloudinary.api.delete_resources_by_prefix("zenith26/team-photos/");
      await cloudinary.api.delete_folder("zenith26/team-photos");
    } catch (folderError) {
      console.warn("Could not delete team photos folder:", folderError);
    }

    res.json({
      success: true,
      message: "Team data clearing completed",
      data: {
        deletedMembers: deletedCount,
        cloudinaryImagesDeleted: cloudinaryDeletedCount,
        totalMembersProcessed: allTeamMembers.length,
        errors: errors.length > 0 ? errors : undefined,
      },
    });
  } catch (error) {
    console.error("Clear all team data error:", error);
    res.status(500).json({
      success: false,
      message: "Error clearing team data",
      error: error.message,
    });
  }
};
