# 📸 Gallery Management System - Zenith 2026

## Overview

Complete media management system with **Cloudinary integration** for high-quality image and video uploads, directly visible on the frontend gallery.

---

## 🌟 Features

### Admin Panel (`/admin/gallery`)

- ✅ **Direct Cloudinary Upload** - Media stored on Cloudinary, URLs saved in MongoDB
- ✅ **Multi-file Upload** - Upload multiple images/videos at once
- ✅ **Live Preview** - Preview media before uploading
- ✅ **Quality Preservation** - No cropping, no quality loss (auto:best quality)
- ✅ **Media Management** - Activate/Deactivate, Delete media
- ✅ **Categorization** - Event, Sports, Ceremony, Participants, Other
- ✅ **Tagging System** - Add tags for better organization
- ✅ **Filtering** - Filter by media type (all, images, videos)
- ✅ **Pagination** - Efficient loading with pagination

### Frontend Gallery (`/home#gallery`)

- ✅ **Responsive Grid** - Beautiful masonry-style layout
- ✅ **Full Quality Display** - No compression, `object-contain` for full visibility
- ✅ **Type Filtering** - Filter by all media, images, or videos
- ✅ **Modal View** - Full-screen modal for detailed view
- ✅ **Theme Matching** - Consistent with Zenith 2026 orange/gold theme
- ✅ **Optimized Loading** - Lazy loading, Cloudinary auto-optimization
- ✅ **Video Support** - Play icon overlay, controls in modal

---

## 🎨 Design Features

### Color Scheme (Matching Zenith Theme)

- **Primary**: Orange gradient (`#ffb36a` to `#ff8b1f`)
- **Background**: Black to dark brown gradient (`#000` to `#0a0604`)
- **Accents**: Gold highlights, subtle sparkles
- **Cards**: Dark gradient with orange borders on hover

### Media Display

- **No Cropping**: Uses `object-contain` to show full media
- **Quality**: `auto:best` for images, `auto:best` for videos
- **Aspect Ratio**: 16:9 container, content scales proportionally
- **Transparency**: Preserved for PNG images
- **Loading**: Lazy loading with skeleton placeholders

---

## 🚀 How It Works

### Upload Flow

1. **Admin selects files** → Preview shown immediately
2. **Admin fills metadata** → Title (required), description, category, tags
3. **Click "Upload to Cloudinary"** → Files uploaded via multer (memory storage)
4. **Backend processes** → Streams to Cloudinary with optimizations
5. **Cloudinary returns URLs** → Stored in MongoDB with metadata
6. **Frontend fetches** → Direct Cloudinary URLs used (no backend relay)

### Display Flow

1. **Frontend calls API** → `/api/media?type=image&isActive=true`
2. **Backend returns data** → MongoDB documents with Cloudinary URLs
3. **Frontend renders** → Direct image/video tags using `secureUrl`
4. **Cloudinary optimizes** → Auto format conversion, quality adjustment
5. **User views** → Fast loading, high quality, no cropping

---

## 📁 File Structure

### Backend

```
backend/
├── config/
│   ├── cloudinary.js          # Cloudinary configuration
│   └── media.js                # Media settings (file types, size limits)
├── controllers/
│   └── media.controller.js     # Media CRUD operations
├── middleware/
│   └── media.middleware.js     # Multer setup for file uploads
├── models/
│   └── media.js                # MongoDB schema for media
├── routes/
│   └── media.routes.js         # API routes for media
└── services/
    └── media.service.js        # Cloudinary upload logic
```

### Frontend

```
frontend/src/
├── pages/
│   ├── AdminGallery.jsx        # Admin upload & management page
│   ├── Gallery.jsx             # Public gallery page (full view)
│   └── Homepage.jsx            # Gallery section component
└── services/
    └── mediaService.js         # API calls for media
```

---

## 🔧 Configuration

### Environment Variables (Backend `.env`)

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional
MAX_FILE_SIZE=52428800  # 50MB (default)
```

### Media Settings

**File Size Limit**: 50MB (configurable)  
**Allowed Image Types**: JPEG, JPG, PNG, GIF, WebP  
**Allowed Video Types**: MP4, MPEG, QuickTime, AVI, WebM  
**Cloudinary Folders**:

- Images: `zenith2026/glimpses/images`
- Videos: `zenith2026/glimpses/videos`

---

## 📊 API Endpoints

### Public Endpoints

```
GET  /api/media                 # Get all active media (with filters)
GET  /api/media/:id              # Get single media by ID
```

### Admin Endpoints (Requires Authentication)

```
POST   /api/media/upload         # Upload new media
PUT    /api/media/:id            # Update media metadata
DELETE /api/media/:id            # Delete media (from DB & Cloudinary)
PUT    /api/media/reorder        # Reorder media (drag & drop)
GET    /api/media/admin/stats    # Get media statistics
```

### Query Parameters

```
?type=image|video               # Filter by type
?category=event|sports|ceremony # Filter by category
?page=1                         # Pagination page number
?limit=12                       # Items per page
?sortBy=createdAt              # Sort field
?sortOrder=desc                # Sort direction
```

---

## 🎯 Usage Guide

### For Admins

#### Upload Media

1. Navigate to **http://localhost:5173/admin/gallery**
2. Click "Select Images/Videos" or drag & drop
3. Fill in:
   - **Title** (required): e.g., "Cricket Final Match"
   - **Description** (optional): Brief description
   - **Category**: Event, Sports, Ceremony, Participants, Other
   - **Tags** (optional): Comma-separated, e.g., "cricket, finals, 2026"
4. Click **"Upload to Cloudinary"**
5. Wait for success notification
6. Media appears in the list below

#### Manage Media

- **Activate/Deactivate**: Toggle visibility on frontend
- **Delete**: Removes from both Cloudinary and MongoDB
- **Filter**: View only images or only videos

### For Users

#### View Gallery

1. Navigate to **http://localhost:5173/home**
2. Scroll to **#gallery** section (or click "Gallery" in nav)
3. **Filter** by All Media, Images, or Videos
4. **Click any media** for full-screen modal view
5. View **tags, description, and category**
6. **Click "View Full Gallery"** for dedicated page

---

## 🛡️ Security Features

- ✅ **Authentication Required** for uploads/management
- ✅ **File Type Validation** (MIME type checking)
- ✅ **File Size Limits** (50MB max)
- ✅ **Secure URLs** (HTTPS via Cloudinary)
- ✅ **Error Handling** (Multer, Cloudinary, MongoDB)
- ✅ **Input Sanitization** (Express Validator)

---

## ⚡ Performance Optimizations

### Backend

- **Memory Storage**: Files buffered in memory, not disk
- **Direct Stream**: Streamed to Cloudinary without temp files
- **Async Operations**: Non-blocking uploads
- **Database Indexing**: Optimized queries for media

### Frontend

- **Lazy Loading**: Images load as user scrolls
- **Cloudinary CDN**: Global edge caching
- **Auto Format**: WebP for modern browsers
- **Auto Quality**: Best quality at smallest size
- **Object Contain**: No cropping, full media visible
- **GPU Acceleration**: CSS `transform: translate3d(0,0,0)`

### Cloudinary Transformations

```javascript
// Images
{
  quality: "auto:best",
  fetch_format: "auto",
  flags: "preserve_transparency"
}

// Videos
{
  quality: "auto:best",
  video_codec: "auto"
}
```

---

## 🐛 Troubleshooting

### Upload Fails

- **Check Cloudinary credentials** in `.env`
- **Verify file size** < 50MB
- **Check file type** (JPEG, PNG, MP4, etc.)
- **Check network connection**
- **View browser console** for errors

### Media Not Showing on Frontend

- **Check `isActive` status** in admin panel
- **Clear browser cache**
- **Check API response** in Network tab
- **Verify MongoDB connection**

### Quality Issues

- **Ensure Cloudinary plan supports HD** (free tier has limits)
- **Check original file quality**
- **Verify transformations** in `media.service.js`

---

## 🎨 Customization

### Change Theme Colors

Edit `AdminGallery.jsx` and `Homepage.jsx`:

```javascript
// Replace:
bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f]  // Orange gradient
bg-[#2a1a11]                                  // Dark brown

// With your colors:
bg-gradient-to-r from-purple-500 to-pink-500
bg-gray-900
```

### Adjust Grid Layout

In `Homepage.jsx` (Gallery section):

```javascript
// Current: 4 columns on XL screens
className =
  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

// Change to 3 columns:
className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";
```

### Change File Size Limit

In `backend/config/media.js`:

```javascript
export const maxFileSize = parseInt(
  process.env.MAX_FILE_SIZE || "52428800", // 50MB
  10
);
```

---

## 📝 Database Schema

### Media Model

```javascript
{
  title: String (required, max 100 chars)
  description: String (optional, max 500 chars)
  type: "image" | "video"
  cloudinaryId: String (Cloudinary public_id)
  url: String (HTTP URL)
  secureUrl: String (HTTPS URL) - Used in frontend
  publicId: String (Cloudinary identifier)
  format: String (jpg, png, mp4, etc.)
  resourceType: "image" | "video" | "raw"
  size: Number (bytes)
  width: Number (pixels)
  height: Number (pixels)
  duration: Number (seconds, for videos)
  thumbnail: String (video thumbnail URL)
  tags: [String] (array of tags)
  category: "event" | "sports" | "ceremony" | "participants" | "other"
  isActive: Boolean (default: true)
  uploadedBy: ObjectId (ref: Admin)
  order: Number (for sorting)
  createdAt: Date
  updatedAt: Date
}
```

---

## 🔮 Future Enhancements

- [ ] Drag & drop reordering in admin panel
- [ ] Bulk upload with progress bar
- [ ] Advanced filters (date range, uploader)
- [ ] Image editing (crop, rotate, filters)
- [ ] Video thumbnails customization
- [ ] Search functionality
- [ ] Analytics (view counts, popular media)
- [ ] Collections/Albums feature
- [ ] Social sharing buttons

---

## 📞 Support

For issues or questions:

1. Check this README
2. Review console errors (browser & terminal)
3. Check Cloudinary dashboard for upload logs
4. Verify MongoDB documents in database

---

## ✅ Testing Checklist

- [ ] Upload single image
- [ ] Upload multiple images
- [ ] Upload video
- [ ] View media in admin panel
- [ ] Toggle media active/inactive
- [ ] Delete media (check Cloudinary too)
- [ ] View gallery on homepage
- [ ] Filter by type (all/image/video)
- [ ] Click media for modal view
- [ ] Test on mobile devices
- [ ] Test with slow network (throttling)
- [ ] Check Cloudinary usage limits

---

**Built with ❤️ for Zenith 2026** 🏆
