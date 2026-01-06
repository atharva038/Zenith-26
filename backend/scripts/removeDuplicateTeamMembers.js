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

async function removeDuplicates() {
  try {
    console.log("\n🔍 Finding duplicate team members...\n");

    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/zenith26"
    );
    console.log("✅ Connected to MongoDB\n");

    // Get all team members
    const allMembers = await TeamMember.find({isActive: true}).sort({
      createdAt: 1, // Oldest first
    });

    console.log(`📊 Total team members found: ${allMembers.length}\n`);

    // Find duplicates by phone number
    const phoneMap = new Map();
    const duplicates = [];

    for (const member of allMembers) {
      const phone = member.phoneNumber;
      if (phoneMap.has(phone)) {
        duplicates.push({
          original: phoneMap.get(phone),
          duplicate: member,
        });
      } else {
        phoneMap.set(phone, member);
      }
    }

    if (duplicates.length === 0) {
      console.log("✅ No duplicates found! Database is clean.\n");
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log(`⚠️  Found ${duplicates.length} duplicate(s):\n`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Display duplicates
    for (let i = 0; i < duplicates.length; i++) {
      const {original, duplicate} = duplicates[i];
      console.log(`${i + 1}. Duplicate Entry:`);
      console.log(`   📱 Phone: ${duplicate.phoneNumber}`);
      console.log(`   👤 Name: ${duplicate.name}`);
      console.log(`   📋 Committee: ${duplicate.committee}`);
      console.log(`   ⭐ Position: ${duplicate.position}`);
      console.log(`   🆔 ID: ${duplicate._id}`);
      console.log(`   📅 Created: ${duplicate.createdAt.toLocaleString()}`);
      console.log(
        `   ⚠️  Keeping original from: ${original.createdAt.toLocaleString()}\n`
      );
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("🗑️  Removing duplicate entries...\n");

    let deletedCount = 0;
    let photoDeletedCount = 0;

    for (const {duplicate} of duplicates) {
      try {
        // Delete photo from Cloudinary
        if (duplicate.photoPublicId) {
          await cloudinary.uploader.destroy(duplicate.photoPublicId);
          photoDeletedCount++;
          console.log(`✅ Deleted photo for: ${duplicate.name}`);
        }

        // Delete from database
        await TeamMember.findByIdAndDelete(duplicate._id);
        deletedCount++;
        console.log(`✅ Removed duplicate entry: ${duplicate.name}\n`);
      } catch (error) {
        console.log(`❌ Failed to remove: ${duplicate.name}`);
        console.log(`   Error: ${error.message}\n`);
      }
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("✨ CLEANUP COMPLETE!\n");
    console.log("📊 Summary:");
    console.log(`   • Duplicate entries removed: ${deletedCount}`);
    console.log(`   • Photos deleted from Cloudinary: ${photoDeletedCount}`);
    console.log(
      `   • Remaining team members: ${allMembers.length - deletedCount}\n`
    );

    // Show remaining members
    const remaining = await TeamMember.find({isActive: true}).sort({
      committee: 1,
      name: 1,
    });

    console.log("✅ Current Team Members:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    let currentCommittee = "";
    for (const member of remaining) {
      if (member.committee !== currentCommittee) {
        currentCommittee = member.committee;
        console.log(`\n📂 ${currentCommittee}:`);
      }
      console.log(
        `   ${member.position === "main" ? "👑" : "⭐"} ${member.name} - ${
          member.phoneNumber
        }`
      );
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("🎉 All duplicates have been removed!\n");

    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error removing duplicates:");
    console.error(error);
    process.exit(1);
  }
}

console.log("\n🧹 ZENITH 2026 - Remove Duplicate Team Members");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
console.log("This script will:");
console.log("  • Find duplicate entries (same phone number)");
console.log("  • Keep the oldest entry (first added)");
console.log("  • Remove newer duplicates");
console.log("  • Delete duplicate photos from Cloudinary\n");

removeDuplicates();
