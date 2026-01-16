import cloudinary from '../config/cloudinary.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagePath = path.join(__dirname, '../../frontend/public/img/marathon.png');

async function uploadImage() {
  try {
    console.log('Uploading marathon image to Cloudinary...');
    console.log('Image path:', imagePath);
    
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'zenith-26/marathon',
      public_id: 'marathon-bg',
      overwrite: true,
      resource_type: 'image',
    });
    
    console.log('\n✅ Upload successful!');
    console.log('URL:', result.secure_url);
    console.log('\nUse this URL in your component:');
    console.log(`backgroundImage: "url('${result.secure_url}')"`);
    
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
  }
}

uploadImage();
