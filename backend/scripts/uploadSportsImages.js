import cloudinary from '../config/cloudinary.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sports images to upload
const sportsImages = [
  'athletics.jpeg',
  'background.png',
  'badminton.jpeg',
  'basketball.png',
  'basketball3cross3.png',
  'chess.jpeg',
  'cricket.png',
  'football.png',
  'handball.jpeg',
  'kabaddi.jpeg',
  'khokho.jpeg',
  'powerlifting.jpeg',
  'rinkFootball.jpeg',
  'tugofwar.png',
  'volleyball.png'
];

const uploadSportsImages = async () => {
  const imagesDir = path.join(__dirname, '../../frontend/public/img/sports');
  const results = {};

  console.log('🚀 Starting sports images upload to Cloudinary...\n');

  for (const imageName of sportsImages) {
    const imagePath = path.join(imagesDir, imageName);
    
    if (!fs.existsSync(imagePath)) {
      console.log(`❌ File not found: ${imageName}`);
      continue;
    }

    try {
      // Extract name without extension for public_id
      const publicId = `zenith-26/sports/${path.parse(imageName).name}`;
      
      console.log(`📤 Uploading: ${imageName}...`);
      
      const result = await cloudinary.uploader.upload(imagePath, {
        public_id: publicId,
        folder: 'zenith-26/sports',
        overwrite: true,
        resource_type: 'image',
        transformation: [
          { quality: 'auto:best' },
          { fetch_format: 'auto' }
        ]
      });

      results[imageName] = result.secure_url;
      console.log(`✅ Uploaded: ${imageName}`);
      console.log(`   URL: ${result.secure_url}\n`);
    } catch (error) {
      console.error(`❌ Error uploading ${imageName}:`, error.message);
    }
  }

  console.log('\n📋 Upload Summary:');
  console.log('==================\n');
  
  // Print as JavaScript object for easy copy-paste
  console.log('const CLOUDINARY_SPORTS_IMAGES = {');
  for (const [name, url] of Object.entries(results)) {
    const key = path.parse(name).name;
    console.log(`  ${key}: "${url}",`);
  }
  console.log('};');

  return results;
};

uploadSportsImages()
  .then(() => {
    console.log('\n✨ All uploads completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Upload failed:', error);
    process.exit(1);
  });
