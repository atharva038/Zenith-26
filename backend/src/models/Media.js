const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    type: {
      type: String,
      enum: ["image", "video"],
      required: [true, "Please specify media type"],
    },
    cloudinaryId: {
      type: String,
      required: [true, "Cloudinary ID is required"],
    },
    url: {
      type: String,
      required: [true, "Media URL is required"],
    },
    secureUrl: {
      type: String,
      required: [true, "Secure URL is required"],
    },
    publicId: {
      type: String,
      required: [true, "Public ID is required"],
    },
    format: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      enum: ["image", "video", "raw"],
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    duration: {
      type: Number, // For videos
    },
    thumbnail: {
      type: String, // Thumbnail URL for videos
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      enum: ["event", "sports", "ceremony", "participants", "other"],
      default: "other",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
MediaSchema.index({ type: 1, isActive: 1 });
MediaSchema.index({ category: 1, isActive: 1 });
MediaSchema.index({ createdAt: -1 });
MediaSchema.index({ tags: 1 });

// Virtual for formatted file size
MediaSchema.virtual("formattedSize").get(function () {
  const bytes = this.size;
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
});

// Ensure virtuals are included in JSON output
MediaSchema.set("toJSON", { virtuals: true });
MediaSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Media", MediaSchema);
