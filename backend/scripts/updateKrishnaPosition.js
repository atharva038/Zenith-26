import mongoose from "mongoose";
import dotenv from "dotenv";
import TeamMember from "../models/TeamMember.js";

dotenv.config();

async function updateKrishnaPosition() {
  try {
    console.log("\n🔄 Updating Krishna's position from SJC to MAIN...\n");

    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/zenith26"
    );
    console.log("✅ Connected to MongoDB\n");

    // Find Krishna by name (partial match to handle case variations)
    const krishna = await TeamMember.findOne({
      name: {$regex: /kr[ui]shna.*keshav.*jadhav/i},
    });

    if (!krishna) {
      console.log("❌ Krishna Keshav Jadhav not found in database");
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log("📋 Found member:");
    console.log(`   Name: ${krishna.name}`);
    console.log(`   Committee: ${krishna.committee}`);
    console.log(`   Current Position: ${krishna.position}`);
    console.log(`   Phone: ${krishna.phoneNumber}\n`);

    if (krishna.position === "main") {
      console.log("ℹ️  Krishna is already in MAIN position. No update needed.");
      await mongoose.disconnect();
      process.exit(0);
    }

    // Update position to main
    krishna.position = "main";
    await krishna.save();

    console.log("✅ Successfully updated Krishna's position to MAIN!\n");
    console.log("📋 Updated details:");
    console.log(`   Name: ${krishna.name}`);
    console.log(`   Committee: ${krishna.committee}`);
    console.log(`   New Position: ${krishna.position} 👑`);
    console.log(`   Phone: ${krishna.phoneNumber}\n`);

    await mongoose.disconnect();
    console.log("✅ Database connection closed\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating Krishna's position:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

updateKrishnaPosition();
