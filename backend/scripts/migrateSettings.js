import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "../.env") });

const migrateSettings = async () => {
  try {
    console.log("🔄 Starting settings migration...");
    console.log("📦 Connecting to MongoDB...");
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log("✅ Connected to MongoDB");
    
    // Get the Settings collection directly
    const db = mongoose.connection.db;
    const settingsCollection = db.collection("settings");
    
    // Check if settings document exists
    const existingSettings = await settingsCollection.findOne({});
    
    if (!existingSettings) {
      console.log("📝 No settings found. Creating new settings document...");
      
      await settingsCollection.insertOne({
        isCricketRegistrationOpen: false,
        isOtherSportsRegistrationOpen: false,
        isRegistrationOpen: false,
        paymentQrUrl: process.env.MAIN_ZENITH_QR_URL || "",
        registrationMessage: "Registrations will open soon. Stay tuned!",
        registrationStartDate: null,
        registrationEndDate: null,
        lastModifiedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      console.log("✅ New settings document created with all fields");
    } else {
      console.log("📝 Existing settings found. Updating with new fields...");
      
      const updateFields = {};
      
      // Add new fields if they don't exist
      if (existingSettings.isCricketRegistrationOpen === undefined) {
        updateFields.isCricketRegistrationOpen = false;
        console.log("   + Adding isCricketRegistrationOpen: false");
      }
      
      if (existingSettings.isOtherSportsRegistrationOpen === undefined) {
        updateFields.isOtherSportsRegistrationOpen = false;
        console.log("   + Adding isOtherSportsRegistrationOpen: false");
      }
      
      if (existingSettings.paymentQrUrl === undefined) {
        updateFields.paymentQrUrl = process.env.MAIN_ZENITH_QR_URL || "";
        console.log("   + Adding paymentQrUrl:", process.env.MAIN_ZENITH_QR_URL || "(empty)");
      }
      
      if (Object.keys(updateFields).length > 0) {
        updateFields.updatedAt = new Date();
        
        await settingsCollection.updateOne(
          { _id: existingSettings._id },
          { $set: updateFields }
        );
        
        console.log("✅ Settings document updated successfully");
      } else {
        console.log("✅ Settings document already has all fields");
      }
    }
    
    // Fetch and display final settings
    const finalSettings = await settingsCollection.findOne({});
    
    console.log("\n📊 Current Settings:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🏏 Cricket Registration:", finalSettings.isCricketRegistrationOpen ? "✅ OPEN" : "❌ CLOSED");
    console.log("⚽ Other Sports Registration:", finalSettings.isOtherSportsRegistrationOpen ? "✅ OPEN" : "❌ CLOSED");
    console.log("🔄 Legacy Registration:", finalSettings.isRegistrationOpen ? "✅ OPEN" : "❌ CLOSED");
    console.log("💳 Payment QR URL:", finalSettings.paymentQrUrl ? "✅ Set" : "❌ Not Set");
    console.log("📝 Message:", finalSettings.registrationMessage);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    console.log("\n✅ Migration completed successfully!");
    
    await mongoose.connection.close();
    console.log("👋 Database connection closed");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    console.error(error.stack);
    process.exit(1);
  }
};

// Run migration
migrateSettings();
