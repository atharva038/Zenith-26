/**
 * Script to drop the unique index on Registration collection
 * This allows duplicate registrations (same email for same event/sport)
 * 
 * Run with: node scripts/dropDuplicateIndex.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/zenith26";

async function dropIndex() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection("registrations");

    // List existing indexes
    console.log("\n📋 Current indexes:");
    const indexes = await collection.indexes();
    indexes.forEach(idx => {
      console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)} ${idx.unique ? '(UNIQUE)' : ''}`);
    });

    // Try to drop the unique index on eventId + email
    try {
      await collection.dropIndex("eventId_1_email_1");
      console.log("\n✅ Successfully dropped index: eventId_1_email_1");
    } catch (error) {
      if (error.codeName === 'IndexNotFound') {
        console.log("\n⚠️ Index 'eventId_1_email_1' does not exist (already removed)");
      } else {
        console.error("\n❌ Error dropping index:", error.message);
      }
    }

    // Verify indexes after dropping
    console.log("\n📋 Indexes after update:");
    const newIndexes = await collection.indexes();
    newIndexes.forEach(idx => {
      console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)} ${idx.unique ? '(UNIQUE)' : ''}`);
    });

    console.log("\n✅ Done! Duplicate registrations are now allowed.");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

dropIndex();
