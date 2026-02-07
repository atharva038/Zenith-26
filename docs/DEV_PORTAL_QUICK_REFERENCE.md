# 🎯 Developer Portal - Quick Reference

## Access URL
```
https://your-domain.com/dev
```

## Navigation Path
```
Admin Sidebar → 💻 Developer Portal → Tool Selection
```

## Available Tools

### ✅ Registration Control
**Path**: `/dev/registration-control`
**What it does**: 
- Toggle ON/OFF all sports registrations globally
- Configure "Coming Soon" messages
- Set registration start/end dates
- Real-time updates across all pages

**When to use**:
- Opening registrations for all events
- Closing registrations during maintenance
- Scheduled registration windows

### 🔜 System Settings (Coming Soon)
**Path**: `/dev/settings`
**Planned features**:
- Application configuration
- Feature flags
- Email templates

### 🔜 API Monitor (Coming Soon)
**Path**: `/dev/api-monitor`
**Planned features**:
- Request/response logging
- Performance metrics
- Error tracking

### 🔜 Database Tools (Coming Soon)
**Path**: `/dev/database`
**Planned features**:
- Data export/import
- Database backups
- Query tools

## Quick Actions

### Open Registrations
1. Go to `/dev`
2. Click "Registration Control"
3. Toggle switch to **ON** (green)
4. Verify status message

### Close Registrations
1. Go to `/dev`
2. Click "Registration Control"
3. Toggle switch to **OFF** (red)
4. Set custom message (optional)
5. Save changes

### Check Current Status
1. Go to `/dev/registration-control`
2. View toggle state:
   - 🟢 **Green** = Registrations OPEN
   - 🔴 **Red** = Registrations CLOSED

## Security Notes
- 🔒 Requires admin authentication
- 🔑 JWT token validated on every request
- 📝 All actions logged with admin details
- ⚠️ Changes affect all users immediately

## File Locations
```
frontend/src/pages/dev/
├── DevPortal.jsx              # Main portal page
└── DevRegistrationControl.jsx # Registration toggle
```

## Related Documentation
- `REGISTRATION_TOGGLE_SYSTEM.md` - Full toggle system details
- `GAMEVERSE_REGISTRATION_TOGGLE.md` - GameVerse integration
- `DEV_PORTAL_IMPLEMENTATION.md` - Complete implementation guide
