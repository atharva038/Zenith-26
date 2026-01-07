import mongoose from "mongoose";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import TeamMember from "../models/TeamMember.js";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function removeTeamMembers() {
  try {
    console.log("\n🔍 Starting removal of team members...\n");

    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/zenith26"
    );
    console.log("✅ Connected to MongoDB\n");

    // =====================================================
    // 1. Remove Mansiii from DECORATION committee
    // =====================================================
    console.log("=" .repeat(50));
    console.log("1️⃣  Searching for Mansiii in DECORATION committee...\n");

    const mansi = await TeamMember.findOne({
      name: { $regex: /mansi/i },
      committee: "DECORATION",
    });

    if (!mansi) {
      console.log("❌ Mansiii not found in DECORATION committee\n");
    } else {
      console.log("✅ Found member:");
      console.log(`   Name: ${mansi.name}`);
      console.log(`   Committee: ${mansi.committee}`);
      console.log(`   Position: ${mansi.position}`);
      console.log(`   Phone: ${mansi.phoneNumber}`);
      console.log(`   Photo: ${mansi.photo}\n`);

      // Delete from Cloudinary first
      if (mansi.photoPublicId) {
        try {
          console.log("🗑️  Deleting photo from Cloudinary...");
          await cloudinary.uploader.destroy(mansi.photoPublicId);
          console.log("✅ Photo deleted from Cloudinary\n");
        } catch (error) {
          console.log(
            "⚠️  Warning: Could not delete photo from Cloudinary:",
            error.message
          );
        }
      }

      // Delete from database
      await TeamMember.findByIdAndDelete(mansi._id);
      console.log("✅ Mansiii removed from DECORATION committee\n");
    }

    // =====================================================
    // 2. Remove Atharva (SJC) from MEDIA & WEB committee
    // =====================================================
    console.log("=" .repeat(50));
    console.log("2️⃣  Searching for Atharva (SJC) in MEDIA & WEB committee...\n");

    const atharva = await TeamMember.findOne({
      name: { $regex: /atharva/i },
      committee: "MEDIA & WEB",
      position: "sjc",
    });

    if (!atharva) {
      console.log("❌ Atharva (SJC) not found in MEDIA & WEB committee\n");
    } else {
      console.log("✅ Found member:");
      console.log(`   Name: ${atharva.name}`);
      console.log(`   Committee: ${atharva.committee}`);
      console.log(`   Position: ${atharva.position}`);
      console.log(`   Phone: ${atharva.phoneNumber}`);
      console.log(`   Photo: ${atharva.photo}\n`);

      // Delete from Cloudinary first
      if (atharva.photoPublicId) {
        try {
          console.log("🗑️  Deleting photo from Cloudinary...");
          await cloudinary.uploader.destroy(atharva.photoPublicId);
          console.log("✅ Photo deleted from Cloudinary\n");
        } catch (error) {
          console.log(
            "⚠️  Warning: Could not delete photo from Cloudinary:",
            error.message
          );
        }
      }

      // Delete from database
      await TeamMember.findByIdAndDelete(atharva._id);
      console.log("✅ Atharva removed from MEDIA & WEB (SJC) committee\n");
    }

    // =====================================================
    // Summary
    // =====================================================
    console.log("=" .repeat(50));
    console.log("🎉 Removal process completed!\n");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

removeTeamMembers();
