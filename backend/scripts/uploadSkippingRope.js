import cloudinary from "./config/cloudinary.js";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload Skipping Rope image to Cloudinary
async function uploadSkippingRope() {
  try {
    const imagePath = path.join(
      __dirname,
      "../frontend/public/img/catgegory1/skipping.png"
    );

    console.log("Uploading Skipping Rope image...");
    console.log("Path:", imagePath);

    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "zenith-26/img/Female-Tournament/1st-Category",
      public_id: "SkippingRope",
      overwrite: true,
      resource_type: "image",
    });

    console.log("\n✅ Upload successful!");
    console.log("Secure URL:", result.secure_url);
    console.log("\nUse this URL in WomenTournamentPage.jsx:");
    console.log(
      `https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto/${result.public_id}`
    );
  } catch (error) {
    console.error("❌ Upload failed:", error.message);
  }
}

uploadSkippingRope();
