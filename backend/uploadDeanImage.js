import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadDeanImage() {
  try {
    // Upload the dean image (Prof. S.B. Dethe)
    const result = await cloudinary.uploader.upload(
      "../frontend/public/img/dean.png",
      {
        folder: "zenith-26/img/mentors",
        public_id: "dean-sb-dethe",
        transformation: [
          {width: 500, height: 500, crop: "fill", gravity: "face"},
          {quality: "auto:best"},
          {fetch_format: "auto"},
        ],
      }
    );

    console.log("✅ Dean image uploaded successfully!");
    console.log("Public ID:", result.public_id);
    console.log("Version:", result.version);
    console.log("Full URL:", result.secure_url);
    console.log("\n📋 Use this URL in your components:");
    console.log(result.secure_url);
  } catch (error) {
    console.error("❌ Upload failed:", error.message);
  }
}

uploadDeanImage();
