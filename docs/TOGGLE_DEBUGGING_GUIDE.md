# Toggle Debugging Guide

## Status Check ✅

The toggles have been implemented and the database has been updated. Here's what we verified:

### Database Status
```
🏏 Cricket Registration: ✅ OPEN
⚽ Other Sports Registration: ❌ CLOSED
💳 Payment QR URL: ✅ Set
```

### API Endpoint Test
```bash
curl http://localhost:5000/api/settings/status
```

**Response:**
```json
{
  "success": true,
  "isCricketOpen": true,
  "isOtherSportsOpen": false,
  "isOpen": false,
  "message": "Registrations will open soon. Stay tuned!",
  "paymentQrUrl": "https://res.cloudinary.com/dvmsho3pj/image/upload/v1770650996/zenith-2026/payment-qr/main-zenith-qr.png"
}
```

## How to Test the Toggles

### 1. Open Developer Portal
1. Make sure you're logged in as admin
2. Navigate to `/dev` (Developer Portal)
3. Click on "Registration Control"

### 2. Check Console Logs
Open browser DevTools (F12) and check the Console tab. You should see:

**On Page Load:**
```
📥 Fetching settings...
✅ Settings response: {...}
🏏 Cricket Registration: true
⚽ Other Sports Registration: false
```

**When Clicking Cricket Toggle:**
```
🏏 Toggling Cricket registration...
✅ Cricket toggle response: {...}
🏏 New Cricket state: false  (or true)
```

**When Clicking Other Sports Toggle:**
```
⚽ Toggling Other Sports registration...
✅ Other Sports toggle response: {...}
⚽ New Other Sports state: true  (or false)
```

### 3. Visual Indicators

**Cricket Toggle:**
- ✅ **GREEN** = Cricket registration is OPEN
- ❌ **RED** = Cricket registration is CLOSED
- Status text: "🎉 Cricket Registration is OPEN" or "🔒 Cricket Registration is CLOSED"

**Other Sports Toggle:**
- ✅ **GREEN** = Other sports registration is OPEN
- ❌ **RED** = Other sports registration is CLOSED
- Status text: "🎉 Other Sports Registration is OPEN" or "🔒 Other Sports Registration is CLOSED"

### 4. Test GameVerse Visibility

Navigate to `/gameverse` and check which sports planets are visible:

| Cricket Toggle | Other Sports Toggle | Expected Result |
|----------------|---------------------|-----------------|
| ❌ OFF | ❌ OFF | "Coming Soon" overlay, NO sports visible |
| ✅ ON | ❌ OFF | Only Cricket planet visible |
| ❌ OFF | ✅ ON | All sports EXCEPT Cricket visible |
| ✅ ON | ✅ ON | ALL sports visible |

## Common Issues & Solutions

### Issue 1: Toggles not updating visually
**Solution:**
- Check browser console for errors
- Ensure you're logged in as admin
- Clear browser cache and reload
- Check network tab to see if API calls are succeeding

### Issue 2: GameVerse not showing correct sports
**Solution:**
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Check console logs for registration status
- Verify API response in Network tab

### Issue 3: "Failed to toggle registration" error
**Solution:**
- Check if you're logged in as admin
- Verify `adminToken` exists in localStorage:
  ```javascript
  localStorage.getItem('adminToken')
  ```
- Check backend server is running on port 5000

### Issue 4: Database not updated
**Solution:**
- Run migration script again:
  ```bash
  cd backend
  node scripts/migrateSettings.js
  ```

## Manual Database Check

If you need to manually check the database:

```bash
cd backend
node -e "
import('mongoose').then(async (m) => {
  await m.default.connect('YOUR_MONGODB_URI');
  const settings = await m.default.connection.db.collection('settings').findOne({});
  console.log('Cricket:', settings.isCricketRegistrationOpen);
  console.log('Other Sports:', settings.isOtherSportsRegistrationOpen);
  console.log('QR URL:', settings.paymentQrUrl);
  process.exit(0);
});
"
```

## Manual Toggle via Database

If toggles aren't working via UI, you can manually update:

```bash
cd backend
# Turn Cricket ON
node -e "import('mongoose').then(async (m) => { await m.default.connect('YOUR_MONGODB_URI'); await m.default.connection.db.collection('settings').updateOne({}, { \$set: { isCricketRegistrationOpen: true } }); console.log('✅ Cricket ON'); process.exit(0); });"

# Turn Other Sports ON
node -e "import('mongoose').then(async (m) => { await m.default.connect('YOUR_MONGODB_URI'); await m.default.connection.db.collection('settings').updateOne({}, { \$set: { isOtherSportsRegistrationOpen: true } }); console.log('✅ Other Sports ON'); process.exit(0); });"
```

## Expected Behavior Summary

✅ **Working Correctly:**
- Two separate toggle buttons in Developer Portal
- Each toggle has its own visual indicator (red/green)
- Success toast notification appears when toggled
- Settings state updates immediately
- Console logs show detailed debugging info
- GameVerse planets update based on toggle states

❌ **Not Working - Check:**
- Are you logged in as admin?
- Is backend server running?
- Are there any console errors?
- Is MongoDB connection working?
- Did migration script run successfully?

## Next Steps

1. Open `/dev/registration-control` in browser
2. Open DevTools Console (F12)
3. Try toggling Cricket - watch console logs
4. Try toggling Other Sports - watch console logs
5. Navigate to `/gameverse` - verify sport visibility
6. Toggle again and refresh GameVerse - verify changes

---

**All logs have been added to:**
- `DevRegistrationControl.jsx` - Toggle handlers
- `useRegistrationStatus.js` - Status fetching

**Check Console for detailed debugging information!** 🐛
