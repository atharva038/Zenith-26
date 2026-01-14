import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import MediaTeam from "../models/MediaTeam.js";
import Admin from "../models/Admin.js";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: join(__dirname, "..", ".env") });

async function createMediaTeamMember() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Find an admin to use as createdBy
    const admin = await Admin.findOne();
    
    if (!admin) {
      console.log("❌ No admin found. Please create an admin first.");
      process.exit(1);
    }

    // Check if media team member already exists
    const existing = await MediaTeam.findOne({ username: "mediateam" });
    
    if (existing) {
      console.log("⚠️  Media team member already exists:");
      console.log("Username:", existing.username);
      console.log("Email:", existing.email);
      console.log("\nDo you want to delete and recreate? (y/n)");
      
      // For script automation, we'll just exit
      console.log("Exiting... Run script with --force to recreate");
      process.exit(0);
    }

    // Create media team member
    const mediaTeam = await MediaTeam.create({
      username: "mediateam",
      email: "media@zenith2026.com",
      password: "Media@2026",
      fullName: "Media Team",
      permissions: ["upload_media", "view_media", "delete_own_media", "edit_own_media"],
      createdBy: admin._id,
      isActive: true,
    });

    console.log("✅ Media Team Member Created Successfully!\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📋 CREDENTIALS (Save these securely!)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Username:    mediateam");
    console.log("Password:    Media@2026");
    console.log("Email:       media@zenith2026.com");
    console.log("Full Name:   Media Team");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("Permissions:");
    mediaTeam.permissions.forEach((perm) => {
      console.log(`  ✓ ${perm}`);
    });
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔐 Login URL: http://localhost:5173/media-team/login");
    console.log("📡 API Endpoint: POST /api/media-team/auth/login");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
}

createMediaTeamMember();
