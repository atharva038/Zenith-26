import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

async function resetPassword() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/zenith26"
    );
    console.log("✅ Connected to MongoDB");

    // Find first admin or create one
    let admin = await Admin.findOne({});

    if (!admin) {
      console.log("\n⚠️  No admin found. Creating new admin...");
      admin = await Admin.create({
        username: "zenith_admin",
        email: "admin@zenith2026.com",
        password: "Admin@123",
        role: "superadmin",
        isActive: true,
      });
      console.log("✅ New admin created!");
    } else {
      console.log(`\n🔄 Resetting password for: ${admin.email}`);

      // Update password (will trigger pre-save hook to hash it)
      admin.password = "Admin@123";
      await admin.save();

      console.log("✅ Password reset successfully!");
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email:", admin.email);
    console.log("👤 Username:", admin.username);
    console.log("🔑 Password: Admin@123");
    console.log("👑 Role:", admin.role);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n✨ You can now login with these credentials!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

resetPassword();
