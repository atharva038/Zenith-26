# Zenith 2026 Backend - Quick Setup Guide

## 🎯 What You Have Now

A complete, production-ready backend with:

- ✅ JWT-based admin authentication
- ✅ Cloudinary integration for media storage
- ✅ MongoDB for storing media references
- ✅ Complete REST API for admin panel
- ✅ Image & video upload/delete capabilities
- ✅ Security features (rate limiting, validation, etc.)

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
MONGODB_URI=your-mongodb-connection-string
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
JWT_SECRET=your-super-secret-key
```

### Step 3: Start the Server

```bash
npm run dev
```

You should see:

```
✅ MongoDB Connected
✅ Cloudinary Connected Successfully
✅ Default admin user created
   Email: admin@zenith2026.com
   Password: Admin@2026
🚀 Server running on port: 5000
```

### Step 4: Test the API

Open: http://localhost:5000/api/health

## 📝 What You Need to Get Started

### 1. MongoDB (Choose One)

**Option A: MongoDB Atlas (Cloud - Recommended)**

- Free tier available
- Go to: https://www.mongodb.com/cloud/atlas
- Create account → Create cluster → Get connection string
- Connection string looks like:
  ```
  mongodb+srv://username:password@cluster.mongodb.net/zenith2026
  ```

**Option B: Local MongoDB**

- Install MongoDB on your computer
- Connection string:
  ```
  mongodb://localhost:27017/zenith2026
  ```

### 2. Cloudinary Account

- Free tier available (25GB storage)
- Go to: https://cloudinary.com/
- Sign up → Dashboard → Copy credentials:
  - Cloud Name
  - API Key
  - API Secret

## 🎮 Testing the Admin Panel APIs

### 1. Login as Admin

```bash
# Using PowerShell
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body (@{email="admin@zenith2026.com"; password="Admin@2026"} | ConvertTo-Json) -ContentType "application/json"
$token = $response.data.token
Write-Host "Token: $token"
```

### 2. Upload an Image

```bash
# Save token from above, then upload
# Use Postman or your frontend for file uploads
```

### 3. Get All Media

```bash
Invoke-RestMethod -Uri "http://localhost:5000/api/media?type=image" -Method Get
```

## 🔌 Frontend Integration

### Fetch Media for Glimpses Page

```javascript
const response = await fetch(
  "http://localhost:5000/api/media?type=image&isActive=true"
);
const { data } = await response.json();

// Use Cloudinary URLs directly in your frontend
data.media.forEach((item) => {
  // item.secureUrl - Use this for images/videos
  // item.thumbnail - Use this for video thumbnails
});
```

### Admin Login Flow

```javascript
// 1. Login
const loginResponse = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@zenith2026.com",
    password: "Admin@2026",
  }),
});
const { data } = await loginResponse.json();
const token = data.token; // Store this!

// 2. Upload Media
const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("title", "Event Photo");
formData.append("category", "event");

const uploadResponse = await fetch("http://localhost:5000/api/media/upload", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
});

// 3. Delete Media
await fetch(`http://localhost:5000/api/media/${mediaId}`, {
  method: "DELETE",
  headers: { Authorization: `Bearer ${token}` },
});
```

## 📂 Key Files to Know

- `src/app.js` - Main server file (start here)
- `src/routes/auth.routes.js` - Authentication endpoints
- `src/routes/media.routes.js` - Media management endpoints
- `.env` - Your configuration (don't commit this!)
- `src/models/Media.js` - Database schema for media
- `src/services/cloudinary.service.js` - Cloudinary upload/delete logic

## 🛠️ Available Scripts

```bash
npm run dev     # Development with auto-reload
npm start       # Production mode
npm test        # Run tests
```

## 🔒 Security Notes

1. **Change default admin password immediately!**
2. Never commit `.env` file
3. Use strong JWT_SECRET in production
4. Enable HTTPS in production
5. Update CORS settings for your frontend URL

## 📚 Full API Documentation

See `README.md` for complete API documentation with all endpoints.

## ❓ Troubleshooting

**MongoDB Connection Failed**

- Check your connection string in `.env`
- For MongoDB Atlas: Make sure to whitelist your IP

**Cloudinary Upload Failed**

- Verify credentials in `.env`
- Check file size (max 10MB by default)

**JWT Token Invalid**

- Make sure JWT_SECRET is set
- Token expires after 7 days (configurable)

## 🎉 You're All Set!

Your backend is ready to:

- ✅ Authenticate admin users
- ✅ Upload images/videos to Cloudinary
- ✅ Store media references in MongoDB
- ✅ Serve optimized media URLs to frontend
- ✅ Manage media with full CRUD operations

Next Steps:

1. Set up your frontend to consume these APIs
2. Create an admin dashboard UI
3. Build the glimpses/gallery page
4. Deploy to production (Heroku, AWS, etc.)

---

Need help? Check the full README.md or create an issue!
