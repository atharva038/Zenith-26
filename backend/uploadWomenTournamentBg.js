import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadBackgroundImage() {
  try {
    // Upload the women's tournament background image
    const result = await cloudinary.uploader.upload(
      "../frontend/public/img/women-tournament-bg.jpg",
      {
        folder: "zenith-26/img/backgrounds",
        public_id: "women-tournament-bg",
        transformation: [
          {width: 1920, crop: "limit"},
          {quality: "auto:good"},
          {fetch_format: "auto"},
        ],
      }
    );

    console.log("✅ Background image uploaded successfully!");
    console.log("Public ID:", result.public_id);
    console.log("Version:", result.version);
    console.log("Full URL:", result.secure_url);
    console.log("\n📋 Use this URL in your component:");
    console.log(
      `https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto:good/v${result.version}/zenith-26/img/backgrounds/women-tournament-bg`
    );
  } catch (error) {
    console.error("❌ Upload failed:", error.message);
  }
}

uploadBackgroundImage();
