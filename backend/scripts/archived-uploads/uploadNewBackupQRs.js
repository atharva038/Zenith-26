import dotenv from "dotenv";
import cloudinary from "../config/cloudinary.js";
import path from "path";
import {fileURLToPath} from "url";
import {dirname} from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const uploadBalajiPhonePeQR = async () => {
  try {
    console.log("🚀 Starting Balaji PhonePe QR code upload...");
    console.log("⚠️  Please save the Balaji PhonePe QR code image to Downloads folder");
    console.log("📝 Expected file: PhonePe QR code for Balaji Anil Kalyankar");
    console.log("   UPI: balajianil.kalyankar@ybl (or check from image)");
    console.log("\n💡 Once saved, update the file path in this script and run again.");

    const downloadsPath = path.join(process.env.HOME, "Downloads");

    // Update this path with the actual filename after downloading
    const qrPath = path.join(downloadsPath, "balaji-phonepe-qr.jpg");

    console.log("\n📂 Looking for file:");
    console.log("   QR:", qrPath);

    // Upload Balaji PhonePe QR code
    console.log("\n📤 Uploading Balaji PhonePe QR code...");

    const result = await cloudinary.uploader.upload(qrPath, {
      folder: "zenith-26/img/payment",
      public_id: "backup-qr-balaji-phonepe",
      transformation: [
        {width: 800, height: 800, crop: "fill"},
        {quality: "auto:best"},
        {fetch_format: "auto"},
      ],
      overwrite: true,
    });

    console.log("✅ Balaji PhonePe QR code uploaded!");
    console.log("📸 URL:", result.secure_url);
    console.log("🔗 Name: Balaji Anil Kalyankar");
    console.log("📱 Payment App: PhonePe");

    console.log("\n🎉 Upload successful!");
    console.log("\n📋 Copy these details for your code:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`{
  name: "Balaji Anil Kalyankar (PhonePe)",
  upi: "balajianil.kalyankar@ybl",
  url: "${result.secure_url}",
}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  } catch (error) {
    console.error("❌ Upload failed:", error.message);
    if (error.code === "ENOENT") {
      console.log("\n⚠️  File not found!");
      console.log("📝 Please:");
      console.log("   1. Save the Balaji PhonePe QR code from the image");
      console.log("   2. Name it 'balaji-phonepe-qr.jpg' (or update script)");
      console.log("   3. Save to Downloads folder");
      console.log("   4. Run this script again");
    }
  } finally {
    process.exit();
  }
};

// Also upload Bank of Baroda QR if needed
const uploadBankOfBarodaQR = async () => {
  try {
    console.log("\n🚀 Starting Bank of Baroda QR code upload...");
    console.log("⚠️  Please save the Bank of Baroda QR code image to Downloads folder");

    const downloadsPath = path.join(process.env.HOME, "Downloads");
    const qrPath = path.join(downloadsPath, "bank-of-baroda-qr.jpg");

    console.log("\n📂 Looking for file:");
    console.log("   QR:", qrPath);

    console.log("\n📤 Uploading Bank of Baroda QR code...");

    const result = await cloudinary.uploader.upload(qrPath, {
      folder: "zenith-26/img/payment",
      public_id: "backup-qr-bank-of-baroda",
      transformation: [
        {width: 800, height: 800, crop: "fill"},
        {quality: "auto:best"},
        {fetch_format: "auto"},
      ],
      overwrite: true,
    });

    console.log("✅ Bank of Baroda QR code uploaded!");
    console.log("📸 URL:", result.secure_url);

    console.log("\n📋 Copy these details for your code:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`{
  name: "Bank of Baroda",
  upi: "your-upi@barodapay",
  url: "${result.secure_url}",
}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  } catch (error) {
    console.error("❌ Upload failed:", error.message);
  }
};

// Run upload
console.log("╔════════════════════════════════════════╗");
console.log("║  Backup QR Codes Upload Script        ║");
console.log("╚════════════════════════════════════════╝");

// Choose which to upload
const uploadType = process.argv[2] || "balaji";

if (uploadType === "balaji") {
  uploadBalajiPhonePeQR();
} else if (uploadType === "baroda") {
  uploadBankOfBarodaQR();
} else if (uploadType === "both") {
  (async () => {
    await uploadBalajiPhonePeQR();
    await uploadBankOfBarodaQR();
  })();
} else {
  console.log("Usage: node uploadNewBackupQRs.js [balaji|baroda|both]");
  process.exit(1);
}
