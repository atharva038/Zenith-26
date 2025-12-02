# Deploying Zenith 2026 Backend to DigitalOcean

## 🚀 Deployment Options

### Option 1: DigitalOcean App Platform (Recommended - Easiest)
### Option 2: DigitalOcean Droplet (More Control)

---

# Option 1: DigitalOcean App Platform (PaaS)

## ✅ Advantages
- Automatic SSL certificates
- Auto-scaling
- Continuous deployment from GitHub
- Managed infrastructure
- Easy setup

## 📋 Step-by-Step Guide

### Step 1: Prepare Your Code

1. **Create `.dockerignore` file in backend folder:**
```
node_modules
npm-debug.log
.env
.git
.gitignore
```

2. **Update `package.json` to ensure it has the start script:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "create-admin": "node createAdmin.js"
  }
}
```

3. **Push your code to GitHub** (if not already done)

### Step 2: Deploy to App Platform

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click **"Create App"**
3. Select **GitHub** as source
4. Authorize DigitalOcean to access your repository
5. Select your **Zenith-26** repository
6. Choose the **main** branch
7. Select **autodeploy** (optional but recommended)

### Step 3: Configure App Settings

1. **Source Directory**: Set to `/backend`
2. **Build Command**: Leave as default or use `npm install`
3. **Run Command**: `npm start`
4. **HTTP Port**: 5000 (or use environment variable)

### Step 4: Set Environment Variables

In the App Platform dashboard, add these environment variables:

```
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=8080
JWT_SECRET=your_strong_secret_key_here
NODE_ENV=production
```

**Important:** DigitalOcean App Platform uses port 8080 by default, so set PORT=8080

### Step 5: Update server.js

Update the port configuration to use environment variable:

```javascript
const PORT = process.env.PORT || 5000;
```

### Step 6: Deploy

1. Click **"Next"** through the configuration
2. Select **Basic** plan ($5/month) or **Pro** as needed
3. Click **"Launch Basic App"** or **"Launch Pro App"**
4. Wait for deployment (5-10 minutes)

### Step 7: Get Your API URL

After deployment completes:
- You'll get a URL like: `https://your-app-name.ondigitalocean.app`
- Your API will be accessible at this URL

### Step 8: Update Frontend

Update your frontend API calls to use the new URL:

Create a config file: `frontend/src/config/api.js`
```javascript
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-app-name.ondigitalocean.app'
  : 'http://localhost:5000';

export default API_BASE_URL;
```

Then update your axios calls:
```javascript
import API_BASE_URL from '../config/api';

axios.post(`${API_BASE_URL}/api/auth/login`, formData);
```

---

# Option 2: DigitalOcean Droplet (VPS)

## ✅ Advantages
- Full server control
- More cost-effective for multiple apps
- Custom configurations

## 📋 Step-by-Step Guide

### Step 1: Create a Droplet

1. Go to [DigitalOcean Droplets](https://cloud.digitalocean.com/droplets)
2. Click **"Create Droplet"**
3. Choose **Ubuntu 22.04 LTS**
4. Select **Basic** plan ($6/month or $4/month)
5. Choose a datacenter region (closest to your users)
6. Add SSH key (or use password)
7. Click **"Create Droplet"**

### Step 2: Connect to Your Droplet

```bash
ssh root@your_droplet_ip
```

### Step 3: Install Node.js and PM2

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node -v
npm -v

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install nginx -y

# Install Git
sudo apt install git -y
```

### Step 4: Clone Your Repository

```bash
# Navigate to web directory
cd /var/www

# Clone your repository
git clone https://github.com/atharva038/Zenith-26.git
cd Zenith-26/backend

# Install dependencies
npm install
```

### Step 5: Configure Environment Variables

```bash
# Create .env file
nano .env
```

Add your environment variables:
```
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
JWT_SECRET=your_strong_secret_key_here
NODE_ENV=production
```

Save and exit (Ctrl+X, then Y, then Enter)

### Step 6: Start with PM2

```bash
# Start the app with PM2
pm2 start server.js --name zenith-backend

# Save PM2 configuration
pm2 save

# Set PM2 to start on system boot
pm2 startup

# Check status
pm2 status
```

### Step 7: Configure Nginx as Reverse Proxy

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/zenith-backend
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your_domain.com;  # or your_droplet_ip

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/zenith-backend /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 8: Configure Firewall

```bash
# Allow Nginx
sudo ufw allow 'Nginx Full'

# Allow SSH
sudo ufw allow OpenSSH

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### Step 9: (Optional) Add SSL Certificate with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d your_domain.com

# Certbot will auto-renew. Test renewal:
sudo certbot renew --dry-run
```

### Step 10: Your API is Live!

Your backend is now accessible at:
- HTTP: `http://your_droplet_ip` or `http://your_domain.com`
- HTTPS: `https://your_domain.com` (if SSL configured)

---

## 🔧 Useful PM2 Commands

```bash
# View logs
pm2 logs zenith-backend

# Restart app
pm2 restart zenith-backend

# Stop app
pm2 stop zenith-backend

# Delete app from PM2
pm2 delete zenith-backend

# Monitor
pm2 monit
```

---

## 🔄 Deploying Updates

### For App Platform:
Just push to GitHub - auto-deploys!

### For Droplet:
```bash
# SSH into droplet
ssh root@your_droplet_ip

# Navigate to project
cd /var/www/Zenith-26/backend

# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Restart with PM2
pm2 restart zenith-backend
```

---

## 💰 Cost Comparison

| Service | Monthly Cost | Best For |
|---------|-------------|----------|
| App Platform (Basic) | $5 | Quick deployment, managed |
| Droplet (Basic) | $6 | Full control, multiple apps |
| Droplet (Small) | $4 | Budget-friendly |

---

## 🐛 Troubleshooting

### App Platform Issues:
- Check build logs in dashboard
- Verify environment variables
- Ensure PORT is set to 8080

### Droplet Issues:
```bash
# Check PM2 logs
pm2 logs

# Check Nginx status
sudo systemctl status nginx

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check if port 5000 is listening
sudo netstat -tulpn | grep 5000
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend is accessible via URL
- [ ] Environment variables are set correctly
- [ ] MongoDB Atlas IP whitelist updated (0.0.0.0/0 or specific IP)
- [ ] CORS configured for frontend domain
- [ ] SSL certificate installed (if using custom domain)
- [ ] Admin account created (`npm run create-admin`)
- [ ] Frontend API URLs updated
- [ ] Test all API endpoints
- [ ] Monitor logs for errors

---

## 🔒 Security Best Practices

1. **Never commit .env files** to GitHub
2. **Use strong JWT secrets** (32+ characters)
3. **Enable firewall** on Droplet
4. **Keep system updated**: `sudo apt update && sudo apt upgrade`
5. **Use SSL/HTTPS** in production
6. **Limit MongoDB IP access** in Atlas
7. **Use environment variables** for all secrets

---

Made with ❤️ for Zenith 2026
