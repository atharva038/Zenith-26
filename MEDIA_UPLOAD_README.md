# Media Upload & Gallery System

## Overview

This system allows admins to upload photos and videos which are automatically displayed in a public gallery on the frontend.

## Features

- ✅ Image and video upload to Cloudinary
- ✅ Drag-and-drop reordering
- ✅ Category and tag management
- ✅ Responsive gallery with filters
- ✅ Full CRUD operations
- ✅ Pagination support
- ✅ Real-time preview
- ✅ ES6 modules throughout

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/zenith26

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Port
PORT=5000

# Cloudinary Configuration (Get from https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# File Upload Configuration (in bytes - default 10MB)
MAX_FILE_SIZE=10485760

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 3. Start the Server

```bash
npm start        # Production
npm run dev      # Development with nodemon
```

## API Endpoints

### Public Endpoints

- `GET /api/media` - Get all media (with filters)
  - Query params: `type`, `category`, `tags`, `search`, `page`, `limit`, `sortBy`, `sortOrder`
- `GET /api/media/:id` - Get single media by ID

### Admin Endpoints (Require Authentication)

- `POST /api/media/upload` - Upload new media
- `PUT /api/media/:id` - Update media metadata
- `DELETE /api/media/:id` - Delete media
- `PUT /api/media/reorder` - Reorder media items
- `GET /api/media/admin/stats` - Get media statistics

## Media Upload Example

### Using Postman/Thunder Client

**POST** `/api/media/upload`

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body:** (form-data)

```
file: [Select your image/video file]
title: "Amazing Sports Moment"
description: "An incredible moment from the tournament"
category: "sports"
tags: "football,tournament,2026"
```

**Allowed File Types:**

- Images: JPEG, JPG, PNG, GIF, WebP
- Videos: MP4, MPEG, QuickTime, AVI, WebM

**Max File Size:** 10MB (configurable via MAX_FILE_SIZE env variable)

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Access Gallery

Navigate to: `http://localhost:5173/gallery`

## Gallery Features

### Filters

- **Type Filter:** All, Images, Videos
- **Category Filter:** All Categories, Events, Sports, Ceremonies, Participants, Other

### User Experience

- Grid layout with responsive design
- Hover effects showing title, description, and tags
- Click to view full-size in modal
- Video playback in modal
- Pagination for large collections

## Admin Gallery Management Page

Create a page at [frontend/src/pages/AdminGallery.jsx](frontend/src/pages/AdminGallery.jsx) with the following features:

```jsx
import { useState, useEffect } from "react";
import {
  uploadMedia,
  getAllMedia,
  updateMedia,
  deleteMedia,
  reorderMedia,
} from "../services/mediaService";

// Features to implement:
// 1. File upload form with drag-and-drop
// 2. Preview before upload
// 3. Media list with edit/delete buttons
// 4. Drag-and-drop reordering
// 5. Statistics dashboard
```

## File Structure

### Backend

```
backend/
├── config/
│   ├── cloudinary.js          # Cloudinary configuration
│   └── media.js                # Media settings (file types, sizes)
├── controllers/
│   └── media.controller.js     # Request handlers
├── middleware/
│   ├── auth.middleware.js      # Authentication
│   ├── media.middleware.js     # File upload middleware
│   └── validate.js             # Validation middleware
├── models/
│   └── media.js                # Media schema
├── routes/
│   └── media.routes.js         # API routes
├── services/
│   └── media.service.js        # Business logic
└── utils/
    └── responseHandler.js      # Response formatters
```

### Frontend

```
frontend/
└── src/
    ├── pages/
    │   └── Gallery.jsx         # Public gallery page
    ├── services/
    │   └── mediaService.js     # API calls
    └── config/
        └── api.js              # Axios configuration
```

## Database Schema

### Media Model

```javascript
{
  title: String,                    // Required, max 100 chars
  description: String,              // Optional, max 500 chars
  type: String,                     // "image" or "video"
  cloudinaryId: String,             // Cloudinary public ID
  url: String,                      // Public URL
  secureUrl: String,                // HTTPS URL
  publicId: String,                 // For deletion
  format: String,                   // File format (jpg, mp4, etc.)
  resourceType: String,             // "image", "video", or "raw"
  size: Number,                     // File size in bytes
  width: Number,                    // Dimensions (images/videos)
  height: Number,
  duration: Number,                 // Video duration in seconds
  thumbnail: String,                // Video thumbnail URL
  tags: [String],                   // Array of tags
  category: String,                 // enum: event, sports, ceremony, participants, other
  isActive: Boolean,                // Visibility toggle
  uploadedBy: ObjectId,             // Reference to Admin
  order: Number,                    // For drag-drop ordering
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### Common Issues

1. **"Failed to load gallery"**

   - Check if backend server is running
   - Verify API_URL in frontend/.env
   - Check browser console for CORS errors

2. **"Upload failed"**

   - Verify Cloudinary credentials in backend/.env
   - Check file size (max 10MB by default)
   - Ensure file type is supported

3. **"Authentication failed"**

   - Login as admin first
   - Check if JWT token is stored in localStorage
   - Verify token hasn't expired

4. **Images not displaying**
   - Check Cloudinary account quota
   - Verify secureUrl in database
   - Check browser console for 404 errors

## Security Notes

- ✅ JWT authentication required for upload/edit/delete
- ✅ File type validation on backend
- ✅ File size limits enforced
- ✅ Cloudinary secure URLs (HTTPS)
- ✅ Input validation with express-validator
- ✅ XSS protection via proper escaping

## Performance Optimization

- Pagination limits database queries
- Cloudinary automatic format optimization
- Image transformations for thumbnails
- Lazy loading in frontend gallery
- Indexed database fields for fast queries

## Next Steps

1. Create AdminGallery page for media management
2. Implement drag-and-drop file upload
3. Add image cropping/editing before upload
4. Create video thumbnail generator
5. Add bulk upload feature
6. Implement search functionality
7. Add social sharing buttons

## Support

For issues or questions, refer to:

- Cloudinary Docs: https://cloudinary.com/documentation
- Multer Docs: https://github.com/expressjs/multer
- Express Validator: https://express-validator.github.io/

---

**Created:** December 2025  
**Version:** 1.0.0  
**License:** MIT
