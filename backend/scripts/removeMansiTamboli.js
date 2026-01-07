import mongoose from "mongoose";
import dotenv from "dotenv";
import {v2 as cloudinary} from "cloudinary";
import TeamMember from "../models/TeamMember.js";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function removeMansiTamboli() {
  try {
    console.log("\n🔍 Searching for Mansi Tamboli in Decoration committee...\n");

    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/zenith26"
    );
    console.log("✅ Connected to MongoDB\n");

    // Find Mansi Tamboli
    const member = await TeamMember.findOne({
      name: { $regex: /Mansi.*Tamboli/i },
      committee: "DECORATION",
      position: "main",
    });

    if (!member) {
      console.log("❌ Mansi Tamboli not found in Decoration Main Team");
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log("✅ Found member:");
    console.log(`   Name: ${member.name}`);
    console.log(`   Committee: ${member.committee}`);
    console.log(`   Position: ${member.position}`);
    console.log(`   Phone: ${member.phoneNumber}`);
    console.log(`   Photo: ${member.photo}\n`);

    // Delete from Cloudinary first
    if (member.photoPublicId) {
      try {
        console.log("🗑️  Deleting photo from Cloudinary...");
        await cloudinary.uploader.destroy(member.photoPublicId);
        console.log("✅ Photo deleted from Cloudinary\n");
      } catch (error) {
        console.log("⚠️  Warning: Could not delete photo from Cloudinary:", error.message);
      }
    }

    // Delete from database
    await TeamMember.findByIdAndDelete(member._id);
    console.log("✅ Mansi Tamboli removed from database\n");

    console.log("🎉 Successfully removed Mansi Tamboli from Decoration Main Team!");
    console.log("💡 She can now re-register with a new photo.\n");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

removeMansiTamboli();
