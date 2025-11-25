require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

// Import configurations and utilities
const connectDB = require("./config/database");
const { testCloudinaryConnection } = require("./config/cloudinary");
const errorHandler = require("./middleware/errorHandler");
const routes = require("./routes");
const createDefaultAdmin = require("./utils/createAdmin");

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Test Cloudinary Connection
testCloudinaryConnection();

// Create default admin user
setTimeout(() => {
  createDefaultAdmin();
}, 2000);

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};

// Security Middleware
app.use(helmet());
app.use(cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || "15") * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// Body Parser Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Compression Middleware
app.use(compression());

// Logging Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// API Routes
app.use("/api", routes);

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Zenith 2026 API Server",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      media: "/api/media",
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use(errorHandler);

// Server Configuration
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Start Server
const server = app.listen(PORT, () => {
  console.log("");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("🚀 Zenith 2026 Backend Server Started Successfully!");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`📍 Environment: ${NODE_ENV}`);
  console.log(`🌐 Server running on port: ${PORT}`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
  console.log(`📚 API Base: http://localhost:${PORT}/api`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`);
  console.log("═══════════════════════════════════════════════════════════");
  console.log("");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("✅ Process terminated");
  });
});

module.exports = app;
