# Backend Scripts

Organized utility scripts for Zenith-26 backend management.

## 📁 Folder Structure

### Root Scripts

#### `resetMarathonData.js` - Marathon Data Reset (NEW)
Resets marathon registrations with fresh testing data using the simplified model (no paymentStatus field).

**Purpose**:
- Delete all existing marathon registrations
- Create 21 sample registrations with new simplified schema
- Generate realistic test data for development

**Usage**:
```bash
cd backend
node scripts/resetMarathonData.js
```

**What it creates**:
- 10 Pending registrations (awaiting approval)
- 8 Confirmed registrations (2 with T-shirts distributed)
- 3 Cancelled registrations (rejected)

⚠️ **Warning:** This script will DELETE all existing marathon registrations!

---

### `/admin/` - Admin Management Scripts
Scripts for managing admin accounts and authentication:
- `createAdmin.js` - Create new admin accounts
- `resetAdminPassword.js` - Reset admin password
- `resetAllAdmins.js` - Bulk admin management
- `setupProductionAdmin.js` - Setup production admin account

**Usage:**
```bash
cd backend
node scripts/admin/createAdmin.js
```

### `/media-team/` - Media Team Scripts
Scripts for managing media team accounts:
- `createMediaTeam.js` - Create media team accounts

**Usage:**
```bash
cd backend
node scripts/media-team/createMediaTeam.js
```

### `/testing/` - Testing & Demo Scripts
Scripts for generating test data:
- `createFakeMarathonData.js` - Generate 500 fake marathon participants

**⚠️ Warning:** This script will DELETE all existing marathon registrations!

**Usage:**
```bash
cd backend
node scripts/testing/createFakeMarathonData.js
```

### `/archived-uploads/` - Archived Upload Scripts
Old scripts for uploading images to Cloudinary (already executed, kept for reference).

**Note:** These scripts have already been executed. Images are now on Cloudinary. Keep for reference only.

## 🚀 Quick Commands

```bash
# Create admin
node scripts/admin/createAdmin.js

# Reset admin password
node scripts/admin/resetAdminPassword.js

# Create media team member
node scripts/media-team/createMediaTeam.js

# Generate test marathon data
node scripts/testing/createFakeMarathonData.js
```

## ⚠️ Important Notes

1. All scripts require `.env` file to be configured
2. Database connection must be active
3. Run scripts from the backend directory
4. Backup database before running management scripts

- `uploadKadamImage.js` - Upload Kadam's image
- `uploadLogo.js` - Upload Zenith logo
- `uploadPaymentQR.js` - Upload payment QR codes
- `uploadSkippingRope.js` - Upload skipping rope sport image
- `uploadTilakImage.js` - Upload Tilak's image

## Usage Notes

1. **Environment Variables**: Ensure `.env` file is properly configured before running scripts
2. **Database Connection**: Scripts will connect to MongoDB using `MONGODB_URI` from environment
3. **Cloudinary**: Image upload scripts require Cloudinary credentials in environment
4. **One-Time Use**: Most of these scripts are meant for initial setup or maintenance tasks
5. **Production Safety**: Always backup database before running reset or modification scripts

## Security

⚠️ **Important**: Never commit sensitive credentials or API keys. Keep `.env` file private and use `.env.example` as a template.
