import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

// PRODUCTION ADMIN SETUP
const PRODUCTION_ADMIN = {
  username: "admin",
  email: "admin@zenith2026.com",
  password: "Admin@123",
  role: "superadmin",
  isActive: true,
};

async function setupProductionAdmin() {
  try {
    console.log("🚀 Setting up Production Admin...\n");

    // Connect to MongoDB
    const MONGODB_URI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/zenith26";
    console.log(
      "📡 Connecting to:",
      MONGODB_URI.includes("mongodb+srv") ? "MongoDB Atlas" : "Local MongoDB"
    );

    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({email: PRODUCTION_ADMIN.email});

    if (existingAdmin) {
      console.log("⚠️  Admin already exists!");
      console.log("📧 Email:", existingAdmin.email);
      console.log("👤 Username:", existingAdmin.username);
      console.log("👑 Role:", existingAdmin.role);
      console.log("✓ Active:", existingAdmin.isActive);

      console.log("\n🔄 Resetting password to: Admin@123");
      existingAdmin.password = PRODUCTION_ADMIN.password;
      await existingAdmin.save();
      console.log("✅ Password updated!\n");
    } else {
      console.log("➕ Creating new admin...");
      const admin = await Admin.create(PRODUCTION_ADMIN);
      console.log("✅ Admin created successfully!\n");
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📋 PRODUCTION LOGIN CREDENTIALS");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email:    admin@zenith2026.com");
    console.log("🔑 Password: Admin@123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n✨ Ready for production use!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error);
    process.exit(1);
  }
}

setupProductionAdmin();
