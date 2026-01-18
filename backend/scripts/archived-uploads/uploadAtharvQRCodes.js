import dotenv from "dotenv";
import cloudinary from "./config/cloudinary.js";
import path from "path";
import {fileURLToPath} from "url";
import {dirname} from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const uploadAtharvaQRCodes = async () => {
  try {
    console.log("🚀 Starting Atharva's backup QR codes upload...");
    console.log("📝 Please save the QR images from your screenshots as:");
    console.log(
      "   1. atharva-qr-okicici.jpg (UPI: atharvsjoshi2005-1@okicici)"
    );
    console.log("   2. atharva-qr-okaxis.jpg (UPI: atharvsjoshi2005@okaxis)");
    console.log("   Location: Downloads folder\n");

    const downloadsPath = path.join(process.env.HOME, "Downloads");
    const results = [];

    // Upload first QR code (okicici)
    try {
      console.log("📤 Uploading QR code 1 (ICICI Bank)...");
      const qr1Path = path.join(downloadsPath, "atharva-qr-okicici.jpg");

      const result1 = await cloudinary.uploader.upload(qr1Path, {
        folder: "zenith-26/img/payment",
        public_id: "payment-qr-atharva-okicici",
        transformation: [
          {width: 500, height: 500, crop: "fill", gravity: "center"},
          {quality: "auto:best"},
          {fetch_format: "auto"},
        ],
        overwrite: true,
      });

      console.log("✅ ICICI QR uploaded successfully!");
      console.log("📸 URL:", result1.secure_url);
      results.push({
        bank: "ICICI",
        url: result1.secure_url,
        upi: "atharvsjoshi2005-1@okicici",
      });
    } catch (error) {
      console.error("❌ Failed to upload ICICI QR:", error.message);
    }

    // Upload second QR code (okaxis)
    try {
      console.log("\n📤 Uploading QR code 2 (Axis Bank)...");
      const qr2Path = path.join(downloadsPath, "atharva-qr-okaxis.jpg");

      const result2 = await cloudinary.uploader.upload(qr2Path, {
        folder: "zenith-26/img/payment",
        public_id: "payment-qr-atharva-okaxis",
        transformation: [
          {width: 500, height: 500, crop: "fill", gravity: "center"},
          {quality: "auto:best"},
          {fetch_format: "auto"},
        ],
        overwrite: true,
      });

      console.log("✅ Axis QR uploaded successfully!");
      console.log("📸 URL:", result2.secure_url);
      results.push({
        bank: "Axis",
        url: result2.secure_url,
        upi: "atharvsjoshi2005@okaxis",
      });
    } catch (error) {
      console.error("❌ Failed to upload Axis QR:", error.message);
    }

    if (results.length > 0) {
      console.log("\n✨ Upload Summary:");
      console.log("=====================================");
      results.forEach((result, index) => {
        console.log(`\n${index + 1}. ${result.bank} Bank`);
        console.log(`   UPI ID: ${result.upi}`);
        console.log(`   URL: ${result.url}`);
      });
      console.log(
        "\n📋 Copy these URLs to WomenTournamentPage.jsx in BACKUP_QR_URLS array"
      );
    }

    return results;
  } catch (error) {
    console.error("❌ Error in upload process:", error.message);
    throw error;
  }
};

uploadAtharvaQRCodes()
  .then(() => {
    console.log("\n🎉 Process complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Process failed:", error);
    process.exit(1);
  });
