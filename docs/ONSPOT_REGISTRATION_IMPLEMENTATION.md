# On-Spot Registration Implementation

## Overview
Created an admin page for on-spot registration for the Women's Tournament with payment method selection (Cash or Online) and QR code display functionality.

## Features Implemented

### 1. Admin On-Spot Registration Page (`AdminOnSpotRegistration.jsx`)
- **Location**: `/frontend/src/pages/AdminOnSpotRegistration.jsx`
- **Route**: `/admin/onspot-registration`
- **Access**: Protected route (admin authentication required)

#### Key Features:
- ✅ Similar form structure to Women's Tournament registration
- ✅ **Theme-consistent UI** (Neon Blue/Cyan - matching admin theme, NO pink/purple)
- ✅ Payment method selection (Cash or Online)
- ✅ QR code display for online payments
  - Primary QR: Sagar Ubale (sagarubale2004@oksbi)
  - Backup QR codes: Atharva Joshi (ICICI and Axis Bank)
- ✅ **Camera Capture Feature** for payment screenshots
  - Direct camera access for on-spot photo capture
  - Automatic upload to Cloudinary
  - Fallback file upload option
- ✅ Payment screenshot upload for online payments
- ✅ Real-time total amount calculation based on selected sports
- ✅ **Grid Layout** for sport selection (NOT scrollable list)
  - 2-3 columns responsive grid
  - All sports visible at once
- ✅ Category-based sport selection:
  - Category 1: ₹49 unlimited pool
  - Category 2: ₹49 per game
  - Category 3: ₹199 per team
- ✅ Form validation and error handling
- ✅ Responsive design with admin theme gradient UI

### 2. Backend Updates

#### Model Changes (`WomenTournament.js`)
Added two new fields:
```javascript
paymentMethod: {
  type: String,
  enum: ["online", "cash", "not_specified"],
  default: "not_specified",
  trim: true,
},
isOnSpot: {
  type: Boolean,
  default: false,
}
```

#### Route Updates (`womenTournament.routes.js`)
- Modified `/register` endpoint to accept:
  - `paymentMethod` (online/cash)
  - `isOnSpot` (boolean flag)
- Maintains backward compatibility with existing registrations

### 3. Frontend Updates

#### App.jsx
- Added import for `AdminOnSpotRegistration`
- Added protected route: `/admin/onspot-registration`

#### AdminSidebar.jsx
- Added navigation menu item:
  - Label: "On-Spot Registration"
  - Icon: 📝
  - Path: `/admin/onspot-registration`

## Payment Flow

### Cash Payment
1. Admin selects "Cash Payment" option
2. No payment screenshot required
3. Registration submitted with `paymentMethod: "cash"`
4. Payment status: pending (to be verified later)

### Online Payment
1. Admin selects "Online Payment (UPI/QR)" option
2. QR codes are displayed:
   - Primary QR code (Sagar Ubale)
   - Backup QR codes (expandable section)
3. Participant scans and pays
4. Admin captures payment screenshot using:
   - **📷 Camera Capture** (Recommended for on-spot)
     - Click "Capture Payment Screenshot" button
     - Camera opens with live preview
     - Capture photo directly from device camera
     - Photo automatically uploaded to Cloudinary
   - **📁 File Upload** (Alternative)
     - Browse and select screenshot from device
     - Upload manually
5. Registration submitted with:
   - `paymentMethod: "online"`
   - `paymentScreenshot: [cloudinary_url]`

## Technical Details

### Payment QR Codes
```javascript
// Primary QR
const PAYMENT_QR_URL = "https://res.cloudinary.com/dvmsho3pj/image/upload/f_auto,q_auto:best/v1767592627/zenith-26/img/payment/payment-qr-sagar-ubale";

// Backup QR Codes
const BACKUP_QR_CODES = [
  {
    name: "ICICI Bank - Atharva Joshi",
    upi: "atharvajoshi038@okicici",
    url: "https://res.cloudinary.com/dvmsho3pj/..."
  },
  {
    name: "Axis Bank - Atharva Joshi",
    upi: "atharvajoshi038@okaxis",
    url: "https://res.cloudinary.com/dvmsho3pj/..."
  }
];
```

### Sports Categories
All sports from Women's Tournament are available:

**Category 1 (₹49 Unlimited Pool):**
- Sack Race
- 3 Leg Race
- Balloon Bursting
- Brick Race
- Nimbu Chamach
- Musical Chair

**Category 2 (₹49 Per Game):**
- Powerlifting
- Weightlifting
- Skipping Rope
- Badminton
- Chess
- Carrom

**Category 3 (₹199 Per Team):**
- Tug of War (8 members)
- Volleyball (6 members)
- Cricket (11 members)
- Basketball (5 members)
- Football (11 members)
- Box Cricket (6 members)

## Access Instructions

### For Admins:
1. Login to admin portal: `/admin/login`
2. Navigate to "On-Spot Registration" from sidebar
3. Fill participant details
4. Select category and sports
5. Choose payment method (Cash or Online)
6. If online: Show QR, wait for payment, upload screenshot
7. Submit registration

### Direct URL:
`https://[your-domain]/admin/onspot-registration`

## Security Features
- ✅ Protected route with admin authentication
- ✅ Form validation on frontend and backend
- ✅ Cloudinary secure upload for payment screenshots
- ✅ Email validation regex
- ✅ File type and size validation (10MB max)

## User Experience
- **Modern admin theme** with Neon Blue/Cyan gradients (matching Zenith 2026 admin portal)
- **Grid layout** for sport selection - all options visible, no scrolling needed
- Smooth animations with Framer Motion
- Real-time form feedback
- Loading states during submission
- Toast notifications for success/error
- Mobile-responsive design
- Collapsible backup QR section
- **Camera integration** for instant payment proof capture
  - Auto-detects back camera on mobile devices
  - Live camera preview
  - One-click photo capture
  - Automatic upload pipeline

## Future Enhancements (Optional)
- [ ] Add bulk registration feature
- [ ] QR scanner integration for instant payment verification
- [ ] Print receipt functionality
- [ ] SMS confirmation to participants
- [ ] Real-time registration dashboard updates
- [ ] Export registered participants list

## Testing Checklist
- [ ] Test cash payment flow
- [ ] Test online payment flow
- [ ] Test payment screenshot upload
- [ ] Test all three categories
- [ ] Test form validation
- [ ] Test mobile responsiveness
- [ ] Test with multiple sport selections
- [ ] Test category 3 team name requirement
- [ ] Test QR code backup toggle
- [ ] Test admin authentication

## Notes
- Registration data is stored in the same `WomenTournament` collection
- `isOnSpot: true` flag helps identify on-spot registrations
- Payment verification should be done by admin before confirming registration
- Email notifications are sent to participants (same as regular registration)

## Files Modified/Created

### Created:
- `/frontend/src/pages/AdminOnSpotRegistration.jsx`

### Modified:
- `/frontend/src/App.jsx` - Added route
- `/frontend/src/components/AdminSidebar.jsx` - Added menu item
- `/backend/models/WomenTournament.js` - Added fields
- `/backend/routes/womenTournament.routes.js` - Updated register endpoint

---

**Implementation Date**: January 8, 2026
**Version**: 1.0
**Status**: ✅ Complete
