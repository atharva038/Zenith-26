# Universal Registration System - Complete Implementation Guide

## 🎯 What Was Fixed

### 1. **Event Availability Issue** ✅
**Problem:** Events were showing as "❌ Closed" even when they were created.

**Root Cause:** Events need **BOTH** checkboxes checked:
- ✅ **Active** - Enables registration
- ✅ **Published** - Makes event visible in GameVerse

The `isPublished` field was defaulting to `false`, so events weren't appearing.

**Solution:**
- Changed `isPublished` default to `true` in `SportEventForm.jsx`
- Added prominent warning banner explaining both checkboxes
- Updated form with helpful tooltips

---

### 2. **Payment QR Code Section** ✅
**Implemented:** Hardcoded UPI payment section with QR code placeholder

**Features:**
- Display of entry fee (₹500 fixed for all sports)
- QR code placeholder (replace with actual QR generator)
- UPI ID displayed: `taherroshan4-1@okicici`
- Instructions for UPI app payment
- Warning to upload payment receipt

**Location:** `frontend/src/pages/UniversalRegistration.jsx`

---

### 3. **Document Upload Section** ✅
**Implemented:** Three mandatory file upload fields

**Required Documents:**
1. **College Permission Letter** - Official letter from Dean/Student Affairs with signatures
2. **Transaction Receipt** - Screenshot of the ₹500 UPI payment
3. **Captain's ID Card** - College ID card of team captain

**Validations:**
- File types: JPG, PNG, PDF only
- Max size: 5MB per file
- All three are mandatory before submission

---

## 🏗️ Technical Implementation

### Frontend Changes

#### 1. `frontend/src/pages/SportEventForm.jsx`
```javascript
// Changed default isPublished from false to true
isPublished: true  // Line 120

// Added warning banner at top explaining both checkboxes
```

#### 2. `frontend/src/pages/UniversalRegistration.jsx`
**Added:**
- Document upload state: `documents` (permissionLetter, transactionReceipt, captainIdCard)
- File change handler with validation: `handleFileChange()`
- Document validation in `validateForm()`
- Updated form submission to use FormData for multipart upload
- Payment QR section with UPI details
- Document upload section with 3 file inputs

### Backend Changes

#### 1. `backend/models/Registration.js`
**Added documents field:**
```javascript
documents: {
  permissionLetter: String,
  transactionReceipt: String,
  captainIdCard: String,
}
```

#### 2. `backend/middleware/upload.middleware.js` (NEW FILE)
**Created multer middleware:**
- Configures file storage in `uploads/` directory
- File filter: Only JPG, PNG, PDF
- Size limit: 5MB max
- Unique filename generation
- Multi-field upload support

#### 3. `backend/routes/registration.routes.js`
**Updated:**
```javascript
import {uploadRegistrationDocuments} from "../middleware/upload.middleware.js";

router.post(
  "/",
  uploadRegistrationDocuments,  // Multer middleware
  registrationController.createRegistration
);
```

#### 4. `backend/controllers/registration.controller.js`
**Updated `createRegistration()`:**
- Parse formData from multipart request
- Validate all 3 documents are present
- Store document file paths in database
- Handle multipart/form-data format

#### 5. `backend/server.js`
**Added:**
- Static file serving for uploads: `app.use("/uploads", express.static(...))`
- Path and URL imports for ES modules

---

## 📦 Required Installation

### Install Multer (File Upload Library)
```bash
cd backend
npm install multer
```

---

## 🧪 Testing Instructions

### 1. **Create a Test Event**
1. Go to Admin Dashboard → Events → Create New Event
2. Fill in details (use "🧪 Fill Test Data" button for quick setup)
3. **IMPORTANT:** Verify BOTH checkboxes are checked:
   - ✅ Active (Enable Registration)
   - ✅ Published (Visible in GameVerse)
4. Save the event

### 2. **Test Registration Flow**
1. Navigate to `/register` route
2. You should now see the sport listed as "✅ Open" instead of "❌ Closed"
3. Select the sport from dropdown
4. Fill out the form (use "🧪 Fill Test Data" button)
5. **Payment Section:**
   - Note the ₹500 entry fee
   - QR code placeholder is shown
   - UPI ID: `taherroshan4-1@okicici`
6. **Upload Documents:**
   - Upload a sample PDF/image for Permission Letter
   - Upload a sample PDF/image for Transaction Receipt
   - Upload a sample PDF/image for Captain's ID Card
7. Submit the form
8. Verify registration success

### 3. **Verify Backend**
1. Check MongoDB `registrations` collection
2. Verify `documents` field contains file paths:
   ```javascript
   documents: {
     permissionLetter: "uploads/permission-1234567890.pdf",
     transactionReceipt: "uploads/receipt-1234567890.jpg",
     captainIdCard: "uploads/id-1234567890.png"
   }
   ```
3. Check `backend/uploads/` directory contains uploaded files

---

## 🎨 QR Code Implementation (TODO)

The payment section currently shows a **placeholder** for the QR code. To implement a real QR code:

### Option 1: Use a QR Code Generator Library
```bash
npm install qrcode.react
```

**Update UniversalRegistration.jsx:**
```javascript
import QRCode from "qrcode.react";

// Replace the placeholder div with:
<QRCode
  value="upi://pay?pa=taherroshan4-1@okicici&pn=Zenith2026&am=500&cu=INR"
  size={192}
  level="H"
/>
```

### Option 2: Use Static QR Image
1. Generate QR code at: https://www.qr-code-generator.com/
2. Enter UPI link: `upi://pay?pa=taherroshan4-1@okicici&pn=Zenith2026&am=500&cu=INR`
3. Download QR code image
4. Place in `frontend/public/img/payment-qr.png`
5. Replace placeholder:
```javascript
<img src="/img/payment-qr.png" alt="Payment QR Code" className="w-48 h-48" />
```

---

## 🔒 Security Notes

### Current Implementation:
- ✅ File type validation (JPG, PNG, PDF only)
- ✅ File size limit (5MB max)
- ✅ Unique filename generation (prevents overwriting)
- ✅ Documents required before submission

### Recommended Enhancements:
- [ ] Scan uploaded files for malware
- [ ] Compress images to reduce storage
- [ ] Use cloud storage (AWS S3, Cloudinary) for production
- [ ] Add admin UI to view/download documents
- [ ] Implement document verification workflow

---

## 📁 File Structure

```
backend/
├── uploads/                          # Auto-created, gitignored
│   ├── permission-1234567890.pdf
│   ├── receipt-1234567890.jpg
│   └── id-1234567890.png
├── middleware/
│   └── upload.middleware.js          # NEW - Multer config
├── models/
│   └── Registration.js               # UPDATED - Added documents field
├── controllers/
│   └── registration.controller.js    # UPDATED - Handle file uploads
├── routes/
│   └── registration.routes.js        # UPDATED - Added middleware
└── server.js                         # UPDATED - Serve static files

frontend/src/pages/
├── SportEventForm.jsx                # UPDATED - isPublished default true
└── UniversalRegistration.jsx         # UPDATED - Payment + Documents
```

---

## 🚨 Important Notes

### For Admins:
- **Always check BOTH checkboxes** when creating events (now defaults to true)
- Events need to be both "Active" AND "Published" to show up
- The warning banner at the top reminds you!

### For Students:
- All three documents are **mandatory**
- Max file size: 5MB each
- Only JPG, PNG, PDF accepted
- Make sure payment screenshot is clear and shows transaction details

### For Developers:
- Run `npm install multer` in backend before testing
- Create `uploads/` directory will be auto-created
- UPI QR code is currently a placeholder - implement using one of the methods above
- Consider using cloud storage for production (AWS S3, Cloudinary)

---

## 🎬 Next Steps

1. ✅ Install multer: `cd backend && npm install multer`
2. ✅ Create a test event with both checkboxes checked
3. ✅ Test registration with document uploads
4. 🔲 Implement actual QR code (see QR Code section above)
5. 🔲 Add admin UI to view uploaded documents
6. 🔲 Set up cloud storage for production
7. 🔲 Add document verification workflow (approve/reject)

---

## 📸 Screenshot Reference

Based on your screenshots:
- ✅ **Screenshot 1:** Sports now show as "✅ Open" when isPublished=true
- ✅ **Screenshot 2:** Payment QR section implemented with UPI ID
- ✅ **Screenshot 3:** Document upload section with 3 file inputs

---

## 🆘 Troubleshooting

### Events still showing as "Closed"?
1. Check if event has `isPublished: true` in database
2. Check if event has `isActive: true`
3. Check if registration deadline hasn't passed (Feb 20, 2026)
4. Open browser console and check `/api/events/public` response

### File upload not working?
1. Verify multer is installed: `npm list multer`
2. Check `uploads/` directory exists (auto-created)
3. Check file size < 5MB
4. Check file type is JPG/PNG/PDF
5. Check browser console for errors

### Documents not saving?
1. Check `Registration.documents` field in MongoDB
2. Check `backend/uploads/` directory has files
3. Check server console for multer errors
4. Verify middleware order in routes file

---

## 📞 Support

If you encounter issues:
1. Check browser console for frontend errors
2. Check server console for backend errors
3. Verify all npm packages are installed
4. Ensure MongoDB is running
5. Check file permissions on `uploads/` directory

---

**Status:** ✅ All features implemented and ready for testing!

**Last Updated:** $(date)
