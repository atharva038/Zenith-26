# Quick Upload Guide for New Backup QR Codes

## 🚀 Step-by-Step Instructions

### Step 1: Prepare the Images

#### Balaji PhonePe QR Code:
1. Take a clear screenshot or save the PhonePe QR image
2. Save it to your **Downloads** folder
3. Name it: `balaji-phonepe-qr.jpg` (or `.png`)

#### Bank of Baroda QR Code:
1. Get the Bank of Baroda QR code image
2. Save it to your **Downloads** folder
3. Name it: `bank-of-baroda-qr.jpg` (or `.png`)

---

### Step 2: Update the Script (if needed)

If you named the files differently, update the script:

```bash
# Edit this file:
backend/scripts/uploadNewBackupQRs.js

# Change these lines if needed:
const qrPath = path.join(downloadsPath, "balaji-phonepe-qr.jpg");
const qrPath = path.join(downloadsPath, "bank-of-baroda-qr.jpg");
```

---

### Step 3: Run the Upload Script

Open terminal and run:

```bash
cd backend

# Upload Balaji PhonePe QR only:
node scripts/uploadNewBackupQRs.js balaji

# OR upload Bank of Baroda QR only:
node scripts/uploadNewBackupQRs.js baroda

# OR upload both at once:
node scripts/uploadNewBackupQRs.js both
```

---

### Step 4: Copy the Cloudinary URLs

After successful upload, you'll see output like:

```
✅ Balaji PhonePe QR code uploaded!
📸 URL: https://res.cloudinary.com/dvmsho3pj/image/upload/v1737177600/...
```

**Copy these URLs!**

---

### Step 5: Update the Code (Already Done!)

The URLs are already added to the code:
- ✅ AdminOnSpotRegistration.jsx
- ✅ MarathonRegistration.jsx
- ✅ WomenTournamentPage.jsx

**BUT**: If Cloudinary generates different URLs, update them in these files.

---

### Step 6: Verify Bank of Baroda UPI ID

Current placeholder: `atharva.baroda@barodapay`

**Update this in 3 files with the correct UPI ID:**

```javascript
// In all 3 files, find and update:
{
  name: "Bank of Baroda",
  upi: "YOUR-ACTUAL-UPI@barodapay", // ← Update this!
  url: "...",
}
```

---

## 🎨 Alternative: Manual Cloudinary Upload

If the script doesn't work, upload manually:

### Via Cloudinary Dashboard:

1. Go to: https://cloudinary.com/console
2. Login with your account
3. Click **Media Library**
4. Click **Upload**
5. Select both QR images
6. Upload to folder: `zenith-26/img/payment/`
7. Rename files:
   - `backup-qr-balaji-phonepe`
   - `backup-qr-bank-of-baroda`
8. Copy the secure URLs
9. Update the code with new URLs

---

## 🧪 Testing After Upload

### Test 1: Admin On-Spot Registration
1. Go to: `/admin/onspot-registration`
2. Create a test registration
3. In payment section, click "Show Backup QR"
4. Verify order:
   - 1st: Balaji PhonePe ✅
   - 2nd: Bank of Baroda ✅
   - 3rd: Axis Bank ✅
   - ICICI should NOT appear ❌

### Test 2: Marathon Registration
1. Go to: `/marathon-registration`
2. Fill form to payment step
3. Check backup QR dropdown
4. Verify same order as above

### Test 3: Women's Tournament
1. Go to: `/women-tournament`
2. Fill form to payment step
3. Check backup QR options
4. Verify same order as above

---

## 🐛 Troubleshooting

### Issue: "File not found"
**Solution:**
- Check file is in Downloads folder
- Check filename matches script
- Use full path if needed

### Issue: "Cloudinary upload failed"
**Solution:**
- Check `.env` has correct Cloudinary credentials
- Check internet connection
- Try manual upload via dashboard

### Issue: QR codes don't display
**Solution:**
- Check browser console for errors
- Verify Cloudinary URLs are correct
- Check image file size (should be < 5MB)

### Issue: Wrong UPI ID for Bank of Baroda
**Solution:**
1. Find the correct UPI ID from the QR code
2. Update in all 3 files
3. Search for: `atharva.baroda@barodapay`
4. Replace with correct UPI

---

## 📝 Quick Checklist

Before going live:

- [ ] Balaji PhonePe QR uploaded to Cloudinary
- [ ] Bank of Baroda QR uploaded to Cloudinary
- [ ] Correct UPI ID for Bank of Baroda
- [ ] All 3 files updated with correct URLs
- [ ] Tested on Admin On-Spot Registration
- [ ] Tested on Marathon Registration
- [ ] Tested on Women's Tournament
- [ ] ICICI QR NOT visible in any backup list
- [ ] QR codes scan successfully with phone
- [ ] Payment flows work end-to-end

---

## 🚨 Important Notes

1. **Keep ICICI Commented:**
   - Don't delete the commented code
   - Easy to restore if needed later

2. **Test with Real Phone:**
   - Scan QR codes with actual PhonePe/UPI app
   - Verify correct merchant names appear
   - Verify correct amounts (if pre-filled)

3. **Backup Original Files:**
   - Keep a backup of old QR URLs
   - In case rollback is needed

---

## 🎉 Expected Result

After completing all steps:

```
Primary Payment: Sagar Ubale (SBI)
↓
If primary fails:
↓
Backup Options:
1. 🥇 Balaji Anil Kalyankar (PhonePe)
2. 🥈 Bank of Baroda
3. 🥉 Axis Bank - Atharva Joshi

❌ ICICI - Hidden (commented out)
```

---

**Estimated Time:** 10-15 minutes  
**Difficulty:** Easy  
**Status:** Ready to upload images
