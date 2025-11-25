# ✅ Admin Panel Testing Checklist

Complete testing checklist to verify the Zenith 2026 admin panel is working correctly.

## 🔧 Prerequisites Check

- [ ] MongoDB is running (`mongod --version`)
- [ ] Node.js installed (`node --version` >= 16)
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Frontend dependencies installed (`cd frontend && npm install`)
- [ ] `.env` file exists in backend folder
- [ ] Cloudinary credentials configured in `.env`

## 🚀 Startup Tests

### Backend Startup

- [ ] Run `cd backend && npm run dev`
- [ ] Check terminal shows: ✅ "MongoDB connected"
- [ ] Check terminal shows: ✅ "Cloudinary connected successfully"
- [ ] Check terminal shows: ✅ "Server running on port 5000"
- [ ] Check terminal shows: "Admin user already exists" OR "Default admin created"

### Frontend Startup

- [ ] Run `cd frontend && npm run dev` (in new terminal)
- [ ] Check terminal shows: ✅ "Local: http://localhost:5173/"
- [ ] Open browser to http://localhost:5173
- [ ] Page loads without errors
- [ ] Check browser console (F12) for errors

## 🔐 Authentication Tests

### Login Flow

- [ ] Navigate to `/admin/login`
- [ ] See login form with animated background
- [ ] Enter email: `admin@zenith2026.com`
- [ ] Enter password: `Admin@2026`
- [ ] Click "Login" button
- [ ] See "Logging in..." on button
- [ ] Successfully redirected to `/admin/dashboard`
- [ ] Dashboard shows welcome message with username

### Login Error Handling

- [ ] Try wrong password → See error message
- [ ] Try invalid email format → See error message
- [ ] Try empty fields → Form validation prevents submit

### Protected Route

- [ ] Logout from dashboard
- [ ] Try accessing `/admin/dashboard` directly
- [ ] Should redirect to `/admin/login`
- [ ] Login again
- [ ] Should return to dashboard

### Logout

- [ ] Click "Logout" button from dashboard
- [ ] Redirected to login page
- [ ] Token removed (check localStorage in browser DevTools)

## 📤 Upload Tests

### Image Upload

- [ ] Navigate to dashboard → "Upload Media" tab
- [ ] Click file input, select .jpg or .png image (< 10MB)
- [ ] See filename displayed after selection
- [ ] Fill title: "Test Image Upload"
- [ ] Fill description: "Testing image upload functionality"
- [ ] Select category: "Sports"
- [ ] Add tags: "test, sports, cricket"
- [ ] Click "Upload Media" button
- [ ] See "Uploading..." on button
- [ ] See success message: "Media uploaded successfully! 🎉"
- [ ] Form resets (file input cleared, fields empty)
- [ ] Statistics cards update (Total Images +1)

### Video Upload

- [ ] Select .mp4 or .mov video (< 100MB)
- [ ] Fill title: "Test Video Upload"
- [ ] Fill description: "Testing video upload"
- [ ] Select category: "Ceremony"
- [ ] Add tags: "test, video, highlights"
- [ ] Click "Upload Media"
- [ ] Wait for upload (videos take longer)
- [ ] See success message
- [ ] Statistics cards update (Total Videos +1)

### Upload Error Handling

- [ ] Try uploading without selecting file → See error
- [ ] Try uploading without title → See validation error
- [ ] Try uploading file > 100MB → See error message

### Backend Upload Verification

- [ ] Check backend terminal for upload logs
- [ ] Log should show: "Uploading to Cloudinary..."
- [ ] Log should show: "Upload successful"
- [ ] Check MongoDB (Compass or mongosh):
  ```bash
  mongosh
  use zenith2026
  db.media.find()
  ```
- [ ] Should see uploaded media documents

### Cloudinary Verification

- [ ] Login to Cloudinary dashboard
- [ ] Navigate to Media Library
- [ ] See uploaded images/videos
- [ ] Verify files are in `zenith2026` folder

## 🖼️ Gallery Tests

### View Gallery

- [ ] Click "Gallery" tab in dashboard
- [ ] See grid of uploaded media
- [ ] Images display correctly
- [ ] Videos display with controls
- [ ] Each item shows: title, description, category, date

### Filter Tests

- [ ] Select "Images Only" filter
- [ ] Only images displayed
- [ ] Select "Videos Only" filter
- [ ] Only videos displayed
- [ ] Select "All Media"
- [ ] All media displayed again

### Delete Media

- [ ] Click "Delete" on a media item
- [ ] See confirmation dialog
- [ ] Click "OK" to confirm
- [ ] Media removed from gallery
- [ ] Statistics update (count decreases)
- [ ] Backend logs show deletion
- [ ] Verify removed from MongoDB
- [ ] Verify removed from Cloudinary

## 📊 Statistics Tests

### Dashboard Statistics

- [ ] View three statistic cards on dashboard
- [ ] "Total Images" shows correct count
- [ ] "Total Videos" shows correct count
- [ ] "Total Media" shows total (images + videos)
- [ ] Upload new media → stats update automatically
- [ ] Delete media → stats decrease

### Statistics API

Test directly via browser or Postman:

- [ ] GET http://localhost:5000/api/media/stats
- [ ] Returns JSON with correct counts

## 🌐 Public Glimpses Page Tests

### Access Glimpses

- [ ] Navigate to `/glimpses` (no login required)
- [ ] Page loads without authentication
- [ ] See header: "ZENITH 2026 Glimpses"
- [ ] All uploaded media displayed in grid

### Filters

- [ ] Use "All Media" dropdown
- [ ] Select "Images" → only images shown
- [ ] Select "Videos" → only videos shown
- [ ] Use category dropdown
- [ ] Select "Sports" → only sports media shown
- [ ] Click "Reset Filters" → all media shown

### Media Modal

- [ ] Click any media item
- [ ] Modal opens with full-size view
- [ ] For images: see full image
- [ ] For videos: video plays automatically
- [ ] See title, description, tags, category, date
- [ ] Click "Close" → modal closes
- [ ] Click outside modal → modal closes

### Responsive Design

- [ ] Resize browser to mobile width (< 640px)
- [ ] Grid changes to 1 column
- [ ] All elements remain accessible
- [ ] Modal works on mobile
- [ ] Test on actual mobile device if available

## 🔗 Navigation Tests

### Routes

Test all routes work:

- [ ] `/` → Stadium intro animation
- [ ] `/home` → Homepage
- [ ] `/glimpses` → Public gallery
- [ ] `/admin/login` → Admin login
- [ ] `/admin/dashboard` → Dashboard (protected)

### Links

- [ ] "View Site" link from dashboard → goes to homepage
- [ ] Back button works on all pages
- [ ] Browser refresh doesn't break auth (if logged in)

## 🎨 UI/UX Tests

### Design Consistency

- [ ] Colors match Zenith theme (orange-blue gradient)
- [ ] Fonts: Orbitron for headings, Rajdhani for body
- [ ] Animations smooth (Framer Motion)
- [ ] Glass morphism effects visible (backdrop blur)
- [ ] Buttons have hover effects
- [ ] Forms have focus states

### Animations

- [ ] Login particles animate
- [ ] Form fields fade in
- [ ] Statistics cards animate on load
- [ ] Gallery items stagger on load
- [ ] Modal fade in/out works
- [ ] Tab switching animates

## 🐛 Error Handling Tests

### API Errors

- [ ] Stop backend server
- [ ] Try uploading → see error message
- [ ] Try viewing gallery → see error
- [ ] Start backend → everything works again

### Network Errors

- [ ] Open DevTools → Network tab → Throttle to Slow 3G
- [ ] Upload large video → see progress
- [ ] Page remains responsive

### Invalid Data

- [ ] Try uploading .txt file → should show error
- [ ] Try uploading 200MB video → should show error
- [ ] Enter invalid URL manually → shows 404 or redirects

## 🔒 Security Tests

### Token Expiration

- [ ] Login successfully
- [ ] Manually delete token from localStorage
- [ ] Try to access dashboard
- [ ] Should redirect to login

### API Authorization

Test with Postman/Thunder Client:

- [ ] Try uploading without token → 401 Unauthorized
- [ ] Try deleting without token → 401 Unauthorized
- [ ] Public endpoints (GET /api/media) work without token

### XSS Prevention

- [ ] Upload media with title: `<script>alert('xss')</script>`
- [ ] View in gallery → script should NOT execute
- [ ] Title displayed as text

## 📱 Cross-Browser Tests

Test on multiple browsers:

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (Mac only)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

## ⚡ Performance Tests

### Load Time

- [ ] Dashboard loads in < 2 seconds
- [ ] Gallery with 50+ items loads smoothly
- [ ] Images load progressively
- [ ] Videos don't auto-play (saves bandwidth)

### Upload Speed

- [ ] 1MB image uploads in < 5 seconds
- [ ] 10MB video uploads in < 30 seconds
- [ ] Progress indicator works

## 📝 Final Verification

### Complete Flow Test

- [ ] Start both servers
- [ ] Login as admin
- [ ] Upload 3 images with different categories
- [ ] Upload 1 video
- [ ] View gallery, verify all 4 items
- [ ] Filter by images, see 3 items
- [ ] Delete 1 image
- [ ] Logout
- [ ] Visit public glimpses page
- [ ] See remaining 3 items (2 images + 1 video)
- [ ] Click item, view modal
- [ ] Close modal
- [ ] Login again
- [ ] Statistics show: 2 images, 1 video, 3 total

## 🎉 Success Criteria

All tests passing means:

- ✅ Authentication working (login/logout/protected routes)
- ✅ Media upload working (images + videos)
- ✅ Cloudinary integration working
- ✅ MongoDB storage working
- ✅ Gallery display working
- ✅ Filters working
- ✅ Delete functionality working
- ✅ Statistics accurate
- ✅ Public page accessible
- ✅ Responsive design working
- ✅ Animations smooth
- ✅ Error handling robust

## 🚨 Common Issues & Fixes

| Issue                   | Solution                                        |
| ----------------------- | ----------------------------------------------- |
| MongoDB not connected   | Run `mongod` or start MongoDB service           |
| Cloudinary upload fails | Check `.env` credentials                        |
| Port 5000 in use        | Kill process: `npx kill-port 5000`              |
| Port 5173 in use        | Kill process: `npx kill-port 5173`              |
| Login fails             | Recreate admin: `node src/utils/createAdmin.js` |
| Images don't load       | Check CORS in backend                           |
| Animations laggy        | Check GPU acceleration in browser               |

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

Prerequisites: ___/6
Startup: ___/2
Authentication: ___/4
Upload: ___/3
Gallery: ___/3
Statistics: ___/2
Public Page: ___/3
Navigation: ___/2
UI/UX: ___/2
Error Handling: ___/3

Total: ___/30

Status: ☐ PASS ☐ FAIL

Notes:
_________________________________
_________________________________
_________________________________
```

---

**Ready to test?** Start from Prerequisites and work your way down! ✅
