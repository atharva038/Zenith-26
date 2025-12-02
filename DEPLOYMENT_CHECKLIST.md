# 🚀 DigitalOcean Deployment - Quick Checklist

## Before Deployment

- [ ] MongoDB Atlas database is set up
- [ ] MongoDB connection string is ready
- [ ] All code is pushed to GitHub
- [ ] Environment variables are documented
- [ ] `.env` file is in `.gitignore`

## Option 1: App Platform (Recommended for Beginners)

### 1. Create App
- [ ] Go to https://cloud.digitalocean.com/apps
- [ ] Click "Create App"
- [ ] Connect GitHub repository
- [ ] Select `Zenith-26` repo, `main` branch

### 2. Configure Build
- [ ] Source Directory: `/backend`
- [ ] Build Command: `npm install`
- [ ] Run Command: `npm start`
- [ ] HTTP Port: `8080`

### 3. Add Environment Variables
```
MONGODB_URI=mongodb+srv://zenith_db_user:k2S1v3uM9uCrwPhF@cluster0.rrayyg4.mongodb.net/zenith_db?appName=Cluster0
PORT=8080
JWT_SECRET=zenith2026_super_secret_key_change_in_production
NODE_ENV=production
```

### 4. Deploy
- [ ] Select Basic plan ($5/month)
- [ ] Click "Launch App"
- [ ] Wait 5-10 minutes for deployment

### 5. Post-Deployment
- [ ] Copy your app URL (e.g., `https://zenith-backend-xxxxx.ondigitalocean.app`)
- [ ] Update `frontend/src/config/api.js` with this URL
- [ ] Test API: `https://your-url/api/health`
- [ ] Create admin: SSH or use DigitalOcean console to run `npm run create-admin`

## Option 2: Droplet (More Control)

### 1. Create Droplet
- [ ] Go to https://cloud.digitalocean.com/droplets
- [ ] Ubuntu 22.04 LTS
- [ ] Basic plan ($6/month recommended)
- [ ] Add SSH key

### 2. Initial Setup
```bash
ssh root@YOUR_DROPLET_IP

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install Git
sudo apt install git -y
```

### 3. Clone and Setup
```bash
cd /var/www
git clone https://github.com/atharva038/Zenith-26.git
cd Zenith-26/backend
npm install

# Create .env file
nano .env
# (Paste your environment variables)
```

### 4. Start with PM2
```bash
pm2 start server.js --name zenith-backend
pm2 save
pm2 startup
```

### 5. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/zenith-backend
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name YOUR_DROPLET_IP;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/zenith-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Configure Firewall
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### 7. Create Admin
```bash
cd /var/www/Zenith-26/backend
npm run create-admin
```

## MongoDB Atlas Configuration

- [ ] Go to MongoDB Atlas
- [ ] Navigate to Network Access
- [ ] Add IP Address: `0.0.0.0/0` (allow all) OR your DigitalOcean IP
- [ ] Save changes

## Frontend Configuration

1. Update `frontend/src/config/api.js`:
```javascript
const API_BASE_URL = import.meta.env.MODE === 'production'
  ? 'https://your-actual-backend-url.ondigitalocean.app' // Your DigitalOcean URL
  : 'http://localhost:5000';

export default API_BASE_URL;
```

2. Update all API calls to use this config:
```javascript
import API_BASE_URL from '../config/api';

// In AdminLogin.jsx, AdminDashboard.jsx, etc.
axios.post(`${API_BASE_URL}/api/auth/login`, formData);
```

## Testing

- [ ] Test API health: `https://your-url/api/health`
- [ ] Test login from frontend
- [ ] Check MongoDB connections in Atlas
- [ ] View logs (App Platform dashboard or `pm2 logs`)

## Useful Commands

### For App Platform:
- View logs in DigitalOcean dashboard
- Redeploy: Push to GitHub (if autodeploy enabled)

### For Droplet:
```bash
# View logs
pm2 logs zenith-backend

# Restart
pm2 restart zenith-backend

# Update code
cd /var/www/Zenith-26/backend
git pull origin main
npm install
pm2 restart zenith-backend
```

## Estimated Time

- **App Platform**: 15-20 minutes
- **Droplet**: 30-45 minutes (includes Nginx setup)

## Costs

- **App Platform Basic**: $5/month
- **Droplet Basic**: $6/month
- **MongoDB Atlas**: Free tier (512MB)

---

## 🆘 Need Help?

**Common Issues:**

1. **Can't connect to MongoDB**
   - Check MongoDB Atlas IP whitelist
   - Verify connection string in environment variables

2. **502 Bad Gateway (Nginx)**
   - Check if PM2 is running: `pm2 status`
   - Check logs: `pm2 logs`

3. **App Platform build fails**
   - Check build logs in dashboard
   - Verify package.json scripts

4. **CORS errors**
   - Update backend CORS configuration to allow your frontend domain

---

**Your Backend URL will be:**
- App Platform: `https://zenith-backend-xxxxx.ondigitalocean.app`
- Droplet: `http://YOUR_DROPLET_IP` or `https://your-domain.com`

Good luck! 🚀
