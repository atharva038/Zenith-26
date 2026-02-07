import Settings from "../models/Settings.js";

// Get current settings
export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
      error: error.message,
    });
  }
};

// Update settings (Admin only)
export const updateSettings = async (req, res) => {
  try {
    const adminId = req.admin?._id; // Auth middleware sets req.admin
    const updates = req.body;
    
    // Validate updates
    const allowedFields = [
      "isRegistrationOpen",
      "registrationMessage",
      "registrationStartDate",
      "registrationEndDate",
    ];
    
    const filteredUpdates = {};
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }
    
    const settings = await Settings.updateSettings(filteredUpdates, adminId);
    
    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update settings",
      error: error.message,
    });
  }
};

// Toggle registration status (Quick action)
export const toggleRegistration = async (req, res) => {
  try {
    const adminId = req.admin?._id; // Auth middleware sets req.admin
    const settings = await Settings.getSettings();
    
    // Toggle the value
    const newStatus = !settings.isRegistrationOpen;
    
    const updatedSettings = await Settings.updateSettings(
      { isRegistrationOpen: newStatus },
      adminId
    );
    
    res.status(200).json({
      success: true,
      message: `Registration ${newStatus ? "opened" : "closed"} successfully`,
      data: updatedSettings,
    });
  } catch (error) {
    console.error("Error toggling registration:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle registration",
      error: error.message,
    });
  }
};

// Public endpoint to check if registration is open (No auth required)
export const checkRegistrationStatus = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    
    console.log("📋 Registration Status Check:", {
      isOpen: settings.isRegistrationOpen,
      message: settings.registrationMessage,
    });
    
    res.status(200).json({
      success: true,
      isOpen: settings.isRegistrationOpen,
      message: settings.registrationMessage,
      startDate: settings.registrationStartDate,
      endDate: settings.registrationEndDate,
    });
  } catch (error) {
    console.error("Error checking registration status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check registration status",
      error: error.message,
    });
  }
};
