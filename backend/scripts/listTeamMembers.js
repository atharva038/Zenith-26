import mongoose from "mongoose";
import dotenv from "dotenv";
import TeamMember from "../models/TeamMember.js";

dotenv.config();

async function listTeamMembers() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/zenith26"
    );
    console.log("✅ Connected to MongoDB\n");

    const allMembers = await TeamMember.find({}).sort({
      committee: 1,
      position: 1,
      name: 1,
    });

    console.log(`📊 Total team members: ${allMembers.length}\n`);

    let currentCommittee = "";
    allMembers.forEach((member) => {
      if (member.committee !== currentCommittee) {
        currentCommittee = member.committee;
        console.log(`\n📂 ${currentCommittee}:`);
      }
      const icon = member.position === "main" ? "👑" : "⭐";
      console.log(`   ${icon} ${member.name} (${member.position}) - ${member.phoneNumber}`);
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

listTeamMembers();
