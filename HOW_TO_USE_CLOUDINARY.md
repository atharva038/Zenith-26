# How to Use Cloudinary - Complete Guide

## 🚀 Quick Start

### Step 1: Create Cloudinary Account
1. Go to **https://cloudinary.com**
2. Click "Sign Up" (it's FREE!)
3. Fill in your details and create account
4. You'll be taken to your Dashboard

### Step 2: Get Your Credentials
Once logged in, you'll see your Dashboard with these details:

```
Cloud name: your_cloud_name
API Key: 123456789012345
API Secret: abcdefghijklmnopqrstuvwxyz
```

**Copy these values** - you'll need them!

### Step 3: Add Credentials to Your Project
1. Open the file: `backend/.env`
2. Replace the placeholder values:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name        # Replace with your actual cloud name
CLOUDINARY_API_KEY=123456789012345           # Replace with your actual API key
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz  # Replace with your actual API secret
```

3. Save the file
4. Restart your backend server (it will pick up the new credentials)

---

## 📂 How to Check if Images are in Cloudinary

### Method 1: Cloudinary Dashboard (Web Interface)
1. Go to **https://cloudinary.com/console**
2. Log in with your account
3. Click on **"Media Library"** in the left sidebar
4. You'll see all your uploaded files organized by folders:
   ```
   📁 zenith26/
      ├── 📁 images/     ← Payment screenshots will be here
      └── 📁 videos/     ← Intro video will be here
   ```

### Method 2: Check When User Uploads
When a user uploads a payment screenshot in the Marathon registration form:
1. The image automatically uploads to Cloudinary
2. You'll see a success message: "Screenshot uploaded"
3. A preview of the image appears on the form
4. The Cloudinary URL is saved in the database

### Method 3: Check in Admin Panel
1. Login to admin panel
2. Go to Marathon registrations
3. Click "View" on any registration
4. Scroll to "Payment Information"
5. If a screenshot was uploaded, you'll see the image there
6. Click on it to view full size

---

## 📤 Do You Need to Upload Manually?

### ❌ Payment Screenshots - NO Manual Upload Needed
- **Automatic**: Users upload payment screenshots through the registration form
- **How it works**:
  1. User selects image file
  2. Frontend automatically sends to backend
  3. Backend uploads to Cloudinary
  4. URL saved in database
  5. Admin can view in admin panel

### ✅ Intro Video & Background Images - YES, Upload Manually

You have **3 options** to upload your intro video and background images:

---

## 🎬 Option 1: Upload via Cloudinary Dashboard (Easiest)

### For Intro Video:
1. Go to https://cloudinary.com/console
2. Click **"Media Library"**
3. Click **"Upload"** button (top right)
4. Select your intro video file
5. In the upload dialog, set folder to: `zenith26/videos`
6. Upload and wait for it to complete
7. Click on the uploaded video
8. **Copy the URL** (it looks like: `https://res.cloudinary.com/yourcloud/video/upload/v123456/zenith26/videos/intro.mp4`)
9. Use this URL in your frontend code

### For Background Images (Cyclone, etc.):
1. Same steps as above
2. Set folder to: `zenith26/images`
3. Upload your background images
4. Copy the URLs
5. Use them in your frontend code

---

## 💻 Option 2: Upload via API (For Developers)

I've created API endpoints for you to upload files programmatically:

### Upload Image via API:
```javascript
// You need admin token for this
const formData = new FormData();
formData.append('file', imageFile); // Your image file

const response = await api.post('/upload/asset/image', formData, {
  headers: { 
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${adminToken}` // Admin login required
  }
});

console.log('Image URL:', response.data.url);
// Use this URL in your components
```

### Upload Video via API:
```javascript
const formData = new FormData();
formData.append('file', videoFile); // Your video file

const response = await api.post('/upload/asset/video', formData, {
  headers: { 
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${adminToken}` // Admin login required
  }
});

console.log('Video URL:', response.data.url);
// Use this URL in your video components
```

---

## 🛠️ Option 3: Create an Admin Upload Page (Recommended)

I can create an admin page where you can upload videos and images directly from your admin panel. Would you like me to create this?

It would have:
- File upload form for intro video
- File upload form for background images
- Preview of uploaded files
- Copy URL button
- All uploads go to Cloudinary automatically

---

## 🔗 How to Use Uploaded URLs in Your Code

Once you have the Cloudinary URL, replace local file paths:

### Before (Local file):
```jsx
<video src="/video/intro.mp4" />
<img src="/img/cyclone-bg.png" />
```

### After (Cloudinary URL):
```jsx
<video src="https://res.cloudinary.com/yourcloud/video/upload/v123/zenith26/videos/intro.mp4" />
<img src="https://res.cloudinary.com/yourcloud/image/upload/v123/zenith26/images/cyclone-bg.png" />
```

---

## 📊 Check Upload Status

### In Cloudinary Dashboard:
1. Go to Media Library
2. You'll see:
   - **Total files**: Count of all uploads
   - **Storage used**: How much space you're using
   - **Bandwidth**: How much data has been delivered
3. Click on any file to see:
   - URL
   - Size
   - Format
   - Upload date
   - Transformations available

### In Your Database:
Payment screenshots are stored in the `Marathon` collection:
```javascript
{
  paymentDetails: {
    transactionId: "TEST12345678AB",
    screenshotUrl: "https://res.cloudinary.com/...",  // ← Cloudinary URL
    amount: 500,
    paymentStatus: "pending"
  }
}
```

---

## 🎯 Current Status

### ✅ Already Implemented (Automatic):
- Payment screenshot upload from user forms
- Backend upload to Cloudinary
- Database storage of URLs
- Admin viewing of screenshots

### ⏳ You Need to Do Manually:
1. **Create Cloudinary account** (5 minutes)
2. **Get credentials** and add to `.env` file
3. **Upload intro video** via dashboard
4. **Upload background images** via dashboard
5. **Update frontend code** to use Cloudinary URLs

---

## 🆘 Troubleshooting

### "Upload failed" error
**Problem**: Invalid Cloudinary credentials  
**Solution**: Check that you copied the credentials correctly to `.env` file

### Can't see uploaded files
**Problem**: Looking in wrong place  
**Solution**: Check the `zenith26/images` and `zenith26/videos` folders in Media Library

### Images not loading on website
**Problem**: Wrong URL or file not public  
**Solution**: 
1. Check the URL is correct
2. In Cloudinary, make sure "Resource Type" is set to "Image" or "Video"
3. Make sure the file is not set to "Private"

---

## 💡 Pro Tips

1. **Free Tier Limits**: 
   - 25 GB storage
   - 25 GB bandwidth/month
   - Should be more than enough for your event

2. **Image Optimization**:
   - Cloudinary automatically optimizes images
   - You can add transformations to URLs:
     - `/w_500/` - Resize to 500px width
     - `/q_auto/` - Auto quality
     - `/f_auto/` - Auto format (WebP for modern browsers)

3. **Organize Your Files**:
   - Use folders: `zenith26/images/backgrounds/`, `zenith26/images/payment/`
   - Makes it easier to find files later

4. **Backup**:
   - Keep local copies of your intro video and images
   - Just in case you need to re-upload

---

## 📞 Next Steps

1. **Create Cloudinary account NOW** - It takes 5 minutes
2. **Add credentials to `.env`** - Copy-paste the values
3. **Test payment upload** - Register for marathon and upload a test screenshot
4. **Upload your intro video** - Via dashboard or let me create an admin upload page
5. **Upload backgrounds** - Same as intro video

Would you like me to:
- ✅ Create an admin page for uploading videos/images?
- ✅ Show you exactly which frontend files to update with Cloudinary URLs?
- ✅ Help you test the payment screenshot upload?

Let me know what you need! 🚀
