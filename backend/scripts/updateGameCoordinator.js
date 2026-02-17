import mongoose from "mongoose";
import dotenv from "dotenv";
import GameCoordinator from "../models/GameCoordinator.js";

dotenv.config();

const updateGameCoordinator = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/zenith26",
    );
    console.log("✅ MongoDB Connected");

    // Find existing coordinator
    const existingCoordinator = await GameCoordinator.findOne({});
    
    if (!existingCoordinator) {
      console.log("❌ No coordinator found. Creating new one...");
      
      const allSports = [
        "Cricket", "Football", "Basketball", "Volleyball", "Badminton",
        "Table Tennis", "Chess", "Carrom", "Athletics", "Swimming",
        "Kabaddi", "Kho-Kho", "Hockey", "Lawn Tennis", "Squash",
      ];
      
      const newCoordinator = new GameCoordinator({
        username: "SggsCoordinator",
        email: "coordinator@sggsie.ac.in",
        password: "SggsGame@2026",
        assignedSports: allSports,
      });
      
      await newCoordinator.save();
      console.log("\n✅ New Coordinator Created!");
    } else {
      // Update existing coordinator
      existingCoordinator.username = "SggsCoordinator";
      existingCoordinator.password = "SggsGame@2026";
      existingCoordinator.email = "coordinator@sggsie.ac.in";
      
      await existingCoordinator.save();
      console.log("\n✅ Coordinator Updated Successfully!");
    }

    console.log("\n📋 Updated Coordinator Details:");
    console.log("   Username: SggsCoordinator");
    console.log("   Password: SggsGame@2026");
    console.log("\n🔐 Login URL: http://localhost:5173/coordinator/login");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error updating coordinator:", error.message);
    process.exit(1);
  }
};

updateGameCoordinator();
