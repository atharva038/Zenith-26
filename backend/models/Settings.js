import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    // Global Registration Toggle
    isRegistrationOpen: {
      type: Boolean,
      default: false,
      required: true,
    },
    
    // Last modified tracking
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    
    // Additional settings can be added here
    registrationMessage: {
      type: String,
      default: "Registrations will open soon. Stay tuned!",
    },
    
    registrationStartDate: {
      type: Date,
    },
    
    registrationEndDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists (Singleton pattern)
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  
  if (!settings) {
    // Create default settings if none exist
    settings = await this.create({
      isRegistrationOpen: false,
      registrationMessage: "Registrations will open soon. Stay tuned!",
    });
  }
  
  return settings;
};

// Update settings (ensures only one document)
settingsSchema.statics.updateSettings = async function (updates, adminId) {
  let settings = await this.getSettings();
  
  Object.assign(settings, updates);
  settings.lastModifiedBy = adminId;
  
  await settings.save();
  return settings;
};

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
