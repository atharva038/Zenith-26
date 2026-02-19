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
    return null;
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
    null
  );
};

const checkDuplicatesAndFees = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Get all registrations
    const registrations = await Registration.find({}).sort({createdAt: 1});
    console.log(`📊 Total registrations: ${registrations.length}\n`);

    // Check for duplicate emails
    console.log("=" .repeat(70));
    console.log("🔍 CHECKING FOR DUPLICATE EMAILS");
    console.log("=" .repeat(70));
    
    const emailMap = new Map();
    registrations.forEach((reg) => {
      const email = reg.email?.toLowerCase();
      if (email) {
        if (!emailMap.has(email)) {
          emailMap.set(email, []);
        }
        emailMap.get(email).push(reg);
      }
    });

    const duplicateEmails = Array.from(emailMap.entries()).filter(
      ([_, regs]) => regs.length > 1
    );

    if (duplicateEmails.length > 0) {
      console.log(`\n⚠️  Found ${duplicateEmails.length} emails with multiple registrations:\n`);
      duplicateEmails.forEach(([email, regs]) => {
        console.log(`📧 ${email} (${regs.length} registrations):`);
        regs.forEach((reg) => {
          console.log(
            `   - ${reg.registrationNumber}: ${reg.eventName} (${
              reg.formData?.gender_category || "N/A"
            }) - ₹${reg.amount} - ${reg.status}`
          );
        });
        console.log();
      });
    } else {
      console.log("✅ No duplicate emails found");
    }

    // Check for duplicate phone numbers
    console.log("\n" + "=".repeat(70));
    console.log("🔍 CHECKING FOR DUPLICATE PHONE NUMBERS");
    console.log("=" .repeat(70));

    const phoneMap = new Map();
    registrations.forEach((reg) => {
      const phone = reg.phoneNumber;
      if (phone) {
        if (!phoneMap.has(phone)) {
          phoneMap.set(phone, []);
        }
        phoneMap.get(phone).push(reg);
      }
    });

    const duplicatePhones = Array.from(phoneMap.entries()).filter(
      ([_, regs]) => regs.length > 1
    );

    if (duplicatePhones.length > 0) {
      console.log(`\n⚠️  Found ${duplicatePhones.length} phone numbers with multiple registrations:\n`);
      duplicatePhones.forEach(([phone, regs]) => {
        console.log(`📱 ${phone} (${regs.length} registrations):`);
        regs.forEach((reg) => {
          console.log(
            `   - ${reg.registrationNumber}: ${reg.eventName} (${
              reg.formData?.gender_category || "N/A"
            }) - ₹${reg.amount} - ${reg.status}`
          );
        });
        console.log();
      });
    } else {
      console.log("✅ No duplicate phone numbers found");
    }

    // Check for incorrect fees
    console.log("\n" + "=".repeat(70));
    console.log("🔍 CHECKING FOR INCORRECT FEES");
    console.log("=" .repeat(70));

    const incorrectFees = [];
    registrations.forEach((reg) => {
      const genderCategory =
        reg.formData?.get?.("gender_category") ||
        reg.formData?.gender_category ||
        null;

      const correctFee = calculateSportFee(reg.eventName, genderCategory);

      if (correctFee !== null && reg.amount !== correctFee) {
        incorrectFees.push({
          reg,
          correctFee,
          genderCategory,
        });
      }
    });

    if (incorrectFees.length > 0) {
      console.log(`\n❌ Found ${incorrectFees.length} registrations with incorrect fees:\n`);
      incorrectFees.forEach(({reg, correctFee, genderCategory}) => {
        console.log(
          `   ${reg.registrationNumber}: ${reg.eventName} (${
            genderCategory || "N/A"
          })`
        );
        console.log(
          `      Current: ₹${reg.amount} | Expected: ₹${correctFee} | Difference: ₹${
            reg.amount - correctFee
          }`
        );
        console.log(`      Email: ${reg.email}`);
        console.log(`      Status: ${reg.status}`);
        console.log();
      });
    } else {
      console.log("✅ All registration fees are correct");
    }

    // Check for same email + same sport + same category
    console.log("\n" + "=".repeat(70));
    console.log("🔍 CHECKING FOR EXACT DUPLICATE REGISTRATIONS");
    console.log("   (Same email + same sport + same category)");
    console.log("=" .repeat(70));

    const exactDuplicates = new Map();
    registrations.forEach((reg) => {
      const email = reg.email?.toLowerCase();
      const genderCategory =
        reg.formData?.gender_category || reg.formData?.get?.("gender_category") || "none";
      const key = `${email}|${reg.eventName}|${genderCategory}`;

      if (!exactDuplicates.has(key)) {
        exactDuplicates.set(key, []);
      }
      exactDuplicates.get(key).push(reg);
    });

    const exactDuplicatesList = Array.from(exactDuplicates.entries()).filter(
      ([_, regs]) => regs.length > 1
    );

    if (exactDuplicatesList.length > 0) {
      console.log(`\n⚠️  Found ${exactDuplicatesList.length} exact duplicate registrations:\n`);
      exactDuplicatesList.forEach(([key, regs]) => {
        const [email, sport, category] = key.split("|");
        console.log(`🚨 ${sport} (${category}) - ${email}:`);
        regs.forEach((reg) => {
          console.log(
            `   - ${reg.registrationNumber}: ₹${reg.amount} - ${reg.status} - Created: ${new Date(
              reg.createdAt
            ).toLocaleString()}`
          );
        });
        console.log();
      });
    } else {
      console.log("✅ No exact duplicate registrations found");
    }

    // Summary
    console.log("\n" + "=".repeat(70));
    console.log("📊 SUMMARY");
    console.log("=" .repeat(70));
    console.log(`Total registrations: ${registrations.length}`);
    console.log(`Emails with multiple registrations: ${duplicateEmails.length}`);
    console.log(`Phone numbers with multiple registrations: ${duplicatePhones.length}`);
    console.log(`Registrations with incorrect fees: ${incorrectFees.length}`);
    console.log(`Exact duplicate registrations: ${exactDuplicatesList.length}`);
    console.log("=" .repeat(70));

    process.exit(0);
  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }
};

// Run the script
checkDuplicatesAndFees();
