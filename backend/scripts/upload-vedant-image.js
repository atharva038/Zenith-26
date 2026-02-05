import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage() {
  try {
    console.log('Uploading image to Cloudinary...');
    
    // Upload the image from frontend/public/img
    const result = await cloudinary.v2.uploader.upload(
      path.join(__dirname, '../../frontend/public/img/sport-club-president.jpeg'),
      {
        folder: 'zenith-2026/team',
        public_id: 'sports-club-president-vedant-dahat',
        transformation: [
          { width: 800, height: 1000, crop: 'fill', gravity: 'face' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      }
    );

    console.log('✅ Upload successful!');
    console.log('Image URL:', result.secure_url);
    console.log('Public ID:', result.public_id);
    
    return result.secure_url;
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
}

uploadImage();
