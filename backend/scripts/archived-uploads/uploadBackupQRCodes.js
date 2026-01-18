import dotenv from "dotenv";
import cloudinary from "./config/cloudinary.js";
import path from "path";
import {fileURLToPath} from "url";
import {dirname} from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const uploadBackupQRCodes = async () => {
  try {
    console.log("🚀 Starting backup QR codes upload...");
    console.log(
      "⚠️  Please save the QR code images from WhatsApp/Screenshots to Downloads folder"
    );
    console.log("📝 Expected files: Two QR code images with UPI IDs:");
    console.log("   1. atharvsjoshi2005-1@okicici");
    console.log("   2. atharvsjoshi2005@okaxis");
    console.log(
      "\n💡 Once saved, update the file paths in this script and run again."
    );

    const downloadsPath = path.join(process.env.HOME, "Downloads");

    // You need to update these paths with the actual filenames after downloading
    const qr1Path = path.join(downloadsPath, "qr-okicici.jpg"); // Update this
    const qr2Path = path.join(downloadsPath, "qr-okaxis.jpg"); // Update this

    console.log("\n📂 Looking for files:");
    console.log("   QR 1:", qr1Path);
    console.log("   QR 2:", qr2Path);

    // Upload first QR code (okicici)
    console.log("\n📤 Uploading QR code 1 (okicici)...");

    const result1 = await cloudinary.uploader.upload(qr1Path, {
      folder: "zenith-26/img/payment",
      public_id: "payment-qr-atharva-okicici",
      transformation: [
        {width: 500, height: 500, crop: "fill"},
        {quality: "auto:best"},
        {fetch_format: "auto"},
      ],
      overwrite: true,
    });

    console.log("✅ QR code 1 uploaded!");
    console.log("📸 URL:", result1.secure_url);
    console.log("🔗 UPI ID: atharvsjoshi2005-1@okicici");

    // Upload second QR code (okaxis)
    console.log("\n📤 Uploading QR code 2 (okaxis)...");

    const result2 = await cloudinary.uploader.upload(qr2Path, {
      folder: "zenith-26/img/payment",
      public_id: "payment-qr-atharva-okaxis",
      transformation: [
        {width: 500, height: 500, crop: "fill"},
        {quality: "auto:best"},
        {fetch_format: "auto"},
      ],
      overwrite: true,
    });

    console.log("✅ QR code 2 uploaded!");
    console.log("📸 URL:", result2.secure_url);
    console.log("🔗 UPI ID: atharvsjoshi2005@okaxis");

    console.log("\n✨ All backup QR codes uploaded successfully!");
    console.log("\n📋 Summary:");
    console.log("1. okicici:", result1.secure_url);
    console.log("2. okaxis:", result2.secure_url);

    return {result1, result2};
  } catch (error) {
    console.error("❌ Error uploading QR codes:", error.message);
    console.error("💡 Make sure the image files exist in Downloads folder");
    throw error;
  }
};

uploadBackupQRCodes()
  .then(() => {
    console.log("\n🎉 Upload complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Upload failed:", error);
    process.exit(1);
  });
