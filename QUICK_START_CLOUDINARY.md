# 🚀 Quick Start Guide - Cloudinary Setup

## ⚡ Summary: What You Need to Know

### ❌ NO - You Don't Need to Upload Payment Screenshots
- **Payment screenshots are AUTOMATICALLY uploaded** by users when they register for marathon
- Users click "Upload Payment Screenshot" → File goes to Cloudinary → URL saved to database
- You just view them in the admin panel

### ✅ YES - You Need to Upload These Manually:
1. **Intro Video** (the main video on your site)
2. **Cyclone Background Image** (your main background)
3. **Any other images/videos** you use on the site

---

## 📋 Step-by-Step Setup (5 Minutes)

### Step 1: Create Cloudinary Account
1. Open browser and go to: **https://cloudinary.com**
2. Click **"Sign Up Free"**
3. Fill in:
   - Email
   - Password
   - Choose a cloud name (e.g., "zenith2026")
4. Click **"Create Account"**
5. Verify your email

### Step 2: Get Your Credentials
1. After login, you'll see the **Dashboard**
2. Look for this box at the top:
   ```
   ┌─────────────────────────────────────┐
   │ Product Environment Credentials     │
   ├─────────────────────────────────────┤
   │ Cloud name:  your_cloud_name        │
   │ API Key:     123456789012345        │
   │ API Secret:  ●●●●●●●●●●●● (hidden)  │
   │              [Show] ← Click this    │
   └─────────────────────────────────────┘
   ```
3. Click **"Show"** next to API Secret
4. **Copy all three values** (you'll need them next)

### Step 3: Add to Your Project
1. Open VS Code
2. Open file: `backend/.env`
3. Replace these lines:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here    ← Paste your cloud name
   CLOUDINARY_API_KEY=your_api_key_here          ← Paste your API key
   CLOUDINARY_API_SECRET=your_api_secret_here    ← Paste your API secret
   ```
4. **Save the file** (Ctrl+S)
5. **Restart backend server**:
   - Stop current server (Ctrl+C in terminal)
   - Run: `npm run dev`

### Step 4: Upload Your Files (2 Options)

#### OPTION A: Use Admin Panel (Easiest) ⭐ RECOMMENDED
1. Start frontend: `npm run dev` (in frontend folder)
2. Go to: `http://localhost:5173`
3. Login to admin panel
4. Click **"Media Upload"** in sidebar
5. Upload your intro video and images by clicking the upload areas
6. **Copy the URLs** that appear
7. Use these URLs in your frontend code (see below)

#### OPTION B: Use Cloudinary Dashboard
1. Go to: **https://cloudinary.com/console/media_library**
2. Click **"Upload"** button
3. Select your intro video
4. In upload settings, set folder: `zenith26/videos`
5. Upload
6. Click on the uploaded file
7. **Copy the URL**
8. Repeat for images (folder: `zenith26/images`)

---

## 🎯 How to Check If Images Are Uploaded

### Method 1: Cloudinary Dashboard
1. Go to: **https://cloudinary.com/console/media_library**
2. You'll see all your files organized:
   ```
   📁 zenith26/
      ├── 📁 images/
      │   ├── 🖼️ cyclone-bg.png
      │   ├── 🖼️ payment-screenshot-1.jpg
      │   └── 🖼️ payment-screenshot-2.jpg
      └── 📁 videos/
          └── 🎬 intro.mp4
   ```

### Method 2: Check in Your Admin Panel
1. Go to Marathon registrations
2. Click "View" on any registration
3. If user uploaded payment screenshot, you'll see it under "Payment Information"
4. If you see the image → Cloudinary is working! ✅

### Method 3: Test Upload
1. Go to Marathon registration form (as a user)
2. Fill the form
3. Click "Upload Payment Screenshot"
4. Select any image
5. If you see "Screenshot uploaded" toast → It's working! ✅

---

## 📂 Current Upload Status

### ✅ Already Working (No Action Needed):
- **Backend upload system**: ✅ Set up
- **Upload routes**: ✅ Created
- **Frontend upload form**: ✅ Ready
- **Admin viewing**: ✅ Working
- **Database storage**: ✅ Configured

### ⏳ You Need to Do:
1. ☐ Create Cloudinary account
2. ☐ Add credentials to `.env` file
3. ☐ Upload intro video
4. ☐ Upload background images
5. ☐ Update frontend code to use Cloudinary URLs

---

## 💻 How to Use Uploaded URLs in Code

After uploading your intro video and images, you'll get URLs like:
```
https://res.cloudinary.com/zenith2026/video/upload/v1234/zenith26/videos/intro.mp4
https://res.cloudinary.com/zenith2026/image/upload/v1234/zenith26/images/cyclone-bg.png
```

### Example 1: Replace Intro Video
Find this in your code:
```jsx
<video src="/video/intro.mp4" />
```

Replace with:
```jsx
<video src="https://res.cloudinary.com/YOUR_CLOUD/video/upload/v123/zenith26/videos/intro.mp4" />
```

### Example 2: Replace Background Image
Find this in your code:
```jsx
backgroundImage: 'url(/img/cyclone.png)'
```

Replace with:
```jsx
backgroundImage: 'url(https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/zenith26/images/cyclone.png)'
```

---

## 🎓 Understanding What's Automatic vs Manual

### 🤖 AUTOMATIC (You don't touch these):
| File Type | Who Uploads | Where | When |
|-----------|-------------|-------|------|
| Payment Screenshots | Users (during registration) | Marathon form | When registering |
| Screenshot URLs | Backend (automatically) | Database | After upload |
| Screenshot Display | Admin panel (automatically) | Admin Marathon page | When viewing |

### 👤 MANUAL (You upload these ONCE):
| File Type | Who Uploads | Where | When |
|-----------|-------------|-------|------|
| Intro Video | You (admin) | Admin panel or Cloudinary | Now (one time) |
| Background Images | You (admin) | Admin panel or Cloudinary | Now (one time) |
| Logo/Icons | You (admin) | Admin panel or Cloudinary | Now (one time) |

---

## ✨ Testing Everything

### Test 1: Payment Screenshot Upload (User Side)
1. Open: `http://localhost:5173/marathon`
2. Fill marathon form
3. Upload any image as payment screenshot
4. Submit form
5. ✅ Should see success message

### Test 2: View Screenshot (Admin Side)
1. Login to admin: `http://localhost:5173/admin/login`
2. Go to Marathon page
3. Click "View" on the registration you just created
4. Scroll to "Payment Information"
5. ✅ You should see the screenshot image

### Test 3: Upload Intro Video (Admin Side)
1. Login to admin
2. Go to "Media Upload" page
3. Click video upload area
4. Select your intro video
5. Wait for upload
6. ✅ Copy the URL that appears

---

## 🆘 Troubleshooting

### Problem: "Upload failed" error
**Cause**: Wrong Cloudinary credentials  
**Fix**: 
1. Check `.env` file
2. Make sure cloud name, API key, and secret are correct
3. No spaces, no quotes
4. Restart backend server

### Problem: Can't see uploaded files in Cloudinary
**Cause**: Looking in wrong place  
**Fix**:
1. Go to Media Library
2. Look in folders: `zenith26/images` and `zenith26/videos`
3. If not there, check "All folders" dropdown

### Problem: Image shows in admin panel but won't load
**Cause**: Wrong URL or network issue  
**Fix**:
1. Check the URL (should start with `https://res.cloudinary.com/`)
2. Try opening URL directly in browser
3. Check if Cloudinary account is active

---

## 🎁 What I've Created for You

1. ✅ **Backend upload system** - Handles all file uploads
2. ✅ **Upload routes** - API endpoints for images and videos
3. ✅ **Admin upload page** - Easy UI to upload files
4. ✅ **Payment screenshot integration** - Automatic user uploads
5. ✅ **Admin viewing** - See all uploaded screenshots
6. ✅ **Database integration** - URLs saved automatically
7. ✅ **Two guides**:
   - `HOW_TO_USE_CLOUDINARY.md` (detailed)
   - `QUICK_START_CLOUDINARY.md` (this file - quick)

---

## 📞 Next Steps (In Order)

1. **Right Now**: Create Cloudinary account (5 min)
2. **Then**: Add credentials to `.env` (1 min)
3. **Then**: Restart backend server (30 sec)
4. **Then**: Upload intro video via admin panel (2 min)
5. **Then**: Upload background images via admin panel (2 min)
6. **Finally**: Replace URLs in frontend code (5 min)

**Total Time: ~15 minutes** ⏱️

---

## 🎉 You're All Set!

After completing the steps above:
- ✅ Payment screenshots upload automatically
- ✅ Admins can view all screenshots
- ✅ Your intro video loads from Cloudinary
- ✅ Background images load from Cloudinary
- ✅ Everything is in the cloud (faster, more reliable)

**Need help?** Just ask! 🚀
