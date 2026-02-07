# 🔍 Registration Toggle Debugging Guide

## Issue: Registration still works when toggle is OFF

### Step-by-Step Debugging

#### 1. Check Browser Console
Open browser console (F12) when visiting `/register-sports` page.

Look for these logs:
```
📋 Registration Status Response: { success: true, isOpen: false, ... }
✅ Registration Status Set: { isOpen: false, message: "..." }
🎛️ ModernRegistration - Status: { isOpen: false, loading: false }
🔒 Registration is CLOSED - Showing RegistrationClosed component
```

**If you see `isOpen: true`** → The database has toggle ON
**If you see `isOpen: false` but form still shows** → Frontend issue

---

#### 2. Check Backend Console
Look for backend logs when page loads:

```
📋 Registration Status Check: { isOpen: false, message: "..." }
```

**If not appearing** → Route not configured correctly
**If showing isOpen: true** → Database has toggle ON

---

#### 3. Test API Directly

**Option A: Using curl**
```bash
curl http://localhost:5000/api/settings/status
```

**Expected Response when CLOSED:**
```json
{
  "success": true,
  "isOpen": false,
  "message": "Registrations will open soon. Stay tuned!"
}
```

**Option B: Using browser**
Visit: `http://localhost:5000/api/settings/status`

---

#### 4. Check Database

**Option A: Using MongoDB Compass**
1. Connect to your database
2. Find collection: `settings`
3. Check document field: `isRegistrationOpen`

**Option B: Using MongoDB shell**
```javascript
use zenith26
db.settings.find().pretty()
```

Look for:
```json
{
  "isRegistrationOpen": false,  // Should be false
  "registrationMessage": "...",
  ...
}
```

---

#### 5. Force Reset Settings

If settings don't exist or are corrupted, reset them:

**MongoDB Shell:**
```javascript
use zenith26

// Delete old settings
db.settings.deleteMany({})

// Create new with toggle OFF
db.settings.insertOne({
  isRegistrationOpen: false,
  registrationMessage: "Registrations will open soon. Stay tuned!",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

#### 6. Test Registration Endpoint

Try to register when toggle is OFF:

```bash
curl -X POST http://localhost:5000/api/registrations/sports \
  -H "Content-Type: application/json" \
  -d '{"eventId":"test","formData":{"captain_name":"Test"}}'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Registrations are currently closed",
  "isRegistrationClosed": true
}
```

**Status Code:** 403 (Forbidden)

---

#### 7. Check Admin Panel

1. Login to admin panel
2. Go to "Registration Control" (🎛️)
3. Check toggle switch state:
   - **RED with "OFF"** → Registrations should be closed ✅
   - **GREEN with "ON"** → Registrations are open 🟢

---

## Common Issues & Solutions

### Issue 1: Toggle shows OFF but registrations work
**Cause:** Frontend not checking status properly
**Solution:**
1. Hard refresh browser (Cmd+Shift+R)
2. Clear browser cache
3. Check console for errors

### Issue 2: Toggle shows ON but you set it to OFF
**Cause:** Settings not saving to database
**Solution:**
1. Check MongoDB connection
2. Check admin token is valid
3. Look for errors in backend console

### Issue 3: API returns 404
**Cause:** Routes not registered
**Solution:**
1. Check `backend/server.js` has: `app.use("/api/settings", settingsRoutes)`
2. Restart backend server
3. Check route file exists: `backend/routes/settings.routes.js`

### Issue 4: RegistrationClosed page not showing
**Cause:** Component import issue
**Solution:**
1. Check import in ModernRegistration: `import RegistrationClosed from "../components/RegistrationClosed"`
2. Check file exists: `frontend/src/components/RegistrationClosed.jsx`
3. Check hook is imported: `import { useRegistrationStatus } from "../hooks/useRegistrationStatus"`

---

## Quick Diagnostic Commands

### Test Everything at Once
```bash
# Run the test script
./test-registration-toggle.sh
```

### Check if backend is running
```bash
curl http://localhost:5000/api/health
```

### Check settings route specifically
```bash
curl http://localhost:5000/api/settings/status | jq
```

### Watch backend logs
```bash
# In backend directory
npm run dev
# Look for: "📋 Registration Status Check: ..."
```

---

## Expected Flow

### When Toggle is OFF (Closed)
1. User visits `/register-sports`
2. Frontend calls `GET /api/settings/status`
3. Backend returns `{ isOpen: false }`
4. Frontend shows `<RegistrationClosed />` component
5. User sees "Coming Soon" page

### When Toggle is ON (Open)
1. User visits `/register-sports`
2. Frontend calls `GET /api/settings/status`
3. Backend returns `{ isOpen: true }`
4. Frontend shows registration form
5. User can submit registration
6. Backend allows `POST /api/registrations/sports`

---

## Manual Verification Checklist

- [ ] Backend server is running (port 5000)
- [ ] Frontend server is running (port 5173)
- [ ] MongoDB is connected
- [ ] Settings route exists in backend
- [ ] Settings document exists in database
- [ ] Admin can access settings page
- [ ] Toggle switch works in admin panel
- [ ] Browser console shows correct logs
- [ ] API returns correct status
- [ ] Registration form hides when OFF
- [ ] "Coming Soon" page shows when OFF

---

## Still Not Working?

1. **Stop both servers**
2. **Clear MongoDB settings:**
   ```javascript
   use zenith26
   db.settings.deleteMany({})
   ```
3. **Restart backend** - Settings will auto-create with toggle OFF
4. **Hard refresh frontend** (Cmd+Shift+R)
5. **Visit `/register-sports`** - Should see "Coming Soon"
6. **Login to admin** → Toggle ON
7. **Refresh frontend** → Should see registration form

---

## Contact Points

If still facing issues, provide these details:
- Browser console logs (F12)
- Backend console logs
- Database settings document
- Screenshots of admin panel
- API response from `/api/settings/status`
