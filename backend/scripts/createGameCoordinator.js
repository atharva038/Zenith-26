import mongoose from "mongoose";
import dotenv from "dotenv";
import GameCoordinator from "../models/GameCoordinator.js";

dotenv.config();

// Define all available sports
const allSports = [
  "Cricket",
  "Football",
  "Basketball",
  "Volleyball",
  "Badminton",
  "Table Tennis",
  "Chess",
  "Carrom",
  "Athletics",
  "Swimming",
  "Kabaddi",
  "Kho-Kho",
  "Hockey",
  "Lawn Tennis",
  "Squash",
];

const createGameCoordinator = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/zenith26",
    );
    console.log("✅ MongoDB Connected");

    // Create a default game coordinator
    const coordinator = new GameCoordinator({
      username: "coordinator",
      email: "coordinator@zenith2026.com",
      password: "coordinator123", // Password will be hashed by the pre-save hook
      assignedSports: allSports, // Assign all sports by default
    });

    await coordinator.save();

    console.log("\n✅ Game Coordinator Created Successfully!");
    console.log("\n📋 Coordinator Details:");
    console.log("   Username: coordinator");
    console.log("   Email: coordinator@zenith2026.com");
    console.log("   Password: coordinator123");
    console.log("   Assigned Sports: All Sports");
    console.log("\n🔐 Login URL: http://localhost:5173/coordinator/login");
    console.log("\n⚠️  Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    if (error.code === 11000) {
      console.error("\n❌ Error: Coordinator already exists!");
      console.log("\nExisting coordinator credentials:");
      console.log("   Username: coordinator");
      console.log("   Email: coordinator@zenith2026.com");
    } else {
      console.error("\n❌ Error creating coordinator:", error.message);
    }
    process.exit(1);
  }
};

createGameCoordinator();
