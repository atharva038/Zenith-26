# 📁 Project Assets - Upload to Cloudinary Guide

## 🎯 Summary: Files You Need to Upload

You have **6 files** in your project that should be uploaded to Cloudinary:

### Videos (3 files)
- ✅ `/frontend/public/video/intro_4k.mp4` - Main intro video (4K quality)
- ✅ `/frontend/public/video/intro_hd.mp4` - Intro video (HD quality)  
- ✅ `/frontend/public/video/intro.mp4` - Intro video (Standard quality)

### Images (3 files)
- ✅ `/frontend/public/img/stadium.jpg` - Stadium background image
- ✅ `/frontend/public/img/image.png` - Wormhole/portal image
- ✅ `/frontend/public/img/wormhole.png` - Additional wormhole image

---

## 📊 Where Each File is Used

### 1. **Intro Videos** (intro_4k.mp4, intro_hd.mp4, intro.mp4)
**Used in:** `CinematicIntro.jsx` (Opening video)

**Current code:**
```jsx
<source src="/video/intro_4k.mp4" type="video/mp4" />
<source src="/video/intro_hd.mp4" type="video/mp4" />
<source src="/video/intro.mp4" type="video/mp4" />
```

**Files to update after upload:**
- `frontend/src/components/CinematicIntro.jsx` (line 87, 92, 96)

---

### 2. **Stadium Background** (stadium.jpg)
**Used in:** Multiple pages - Main background image

**Current code:**
```jsx
backgroundImage: 'url("/img/stadium.jpg")'
```

**Files to update after upload:**
- `frontend/src/pages/Homepage.jsx` (line 291)
- `frontend/src/pages/ParallaxDemo.jsx` (line 274)
- `frontend/src/pages/Homepage_ScrollAnimations.jsx` (line 277)
- `frontend/src/pages/Homepage_Parallax_Enhanced.jsx` (line 181)

---

### 3. **Wormhole/Portal Image** (image.png)
**Used in:** `WormholePortal.jsx` (Portal effect component)

**Current code:**
```jsx
const WORMHOLE_IMAGE = "/img/image.png";
```

**Files to update after upload:**
- `frontend/src/components/WormholePortal.jsx` (line 7)

---

## 🚀 Step-by-Step Upload Process

### Step 1: Upload Files to Cloudinary

**Option A: Via Admin Panel (Easiest)**
1. Open: http://localhost:5174
2. Login to admin
3. Go to "Media Upload" page
4. Upload each file:
   - Upload 3 videos → Click video upload area
   - Upload 3 images → Click image upload area
5. **IMPORTANT**: Copy each URL that appears after upload

**Option B: Via Cloudinary Dashboard**
1. Go to: https://cloudinary.com/console/media_library
2. Click "Upload"
3. For videos: Set folder to `zenith26/videos`
4. For images: Set folder to `zenith26/images`
5. Upload all files
6. Copy each URL

---

### Step 2: Replace URLs in Code

After uploading, you'll get URLs like:
```
https://res.cloudinary.com/YOUR_CLOUD/video/upload/v123/zenith26/videos/intro_4k.mp4
https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/zenith26/images/stadium.jpg
```

---

## 📝 Code Changes Required

### File 1: `frontend/src/components/CinematicIntro.jsx`

**Find (around line 87-96):**
```jsx
<source src="/video/intro_4k.mp4" type="video/mp4" />
<source src="/video/intro_hd.mp4" type="video/mp4" />
<source src="/video/intro.mp4" type="video/mp4" />
```

**Replace with:**
```jsx
<source src="CLOUDINARY_URL_FOR_intro_4k.mp4" type="video/mp4" />
<source src="CLOUDINARY_URL_FOR_intro_hd.mp4" type="video/mp4" />
<source src="CLOUDINARY_URL_FOR_intro.mp4" type="video/mp4" />
```

---

### File 2: `frontend/src/pages/Homepage.jsx`

**Find (around line 291):**
```jsx
backgroundImage: 'url("/img/stadium.jpg")',
```

**Replace with:**
```jsx
backgroundImage: 'url("CLOUDINARY_URL_FOR_stadium.jpg")',
```

---

### File 3: `frontend/src/pages/ParallaxDemo.jsx`

**Find (around line 274):**
```jsx
backgroundImage: "url(/img/stadium.jpg)",
```

**Replace with:**
```jsx
backgroundImage: "url(CLOUDINARY_URL_FOR_stadium.jpg)",
```

---

### File 4: `frontend/src/pages/Homepage_ScrollAnimations.jsx`

**Find (around line 277):**
```jsx
backgroundImage: 'url("/img/stadium.jpg")',
```

**Replace with:**
```jsx
backgroundImage: 'url("CLOUDINARY_URL_FOR_stadium.jpg")',
```

---

### File 5: `frontend/src/pages/Homepage_Parallax_Enhanced.jsx`

**Find (around line 181):**
```jsx
backgroundImage: 'url("/img/stadium.jpg")',
```

**Replace with:**
```jsx
backgroundImage: 'url("CLOUDINARY_URL_FOR_stadium.jpg")',
```

---

### File 6: `frontend/src/components/WormholePortal.jsx`

**Find (around line 7):**
```jsx
const WORMHOLE_IMAGE = "/img/image.png";
```

**Replace with:**
```jsx
const WORMHOLE_IMAGE = "CLOUDINARY_URL_FOR_image.png";
```

---

## ✅ Quick Checklist

- [ ] Created Cloudinary account
- [ ] Added credentials to `backend/.env`
- [ ] Restarted backend server
- [ ] Uploaded `intro_4k.mp4` to Cloudinary
- [ ] Uploaded `intro_hd.mp4` to Cloudinary
- [ ] Uploaded `intro.mp4` to Cloudinary
- [ ] Uploaded `stadium.jpg` to Cloudinary
- [ ] Uploaded `image.png` to Cloudinary
- [ ] Uploaded `wormhole.png` to Cloudinary (if exists)
- [ ] Copied all 6 URLs from Cloudinary
- [ ] Updated `CinematicIntro.jsx` with video URLs
- [ ] Updated `Homepage.jsx` with stadium URL
- [ ] Updated `ParallaxDemo.jsx` with stadium URL
- [ ] Updated `Homepage_ScrollAnimations.jsx` with stadium URL
- [ ] Updated `Homepage_Parallax_Enhanced.jsx` with stadium URL
- [ ] Updated `WormholePortal.jsx` with wormhole URL
- [ ] Tested website to confirm all images/videos load

---

## 🎯 Benefits of Using Cloudinary

### Before (Local Files):
- ❌ Files stored on your server
- ❌ Slower loading times
- ❌ Uses your server bandwidth
- ❌ Large files slow down deployment

### After (Cloudinary):
- ✅ Files served from global CDN
- ✅ Faster loading (30-50% faster)
- ✅ Automatic optimization
- ✅ Smaller deployment size
- ✅ Better performance

---

## 📞 Need Help?

1. **Can't find Cloudinary URLs?**
   - After upload, look for "Copy URL" button in admin panel
   - OR check Media Library in Cloudinary dashboard

2. **Which file is which?**
   - Check the file name in the URL
   - intro_4k.mp4 = highest quality intro
   - stadium.jpg = main background
   - image.png = wormhole portal effect

3. **How to test?**
   - After replacing URLs, refresh your website
   - Check browser DevTools → Network tab
   - URLs should show cloudinary.com domain

---

## 💡 Pro Tip

Since `stadium.jpg` is used in **4 different files**, I recommend:
1. Upload `stadium.jpg` ONCE to Cloudinary
2. Copy the URL
3. Use the SAME URL in all 4 files
4. This ensures consistency and faster loading

Same applies for the intro videos - upload once, use the URLs in `CinematicIntro.jsx`

---

**Ready?** Start uploading via the Media Upload page! 🚀

After uploading all files, let me know and I'll help you update all the code files automatically!
