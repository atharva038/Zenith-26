import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";
import bcrypt from "bcryptjs";

dotenv.config();

async function testAndFixAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/zenith26"
    );
    console.log("✅ Connected to MongoDB");

    // Find all admins
    const admins = await Admin.find({});
    console.log("\n📋 Total admins in database:", admins.length);

    if (admins.length === 0) {
      console.log("\n⚠️  No admins found! Creating default admin...");

      const newAdmin = await Admin.create({
        username: "zenith_admin",
        email: "admin@zenith2026.com",
        password: "Admin@123",
        role: "superadmin",
        isActive: true,
      });

      console.log("\n✅ Default admin created!");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("Email: admin@zenith2026.com");
      console.log("Password: Admin@123");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    } else {
      // List all admins
      console.log("\n👥 Existing admins:");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      for (const admin of admins) {
        console.log(`\nID: ${admin._id}`);
        console.log(`Email: ${admin.email}`);
        console.log(`Username: ${admin.username}`);
        console.log(`Role: ${admin.role}`);
        console.log(`Active: ${admin.isActive}`);
        console.log(`Has Password: ${!!admin.password}`);
        console.log(`Password Hash Length: ${admin.password?.length || 0}`);
      }
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // Test password for first admin
      const firstAdmin = admins[0];
      console.log(`\n🔍 Testing password comparison for: ${firstAdmin.email}`);

      const testPasswords = [
        "Admin@123",
        "Zenith@2026",
        "admin123",
        "zenith2026",
      ];

      for (const testPass of testPasswords) {
        try {
          const isValid = await firstAdmin.comparePassword(testPass);
          console.log(
            `   "${testPass}" -> ${isValid ? "✅ VALID" : "❌ Invalid"}`
          );
          if (isValid) {
            console.log(`\n🎉 SUCCESS! Use this password: "${testPass}"`);
          }
        } catch (error) {
          console.log(`   "${testPass}" -> ❌ Error:`, error.message);
        }
      }

      // Offer to reset password
      console.log("\n❓ Want to reset password to 'Admin@123'?");
      console.log("   Run: node resetAdminPassword.js");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error);
    process.exit(1);
  }
}

testAndFixAdmin();
