# 🎯 Admin Panel - Quick Start Guide

## ✅ What's Been Implemented

### Backend (Express + MongoDB + Cloudinary)
- ✅ JWT Authentication System
- ✅ Image & Video Upload to Cloudinary
- ✅ MongoDB Database for Media Storage
- ✅ RESTful API with Full CRUD Operations
- ✅ Security: Helmet, CORS, Rate Limiting

### Frontend (React + Framer Motion)
- ✅ Admin Login Page (matching your theme)
- ✅ Admin Dashboard with Upload & Gallery
- ✅ Public Glimpses Page for viewing media
- ✅ Protected Routes with JWT
- ✅ Beautiful animations matching homepage style

---

## 🚀 How to Run

### 1. Start Backend Server
```bash
cd backend
npm run dev
```
**Backend runs on:** http://localhost:5000

### 2. Start Frontend (in new terminal)
```bash
cd frontend
npm run dev
```
**Frontend runs on:** http://localhost:5173

---

## 🔐 Admin Login Credentials

**Email:** `admin@zenith2026.com`  
**Password:** `Admin@2026`

---

## 📍 Important URLs

| Page | URL | Description |
|------|-----|-------------|
| **Homepage** | http://localhost:5173/home | Main landing page |
| **Glimpses** | http://localhost:5173/glimpses | Public gallery |
| **Admin Login** | http://localhost:5173/admin/login | Admin authentication |
| **Admin Dashboard** | http://localhost:5173/admin/dashboard | Media management |

---

## 🎨 Design Features

### Matching Your Theme
- **Colors:** Orange-to-blue gradients (same as homepage)
- **Fonts:** Orbitron (headings) + Rajdhani (body)
- **Animations:** Framer Motion particles & smooth transitions
- **Background:** Gradient with animated sparkles
- **Style:** Glass-morphism cards matching your site

### Admin Dashboard Features
1. **Upload Tab:**
   - Drag & drop file upload
   - Title, description, category fields
   - Tags for organization
   - Real-time upload progress

2. **Gallery Tab:**
   - Grid view of all media
   - Filter by type (images/videos)
   - Delete functionality
   - Responsive design

3. **Statistics:**
   - Total images count
   - Total videos count
   - Total media count
   - Color-coded cards

---

## 🔄 How It Works

### Upload Flow
1. Admin logs in → JWT token stored
2. Admin uploads file → Sent to backend
3. Backend uploads to Cloudinary → Gets URL
4. URL + metadata saved to MongoDB
5. Success message shown

### View Flow
1. User visits `/glimpses`
2. Frontend fetches media from backend
3. Backend queries MongoDB
4. Returns Cloudinary URLs
5. Images/videos displayed in gallery

---

## 🛠️ Tech Stack

**Backend:**
- Express.js 4.21.2
- MongoDB (Mongoose)
- Cloudinary SDK
- JWT + bcryptjs
- Multer (file handling)

**Frontend:**
- React 19.2.0
- React Router 7.9.5
- Framer Motion 12.23.24
- Tailwind CSS
- Axios

---

## 📦 What's Stored Where

### MongoDB Collections
```javascript
// Users Collection
{
  username: "admin",
  email: "admin@zenith2026.com",
  password: "hashed_password",
  role: "admin"
}

// Media Collection
{
  title: "Event Photo",
  description: "Description here",
  type: "image",
  category: "event",
  publicId: "cloudinary_id",
  secureUrl: "https://cloudinary.com/...",
  uploadedBy: "admin_id",
  tags: ["cricket", "2026"]
}
```

### Cloudinary
- Original images/videos stored
- Optimized URLs returned
- Automatic format conversion

---

## 🎯 Admin Panel Navigation

### From Homepage
1. Scroll to buttons section
2. Click **"Admin Login"** button
3. Enter credentials
4. Access dashboard

### Direct Access
- Visit: http://localhost:5173/admin/login
- Login redirects to dashboard
- Protected route checks JWT

---

## ✨ Key Features

### Security
- ✅ JWT token authentication
- ✅ Protected API routes
- ✅ Password hashing (bcryptjs)
- ✅ CORS configured
- ✅ Rate limiting enabled

### User Experience
- ✅ Smooth animations
- ✅ Loading states
- ✅ Error messages
- ✅ Success notifications
- ✅ Responsive design

### Performance
- ✅ Cloudinary optimization
- ✅ Lazy loading
- ✅ Compression enabled
- ✅ Efficient queries

---

## 🔧 Configuration

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/zenith2026
JWT_SECRET=zenith2026-super-secret-jwt-key-change-in-production
CLOUDINARY_CLOUD_NAME=dzjtpunkb
CLOUDINARY_API_KEY=293751516579729
CLOUDINARY_API_SECRET=wsNGFDHExrbOTaDxJgZiBd2j0tc
```

### Frontend (api.js)
```javascript
const API_BASE_URL = "http://localhost:5000";
```

---

## 🚨 Troubleshooting

### Backend Won't Start
```bash
# Check MongoDB is running
mongod --version

# Reinstall dependencies
cd backend
rm -rf node_modules
npm install
```

### Login Not Working
1. Check backend is running on port 5000
2. Verify MongoDB connection
3. Check browser console for errors
4. Ensure credentials are correct

### Images Not Uploading
1. Verify Cloudinary credentials in `.env`
2. Check file size (max 10MB)
3. Check network tab for API errors
4. Ensure file type is supported

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get user profile

### Media Management
- `POST /api/media/upload` - Upload image/video
- `GET /api/media` - Get all media (with filters)
- `GET /api/media/stats` - Get statistics
- `DELETE /api/media/:id` - Delete media

---

## 🎉 Success!

Your admin panel is now **fully integrated** with your stunning frontend theme. The design matches perfectly with:
- Same gradient colors (orange → blue)
- Same fonts (Orbitron + Rajdhani)
- Same animation style (Framer Motion)
- Same glass-morphism effects

**Everything is pushed to GitHub:** https://github.com/jadhavkrushna/Zenithsggs-26

---

## 🔐 Security Notes

**Before Production:**
1. Change `JWT_SECRET` to a strong random string
2. Change admin password
3. Enable HTTPS
4. Set NODE_ENV=production
5. Configure proper CORS origins
6. Add input validation
7. Set up monitoring

---

## 📞 Need Help?

Check these files for more info:
- `backend/README.md` - Backend documentation
- `backend/SETUP_GUIDE.md` - Detailed setup
- `frontend/ADMIN_PANEL_README.md` - Frontend guide
- `ADMIN_QUICK_START.md` - Quick reference

**Happy Managing! 🚀**
