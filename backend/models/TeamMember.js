import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    committee: {
      type: String,
      required: true,
      enum: [
        "EVENT MANAGEMENT",
        "FOOD & SITE",
        "EVENT MANAGEMENT & FOOD",
        "GUEST MANAGEMENT & HOSPITALITY",
        "GROUND & SITE + DISCIPLINE",
        "DECORATION",
        "SPONSORSHIP",
        "MEDIA & WEB",
        "PRC/PERMISSION",
        "FINANCE",
      ],
    },
    position: {
      type: String,
      required: true,
      enum: ["main", "sjc"],
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String, // Cloudinary URL
      required: true,
    },
    photoPublicId: {
      type: String, // Cloudinary public ID for deletion
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
teamMemberSchema.index({ committee: 1 });
teamMemberSchema.index({ position: 1 });
teamMemberSchema.index({ isActive: 1 });

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);

export default TeamMember;
