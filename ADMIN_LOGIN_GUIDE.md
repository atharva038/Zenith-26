# 🔐 Admin Login Instructions

## Quick Start

### 1. Start the Backend Server
```bash
cd backend
npm start
```
Server will run on `http://localhost:5000`

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### 3. Login to Admin Panel

Visit: `http://localhost:5173/admin/login`

**Default Credentials:**
- **Email:** `admin@zenith2026.com`
- **Password:** `admin123`

⚠️ **IMPORTANT:** Change the password after first login!

---

## Admin Features

### Dashboard
- View admin statistics
- Manage admin accounts
- Monitor system activity

### Navigation
- **Dashboard** - Overview and stats
- **Admins** - Manage admin users
- **Events** - Coming soon
- **Gallery** - Coming soon
- **Settings** - Coming soon

### Security
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- Token expiration (30 days)

---

## Creating Additional Admins

If you need to create more admin accounts, you can:

1. **Through the Dashboard** (once logged in)
   - Navigate to "Admins" section
   - Click "Add New Admin" (when implemented)

2. **Using the Script**
   - Modify `backend/createAdmin.js` with new credentials
   - Run `npm run create-admin`

---

## Troubleshooting

### Can't Login?
- Check if backend server is running on port 5000
- Check if MongoDB is connected
- Verify credentials are correct

### Token Expired?
- Logout and login again
- Tokens expire after 30 days

### Forgot Password?
- Run the create-admin script again (it will show if admin exists)
- Or create a password reset feature (coming soon)

---

## Theme
The admin portal uses the Zenith 2026 theme:
- Dark backgrounds with gradient overlays
- Neon blue (#00d4ff) primary color
- Neon orange (#ff6b35) accent color
- Electric cyan (#00ffff) highlights
- Smooth animations with Framer Motion

---

Made with ❤️ for Zenith 2026
