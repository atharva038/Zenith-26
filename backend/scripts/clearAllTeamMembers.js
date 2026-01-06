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

async function clearAllTeamMembers() {
  try {
    console.log("\n🚀 Starting Team Member Data Cleanup...\n");

    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/zenith26"
    );
    console.log("✅ Connected to MongoDB\n");

    // Get all team members
    const teamMembers = await TeamMember.find({});
    const totalMembers = teamMembers.length;

    if (totalMembers === 0) {
      console.log("ℹ️  No team members found in database!");
      console.log("✨ Database is already clean.\n");
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log(`📊 Found ${totalMembers} team member(s) to delete\n`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Delete photos from Cloudinary
    let cloudinarySuccess = 0;
    let cloudinaryFailed = 0;

    console.log("\n🗑️  Deleting photos from Cloudinary...\n");

    for (const member of teamMembers) {
      try {
        if (member.photoPublicId) {
          await cloudinary.uploader.destroy(member.photoPublicId);
          cloudinarySuccess++;
          console.log(
            `✅ Deleted photo for: ${member.name} (${member.committee})`
          );
        }
      } catch (error) {
        cloudinaryFailed++;
        console.log(`❌ Failed to delete photo for: ${member.name}`);
        console.log(`   Error: ${error.message}`);
      }
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n📸 Cloudinary Deletion Summary:");
    console.log(`   ✅ Successfully deleted: ${cloudinarySuccess}`);
    console.log(`   ❌ Failed: ${cloudinaryFailed}`);

    // Delete all team members from database
    console.log("\n🗄️  Deleting team members from database...\n");

    const deleteResult = await TeamMember.deleteMany({});

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n✨ CLEANUP COMPLETE!\n");
    console.log("📊 Final Summary:");
    console.log(
      `   • Team members deleted from database: ${deleteResult.deletedCount}`
    );
    console.log(
      `   • Photos deleted from Cloudinary: ${cloudinarySuccess}/${totalMembers}`
    );

    if (cloudinaryFailed > 0) {
      console.log(
        `   ⚠️  Warning: ${cloudinaryFailed} photos failed to delete from Cloudinary`
      );
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("🎉 All dummy team member data has been cleared!");
    console.log("✅ Ready for fresh team member uploads.\n");

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error clearing team member data:");
    console.error(error);
    process.exit(1);
  }
}

// Add confirmation prompt
console.log(
  "\n⚠️  WARNING: This will permanently delete ALL team member data!"
);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("This includes:");
console.log("  • All team member records from MongoDB");
console.log("  • All team member photos from Cloudinary");
console.log("  • This action CANNOT be undone!");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

// Run the cleanup
clearAllTeamMembers();
