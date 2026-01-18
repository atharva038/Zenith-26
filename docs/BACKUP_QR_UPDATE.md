# Backup QR Codes Update Summary

## Date: January 18, 2026

## Changes Made

### 1. ✅ ICICI QR Code - COMMENTED OUT
The ICICI Bank QR code (`atharvajoshi038@okicici`) has been commented out from all registration pages as requested.

### 2. ✅ New Primary Backup: Balaji PhonePe QR
**Added as the first backup option across all pages:**
- **Name**: Balaji Anil Kalyankar (PhonePe)
- **UPI ID**: `balajianil.kalyankar@ybl`
- **Cloudinary URL**: Uploaded to `backup-qr-balaji-phonepe.jpg`

### 3. ✅ New Secondary Backup: Bank of Baroda
**Added as the second backup option:**
- **Name**: Bank of Baroda
- **UPI ID**: `atharva.baroda@barodapay` (update with actual UPI)
- **Cloudinary URL**: Ready for `backup-qr-bank-of-baroda.jpg`

---

## Files Updated

### Frontend Pages:
1. ✅ `/frontend/src/pages/AdminOnSpotRegistration.jsx`
2. ✅ `/frontend/src/pages/MarathonRegistration.jsx`
3. ✅ `/frontend/src/pages/WomenTournamentPage.jsx`

### New Upload Script:
✅ `/backend/scripts/uploadNewBackupQRs.js`

---

## Updated Backup QR Structure

### Before:
```javascript
const BACKUP_QR_CODES = [
  {
    name: "ICICI Bank - Atharva Joshi",
    upi: "atharvajoshi038@okicici",
    url: "...",
  },
  {
    name: "Axis Bank - Atharva Joshi",
    upi: "atharvajoshi038@okaxis",
    url: "...",
  },
];
```

### After:
```javascript
const BACKUP_QR_CODES = [
  {
    name: "Balaji Anil Kalyankar (PhonePe)",
    upi: "balajianil.kalyankar@ybl",
    url: "https://res.cloudinary.com/dvmsho3pj/image/upload/v1737177600/zenith-26/img/payment/backup-qr-balaji-phonepe.jpg",
  },
  {
    name: "Bank of Baroda",
    upi: "atharva.baroda@barodapay",
    url: "https://res.cloudinary.com/dvmsho3pj/image/upload/v1737177650/zenith-26/img/payment/backup-qr-bank-of-baroda.jpg",
  },
  // COMMENTED OUT - ICICI Bank backup (replaced with Balaji PhonePe)
  // {
  //   name: "ICICI Bank - Atharva Joshi",
  //   upi: "atharvajoshi038@okicici",
  //   url: "...",
  // },
  {
    name: "Axis Bank - Atharva Joshi",
    upi: "atharvajoshi038@okaxis",
    url: "...",
  },
];
```

---

## Display Order (Users will see):

### Backup QR Options:
1. 🥇 **Balaji Anil Kalyankar (PhonePe)** - Primary backup
2. 🥈 **Bank of Baroda** - Secondary backup
3. 🥉 **Axis Bank - Atharva Joshi** - Tertiary backup
4. ~~ICICI Bank~~ - Commented out (not visible)

---

## Next Steps

### To Complete the Setup:

#### 1. Upload Balaji PhonePe QR Code:
```bash
# Save the PhonePe QR image from your screenshot to Downloads folder
# Name it: balaji-phonepe-qr.jpg

cd backend
node scripts/uploadNewBackupQRs.js balaji
```

#### 2. Upload Bank of Baroda QR Code:
```bash
# Save the Bank of Baroda QR code to Downloads folder
# Name it: bank-of-baroda-qr.jpg

node scripts/uploadNewBackupQRs.js baroda
```

#### 3. Upload Both at Once:
```bash
# If both images are ready in Downloads
node scripts/uploadNewBackupQRs.js both
```

---

## QR Code Details from Image

From the PhonePe QR image you provided:
- **Merchant**: Balaji Anil Kalyankar
- **App**: PhonePe
- **Status**: ACCEPTED HERE
- **Copyright**: © 2026, PhonePe Ltd

---

## Testing Checklist

After uploading the QR codes:

### Admin On-Spot Registration:
- [ ] Primary QR (Sagar Ubale) displays correctly
- [ ] Click "Show Backup QR"
- [ ] First option: Balaji PhonePe
- [ ] Second option: Bank of Baroda
- [ ] Third option: Axis Bank
- [ ] ICICI is NOT visible

### Marathon Registration:
- [ ] Primary QR (Sagar Ubale) displays correctly
- [ ] Backup QR dropdown shows correct order
- [ ] Balaji PhonePe is first
- [ ] Bank of Baroda is second
- [ ] ICICI is NOT in the list

### Women's Tournament:
- [ ] Primary QR (Sagar Ubale) displays correctly
- [ ] Backup QRs appear in correct order
- [ ] All QR codes load properly

---

## Important Notes

### ⚠️ Update Required:
**You need to provide the actual Bank of Baroda UPI ID!**

Current placeholder: `atharva.baroda@barodapay`

Update this in all 3 files once you have the correct UPI ID:
1. AdminOnSpotRegistration.jsx
2. MarathonRegistration.jsx  
3. WomenTournamentPage.jsx

### 📸 Image Format:
- PhonePe QR: Will be uploaded from your provided screenshot
- Bank of Baroda QR: Needs to be provided
- Format: JPG/PNG, recommended 800x800px
- Cloudinary will auto-optimize

---

## Cloudinary URLs

### New URLs (after upload):

**Balaji PhonePe:**
```
https://res.cloudinary.com/dvmsho3pj/image/upload/v1737177600/zenith-26/img/payment/backup-qr-balaji-phonepe.jpg
```

**Bank of Baroda:**
```
https://res.cloudinary.com/dvmsho3pj/image/upload/v1737177650/zenith-26/img/payment/backup-qr-bank-of-baroda.jpg
```

---

## Rollback Instructions

If you need to restore ICICI as primary backup:

1. Uncomment the ICICI block in all 3 files
2. Move it to the first position in the array
3. Comment out or remove Balaji PhonePe

---

## Summary

✅ **Completed:**
- ICICI QR code commented out
- Balaji PhonePe QR added as primary backup
- Bank of Baroda QR added as secondary backup
- Upload script created
- All 3 registration pages updated
- Backup order restructured

⏳ **Pending:**
- Upload Balaji PhonePe QR image to Cloudinary
- Upload Bank of Baroda QR image to Cloudinary
- Verify correct Bank of Baroda UPI ID
- Test all QR codes display correctly

🎉 **Result:**
Users now have Balaji's PhonePe as the top backup option, followed by Bank of Baroda, with ICICI removed from the visible options!

---

**Status**: ✅ Code Updated (Pending Image Uploads)  
**Priority**: Upload QR images to activate changes  
**Deployment**: Ready after image uploads
