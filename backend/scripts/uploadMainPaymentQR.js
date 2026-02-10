import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ES Module way to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadMainQR() {
  try {
    console.log('🚀 Starting mainQR.png upload to Cloudinary...\n');

    // Path to mainQR.png in frontend/public/img/
    const frontendPath = path.join(__dirname, '../../frontend/public/img/mainQR.png');
    
    // Check if file exists
    if (!fs.existsSync(frontendPath)) {
      throw new Error(`File not found at: ${frontendPath}`);
    }

    console.log('📁 File found:', frontendPath);
    console.log('📊 File size:', (fs.statSync(frontendPath).size / 1024).toFixed(2), 'KB\n');

    // Upload to Cloudinary
    console.log('⬆️  Uploading to Cloudinary...');
    const result = await cloudinary.uploader.upload(frontendPath, {
      folder: 'zenith-2026/payment-qr',
      public_id: 'main-payment-qr',
      resource_type: 'image',
      overwrite: true,
      format: 'png',
      quality: 'auto:best',
    });

    console.log('\n✅ Upload successful!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📸 Public ID:', result.public_id);
    console.log('🔗 Secure URL:', result.secure_url);
    console.log('📐 Dimensions:', `${result.width}x${result.height}px`);
    console.log('📦 Format:', result.format);
    console.log('💾 Size:', (result.bytes / 1024).toFixed(2), 'KB');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('🎯 Next Steps:');
    console.log('1. Copy the Secure URL above');
    console.log('2. Update PAYMENT_QR_URL in frontend/src/pages/UniversalRegistration.jsx');
    console.log('3. Replace the old URL with:', result.secure_url);

    return result;
  } catch (error) {
    console.error('\n❌ Upload failed:', error.message);
    if (error.http_code) {
      console.error('HTTP Code:', error.http_code);
    }
    process.exit(1);
  }
}

// Run the upload
uploadMainQR();
