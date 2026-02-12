import mongoose from "mongoose";

const pageLikeSchema = new mongoose.Schema(
  {
    pageName: {
      type: String,
      required: true,
      unique: true,
      enum: [
        "home",
        "sports",
        "gameverse",
        "marathon",
        "gallery",
        "team",
        "contact",
        "about"
      ],
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    // Store visitor IDs who liked (to prevent duplicate likes)
    likedBy: [{
      visitorId: {
        type: String,
        required: true,
      },
      likedAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
pageLikeSchema.index({ pageName: 1 });

const PageLike = mongoose.model("PageLike", pageLikeSchema);

export default PageLike;
