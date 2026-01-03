# 📋 Gallery System - Quick Reference

## 🚀 Quick Access URLs

| Location             | URL                                 | Description            |
| -------------------- | ----------------------------------- | ---------------------- |
| **Admin Upload**     | http://localhost:5173/admin/gallery | Upload & manage media  |
| **Homepage Gallery** | http://localhost:5173/home#gallery  | View gallery section   |
| **Full Gallery**     | http://localhost:5173/gallery       | Dedicated gallery page |
| **Admin Login**      | http://localhost:5173/admin/login   | Login first            |

---

## ⚡ Quick Commands

```bash
# Start Backend
cd backend
npm run dev

# Start Frontend
cd frontend
npm run dev

# Both at once (Linux/Mac)
cd backend && npm run dev & cd ../frontend && npm run dev
```

---

## 🎯 Upload Steps

1. **Login** → http://localhost:5173/admin/login
2. **Navigate** → Click "Gallery" in sidebar
3. **Select Files** → Click button or drag & drop
4. **Fill Form:**
   - Title (required)
   - Description (optional)
   - Category (Event/Sports/Ceremony/Participants/Other)
   - Tags (comma-separated)
5. **Upload** → Click "Upload to Cloudinary"
6. **Wait** → Success notification
7. **Done** → Media appears in list

---

## 📝 File Requirements

| Type       | Formats                   | Max Size |
| ---------- | ------------------------- | -------- |
| **Images** | JPEG, JPG, PNG, GIF, WebP | 50MB     |
| **Videos** | MP4, WebM, QuickTime, AVI | 50MB     |

---

## 🔧 Environment Setup

Add to `backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Get credentials from: https://cloudinary.com/console

---

## 🎨 Theme Colors

| Element        | Color Code |
| -------------- | ---------- |
| Primary Orange | `#ffb36a`  |
| Dark Orange    | `#ff8b1f`  |
| Dark Brown BG  | `#2a1a11`  |
| Brown Border   | `#3a2416`  |
| Dark Text      | `#2c1506`  |

---

## 🐛 Common Issues

| Issue        | Solution                               |
| ------------ | -------------------------------------- |
| Upload fails | Check Cloudinary credentials in `.env` |
| Not visible  | Check "Active" status in admin         |
| Poor quality | Upload higher resolution files         |
| Auth error   | Re-login at `/admin/login`             |

---

## ✅ Quick Test

1. Upload an image in admin
2. View on http://localhost:5173/home#gallery
3. Click to open modal
4. Verify quality and full visibility
5. Delete from admin
6. Confirm removed from frontend

---

## 📊 Key Features

- ✅ Direct Cloudinary storage
- ✅ No quality loss
- ✅ No cropping
- ✅ Multi-file upload
- ✅ Live preview
- ✅ Filtering (type, category)
- ✅ Pagination
- ✅ Modal view
- ✅ Responsive design
- ✅ Theme matching

---

## 📁 Important Files

### Backend

- `config/cloudinary.js` - Cloudinary setup
- `services/media.service.js` - Upload logic
- `controllers/media.controller.js` - API handlers
- `routes/media.routes.js` - API routes

### Frontend

- `pages/AdminGallery.jsx` - Admin panel
- `pages/Homepage.jsx` - Gallery section
- `pages/Gallery.jsx` - Full gallery page
- `services/mediaService.js` - API calls

---

## 🔗 Documentation

- **Full Guide:** `GALLERY_MANAGEMENT_README.md`
- **Setup Guide:** `QUICK_START_GALLERY.md`
- **Summary:** `IMPLEMENTATION_SUMMARY.md`

---

**Need Help?** Check the full documentation files above!

**Built for Zenith 2026** 🏆
