import express from "express";
import PageLike from "../models/PageLike.js";

const router = express.Router();

// Get like count for a page
router.get("/:pageName", async (req, res) => {
  try {
    const { pageName } = req.params;
    const visitorId = req.query.visitorId;
    
    let pageLike = await PageLike.findOne({ pageName });
    
    // If page doesn't exist, create it with 0 likes
    if (!pageLike) {
      pageLike = await PageLike.create({ pageName, likeCount: 0, likedBy: [] });
    }
    
    // Check if this visitor has already liked
    const hasLiked = visitorId 
      ? pageLike.likedBy.some(like => like.visitorId === visitorId)
      : false;
    
    res.json({
      success: true,
      data: {
        pageName: pageLike.pageName,
        likeCount: pageLike.likeCount,
        hasLiked,
      },
    });
  } catch (error) {
    console.error("Error getting page likes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get page likes",
      error: error.message,
    });
  }
});

// Toggle like for a page
router.post("/:pageName/toggle", async (req, res) => {
  try {
    const { pageName } = req.params;
    const { visitorId } = req.body;
    
    if (!visitorId) {
      return res.status(400).json({
        success: false,
        message: "Visitor ID is required",
      });
    }
    
    let pageLike = await PageLike.findOne({ pageName });
    
    // If page doesn't exist, create it
    if (!pageLike) {
      pageLike = await PageLike.create({ pageName, likeCount: 0, likedBy: [] });
    }
    
    // Check if already liked
    const existingLikeIndex = pageLike.likedBy.findIndex(
      like => like.visitorId === visitorId
    );
    
    let hasLiked;
    
    if (existingLikeIndex > -1) {
      // Unlike - remove from likedBy and decrement count
      pageLike.likedBy.splice(existingLikeIndex, 1);
      pageLike.likeCount = Math.max(0, pageLike.likeCount - 1);
      hasLiked = false;
    } else {
      // Like - add to likedBy and increment count
      pageLike.likedBy.push({ visitorId, likedAt: new Date() });
      pageLike.likeCount += 1;
      hasLiked = true;
    }
    
    await pageLike.save();
    
    res.json({
      success: true,
      data: {
        pageName: pageLike.pageName,
        likeCount: pageLike.likeCount,
        hasLiked,
      },
    });
  } catch (error) {
    console.error("Error toggling page like:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle like",
      error: error.message,
    });
  }
});

// Get all pages likes (for admin)
router.get("/", async (req, res) => {
  try {
    const pageLikes = await PageLike.find({}).select("pageName likeCount").sort({ likeCount: -1 });
    
    res.json({
      success: true,
      data: pageLikes,
    });
  } catch (error) {
    console.error("Error getting all page likes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get page likes",
      error: error.message,
    });
  }
});

export default router;
