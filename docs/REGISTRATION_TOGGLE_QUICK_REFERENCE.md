# 🎛️ Registration Toggle - Quick Reference

## Admin Dashboard
Navigate to: `/admin/registration-settings`

### Toggle Switch
- **ON (Green)** 🟢 = Sports registration is OPEN
- **OFF (Red)** 🔴 = Sports registration is CLOSED

### Settings You Can Control:
1. **Registration Status** - ON/OFF toggle
2. **Coming Soon Message** - Custom message for users
3. **Start Date** - When registration opens (optional)
4. **End Date** - When registration closes (optional)

---

## API Quick Reference

### Check Status (Public - No Auth)
```bash
GET /api/settings/status
```
**Response:**
```json
{
  "success": true,
  "isOpen": false,
  "message": "Registrations will open soon. Stay tuned!",
  "startDate": "2026-02-15T00:00:00.000Z",
  "endDate": "2026-02-20T00:00:00.000Z"
}
```

### Get Settings (Admin Only)
```bash
GET /api/settings
Authorization: Bearer <admin-token>
```

### Update Settings (Admin Only)
```bash
PUT /api/settings
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "registrationMessage": "Registrations open on Feb 15!",
  "registrationStartDate": "2026-02-15",
  "registrationEndDate": "2026-02-20"
}
```

### Quick Toggle (Admin Only)
```bash
POST /api/settings/toggle
Authorization: Bearer <admin-token>
```
*Automatically flips the current status (ON → OFF or OFF → ON)*

---

## What's Affected vs Not Affected

### ✅ Controlled by Toggle:
- **Main Sports Registration** (`/register-sports`)
  - ModernRegistration page
  - All sports (Cricket, Football, Basketball, etc.)
  - API: `/api/registrations/sports`

### ❌ NOT Controlled by Toggle:
- **Marathon Registration** (`/marathon`)
  - Always works independently
  - API: `/api/marathon/register`

- **Women's Tournament** (`/women-tournament`)
  - Always works independently
  - API: `/api/women-tournament/register`

- **Register Page** (`/register`)
  - Landing page with links
  - Not affected

---

## User Experience

### When Registration is OPEN 🟢
1. User visits `/register-sports`
2. Sees full registration form
3. Can select sport and register
4. Form submission works

### When Registration is CLOSED 🔴
1. User visits `/register-sports`
2. Sees "Coming Soon" page with:
   - 🔒 Lock icon
   - Custom message from admin
   - Start/End dates (if set)
   - Links to explore other sections
3. Form submission blocked by backend

---

## Testing Commands

### Test Public Status Check
```bash
curl http://localhost:5000/api/settings/status
```

### Test Admin Toggle (requires token)
```bash
curl -X POST http://localhost:5000/api/settings/toggle \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Test Registration When Closed
```bash
curl -X POST http://localhost:5000/api/registrations/sports \
  -H "Content-Type: application/json" \
  -d '{"eventId":"...","formData":{...}}'
```
**Expected when closed:**
```json
{
  "success": false,
  "message": "Registrations are currently closed",
  "isRegistrationClosed": true
}
```

---

## Common Scenarios

### Scenario 1: Before Event Opens
```
Admin Action:
  - Toggle: OFF
  - Message: "Registrations open on Feb 15, 2026! Get ready!"
  - Start Date: 2026-02-15

User Sees:
  - Coming Soon page
  - Message and start date displayed
```

### Scenario 2: Registration Period
```
Admin Action:
  - Toggle: ON
  - (Message not needed)

User Sees:
  - Full registration form
  - Can register for sports
```

### Scenario 3: After Registration Closes
```
Admin Action:
  - Toggle: OFF
  - Message: "Registrations are now closed. See you at the event!"
  - End Date: 2026-02-10

User Sees:
  - Coming Soon page
  - Closed message displayed
```

---

## Troubleshooting

### Issue: Toggle doesn't change status
**Check:**
- Admin is logged in
- Valid admin token in localStorage
- Backend server is running
- Check browser console for errors

### Issue: Users still see registration form when OFF
**Check:**
- Frontend page is using `useRegistrationStatus()` hook
- Frontend is calling correct API endpoint
- Browser cache (try hard refresh: Cmd+Shift+R)

### Issue: Marathon/Women's affected by toggle
**Verify:**
- Marathon routes don't have `checkRegistrationEnabled` middleware
- Women's tournament routes don't have middleware
- Check: `backend/routes/marathon.routes.js`
- Check: `backend/routes/womenTournament.routes.js`

---

## Admin Dashboard Features

### Visual Indicators
- ✅ Large ON/OFF toggle switch
- 🎨 Color-coded status (Green=Open, Red=Closed)
- ⏱️ Last updated timestamp
- 👤 Who made the last change

### Form Fields
- **Message**: Multi-line text area for custom message
- **Start Date**: Date picker
- **End Date**: Date picker
- **Update Button**: Saves all settings at once

### Real-time Status
- Shows current registration state
- Pulse animation when OPEN
- Clear visual feedback

---

## Security Notes

- All admin endpoints require authentication
- Settings changes are logged with admin ID
- Public status endpoint is read-only
- Only admins can modify settings
- Token validation on every request

---

## Quick Tips

1. **Test First**: Toggle OFF, check user page, then toggle ON
2. **Custom Message**: Write clear, friendly messages for users
3. **Dates Are Optional**: Only set if you want to display them
4. **Marathon Independent**: Remember marathon always works!
5. **Check Status**: Use public API to verify current state

---

## Support

For detailed documentation, see:
📚 `docs/REGISTRATION_TOGGLE_SYSTEM.md`

Admin Panel Location:
🎛️ Admin Sidebar → "Registration Control" (First menu item)
