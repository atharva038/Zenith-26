# Cricket Separate Toggle Implementation

## Overview
Implemented separate registration toggles for **Cricket** and **Other Sports**, with smart visibility logic based on toggle states.

## Changes Made

### 1. Backend Updates

#### Settings Model (`backend/models/Settings.js`)
- ✅ Added `isCricketRegistrationOpen` field (Boolean, default: false)
- ✅ Added `isOtherSportsRegistrationOpen` field (Boolean, default: false)
- ✅ Added `paymentQrUrl` field (String) - stores Cloudinary QR code URL
- ✅ Kept `isRegistrationOpen` for backward compatibility (legacy field)

#### Settings Controller (`backend/controllers/settings.controller.js`)
- ✅ Added `toggleCricketRegistration()` - POST endpoint to toggle Cricket registration
- ✅ Added `toggleOtherSportsRegistration()` - POST endpoint to toggle Other Sports registration
- ✅ Updated `checkRegistrationStatus()` to return all toggle states:
  - `isCricketOpen`
  - `isOtherSportsOpen`
  - `paymentQrUrl`
  - `isOpen` (legacy)

#### Settings Routes (`backend/routes/settings.routes.js`)
- ✅ Added `/settings/toggle-cricket` endpoint (POST, Admin only)
- ✅ Added `/settings/toggle-other-sports` endpoint (POST, Admin only)
- ✅ Kept `/settings/toggle` as legacy endpoint

#### Environment Variables (`backend/.env`)
- ✅ Added `MAIN_ZENITH_QR_URL` with Cloudinary URL
```
MAIN_ZENITH_QR_URL=https://res.cloudinary.com/dvmsho3pj/image/upload/v1770650996/zenith-2026/payment-qr/main-zenith-qr.png
```

### 2. Frontend Updates

#### Registration Status Hook (`frontend/src/hooks/useRegistrationStatus.js`)
- ✅ Updated to return separate toggle states:
  - `isCricketOpen`
  - `isOtherSportsOpen`
  - `paymentQrUrl`
  - `isOpen` (legacy)
- ✅ Added console logging for debugging

#### Developer Portal (`frontend/src/pages/dev/DevRegistrationControl.jsx`)
- ✅ Replaced single toggle with **TWO separate toggles**:
  - 🏏 **Cricket Registration Toggle**
  - ⚽ **Other Sports Registration Toggle**
- ✅ Each toggle has its own visual status indicator
- ✅ Added handlers:
  - `handleToggleCricket()`
  - `handleToggleOtherSports()`

#### GameVerse Page (`frontend/src/pages/GameVerse.jsx`)
- ✅ Added `availableSports` computed from toggle states
- ✅ Implemented smart visibility logic:
  - **Both OFF** → Show "Coming Soon" overlay (no sports visible)
  - **Cricket ON, Others OFF** → Show only Cricket
  - **Cricket OFF, Others ON** → Show all sports except Cricket
  - **Both ON** → Show all sports
- ✅ Updated Scene component to accept `availableSports` prop
- ✅ Updated registration check to be sport-specific:
  ```javascript
  const isCricket = sport.name === "CRICKET";
  const isRegistrationOpen = isCricket ? isCricketOpen : isOtherSportsOpen;
  ```
- ✅ Added global "Coming Soon" overlay when both toggles are off
- ✅ Updated SportModal to show correct registration status per sport

## User Experience Flow

### Scenario 1: Both Toggles OFF
- ✅ User sees "Coming Soon" overlay on GameVerse
- ✅ No sports planets are visible
- ✅ Message: "Sports registrations will open soon!"

### Scenario 2: Cricket ON, Others OFF
- ✅ User sees only Cricket planet
- ✅ Clicking Cricket shows registration button
- ✅ Other sports are hidden

### Scenario 3: Cricket OFF, Others ON
- ✅ User sees all sports except Cricket
- ✅ Cricket planet is hidden
- ✅ Other sports show registration buttons

### Scenario 4: Both ON
- ✅ User sees all sports planets
- ✅ All sports show registration buttons
- ✅ Full sports selection available

## Admin Control

### How to Enable Cricket Registration
1. Login as admin
2. Navigate to `/dev` (Developer Portal)
3. Click "Registration Control"
4. Toggle **🏏 Cricket Registration** to ON (green)
5. Cricket registration is now live!

### How to Enable Other Sports
1. Same steps as above
2. Toggle **⚽ Other Sports Registration** to ON (green)
3. All other sports registrations are now live!

## API Endpoints

### Public Endpoint
```
GET /settings/status
Response:
{
  "success": true,
  "isCricketOpen": false,
  "isOtherSportsOpen": false,
  "isOpen": false,  // legacy
  "paymentQrUrl": "https://...",
  "message": "Registrations will open soon. Stay tuned!",
  "startDate": null,
  "endDate": null
}
```

### Admin Endpoints (Require Auth)
```
POST /settings/toggle-cricket
POST /settings/toggle-other-sports
POST /settings/toggle  // legacy endpoint
```

## Database Schema

```javascript
{
  isCricketRegistrationOpen: Boolean,     // NEW
  isOtherSportsRegistrationOpen: Boolean, // NEW
  paymentQrUrl: String,                   // NEW (Cloudinary URL)
  isRegistrationOpen: Boolean,            // LEGACY (kept for compatibility)
  registrationMessage: String,
  registrationStartDate: Date,
  registrationEndDate: Date,
  lastModifiedBy: ObjectId (Admin),
  timestamps: true
}
```

## Testing Checklist

- [ ] Turn both toggles OFF → See coming soon overlay
- [ ] Turn Cricket ON only → See only Cricket planet
- [ ] Turn Other Sports ON only → See all sports except Cricket
- [ ] Turn both ON → See all sports
- [ ] Click Cricket when toggle is OFF → Coming soon message
- [ ] Click Cricket when toggle is ON → Registration form opens
- [ ] Click Football when toggle is OFF → Coming soon message
- [ ] Click Football when toggle is ON → Registration form opens

## Next Steps

1. ✅ Upload mainQR.png to Cloudinary (DONE)
2. ✅ Add Cloudinary URL to .env (DONE)
3. ✅ Create separate toggles in Dev Portal (DONE)
4. ✅ Implement smart visibility logic (DONE)
5. 🔜 Test all scenarios
6. 🔜 Enable Cricket toggle when ready to launch
7. 🔜 Monitor registrations

## Notes

- Payment QR code is now served from Cloudinary (faster, CDN-backed)
- Legacy `isRegistrationOpen` field kept for backward compatibility
- All changes are backward compatible
- Sports list dynamically updates based on toggle states
- No page refresh needed when toggles change (real-time via API calls)

## Cloudinary QR Code

**URL:** `https://res.cloudinary.com/dvmsho3pj/image/upload/v1770650996/zenith-2026/payment-qr/main-zenith-qr.png`

**Folder:** `zenith-2026/payment-qr/`  
**Public ID:** `main-zenith-qr`  
**Size:** 44.91 KB  
**Dimensions:** 576 x 800 px

---

**Implementation Date:** February 9, 2026  
**Status:** ✅ Complete and Ready for Testing
