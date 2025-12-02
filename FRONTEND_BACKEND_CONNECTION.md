# 🔗 Connecting Frontend to Backend in Production

## Step-by-Step Guide (Using App Platform for Backend)

---

## Step 1: Get Your Backend URL

### From DigitalOcean App Platform:

1. Go to **DigitalOcean Dashboard**
2. Click on your **zenith-26-backend** app
3. Look for the **Live App** URL at the top

**It will look like:**
```
https://zenith-26-backend-xxxxx.ondigitalocean.app
```

**Copy this URL!** 📋

---

## Step 2: Update Frontend API Configuration

### Option A: Using the config file (Recommended)

**File:** `frontend/src/config/api.js`

Replace `your-backend-url.ondigitalocean.app` with your actual backend URL:

```javascript
const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://zenith-26-backend-xxxxx.ondigitalocean.app"  // ← Put your actual URL here
    : "http://localhost:5000";

export default API_BASE_URL;
```

---

## Step 3: Update All API Calls

You need to update these files to use the `API_BASE_URL`:

### 1. **AdminLogin.jsx**

Current (wrong):
```javascript
import axios from 'axios';

// In handleSubmit:
const response = await axios.post('http://localhost:5000/api/auth/login', formData);
```

**Change to:**
```javascript
import axios from 'axios';
import API_BASE_URL from '../config/api';

// In handleSubmit:
const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
```

### 2. **AdminDashboard.jsx**

Current (wrong):
```javascript
const [statsRes, adminsRes] = await Promise.all([
  axios.get('http://localhost:5000/api/admin/dashboard/stats', {
    headers: { Authorization: `Bearer ${token}` },
  }),
  axios.get('http://localhost:5000/api/admin/admins', {
    headers: { Authorization: `Bearer ${token}` },
  }),
]);
```

**Change to:**
```javascript
import API_BASE_URL from '../config/api';

const [statsRes, adminsRes] = await Promise.all([
  axios.get(`${API_BASE_URL}/api/admin/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  }),
  axios.get(`${API_BASE_URL}/api/admin/admins`, {
    headers: { Authorization: `Bearer ${token}` },
  }),
]);

// Also update the delete function:
await axios.delete(`${API_BASE_URL}/api/admin/admins/${id}`, {
  headers: { Authorization: `Bearer ${token}` },
});
```

---

## Step 4: Update Backend CORS Settings

Your backend needs to allow requests from your frontend domain.

**File:** `backend/server.js`

**Current:**
```javascript
app.use(cors());
```

**Change to:**
```javascript
const allowedOrigins = [
  'http://localhost:5173',  // Local development
  'https://your-frontend-domain.vercel.app',  // Production frontend
  // Add more origins if needed
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
```

**OR simpler (for now):**
```javascript
app.use(cors({
  origin: '*',  // Allow all origins (less secure but works)
  credentials: true
}));
```

---

## Step 5: Push Changes to GitHub

```bash
cd frontend

# Update the config file with your backend URL
# Then commit and push

git add src/config/api.js
git add src/pages/AdminLogin.jsx
git add src/pages/AdminDashboard.jsx
git commit -m "feat: Connect frontend to production backend"
git push origin main
```

If you set up auto-deploy, your frontend will automatically redeploy with the new configuration! ✨

---

## Step 6: Verify Connection

### Test the Connection:

1. **Visit your frontend URL**
2. **Go to** `/admin/login`
3. **Open browser console** (F12 or Cmd+Option+I)
4. **Try to login** with:
   - Email: `admin@zenith2026.com`
   - Password: `admin123`

### Check for Errors:

**In Browser Console:**
- ✅ No CORS errors
- ✅ API requests go to your DigitalOcean backend URL
- ✅ Response received from backend

**In DigitalOcean Backend Logs:**
- ✅ See incoming requests
- ✅ No authentication errors
- ✅ MongoDB connected

---

## Quick Reference: Files to Update

### Frontend Files:
```
frontend/
├── src/
│   ├── config/
│   │   └── api.js                    ← Update backend URL
│   └── pages/
│       ├── AdminLogin.jsx           ← Update API calls
│       └── AdminDashboard.jsx       ← Update API calls
```

### Backend Files:
```
backend/
└── server.js                        ← Update CORS settings
```

---

## Complete Code Examples

### ✅ frontend/src/config/api.js

```javascript
const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://zenith-26-backend-abc123.ondigitalocean.app"  // Your actual URL
    : "http://localhost:5000";

export default API_BASE_URL;
```

### ✅ frontend/src/pages/AdminLogin.jsx (Updated imports and usage)

```javascript
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import API_BASE_URL from '../config/api';  // ← Add this import

const AdminLogin = () => {
  // ... existing state ...

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ✅ Use API_BASE_URL instead of hardcoded localhost
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
      
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.data.token);
        localStorage.setItem('adminData', JSON.stringify(response.data.data.admin));
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component ...
};
```

### ✅ backend/server.js (Updated CORS)

```javascript
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Updated CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,  // Add FRONTEND_URL to your env variables
  // Add your actual frontend domain
  'https://your-frontend.vercel.app',
].filter(Boolean);  // Remove undefined values

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// ... rest of server.js ...
```

---

## Environment Variable in Backend (Optional but Recommended)

Add this to your **DigitalOcean environment variables**:

```
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

Then use it in CORS:
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);
```

---

## Troubleshooting

### ❌ CORS Error in Browser

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
1. Check backend CORS configuration allows your frontend domain
2. Add frontend URL to allowed origins
3. Redeploy backend after changes

### ❌ Network Error / Connection Refused

**Error:** `Network Error` or `ERR_CONNECTION_REFUSED`

**Solution:**
1. Check backend URL is correct in `api.js`
2. Verify backend is running: visit `https://your-backend-url/api/health`
3. Check for typos in the URL

### ❌ 401 Unauthorized

**Error:** `401 Unauthorized` on login

**Solution:**
1. Verify admin account exists (run `npm run create-admin` on backend)
2. Check JWT_SECRET is set in backend environment variables
3. Ensure MongoDB is connected

---

## Testing Checklist

- [ ] Backend URL updated in `frontend/src/config/api.js`
- [ ] All API calls use `API_BASE_URL`
- [ ] CORS configured in backend
- [ ] Frontend redeployed with changes
- [ ] Backend health check works: `/api/health`
- [ ] Admin login works from production frontend
- [ ] Dashboard loads after login
- [ ] No console errors in browser

---

## Summary

**What you need to do:**

1. ✅ Get your backend URL from DigitalOcean
2. ✅ Update `frontend/src/config/api.js` with the URL
3. ✅ Update `AdminLogin.jsx` to use `API_BASE_URL`
4. ✅ Update `AdminDashboard.jsx` to use `API_BASE_URL`
5. ✅ Update backend CORS to allow frontend domain
6. ✅ Push changes to GitHub (auto-deploys)
7. ✅ Test login from production

**That's it!** Your frontend will now communicate with your backend in production! 🚀

---

_Last Updated: December 2, 2025_
