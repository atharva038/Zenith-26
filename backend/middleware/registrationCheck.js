import Settings from "../models/Settings.js";

/**
 * Middleware to check if registration is globally enabled
 * This applies to all sports/event registrations
 */
export const checkRegistrationEnabled = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    
    if (!settings.isRegistrationOpen) {
      return res.status(403).json({
        success: false,
        message: settings.registrationMessage || "Registrations are currently closed",
        isRegistrationClosed: true,
      });
    }
    
    // Registration is open, proceed
    next();
  } catch (error) {
    console.error("Error checking registration status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify registration status",
      error: error.message,
    });
  }
};
