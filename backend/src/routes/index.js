const express = require("express");
const authRoutes = require("./auth.routes");
const mediaRoutes = require("./media.routes");

const router = express.Router();

// API Routes
router.use("/auth", authRoutes);
router.use("/media", mediaRoutes);

// Health check
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
