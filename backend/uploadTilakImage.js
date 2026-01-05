import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadTilakImage() {
  try {
    // Upload Mr. Tilak Jadhao image (Faculty Coordinator) with background removal
    const result = await cloudinary.uploader.upload(
      "../frontend/public/img/tilak-sir .png",
      {
        folder: "zenith-26/img/mentors",
        public_id: "faculty-coordinator-tilak-jadhao",
        background_removal: "cloudinary_ai",
        transformation: [
          {width: 500, height: 500, crop: "fill", gravity: "face"},
          {quality: "auto:best"},
          {fetch_format: "auto"},
        ],
      }
    );

    console.log("✅ Mr. Tilak Jadhao image uploaded successfully!");
    console.log("Public ID:", result.public_id);
    console.log("Version:", result.version);
    console.log("Full URL:", result.secure_url);
    console.log("\n📋 URL with background removal effect:");
    console.log(
      `https://res.cloudinary.com/dvmsho3pj/image/upload/e_background_removal/v${result.version}/zenith-26/img/mentors/faculty-coordinator-tilak-jadhao`
    );
  } catch (error) {
    console.error("❌ Upload failed:", error.message);
  }
}

uploadTilakImage();
