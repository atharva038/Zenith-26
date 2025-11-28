const User = require("../models/User");

/**
 * Create default admin user if not exists
 */
const createDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@zenith2026.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@2026";

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await User.create({
        username: "admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });

      console.log("✅ Default admin user created");
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log("   ⚠️  Please change the password after first login!");
    } else {
      console.log("✅ Admin user already exists");
    }
  } catch (error) {
    console.error("❌ Error creating default admin:", error.message);
  }
};

module.exports = createDefaultAdmin;
