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

async function uploadAthleticsImages() {
  try {
    console.log("\n🚀 Uploading athletics images to Cloudinary...\n");

    const downloadsPath = path.join(process.env.HOME, "Downloads");
    const files = fs.readdirSync(downloadsPath);
    
    // Find the most recent 4 image files (these should be the athletics images you just shared)
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|heic)$/i.test(f));
    
    const sortedImages = imageFiles
      .map(f => ({
        name: f,
        path: path.join(downloadsPath, f),
        mtime: fs.statSync(path.join(downloadsPath, f)).mtime
      }))
      .sort((a, b) => b.mtime - a.mtime)
      .slice(0, 4); // Get the 4 most recent images

    if (sortedImages.length < 4) {
      console.log("❌ Need 4 images for javelin, hammer, shotput, and discus");
      console.log("Please save all 4 images to Downloads folder and run again.");
      process.exit(1);
    }

    const sportNames = ["javelin", "hammer-throw", "shotput", "discus"];
    const results = [];

    for (let i = 0; i < 4; i++) {
      const imagePath = sortedImages[i].path;
      const sportName = sportNames[i];
      
      console.log(`${i + 1}. Uploading ${sportName}...`);
      console.log(`   File: ${sortedImages[i].name}`);

      const result = await cloudinary.v2.uploader.upload(imagePath, {
        folder: "zenith-26/img/women-athletics",
        public_id: sportName,
        overwrite: true,
        resource_type: "image",
        quality: "auto:best",
        fetch_format: "auto",
      });

      console.log(`   ✅ Uploaded: ${result.secure_url}\n`);
      results.push({ sport: sportName, url: result.secure_url });
    }

    console.log("=" .repeat(70));
    console.log("\n🎉 All athletics images uploaded successfully!\n");
    console.log("📋 URLs for Women's Tournament Page:\n");
    
    results.forEach(r => {
      console.log(`${r.sport.toUpperCase().padEnd(15)}: ${r.url}`);
    });

    console.log("\n" + "=" .repeat(70));

    process.exit(0);
  } catch (error) {
    console.error("❌ Error uploading images:", error);
    process.exit(1);
  }
}

uploadAthleticsImages();
