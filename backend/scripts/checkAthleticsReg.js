import mongoose from "mongoose";
import Registration from "../models/Registration.js";
import dotenv from "dotenv";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({path: path.join(__dirname, "../.env")});

const checkAthleticsRegistration = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Find the specific Athletics registration
    const athleticsReg = await Registration.findOne({
      registrationNumber: "ATH-247438-1",
    });

    if (athleticsReg) {
      console.log("📋 Found Registration:");
      console.log("Registration Number:", athleticsReg.registrationNumber);
      console.log("Event Name:", athleticsReg.eventName);
      console.log("Amount:", athleticsReg.amount);
      console.log("Status:", athleticsReg.status);
      console.log("\nForm Data:");
      console.log(JSON.stringify(athleticsReg.formData, null, 2));
      
      const genderCategory =
        athleticsReg.formData?.gender_category ||
        athleticsReg.formData?.get?.("gender_category") ||
        null;
      
      console.log("\n🔍 Gender Category:", genderCategory);
      console.log("Expected Fee:");
      if (genderCategory === "individual") {
        console.log("  ✓ Individual: ₹200");
      } else if (genderCategory === "team") {
        console.log("  ✓ Team (Relay): ₹700");
      } else {
        console.log("  ⚠️ Unknown category:", genderCategory);
      }
    } else {
      console.log("❌ Registration ATH-247438-1 not found");
    }

    // Check all Athletics registrations
    console.log("\n" + "=".repeat(70));
    console.log("ALL ATHLETICS REGISTRATIONS:");
    console.log("=".repeat(70));
    
    const allAthletics = await Registration.find({ eventName: "Athletics" });
    console.log(`\nFound ${allAthletics.length} Athletics registrations:\n`);
    
    allAthletics.forEach((reg) => {
      const genderCategory =
        reg.formData?.gender_category ||
        reg.formData?.get?.("gender_category") ||
        "N/A";
      
      console.log(`${reg.registrationNumber}:`);
      console.log(`  Category: ${genderCategory}`);
      console.log(`  Amount: ₹${reg.amount}`);
      console.log(`  Status: ${reg.status}`);
      console.log(`  Expected: ${genderCategory === "individual" ? "₹200" : genderCategory === "team" ? "₹700" : "Unknown"}`);
      console.log(`  ${reg.amount === (genderCategory === "individual" ? 200 : 700) ? "✅ Correct" : "❌ INCORRECT"}`);
      console.log();
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }
};

checkAthleticsRegistration();
