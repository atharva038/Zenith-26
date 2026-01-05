import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadLogo() {
  try {
    // Upload the Zenith 2026 logo for navbar
    const logoResult = await cloudinary.uploader.upload(
      "../frontend/public/logo.png",
      {
        folder: "zenith-26/img",
        public_id: "zenith-logo",
        transformation: [{quality: "auto:best"}, {fetch_format: "auto"}],
      }
    );

    console.log("✅ Logo uploaded successfully!");
    console.log("Logo URL:", logoResult.secure_url);

    // Upload as OG image with proper dimensions (1200x630 for WhatsApp/social)
    const ogResult = await cloudinary.uploader.upload(
      "../frontend/public/logo.png",
      {
        folder: "zenith-26/img",
        public_id: "zenith-og-image-large",
        transformation: [
          {width: 1200, height: 630, crop: "pad", background: "white"},
          {quality: "auto:best"},
          {fetch_format: "png"},
        ],
      }
    );

    console.log("\n✅ OG Image uploaded successfully!");
    console.log("OG Image URL:", ogResult.secure_url);
    console.log("\n📋 Use these URLs:");
    console.log("Navbar Logo:", logoResult.secure_url);
    console.log("OG Image (WhatsApp):", ogResult.secure_url);
  } catch (error) {
    console.error("❌ Upload failed:", error.message);
  }
}

uploadLogo();
