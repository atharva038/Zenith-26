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

async function uploadMarathonRuleBook() {
  try {
    console.log("🚀 Starting Marathon Rule Book PDF upload to Cloudinary...\n");

    const pdfPath = path.join(
      __dirname,
      "../../frontend/public/Rule Book & Participant Guidelines (1).pdf"
    );

    console.log(`📁 Uploading from: ${pdfPath}`);

    const result = await cloudinary.uploader.upload(pdfPath, {
      folder: "zenith-26/documents",
      public_id: "marathon-rule-book-2026",
      resource_type: "raw", // Important: 'raw' for PDF files
      overwrite: true,
    });

    console.log("\n✅ Upload successful!");
    console.log("📋 Cloudinary URL:", result.secure_url);
    console.log("🆔 Public ID:", result.public_id);
    console.log("📦 Size:", `${(result.bytes / 1024).toFixed(2)} KB`);
    console.log("📄 Format:", result.format);

    console.log("\n🔗 Use this URL in your code:");
    console.log(result.secure_url);

    return result.secure_url;
  } catch (error) {
    console.error("❌ Upload failed:", error.message);
    process.exit(1);
  }
}

uploadMarathonRuleBook()
  .then(() => {
    console.log("\n✨ Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
