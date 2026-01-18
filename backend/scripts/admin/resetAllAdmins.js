import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

const NEW_PASSWORD = "Admin@123";

async function resetAllPasswords() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/zenith26"
    );
    console.log("✅ Connected to MongoDB\n");

    // Find all admins
    const admins = await Admin.find({});

    if (admins.length === 0) {
      console.log("⚠️  No admins found in database!");
      console.log("Creating default admin...\n");

      const newAdmin = await Admin.create({
        username: "admin",
        email: "admin@zenith2026.com",
        password: NEW_PASSWORD,
        role: "superadmin",
        isActive: true,
      });

      console.log("✅ Default admin created!\n");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📧 Email: admin@zenith2026.com");
      console.log("🔑 Password: Admin@123");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    } else {
      console.log(`🔄 Resetting passwords for ${admins.length} admin(s)...\n`);

      for (const admin of admins) {
        admin.password = NEW_PASSWORD;
        await admin.save();
        console.log(`✅ Reset password for: ${admin.email}`);
      }

      console.log("\n✨ All passwords have been reset!\n");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📋 LOGIN CREDENTIALS (All admins)");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      for (const admin of admins) {
        console.log(`\n📧 Email: ${admin.email}`);
        console.log(`👤 Username: ${admin.username}`);
        console.log(`🔑 Password: ${NEW_PASSWORD}`);
        console.log(`👑 Role: ${admin.role}`);
        console.log(`✓ Active: ${admin.isActive}`);
      }

      console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    }

    console.log("💡 TIP: You can use ANY of the above emails to login");
    console.log("🔐 Password for all accounts: Admin@123\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error);
    process.exit(1);
  }
}

resetAllPasswords();
