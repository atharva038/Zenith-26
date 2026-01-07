import cloudinary from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadSportsSecretary() {
  try {
    console.log("\n🚀 Uploading Sports Secretary photo to Cloudinary...\n");

    // The image should be in Downloads folder or we can specify a path
    const possiblePaths = [
      path.join(process.env.HOME, "Downloads", "sports-secretary.jpg"),
      path.join(process.env.HOME, "Downloads", "sports-secretary.png"),
      path.join(process.env.HOME, "Downloads", "IMG_*.jpg"),
      path.join(__dirname, "../../frontend/public/img/sports-secretary.jpg"),
      path.join(__dirname, "../../frontend/public/img/sports-secretary.png"),
    ];

    // Check Downloads folder for any recent image
    const downloadsPath = path.join(process.env.HOME, "Downloads");
    const files = fs.readdirSync(downloadsPath);
    
    // Find the most recent image file (jpg, png, jpeg)
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|heic)$/i.test(f));
    
    // Sort by modification time (most recent first)
    const sortedImages = imageFiles
      .map(f => ({
        name: f,
        path: path.join(downloadsPath, f),
        mtime: fs.statSync(path.join(downloadsPath, f)).mtime
      }))
      .sort((a, b) => b.mtime - a.mtime);

    if (sortedImages.length === 0) {
      console.log("❌ No image files found in Downloads folder");
      console.log("Please save the Sports Secretary image to your Downloads folder and run again.");
      process.exit(1);
    }

    // Use the most recent image
    const imagePath = sortedImages[0].path;
    console.log(`📷 Found image: ${sortedImages[0].name}`);
    console.log(`   Modified: ${sortedImages[0].mtime.toLocaleString()}\n`);

    const result = await cloudinary.v2.uploader.upload(imagePath, {
      folder: "zenith-26/img/team",
      public_id: "sports-secretary",
      overwrite: true,
      resource_type: "image",
      quality: "auto:best",
      fetch_format: "auto",
    });

    console.log("✅ Sports Secretary photo uploaded successfully!");
    console.log(`   📎 URL: ${result.secure_url}`);
    console.log(`   🆔 Public ID: ${result.public_id}\n`);

    console.log("=" .repeat(60));
    console.log("\n🎉 Upload complete!\n");
    console.log(`URL: ${result.secure_url}`);
    console.log("\n" + "=" .repeat(60));

    process.exit(0);
  } catch (error) {
    console.error("❌ Error uploading image:", error);
    process.exit(1);
  }
}

uploadSportsSecretary();
