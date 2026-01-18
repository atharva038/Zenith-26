# Backend Utility Scripts

This folder contains one-time setup scripts and utility tools for managing the Zenith 2026 backend.

## Marathon Testing Scripts

### `createFakeMarathonData.js` ⭐ NEW
Create 500 fake marathon participants for testing the T-shirt distribution system.

**Features:**
- Creates 500 realistic fake participants with Indian names
- Random distribution of confirmed/pending registrations
- 30% of confirmed registrations have T-shirts already distributed
- Random colleges, ages, phone numbers, emails
- Realistic emergency contacts and medical conditions

**Usage:**
```bash
cd backend
node scripts/createFakeMarathonData.js
```

**⚠️ Warning:** This script will DELETE all existing marathon registrations before creating fake data!

**What it creates:**
- ~400 confirmed registrations
- ~100 pending registrations
- ~120 T-shirts already distributed (for testing)
- Random distribution of male/female participants
- Random T-shirt sizes, ages, colleges

**After running:**
Visit `/tshirt-distribution` to see the fake data in action!

---

## Admin Management Scripts

### `createAdmin.js`
Create a new admin account.

```bash
cd backend
node scripts/createAdmin.js
```

### `resetAdminPassword.js`
Reset password for a specific admin account.

```bash
cd backend
node scripts/resetAdminPassword.js
```

### `resetAllAdmins.js`
Reset passwords for all admin accounts (use with caution).

```bash
cd backend
node scripts/resetAllAdmins.js
```

### `setupProductionAdmin.js`
Setup admin account for production environment.

```bash
cd backend
node scripts/setupProductionAdmin.js
```

### `testAdmin.js`
Test admin authentication and functionality.

```bash
cd backend
node scripts/testAdmin.js
```

## Image Upload Scripts

These scripts upload images to Cloudinary for the Women's Tournament section.

### `upload1stCategoryImages.js`
Upload 1st category sport images to Cloudinary.

```bash
cd backend
node scripts/upload1stCategoryImages.js
```

### `uploadFemaleTournamentImages.js`
Upload female tournament related images.

```bash
cd backend
node scripts/uploadFemaleTournamentImages.js
```

### `uploadWomenTournamentBg.js`
Upload women's tournament background images.

```bash
cd backend
node scripts/uploadWomenTournamentBg.js
```

### Individual Image Upload Scripts
- `uploadAtharvQRCodes.js` - Upload Atharva QR codes
- `uploadBackupQRCodes.js` - Upload backup QR codes
- `uploadBackupQRs.js` - Upload backup QR images
- `uploadDeanImage.js` - Upload dean's image
- `uploadDirectorImage.js` - Upload director's image
- `uploadJeetPatilImage.js` - Upload Jeet Patil's image
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
