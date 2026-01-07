import cloudinary from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadTeamHeroImages() {
  try {
    console.log("\n🚀 Starting team hero images upload to Cloudinary...\n");

    const frontendPublicPath = path.join(__dirname, "../../frontend/public/img");

    // Upload desktop team image
    console.log("1️⃣ Uploading desktop team image (team-front-optimized.jpg)...");
    const desktopImagePath = path.join(frontendPublicPath, "team-front-optimized.jpg");
    
    const desktopResult = await cloudinary.v2.uploader.upload(desktopImagePath, {
      folder: "zenith-26/img/team",
      public_id: "team-hero-desktop",
      overwrite: true,
      resource_type: "image",
      quality: "auto:best",
      fetch_format: "auto",
    });
    
    console.log("✅ Desktop image uploaded successfully!");
    console.log(`   📎 URL: ${desktopResult.secure_url}`);
    console.log(`   🆔 Public ID: ${desktopResult.public_id}\n`);

    // Upload mobile team image
    console.log("2️⃣ Uploading mobile team image (mobile-team.png)...");
    const mobileImagePath = path.join(frontendPublicPath, "mobile-team.png");
    
    const mobileResult = await cloudinary.v2.uploader.upload(mobileImagePath, {
      folder: "zenith-26/img/team",
      public_id: "team-hero-mobile",
      overwrite: true,
      resource_type: "image",
      quality: "auto:best",
      fetch_format: "auto",
    });
    
    console.log("✅ Mobile image uploaded successfully!");
    console.log(`   📎 URL: ${mobileResult.secure_url}`);
    console.log(`   🆔 Public ID: ${mobileResult.public_id}\n`);

    console.log("=" .repeat(60));
    console.log("\n🎉 Both images uploaded successfully!\n");
    console.log("📋 CLOUDINARY URLs:\n");
    console.log(`   Desktop (PC): ${desktopResult.secure_url}`);
    console.log(`   Mobile:       ${mobileResult.secure_url}`);
    console.log("\n" + "=" .repeat(60));

    console.log("\n💡 Update TeamPage.jsx with these URLs:");
    console.log(`
// Desktop image (hidden md:block)
backgroundImage: 'url("${desktopResult.secure_url}")'

// Mobile image (md:hidden)
backgroundImage: 'url("${mobileResult.secure_url}")'
`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error uploading images:", error);
    process.exit(1);
  }
}

uploadTeamHeroImages();
