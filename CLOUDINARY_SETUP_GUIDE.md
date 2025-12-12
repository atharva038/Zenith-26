# Cloudinary Integration Setup Guide

## ✅ What's Been Completed

### Backend Implementation
1. **Cloudinary Configuration** (`backend/config/cloudinary.js`)
   - Configured using environment variables
   - Ready to use with Cloudinary v2 API

2. **Upload Middleware** (`backend/middleware/cloudinaryUpload.middleware.js`)
   - Image uploads → `zenith26/images` folder
   - Video uploads → `zenith26/videos` folder
   - Auto-resizing images to max 1500px width
   - File type validation

3. **Upload Routes** (`backend/routes/upload.routes.js`)
   - `POST /api/upload/payment-screenshot` - Public endpoint for payment screenshots
   - `POST /api/upload/asset/image` - Admin-protected for images
   - `POST /api/upload/asset/video` - Admin-protected for videos

4. **Database Schema** (`backend/models/Marathon.js`)
   - Added `screenshotUrl` field to store Cloudinary URLs

### Frontend Implementation
1. **Marathon Registration Page** (`frontend/src/pages/MarathonRegistration.jsx`)
   - File input for payment screenshot upload
   - Auto-upload to Cloudinary on file selection
   - Preview uploaded screenshot
   - Screenshot URL saved with registration

2. **Admin Marathon Page** (`frontend/src/pages/AdminMarathon.jsx`)
   - View payment screenshot in details modal
   - Click to view full-size image in new tab

## 🔧 Setup Instructions

### Step 1: Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Get your credentials from the Dashboard:
   - Cloud Name
   - API Key
   - API Secret

### Step 2: Create Backend Environment File
1. In the `backend` folder, create a `.env` file (copy from `.env.example`)
2. Add your Cloudinary credentials:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/zenith26

# JWT
JWT_SECRET=your-secret-key-here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Server
PORT=5000
NODE_ENV=development
```

### Step 3: Install Dependencies (Already Done)
```bash
cd backend
npm install cloudinary multer multer-storage-cloudinary
```

### Step 4: Start Backend Server
```bash
cd backend
npm run dev
```

The server should start on port 5000.

## 📂 How It Works

### User Flow - Payment Screenshot
1. User fills Marathon registration form
2. User selects payment screenshot file
3. Frontend automatically uploads to Cloudinary via `/api/upload/payment-screenshot`
4. Cloudinary returns secure URL
5. URL is saved in `screenshotUrl` field
6. Admin can view screenshot when reviewing registration

### Admin Flow - Asset Upload
1. Admin logs in
2. Admin can upload images/videos via protected endpoints:
   - `/api/upload/asset/image` for images
   - `/api/upload/asset/video` for videos
3. Files stored in Cloudinary with proper folder structure

## 🗂️ Cloudinary Folder Structure
```
zenith26/
├── images/          # All images (payment screenshots, backgrounds, etc.)
└── videos/          # All videos (intro video, etc.)
```

## 🎯 Next Steps for Other Assets

### Upload Intro Video to Cloudinary
1. Use the admin upload endpoint or Cloudinary dashboard
2. Upload your intro video
3. Get the Cloudinary URL
4. Update the video source in your components to use the Cloudinary URL

### Upload Background Images
1. Upload cyclone background and other images to Cloudinary
2. Get the URLs
3. Replace local image paths with Cloudinary URLs in your components

### Example: Uploading Intro Video via API
```javascript
const formData = new FormData();
formData.append('file', videoFile);

const response = await api.post('/upload/asset/video', formData, {
  headers: { 
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${adminToken}`
  }
});

console.log('Video URL:', response.data.url);
```

## 🔒 Security Features
- Public endpoint for payment screenshots (no auth required)
- Protected endpoints for admin assets (JWT auth required)
- File type validation (only images and videos)
- Automatic image optimization
- Secure URLs from Cloudinary

## 📝 Testing
1. Fill Marathon registration form
2. Upload a payment screenshot
3. Check that it uploads successfully
4. Submit the form
5. Login as admin
6. View the registration details
7. Verify screenshot is visible and clickable

## 🐛 Troubleshooting

### Issue: Upload fails with 401
**Solution:** Make sure your Cloudinary credentials are correct in `.env`

### Issue: Upload fails with "Invalid file type"
**Solution:** Only images (jpg, png, webp) and videos (mp4, mov, webm) are allowed

### Issue: Screenshot not showing in admin
**Solution:** Make sure the registration was created AFTER adding the screenshot upload feature

### Issue: Backend server won't start
**Solution:** Check if port 5000 is already in use. Kill the process or change the port in `.env`

## 📚 Resources
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Multer Storage Cloudinary](https://www.npmjs.com/package/multer-storage-cloudinary)
- [Express Multer](https://www.npmjs.com/package/multer)

---

**Created:** December 9, 2025
**Last Updated:** December 9, 2025
