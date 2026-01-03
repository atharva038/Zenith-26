import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    role: {
      type: String,
      enum: ["admin", "participant", "volunteer"],
      default: "participant",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profileImage: {
      type: String, // URL to profile image
    },
    department: {
      type: String,
      trim: true,
    },
    year: {
      type: String,
      trim: true,
    },
    rollNumber: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    college: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
// Note: email index is automatically created by unique: true
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

// Pre-save middleware to update the updatedAt field
UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("User", UserSchema);
