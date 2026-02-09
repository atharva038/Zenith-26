import cloudinary from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMainQR = async () => {
  try {
    console.log("🔄 Starting mainQR.png upload to Cloudinary...");

    // Path to the QR code (go up from backend/scripts to project root, then to frontend)
    const qrPath = path.join(__dirname, "../../frontend/public/img/mainQR.png");

    // Check if file exists
    if (!fs.existsSync(qrPath)) {
      throw new Error("mainQR.png not found at: " + qrPath);
    }

    console.log("✅ File found:", qrPath);

    // Upload to Cloudinary
    const result = await cloudinary.v2.uploader.upload(qrPath, {
      folder: "zenith-2026/payment-qr",
      public_id: "main-zenith-qr",
      overwrite: true,
      resource_type: "image",
      transformation: [
        { width: 800, height: 800, crop: "limit" }, // Limit size while maintaining aspect ratio
        { quality: "auto:best" }, // Optimize quality
        { fetch_format: "auto" }, // Auto format selection
      ],
    });

    console.log("\n🎉 Upload successful!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📊 Upload Details:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✓ Public ID:", result.public_id);
    console.log("✓ Secure URL:", result.secure_url);
    console.log("✓ Width:", result.width);
    console.log("✓ Height:", result.height);
    console.log("✓ Format:", result.format);
    console.log("✓ Size:", (result.bytes / 1024).toFixed(2), "KB");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    console.log("📝 Next Steps:");
    console.log("1. Copy the Secure URL above");
    console.log("2. Update your .env file with:");
    console.log(`   MAIN_ZENITH_QR_URL=${result.secure_url}`);
    console.log("3. Restart your backend server\n");

    return result;
  } catch (error) {
    console.error("❌ Error uploading QR code:", error.message);
    throw error;
  }
};

// Run the upload
uploadMainQR()
  .then(() => {
    console.log("✅ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
