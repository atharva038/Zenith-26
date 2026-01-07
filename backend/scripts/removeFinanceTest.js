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

async function removeFinanceTest() {
  try {
    console.log("\n🔍 Searching for test entry in Finance committee...\n");

    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/zenith26"
    );
    console.log("✅ Connected to MongoDB\n");

    // Find all Finance members to identify test entries
    const financeMembers = await TeamMember.find({
      committee: "FINANCE",
    });

    console.log(`📊 Found ${financeMembers.length} members in Finance committee:\n`);
    
    financeMembers.forEach((member, index) => {
      console.log(`${index + 1}. ${member.name} (${member.position}) - Phone: ${member.phoneNumber}`);
    });

    // Look for test entries (common test patterns)
    const testMember = await TeamMember.findOne({
      committee: "FINANCE",
      $or: [
        { name: { $regex: /test/i } },
        { name: { $regex: /demo/i } },
        { name: { $regex: /sample/i } },
        { phoneNumber: { $regex: /^(0000000000|1111111111|1234567890|9999999999)$/ } },
      ]
    });

    if (!testMember) {
      console.log("\n❌ No obvious test entry found in Finance committee");
      console.log("💡 Please manually verify which entry to remove from the list above.\n");
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log("\n✅ Found test entry:");
    console.log(`   Name: ${testMember.name}`);
    console.log(`   Committee: ${testMember.committee}`);
    console.log(`   Position: ${testMember.position}`);
    console.log(`   Phone: ${testMember.phoneNumber}`);
    console.log(`   Photo: ${testMember.photo}\n`);

    // Delete from Cloudinary first
    if (testMember.photoPublicId) {
      try {
        console.log("🗑️  Deleting photo from Cloudinary...");
        await cloudinary.uploader.destroy(testMember.photoPublicId);
        console.log("✅ Photo deleted from Cloudinary\n");
      } catch (error) {
        console.log("⚠️  Warning: Could not delete photo from Cloudinary:", error.message);
      }
    }

    // Delete from database
    await TeamMember.findByIdAndDelete(testMember._id);
    console.log("✅ Test entry removed from database\n");

    console.log("🎉 Successfully removed test entry from Finance committee!\n");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

removeFinanceTest();
