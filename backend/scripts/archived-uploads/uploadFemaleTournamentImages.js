import cloudinary from "./config/cloudinary.js";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesToUpload = [
  {
    name: "BasketBall",
    file: "../frontend/public/img/Female-Tournament/BasketBall.png",
    sport: "Basketball 3x3",
  },
  {
    name: "Cricket",
    file: "../frontend/public/img/Female-Tournament/Cricket.png",
    sport: "Cricket",
  },
  {
    name: "Football",
    file: "../frontend/public/img/Female-Tournament/Football.png",
    sport: "Football",
  },
  {
    name: "Ring-Football",
    file: "../frontend/public/img/Female-Tournament/Ring-Football.png",
    sport: "Rink Football",
  },
  {
    name: "TurfCricket",
    file: "../frontend/public/img/Female-Tournament/TurfCricket.png",
    sport: "Box Cricket",
  },
  {
    name: "Vollyball",
    file: "../frontend/public/img/Female-Tournament/Vollyball.png",
    sport: "Volleyball",
  },
  {
    name: "tug-of-war",
    file: "../frontend/public/img/Female-Tournament/tug-of-war.png",
    sport: "Tug of War",
  },
];

async function uploadImages() {
  console.log(
    "🚀 Starting Cloudinary upload for Female Tournament images...\n"
  );

  const uploadResults = [];

  for (const image of imagesToUpload) {
    try {
      const imagePath = path.join(__dirname, image.file);
      console.log(`📤 Uploading ${image.name} for ${image.sport}...`);

      const result = await cloudinary.uploader.upload(imagePath, {
        folder: "zenith-26/img/Female-Tournament",
        public_id: image.name,
        overwrite: true,
        resource_type: "image",
        transformation: [{quality: "auto", fetch_format: "auto"}],
      });

      uploadResults.push({
        sport: image.sport,
        name: image.name,
        url: result.secure_url,
        optimizedUrl: `https://res.cloudinary.com/${result.cloud_name}/image/upload/f_auto,q_auto/v${result.version}/${result.public_id}`,
      });

      console.log(`✅ Success: ${image.name}`);
      console.log(`   URL: ${result.secure_url}\n`);
    } catch (error) {
      console.error(`❌ Failed to upload ${image.name}:`, error.message);
    }
  }

  console.log("\n📊 Upload Summary:");
  console.log("=".repeat(80));
  uploadResults.forEach((result) => {
    console.log(`\n${result.sport}:`);
    console.log(`  Name: ${result.name}`);
    console.log(`  URL: ${result.optimizedUrl}`);
  });
  console.log("\n" + "=".repeat(80));

  // Generate code snippet for WomenTournamentPage.jsx
  console.log("\n📝 Copy these URLs to your sports array:\n");
  uploadResults.forEach((result) => {
    console.log(`// ${result.sport}`);
    console.log(`image: "${result.optimizedUrl}",\n`);
  });

  return uploadResults;
}

uploadImages()
  .then((results) => {
    console.log(`\n✨ Successfully uploaded ${results.length} images!`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Upload failed:", error);
    process.exit(1);
  });
