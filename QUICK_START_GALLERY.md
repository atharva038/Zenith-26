# 🚀 Quick Start - Gallery Management System

## Setup Instructions

### 1. Backend Setup

#### Install Dependencies (if not already installed)

```bash
cd backend
npm install
```

Required packages should already be installed:

- `cloudinary` - For media storage
- `multer` - For file uploads
- `mongoose` - For MongoDB
- `express-validator` - For validation

#### Configure Environment Variables

Edit `backend/.env` and add your Cloudinary credentials:

```env
# Cloudinary Configuration (REQUIRED)
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Optional
MAX_FILE_SIZE=52428800  # 50MB
```

**Get Cloudinary Credentials:**

1. Go to https://cloudinary.com
2. Sign up or log in
3. Go to Dashboard
4. Copy: Cloud Name, API Key, API Secret

#### Start Backend Server

```bash
cd backend
npm run dev
# OR
node server.js
```

Backend should be running on: **http://localhost:5000**

---

### 2. Frontend Setup

#### Install Dependencies (if not already installed)

```bash
cd frontend
npm install
```

#### Start Frontend Dev Server

```bash
cd frontend
npm run dev
```

Frontend should be running on: **http://localhost:5173**

---

## 🎯 Access Points

### Admin Panel (Upload Media)

**URL:** http://localhost:5173/admin/gallery

**Steps:**

1. Login as admin first: http://localhost:5173/admin/login
2. Navigate to Gallery from admin sidebar
3. Upload images/videos
4. Manage existing media

### Frontend Gallery (View Media)

**Homepage Section:** http://localhost:5173/home#gallery  
**Full Gallery Page:** http://localhost:5173/gallery

---

## ✅ Testing the System

### Test 1: Upload an Image

1. Go to http://localhost:5173/admin/gallery
2. Click "Select Images/Videos" button
3. Choose an image file (JPEG, PNG, WebP)
4. Fill in:
   - Title: "Test Image"
   - Category: "Event"
   - Tags: "test, zenith2026"
5. Click "Upload to Cloudinary"
6. Wait for success message
7. Image should appear in the list below

### Test 2: View on Frontend

1. Go to http://localhost:5173/home
2. Scroll to Gallery section (or click Gallery in nav)
3. Your uploaded image should appear
4. Click the image for full-screen view
5. Verify quality and full visibility (no cropping)

### Test 3: Upload a Video

1. Same as Test 1, but with MP4/WebM video
2. Video should show with play button overlay
3. Click to view in modal with controls

### Test 4: Filter Media

1. In admin panel: Click "Images" or "Videos" to filter
2. On frontend: Use filter buttons (All/Images/Videos)

### Test 5: Delete Media

1. In admin panel, click "Delete" on any media
2. Confirm deletion
3. Media should disappear from both admin and frontend
4. Verify it's also deleted from Cloudinary dashboard

---

## 🔧 Common Issues & Solutions

### Issue: Upload fails with "Upload failed" error

**Solution:**

- Check Cloudinary credentials in `.env`
- Verify file size < 50MB
- Check internet connection
- View browser console for detailed error

### Issue: Media not showing on frontend

**Solution:**

- Check if media is marked as "Active" in admin panel
- Clear browser cache
- Check Network tab in DevTools for API errors
- Verify MongoDB connection

### Issue: "Authentication required" error

**Solution:**

- Make sure you're logged in as admin
- Check if JWT token is valid
- Re-login if session expired

### Issue: Poor image quality

**Solution:**

- Upload higher resolution images
- Check Cloudinary plan limits (free tier has restrictions)
- Verify transformations in `backend/services/media.service.js`

### Issue: Video won't play

**Solution:**

- Use supported formats: MP4, WebM
- Check video codec compatibility
- Try different browser
- Verify video isn't corrupted

---

## 📊 Feature Checklist

After setup, verify these features work:

- [ ] Admin login works
- [ ] Can select multiple files
- [ ] Preview shows before upload
- [ ] Upload to Cloudinary succeeds
- [ ] Media appears in admin list
- [ ] Can activate/deactivate media
- [ ] Can delete media
- [ ] Filter by type works (admin)
- [ ] Media shows on homepage gallery
- [ ] Filter works on frontend
- [ ] Click media opens modal
- [ ] Full quality visible (no cropping)
- [ ] Tags and categories display
- [ ] Pagination works (if >12 items)
- [ ] Responsive on mobile

---

## 🎨 Customization Guide

### Change Upload Limit

Edit `backend/config/media.js`:

```javascript
export const maxFileSize = 52428800; // 50MB
// Change to 104857600 for 100MB
```

### Add New Category

Edit `backend/models/media.js`:

```javascript
category: {
  type: String,
  enum: ["event", "sports", "ceremony", "participants", "other", "your_new_category"],
  default: "other",
}
```

Also update validation in `backend/routes/media.routes.js`

### Change Grid Layout

Edit `frontend/src/pages/Homepage.jsx` (GallerySection):

```javascript
// Current: 4 columns on XL
className =
  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

// Change to 3 columns:
className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";
```

---

## 📝 Quick Commands

```bash
# Start both servers
cd backend && npm run dev &
cd frontend && npm run dev

# View backend logs
cd backend && npm run dev

# View MongoDB data (if using MongoDB Compass)
mongodb://localhost:27017/zenith26

# Check Cloudinary uploads
# Visit: https://cloudinary.com/console/media_library
```

---

## 🆘 Getting Help

1. **Read Full Documentation:** `GALLERY_MANAGEMENT_README.md`
2. **Check Console Errors:** Browser DevTools → Console
3. **Check Network Requests:** Browser DevTools → Network
4. **View Backend Logs:** Terminal running backend server
5. **Cloudinary Dashboard:** Check uploads at cloudinary.com/console

---

## ✨ Next Steps

After successful setup:

1. Upload some test media
2. Customize theme colors if needed
3. Add more categories/tags
4. Test on mobile devices
5. Deploy to production when ready

---

**Built for Zenith 2026** 🏆
