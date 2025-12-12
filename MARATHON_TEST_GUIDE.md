# Marathon Registration - Testing Guide

## 🧪 Test Data for Marathon Registration

This guide provides sample data for testing the Marathon registration feature before deploying with real payment details.

---

## Quick Test Method

### Option 1: Use "Fill Test Data" Button (Easiest)
1. Go to Marathon Registration page (`/marathon`)
2. Click the **"🧪 Fill Test Data (For Testing)"** button at the top of the form
3. All fields will be auto-filled including payment details
4. Click **"🏃 Register for Marathon"** to submit

---

## Sample Test Data (Manual Entry)

### Personal Information
- **Full Name:** Rahul Sharma
- **Email:** rahul.sharma@example.com
- **Phone:** 9876543210
- **Age:** 25
- **Gender:** Male
- **College:** SGGSIE&T, Nanded

### Marathon Details
- **Category:** 10K Run
- **T-Shirt Size:** L

### Emergency Contact
- **Contact Name:** Priya Sharma
- **Contact Phone:** 9123456789

### Medical Information (Optional)
- **Medical Conditions:** No medical conditions

### Payment Details
- **Transaction ID:** TEST12345678AB
- **Amount:** ₹500 (auto-filled)
- **Payment Confirmation:** ✅ Check the box

---

## Sample Transaction IDs for Testing

You can use any of these sample transaction IDs:
```
TEST12345678AB
TEST98765432CD
TEST11223344EF
TEST55667788GH
TEST99887766IJ
SAMPLE1234567890
UPI202412091234567
```

---

## Current Test Configuration

### Sample QR Code
- A sample SVG QR code is displayed in the payment section
- This is for visual purposes only during testing
- **Replace with real QR code before production**

### Sample UPI ID
- Current: `zenith2026@upi` (Sample for testing)
- **Replace with your actual UPI ID before production**

---

## Admin Panel - Verifying Test Payments

### Login to Admin Panel
1. Go to `/admin/login`
2. **Email:** zenith_admin@zenith2026.com
3. **Password:** Zenith@2026

### View Marathon Registrations
1. Navigate to **Marathon** section from sidebar
2. You'll see all registrations with:
   - Registration Number (e.g., MAR20260001)
   - Payment Status (Pending/Verified/Failed)
   - Registration Status (Pending/Confirmed/Cancelled)

### Verify Payment
1. Click **"👁️ View"** button on any registration
2. View full details including:
   - All personal information
   - Marathon details
   - Emergency contact
   - Medical information
   - **Payment Information** section showing:
     - Transaction ID
     - Amount Paid (₹500)
     - Payment Date
     - Payment Status
3. Click **"✅ Verify Payment & Confirm"** to approve
4. Or click **"❌ Reject Registration"** if payment is invalid

---

## Testing Workflow

### Complete Test Flow
1. **User Registration:**
   ```
   Fill Form → Use Test Data → Enter Transaction ID → Submit
   ```

2. **Admin Verification:**
   ```
   Login to Admin → Navigate to Marathon → View Details → Verify Payment → Confirm
   ```

3. **Expected Results:**
   - User receives registration number (e.g., MAR20260001)
   - Registration appears in admin panel with "Pending" status
   - Payment shows as "Pending" verification
   - Admin can see transaction ID: TEST12345678AB
   - Admin confirms → Status changes to "Confirmed"
   - Payment status changes to "Verified"

---

## Before Production Deployment

### ⚠️ Important: Replace Before Going Live

1. **Replace Sample QR Code**
   - File: `frontend/src/pages/MarathonRegistration.jsx`
   - Replace the SVG QR code with real payment QR code
   - You can use a QR code generator service or payment gateway

2. **Update UPI ID**
   - File: `frontend/src/pages/MarathonRegistration.jsx`
   - Line: `zenith2026@upi` (Sample for testing)
   - Replace with your actual UPI ID

3. **Remove Test Data Button**
   - File: `frontend/src/pages/MarathonRegistration.jsx`
   - Remove or comment out the "Fill Test Data" button
   - Or hide it based on environment variable

4. **Update Amount** (if different)
   - Currently set to ₹500
   - Update in both frontend and backend if needed

---

## Multiple Test Registrations

You can test with different users:

### Test User 1
- Name: Rahul Sharma
- Email: rahul.sharma@example.com
- Phone: 9876543210
- Transaction ID: TEST12345678AB

### Test User 2
- Name: Priya Patel
- Email: priya.patel@example.com
- Phone: 9123456789
- Transaction ID: TEST98765432CD

### Test User 3
- Name: Amit Kumar
- Email: amit.kumar@example.com
- Phone: 9988776655
- Transaction ID: TEST11223344EF

---

## Notes

- All test transaction IDs start with "TEST" for easy identification
- Admin can filter registrations by status (Pending/Confirmed/Cancelled)
- Admin can export all registrations to CSV
- Payment verification is manual - admin checks transaction ID and confirms
- Real payment gateway integration can be added later if needed

---

## Need Help?

If you encounter any issues during testing:
1. Check browser console for errors
2. Verify backend server is running on port 5000
3. Verify frontend is running on port 5173
4. Check MongoDB connection
5. Ensure admin user is created with correct credentials

---

**Happy Testing! 🏃‍♂️💰✅**
