import dotenv from "dotenv";
import cloudinary from "./config/cloudinary.js";
import path from "path";
import {fileURLToPath} from "url";
import {dirname} from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const uploadKadamImage = async () => {
  try {
    console.log("🚀 Starting Kadam sir image upload...");

    // Path to the image in Downloads folder
    const imagePath = path.join(
      process.env.HOME,
      "Downloads",
      "kadam sir.jpeg"
    );

    console.log("📁 Image path:", imagePath);
    console.log("☁️ Uploading to Cloudinary...");

    // Upload to Cloudinary with transformations
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "zenith-26/mentors",
      public_id: "kadam-sir",
      transformation: [
        {width: 400, height: 400, crop: "fill", gravity: "face"},
        {quality: "auto:best"},
        {fetch_format: "auto"},
      ],
      overwrite: true,
    });

    console.log("✅ Upload successful!");
    console.log("📸 Image URL:", result.secure_url);
    console.log("\n🔗 Use this URL in your code:");
    console.log(`"${result.secure_url}"`);

    return result;
  } catch (error) {
    console.error("❌ Error uploading image:", error.message);
    throw error;
  }
};

uploadKadamImage()
  .then(() => {
    console.log("\n✨ Upload complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Upload failed:", error);
    process.exit(1);
  });
