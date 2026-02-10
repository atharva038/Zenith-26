# Main Payment QR Code Update

## Overview
Updated the registration form to use the correct main payment QR code for Pramila Patil instead of the previous QR code.

## Changes Made

### 1. Uploaded New QR to Cloudinary ☁️
**File:** `frontend/public/img/mainQR.png` → Cloudinary

**Cloudinary Details:**
- **Public ID:** `zenith-2026/payment-qr/main-payment-qr`
- **URL:** `https://res.cloudinary.com/dvmsho3pj/image/upload/v1770705868/zenith-2026/payment-qr/main-payment-qr.png`
- **Dimensions:** 921x1280px
- **Size:** 96.43 KB (compressed from 224.88 KB)
- **Format:** PNG
- **Quality:** Auto-optimized

### 2. Updated Registration Form QR Code
**File:** `frontend/src/pages/UniversalRegistration.jsx`

**Before:**
```javascript
const PAYMENT_QR_URL =
  "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto:best/v1767592627/zenith-26/img/payment/payment-qr-sagar-ubale";
```

**After:**
```javascript
// Payment QR Code - Main Zenith QR (Pramila Patil)
const PAYMENT_QR_URL =
  "https://res.cloudinary.com/dvmsho3pj/image/upload/v1770705868/zenith-2026/payment-qr/main-payment-qr.png";
```

### 3. Updated UPI Information Display
**File:** `frontend/src/pages/UniversalRegistration.jsx`

**Before:**
```jsx
<p className="text-sm text-gray-400">UPI ID: sagarubale2004@oksbi</p>
```

**After:**
```jsx
<div className="space-y-1">
  <p className="text-sm font-semibold text-[#ffb77a]">Pramila Patil</p>
  <p className="text-sm text-gray-400">UPI ID: pra.pra.patil1@oksbi</p>
</div>
```

### 4. Updated Environment Variable
**File:** `backend/.env`

**Before:**
```env
MAIN_ZENITH_QR_URL=https://res.cloudinary.com/dvmsho3pj/image/upload/v1770650996/zenith-2026/payment-qr/main-zenith-qr.png
```

**After:**
```env
# Payment QR Code (Cloudinary) - Main Payment QR (Pramila Patil)
MAIN_ZENITH_QR_URL=https://res.cloudinary.com/dvmsho3pj/image/upload/v1770705868/zenith-2026/payment-qr/main-payment-qr.png
```

### 5. Created Upload Script
**File:** `backend/scripts/uploadMainPaymentQR.js`

A reusable script to upload payment QR codes to Cloudinary with proper configuration.

## Payment QR Details

### Primary Payment Method
- **Name:** Pramila Patil
- **UPI ID:** `pra.pra.patil1@oksbi`
- **QR Code:** Google Pay QR
- **Location:** Displayed prominently in Step 4 (Payment & Documents)

### Backup Payment Methods (Unchanged)
1. **Balaji Anil Kalyankar**
   - UPI: `balajianil.kalyankar@ybl`
   - PhonePe QR
   
2. **Atharva Joshi**
   - UPI: `atharvsjoshi2005-1@okicici`
   - Bank of Baroda QR

## Visual Changes

### Registration Form - Step 4
```
┌─────────────────────────────────┐
│       Scan to Pay               │
│  ┌───────────────────────┐      │
│  │                       │      │
│  │    [QR CODE IMAGE]    │      │
│  │   (Pramila Patil)     │      │
│  │                       │      │
│  └───────────────────────┘      │
│      Pramila Patil              │
│  UPI ID: pra.pra.patil1@oksbi   │
│                                 │
│  [Show Alternative Methods]     │
└─────────────────────────────────┘
```

## Benefits

✅ **Correct QR Code** - Now shows the official Zenith 2026 payment QR  
✅ **Better Display** - Name and UPI ID clearly visible  
✅ **Cloudinary Hosted** - Fast, optimized, and reliable CDN  
✅ **Auto-Optimized** - Cloudinary compresses without quality loss  
✅ **Backup Options** - Alternative payment methods still available  

## Testing Steps

1. Navigate to `/register-sports`
2. Select any sport (e.g., Cricket)
3. Click "Fill Test Data" button
4. Proceed to Step 4 (Payment & Documents)
5. Verify QR code displays correctly
6. Check name shows: "Pramila Patil"
7. Check UPI ID shows: "pra.pra.patil1@oksbi"
8. Click "Show Alternative Payment Methods"
9. Verify backup QRs still work

## File Structure

```
backend/
  scripts/
    ✅ uploadMainPaymentQR.js    # New upload script
  .env                          # Updated with new URL

frontend/
  public/
    img/
      mainQR.png                # Source image (uploaded)
  src/
    pages/
      UniversalRegistration.jsx # Updated QR URL & display
```

## Script Usage

To re-upload the QR code in future:
```bash
cd backend
node scripts/uploadMainPaymentQR.js
```

The script will:
1. ✅ Find the mainQR.png file
2. ✅ Upload to Cloudinary
3. ✅ Compress and optimize
4. ✅ Print the new URL
5. ✅ Provide update instructions

## Important Notes

⚠️ **QR Code Verification**
- The QR code now points to: **Pramila Patil** (pra.pra.patil1@oksbi)
- Test the QR code with a UPI app before going live
- Ensure the account is active and can receive payments

⚠️ **Cache Considerations**
- Old QR may be cached in browsers
- Use hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- Or clear browser cache

⚠️ **Backup QRs**
- Keep backup payment options visible
- Provides redundancy if main QR has issues

## Rollback Plan

If you need to revert to the old QR:

1. Update `PAYMENT_QR_URL` in `UniversalRegistration.jsx`:
   ```javascript
   const PAYMENT_QR_URL = "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto:best/v1767592627/zenith-26/img/payment/payment-qr-sagar-ubale";
   ```

2. Update UPI display:
   ```jsx
   <p className="text-sm text-gray-400">UPI ID: sagarubale2004@oksbi</p>
   ```

## Success Indicators

✅ QR code displays in registration form  
✅ Shows "Pramila Patil" name  
✅ Shows correct UPI ID: `pra.pra.patil1@oksbi`  
✅ QR code is scannable with UPI apps  
✅ Backup QRs are accessible via toggle  
✅ No console errors in browser  

---

**Updated:** February 10, 2026  
**Status:** ✅ Implemented & Ready for Testing  
**QR Source:** `frontend/public/img/mainQR.png`  
**Cloudinary URL:** `https://res.cloudinary.com/dvmsho3pj/image/upload/v1770705868/zenith-2026/payment-qr/main-payment-qr.png`
