import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

// Admin credentials
const ADMIN_DATA = {
  username: "admin",
  email: "admin@zenith2026.com",
  password: "admin123", // This will be hashed automatically
  role: "superadmin",
};

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/zenith26"
    );
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({email: ADMIN_DATA.email});

    if (existingAdmin) {
      console.log("⚠️  Admin already exists!");
      console.log("Email:", existingAdmin.email);
      console.log("Username:", existingAdmin.username);
      process.exit(0);
    }

    // Create new admin
    const admin = await Admin.create(ADMIN_DATA);

    console.log("\n✅ Admin created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Email:", admin.email);
    console.log("Username:", admin.username);
    console.log("Password: admin123");
    console.log("Role:", admin.role);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n⚠️  Please change the password after first login!\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
}

createAdmin();
