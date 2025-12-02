# 🔐 Production Environment Variables Guide

## Backend (.env for DigitalOcean)

### Required Variables

Add these in **DigitalOcean App Platform Dashboard** → **Settings** → **Environment Variables**:

```env
MONGODB_URI=mongodb+srv://zenith_db_user:k2S1v3uM9uCrwPhF@cluster0.rrayyg4.mongodb.net/zenith_db?appName=Cluster0
PORT=8080
NODE_ENV=production
JWT_SECRET=your_super_secret_key_minimum_32_characters_long_random_string
```

---

## 📋 Detailed Breakdown

### 1. MONGODB_URI (Required)
**What it is:** Your MongoDB Atlas connection string

**Current Value:**
```
mongodb+srv://zenith_db_user:k2S1v3uM9uCrwPhF@cluster0.rrayyg4.mongodb.net/zenith_db?appName=Cluster0
```

**How to get it:**
1. Go to MongoDB Atlas dashboard
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password

**⚠️ Important:**
- Keep this secret!
- Don't commit to GitHub
- Ensure MongoDB Atlas allows connections from DigitalOcean IPs (0.0.0.0/0)

---

### 2. PORT (Required)
**What it is:** The port your backend server listens on

**Production Value:**
```
PORT=8080
```

**Why 8080?**
- DigitalOcean App Platform expects port 8080
- Don't use 5000 in production (that's for local development)

---

### 3. NODE_ENV (Required)
**What it is:** Tells your app it's running in production mode

**Value:**
```
NODE_ENV=production
```

**What it does:**
- Disables detailed error messages in API responses
- Optimizes performance
- Enables production-level logging

---

### 4. JWT_SECRET (Critical!)
**What it is:** Secret key used to sign authentication tokens

**⚠️ MUST CHANGE THIS!**

**Current (INSECURE - for demo only):**
```
JWT_SECRET=zenith2026_super_secret_key_change_in_production
```

**Generate a Strong Secret:**

**Option 1: Using OpenSSL (Mac/Linux)**
```bash
openssl rand -base64 32
```

**Option 2: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3: Online Generator**
- Visit: https://randomkeygen.com/
- Use "256-bit WPA Key"

**Example Strong Secret:**
```
JWT_SECRET=K7j2N9mP4qR8sT1vX3yZ6bC5dF0gH9iJ2kL7mN4pQ8rS
```

**Why it's important:**
- Prevents token forgery
- Protects user sessions
- Critical for security

---

## 🎯 How to Add Environment Variables in DigitalOcean

### Step-by-Step:

1. **Go to your App** in DigitalOcean dashboard
2. Click **"Settings"** tab
3. Click **"zenith-26-backend"** component
4. Scroll to **"Environment Variables"** section
5. Click **"Edit"**
6. Click **"Add Variable"**

### Add Each Variable:

**Variable 1:**
- Key: `MONGODB_URI`
- Value: `mongodb+srv://zenith_db_user:k2S1v3uM9uCrwPhF@cluster0.rrayyg4.mongodb.net/zenith_db?appName=Cluster0`
- Type: Secret ✅ (Encrypt)

**Variable 2:**
- Key: `PORT`
- Value: `8080`
- Type: Plain Text

**Variable 3:**
- Key: `NODE_ENV`
- Value: `production`
- Type: Plain Text

**Variable 4:**
- Key: `JWT_SECRET`
- Value: `[Your generated secret from above]`
- Type: Secret ✅ (Encrypt)

**Variable 5 (Optional but Recommended):**
- Key: `FRONTEND_URL`
- Value: `https://your-frontend-url.vercel.app`
- Type: Plain Text

7. Click **"Save"**
8. App will **automatically redeploy** with new variables

---

## 🌐 Frontend Environment Variables (Optional)

If using Vercel/Netlify for frontend:

### Create `.env.production` in frontend folder:

```env
VITE_API_URL=https://your-backend-url.ondigitalocean.app
VITE_APP_NAME=Zenith 2026
```

### Or update `frontend/src/config/api.js`:

```javascript
const API_BASE_URL = import.meta.env.MODE === 'production'
  ? 'https://zenith-26-backend-xxxxx.ondigitalocean.app'  // Your actual backend URL
  : 'http://localhost:5000';

export default API_BASE_URL;
```

---

## 🔒 Security Best Practices

### ✅ DO:
- ✅ Use strong, random JWT_SECRET (32+ characters)
- ✅ Mark sensitive variables as "Secret/Encrypted"
- ✅ Rotate JWT_SECRET periodically (every 3-6 months)
- ✅ Use different secrets for dev/staging/production
- ✅ Whitelist only necessary IPs in MongoDB Atlas

### ❌ DON'T:
- ❌ Commit .env files to GitHub
- ❌ Use simple/guessable secrets
- ❌ Share secrets in public channels
- ❌ Use the same secret across environments
- ❌ Hardcode secrets in source code

---

## 📝 Complete Production .env Template

Copy this template and fill in your values:

```env
# ================================
# ZENITH 2026 - PRODUCTION ENV
# ================================

# Database
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority

# Server
PORT=8080
NODE_ENV=production

# Security (MUST CHANGE!)
JWT_SECRET=GENERATE_YOUR_OWN_STRONG_SECRET_HERE_32_CHARS_MIN

# Frontend
FRONTEND_URL=https://your-frontend-domain.com

# Optional: Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Optional: Session
SESSION_SECRET=ANOTHER_STRONG_SECRET_HERE

# Optional: Email (Future feature)
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=
# EMAIL_PASSWORD=

# Optional: File Upload (Future feature)
# CLOUDINARY_CLOUD_NAME=
# CLOUDINARY_API_KEY=
# CLOUDINARY_API_SECRET=
# MAX_FILE_SIZE=5242880
```

---

## 🔄 After Adding Variables

1. **Save** the environment variables
2. **Wait** for automatic redeployment (2-5 minutes)
3. **Test** your backend:
   ```bash
   curl https://your-backend-url/api/health
   ```
4. **Test** admin login from frontend
5. **Check logs** in DigitalOcean for any errors

---

## ✅ Verification Checklist

- [ ] All 4 required variables added
- [ ] JWT_SECRET is strong and unique
- [ ] Sensitive variables marked as "Secret"
- [ ] MongoDB URI is correct
- [ ] PORT is set to 8080
- [ ] NODE_ENV is "production"
- [ ] App redeployed successfully
- [ ] Health endpoint returns OK
- [ ] Admin login works

---

## 🆘 Troubleshooting

### If Admin Login Fails:
```
Possible causes:
1. JWT_SECRET mismatch
2. MongoDB connection failed
3. Wrong credentials
```

**Solution:**
- Check DigitalOcean runtime logs
- Verify environment variables saved correctly
- Test MongoDB connection from MongoDB Atlas

### If Backend Won't Start:
```
Possible causes:
1. Missing required environment variable
2. Wrong PORT value
3. MongoDB URI error
```

**Solution:**
- Check build logs in DigitalOcean
- Ensure PORT=8080 (not 5000)
- Verify MongoDB URI format

---

**Remember:** Never commit `.env` files to GitHub! Always use environment variables in your deployment platform.

---

_Last Updated: December 2, 2025_
