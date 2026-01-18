import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadAtharvaQR() {
  try {
    console.log("🚀 Starting Atharva QR code upload to Cloudinary...\n");

    const imagePath = path.join(
      __dirname,
      "../../frontend/public/img/atharvaQR.png"
    );

    console.log(`📁 Uploading from: ${imagePath}`);

    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "zenith-26/img/payment",
      public_id: "backup-qr-atharva-bob",
      overwrite: true,
      resource_type: "image",
      format: "png",
    });

    console.log("\n✅ Upload successful!");
    console.log("📋 Cloudinary URL:", result.secure_url);
    console.log("🆔 Public ID:", result.public_id);
    console.log("📏 Dimensions:", `${result.width}x${result.height}`);
    console.log("📦 Size:", `${(result.bytes / 1024).toFixed(2)} KB`);

    console.log("\n🔗 Use this URL in your code:");
    console.log(result.secure_url);

    return result.secure_url;
  } catch (error) {
    console.error("❌ Upload failed:", error.message);
    process.exit(1);
  }
}

uploadAtharvaQR()
  .then(() => {
    console.log("\n✨ Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
