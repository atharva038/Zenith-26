import mongoose from "mongoose";
import dotenv from "dotenv";
import {v2 as cloudinary} from "cloudinary";
import TeamMember from "../models/TeamMember.js";
import readline from "readline";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function listAllMembers() {
  try {
    console.log("\n📋 Listing all team members...\n");

    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/zenith26"
    );
    console.log("✅ Connected to MongoDB\n");

    const allMembers = await TeamMember.find({isActive: true}).sort({
      committee: 1,
      createdAt: 1,
    });

    console.log(`📊 Total team members: ${allMembers.length}\n`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    let currentCommittee = "";
    const membersWithIndex = [];

    allMembers.forEach((member, index) => {
      if (member.committee !== currentCommittee) {
        currentCommittee = member.committee;
        console.log(`\n📂 ${currentCommittee}:\n`);
      }

      const icon = member.position === "main" ? "👑" : "⭐";
      console.log(
        `   ${index + 1}. ${icon} ${member.name} - ${member.phoneNumber}`
      );
      console.log(`      🆔 ID: ${member._id}`);
      console.log(`      📅 Added: ${member.createdAt.toLocaleString()}\n`);

      membersWithIndex.push({index: index + 1, member});
    });

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Check for potential duplicates by name
    const nameGroups = {};
    allMembers.forEach((member) => {
      const nameKey = member.name.toLowerCase().trim();
      if (!nameGroups[nameKey]) {
        nameGroups[nameKey] = [];
      }
      nameGroups[nameKey].push(member);
    });

    const potentialDuplicates = Object.entries(nameGroups).filter(
      ([_, members]) => members.length > 1
    );

    if (potentialDuplicates.length > 0) {
      console.log("\n⚠️  Potential duplicates found (same name):\n");
      potentialDuplicates.forEach(([name, members]) => {
        console.log(`   👤 ${name} (${members.length} entries):`);
        members.forEach((m) => {
          console.log(
            `      - ${m.committee} | ${
              m.phoneNumber
            } | ${m.createdAt.toLocaleString()}`
          );
        });
        console.log("");
      });
    }

    console.log("\n❓ Do you want to delete a team member? (y/n): ");
    const answer = await question("");

    if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
      console.log("\n📝 Enter the number of the member to delete: ");
      const numberStr = await question("");
      const number = parseInt(numberStr);

      if (number > 0 && number <= allMembers.length) {
        const toDelete = allMembers[number - 1];
        console.log(`\n⚠️  You are about to delete:\n`);
        console.log(`   👤 Name: ${toDelete.name}`);
        console.log(`   📋 Committee: ${toDelete.committee}`);
        console.log(`   📱 Phone: ${toDelete.phoneNumber}`);
        console.log(`   🆔 ID: ${toDelete._id}\n`);

        const confirm = await question("Confirm deletion? (yes/no): ");

        if (confirm.toLowerCase() === "yes") {
          try {
            // Delete photo from Cloudinary
            if (toDelete.photoPublicId) {
              await cloudinary.uploader.destroy(toDelete.photoPublicId);
              console.log("\n✅ Deleted photo from Cloudinary");
            }

            // Delete from database
            await TeamMember.findByIdAndDelete(toDelete._id);
            console.log("✅ Deleted from database");
            console.log("\n🎉 Team member successfully removed!\n");
          } catch (error) {
            console.error("\n❌ Error deleting member:", error.message);
          }
        } else {
          console.log("\n❌ Deletion cancelled.");
        }
      } else {
        console.log("\n❌ Invalid number.");
      }
    } else {
      console.log("\n✅ No changes made.");
    }

    rl.close();
    await mongoose.disconnect();
    console.log("\n👋 Disconnected from MongoDB\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error);
    rl.close();
    process.exit(1);
  }
}

console.log("\n🧹 ZENITH 2026 - Team Member Manager");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
console.log("This script will:");
console.log("  • List all team members");
console.log("  • Show potential duplicates");
console.log("  • Allow you to delete specific entries\n");

listAllMembers();
