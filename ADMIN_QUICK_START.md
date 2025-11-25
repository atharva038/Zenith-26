# 🚀 Quick Start Guide - Zenith 2026 Admin Panel

Get the admin panel running in under 5 minutes!

## ⚡ Quick Setup

### 1. Start Backend (Terminal 1)

```bash
cd backend
npm install
npm run dev
```

Backend runs on **http://localhost:5000**

### 2. Start Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

## 🔑 Default Login

```
Email: admin@zenith2026.com
Password: Admin@2026
```

## 📸 Test Upload Flow

1. Open browser: `http://localhost:5173`
2. Navigate to: `/admin/login`
3. Login with default credentials
4. Click **"Upload Media"** tab
5. Select an image or video file
6. Fill in:
   - Title: "Test Upload"
   - Description: "My first media upload"
   - Category: "Event"
   - Tags: "test, demo, 2026"
7. Click **"Upload Media"** button
8. Wait for success message ✅
9. Switch to **"Gallery"** tab
10. See your uploaded media!

## 🌐 Visit Public Gallery

Open: `http://localhost:5173/glimpses`

Browse all uploaded media without authentication!

## 🎯 Common Tasks

### Upload Image

```
1. Login → Upload tab
2. Select .jpg/.png file
3. Fill metadata
4. Click Upload
```

### Upload Video

```
1. Login → Upload tab
2. Select .mp4/.mov file
3. Fill metadata
4. Click Upload (may take longer)
```

### Delete Media

```
1. Login → Gallery tab
2. Find media item
3. Click "Delete" button
4. Confirm deletion
```

### View Statistics

```
Login → See cards at top:
- Total Images
- Total Videos
- Total Media
```

## 🔧 Troubleshooting

### Backend won't start

```bash
# Check MongoDB is running
mongod --version

# Restart backend
cd backend
npm run dev
```

### Frontend won't start

```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Can't login

- Check backend terminal for errors
- Verify MongoDB is running
- Try creating admin manually:

```bash
cd backend
node src/utils/createAdmin.js
```

### Upload fails

1. Check Cloudinary credentials in `backend/.env`
2. Verify file size < 10MB for images, < 100MB for videos
3. Check backend terminal for errors

## 📋 Checklist

Before testing, ensure:

- [ ] MongoDB is running
- [ ] Backend started (port 5000)
- [ ] Frontend started (port 5173)
- [ ] Cloudinary configured in `.env`
- [ ] Default admin created

## 🎨 Features to Test

- [x] Login/Logout
- [x] Upload image
- [x] Upload video
- [x] View gallery
- [x] Filter by type
- [x] Delete media
- [x] View statistics
- [x] Public glimpses page
- [x] Modal view

## 🔗 Useful URLs

| Page            | URL                                   |
| --------------- | ------------------------------------- |
| Frontend        | http://localhost:5173                 |
| Admin Login     | http://localhost:5173/admin/login     |
| Admin Dashboard | http://localhost:5173/admin/dashboard |
| Public Glimpses | http://localhost:5173/glimpses        |
| Backend API     | http://localhost:5000/api             |
| Health Check    | http://localhost:5000/health          |

## 📝 Sample Test Data

### Test Image Upload

- Title: "Cricket Final 2026"
- Description: "Zenith Cricket Championship Final Match"
- Category: Sports
- Tags: cricket, final, championship

### Test Video Upload

- Title: "Opening Ceremony Highlights"
- Description: "Best moments from Zenith 2026 opening ceremony"
- Category: Ceremony
- Tags: ceremony, opening, highlights

## 🎉 Success Indicators

You'll know it's working when:

- ✅ Backend shows "MongoDB connected"
- ✅ Backend shows "Server running on port 5000"
- ✅ Frontend opens at localhost:5173
- ✅ Login redirects to dashboard
- ✅ Upload shows success message
- ✅ Gallery displays uploaded media
- ✅ Glimpses page shows all media

## 🚨 Need Help?

1. Check backend terminal for errors
2. Check frontend browser console (F12)
3. Verify MongoDB is running: `mongosh`
4. Check `.env` file exists with correct values
5. Review `backend/SETUP_GUIDE.md` for detailed setup

---

**Ready to go?** Open `http://localhost:5173/admin/login` and start uploading! 🚀
