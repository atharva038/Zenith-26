import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const mediaTeamSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: "media_team",
      immutable: true, // Cannot be changed
    },
    permissions: {
      type: [String],
      default: ["upload_media", "view_media", "delete_own_media"],
      enum: [
        "upload_media",
        "view_media",
        "delete_own_media",
        "edit_own_media",
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    uploadCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
mediaTeamSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
mediaTeamSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user has specific permission
mediaTeamSchema.methods.hasPermission = function (permission) {
  return this.permissions.includes(permission);
};

// Remove password from JSON output
mediaTeamSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const MediaTeam = mongoose.model("MediaTeam", mediaTeamSchema);

export default MediaTeam;
