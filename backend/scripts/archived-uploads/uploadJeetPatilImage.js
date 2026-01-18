import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadJeetPatilImage() {
  try {
    // Upload Dr. Jeet Patil image (Faculty Coordinator)
    const result = await cloudinary.uploader.upload(
      "../frontend/public/img/JEET-FacutlyCoordinator.png",
      {
        folder: "zenith-26/img/mentors",
        public_id: "faculty-coordinator-jeet-patil",
        transformation: [
          {width: 500, height: 500, crop: "fill", gravity: "face"},
          {quality: "auto:best"},
          {fetch_format: "auto"},
        ],
      }
    );

    console.log("✅ Dr. Jeet Patil image uploaded successfully!");
    console.log("Public ID:", result.public_id);
    console.log("Version:", result.version);
    console.log("Full URL:", result.secure_url);
  } catch (error) {
    console.error("❌ Upload failed:", error.message);
  }
}

uploadJeetPatilImage();
