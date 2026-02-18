import mongoose from "mongoose";
import Registration from "../models/Registration.js";
import dotenv from "dotenv";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({path: path.join(__dirname, "../.env")});

// Sport fees configuration - must match registration controller
const SPORTS_FEES = {
  Cricket: {amount: 6500},
  "Box Cricket": {amount: 3000},
  Football: {amount: 3000},
  Basketball: {men: 2500, women: 1500},
  Volleyball: {men: 2200, women: 1500},
  Badminton: {boys: 1000, girls: 800, mixed: 600},
  "Table Tennis": {amount: 400},
  Chess: {team: 500, individual: 200},
  Carrom: {amount: 300},
  Athletics: {individual: 200, team: 700},
  Swimming: {amount: 300},
  Kabaddi: {men: 2200, women: 1500},
  "Kho-Kho": {men: 1500, women: 1200},
  Hockey: {amount: 2500},
  "Lawn Tennis": {amount: 500},
  Squash: {amount: 400},
  Handball: {amount: 1500},
  "Rink Football": {men: 2200, women: 1500},
  "Tug of War": {amount: 1000},
  "Power Lifting": {amount: 300},
};

// Calculate correct fee based on sport and category
const calculateSportFee = (sportName, genderCategory) => {
  const feeInfo = SPORTS_FEES[sportName];

  if (!feeInfo) {
    console.warn(`No fee info found for sport: ${sportName}`);
    return 500;
  }

  if (feeInfo.amount) {
    return feeInfo.amount;
  }

  if (genderCategory) {
    const category = genderCategory.toLowerCase();

    if (feeInfo.men && category === "men") return feeInfo.men;
    if (feeInfo.women && category === "women") return feeInfo.women;
    if (feeInfo.boys && category === "boys") return feeInfo.boys;
    if (feeInfo.girls && category === "girls") return feeInfo.girls;
    if (feeInfo.mixed && category === "mixed") return feeInfo.mixed;
    if (feeInfo.team && category === "team") return feeInfo.team;
    if (feeInfo.individual && category === "individual")
      return feeInfo.individual;
  }

  return (
    feeInfo.amount ||
    feeInfo.men ||
    feeInfo.women ||
    feeInfo.boys ||
    feeInfo.girls ||
    feeInfo.mixed ||
    feeInfo.team ||
    feeInfo.individual ||
    500
  );
};

const fixRegistrationFees = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Get all registrations
    const registrations = await Registration.find({});
    console.log(`📊 Found ${registrations.length} registrations to process`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const reg of registrations) {
      try {
        // Extract gender category from formData
        const genderCategory =
          reg.formData?.get?.("gender_category") ||
          reg.formData?.gender_category ||
          null;

        // Calculate correct fee
        const correctFee = calculateSportFee(reg.eventName, genderCategory);

        // Update if fee is different
        if (reg.amount !== correctFee) {
          const oldAmount = reg.amount;
          reg.amount = correctFee;
          await reg.save();

          console.log(
            `✏️  Updated ${reg.eventName} (${genderCategory || "N/A"}): ₹${oldAmount} → ₹${correctFee} [${reg.registrationNumber}]`
          );
          updated++;
        } else {
          skipped++;
        }
      } catch (error) {
        console.error(
          `❌ Error updating ${reg.registrationNumber}:`,
          error.message
        );
        errors++;
      }
    }

    console.log("\n📈 Summary:");
    console.log(`   Total: ${registrations.length}`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️  Skipped (already correct): ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }
};

// Run the script
fixRegistrationFees();
