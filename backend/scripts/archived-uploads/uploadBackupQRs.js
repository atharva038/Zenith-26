import dotenv from "dotenv";
import cloudinary from "./config/cloudinary.js";
import path from "path";
import {fileURLToPath} from "url";
import {dirname} from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const uploadBackupQRs = async () => {
  try {
    console.log("🚀 Starting backup QR codes upload to Cloudinary...\n");

    const imgFolderPath = path.join(__dirname, "../frontend/public/img");

    // Upload QR2.png (okicici)
    console.log("📤 Uploading QR2.png (atharvsjoshi2005-1@okicici)...");
    const qr2Path = path.join(imgFolderPath, "QR2.png");

    const result1 = await cloudinary.uploader.upload(qr2Path, {
      folder: "zenith-26/img/payment",
      public_id: "backup-qr-atharva-okicici",
      transformation: [
        {width: 500, height: 500, crop: "pad", background: "white"},
        {quality: "auto:best"},
        {fetch_format: "auto"},
      ],
      overwrite: true,
    });

    console.log("✅ QR2.png uploaded!");
    console.log("📸 URL:", result1.secure_url);
    console.log("🔗 UPI ID: atharvsjoshi2005-1@okicici\n");

    // Upload QR3.png (okaxis)
    console.log("📤 Uploading QR3.png (atharvsjoshi2005@okaxis)...");
    const qr3Path = path.join(imgFolderPath, "QR3.png");

    const result2 = await cloudinary.uploader.upload(qr3Path, {
      folder: "zenith-26/img/payment",
      public_id: "backup-qr-atharva-okaxis",
      transformation: [
        {width: 500, height: 500, crop: "pad", background: "white"},
        {quality: "auto:best"},
        {fetch_format: "auto"},
      ],
      overwrite: true,
    });

    console.log("✅ QR3.png uploaded!");
    console.log("📸 URL:", result2.secure_url);
    console.log("🔗 UPI ID: atharvsjoshi2005@okaxis\n");

    console.log("✨ All backup QR codes uploaded successfully!\n");
    console.log("📋 Summary - Copy these URLs to your code:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\nBackup QR 1 (ICICI):");
    console.log(`"${result1.secure_url}"`);
    console.log("\nBackup QR 2 (Axis):");
    console.log(`"${result2.secure_url}"`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    return {result1, result2};
  } catch (error) {
    console.error("❌ Error uploading QR codes:", error.message);
    console.error(error);
    throw error;
  }
};

uploadBackupQRs()
  .then(() => {
    console.log("🎉 Upload process complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Upload failed:", error);
    process.exit(1);
  });
