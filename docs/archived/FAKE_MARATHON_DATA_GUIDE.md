# Fake Marathon Data Generator - Usage Guide

## Quick Start

### Generate 500 Fake Participants

```bash
cd backend
node scripts/createFakeMarathonData.js
```

---

## What Gets Created

### 500 Realistic Participants with:

#### Personal Information
- **Indian Names**: Combinations of common Indian first and last names
- **Realistic Emails**: Auto-generated from names (gmail, yahoo, outlook, hotmail)
- **Phone Numbers**: Valid 10-digit Indian mobile numbers (starting with 7, 8, or 9)
- **Ages**: Random ages between 18-62 years
- **Gender**: Random distribution of Male, Female, Other
- **Colleges**: 30 different Indian colleges including IITs, NITs, and others

#### Registration Details
- **T-shirt Sizes**: Random distribution of S, M, L, XL, XXL
- **Emergency Contacts**: Random names and phone numbers
- **Medical Conditions**: Mostly "None", some with Asthma, Diabetes, etc.
- **Registration Numbers**: Auto-generated (MAR2026XXXX)

#### Payment & Status
- **~400 Confirmed Registrations** (payment verified)
- **~100 Pending Registrations** (payment not verified)
- **Payment Amount**: ₹99 for all
- **Transaction IDs**: Unique generated IDs

#### T-shirt Distribution
- **~120 Already Distributed** (30% of confirmed)
- **~280 Pending Distribution** (70% of confirmed)
- **Distribution Timestamps**: Random times in last 24 hours

---

## Statistics Example

After running the script, you'll see:

```
📊 Statistics:
   Total: 500
   Confirmed: 402
   Pending: 98
   T-shirts Distributed: 121
   Male: 245
   Female: 255
```

---

## ⚠️ Important Warning

**This script will DELETE all existing marathon registrations!**

Make sure you:
1. ✅ Have a backup if needed
2. ✅ Are running in a test/development environment
3. ✅ Want to replace all current data

---

## Use Cases

### 1. Testing T-shirt Distribution System
- Test search functionality with 500 records
- Test filter functionality (All/Pending/Distributed)
- Test marking T-shirts as distributed
- Test undo functionality
- Check performance with large dataset

### 2. Testing Statistics Dashboard
- Verify statistics calculations are correct
- Check percentage calculations
- Test distribution tracking

### 3. UI/UX Testing
- Test responsive design with many cards
- Test pagination/scrolling
- Test loading states
- Check mobile performance

### 4. Search & Filter Testing
- Search by name (many variations)
- Search by registration number
- Search by phone number
- Filter combinations

---

## Data Distribution

### Registration Status
- 80% Confirmed (verified payment)
- 20% Pending (payment not verified)

### T-shirt Distribution (for Confirmed)
- 30% Already Distributed
- 70% Pending Distribution

### Gender Distribution
- ~50% Male
- ~50% Female
- Few Other

### College Distribution
- SGGSIE&T Nanded (most common)
- Various IITs and NITs
- Other engineering colleges
- General colleges

### Age Distribution
- 18-30 years: 60%
- 31-45 years: 30%
- 46-62 years: 10%

### T-shirt Sizes
- S: 15%
- M: 25%
- L: 30%
- XL: 20%
- XXL: 10%

---

## After Running

### Access Points:

1. **T-shirt Distribution Page**
   ```
   http://localhost:5173/tshirt-distribution
   ```

2. **Admin Marathon Panel**
   ```
   http://localhost:5173/admin/marathon
   ```

### Things to Test:

✅ **Search Bar**
- Search "Rahul" → Should find multiple participants
- Search "MAR2026" → Should find registration numbers
- Search "98" → Should find phone numbers

✅ **Filters**
- Click "All" → 500 registrations
- Click "Pending" → ~280 pending distribution
- Click "Distributed" → ~120 distributed

✅ **Mark as Given**
- Click on a pending registration
- Confirm the modal
- Verify it moves to distributed

✅ **Undo**
- Click undo on a distributed registration
- Verify it moves back to pending

✅ **Statistics**
- Check numbers match the counts
- Verify percentage is calculated correctly

---

## Cleanup

To remove all fake data and start fresh:

```bash
# Run the script again (it clears data first)
node scripts/createFakeMarathonData.js

# Or manually clear in MongoDB
# (if you have MongoDB Compass or similar)
```

---

## Troubleshooting

### Script Fails to Connect
- Check if MongoDB is running
- Verify `.env` file has correct `MONGODB_URI`
- Check network connection

### Duplicate Key Errors
- Script should clear data first
- If issues persist, manually clear the `marathons` collection

### Too Slow
- 500 records should insert in 2-5 seconds
- If slower, check MongoDB connection
- Check system resources

---

## Script Details

**Location:** `/backend/scripts/createFakeMarathonData.js`

**Dependencies:**
- mongoose
- dotenv
- Marathon model

**Database:**
- Collection: `marathons`
- Operation: Delete all → Insert 500

**Execution Time:** ~5 seconds

---

## Example Output

```
🔄 Connecting to MongoDB...
✅ Connected to MongoDB

🗑️  Clearing existing marathon data...
✅ Deleted 123 existing registrations

👥 Creating 500 fake marathon participants...
💾 Inserting participants into database...

✅ Successfully created 500 fake marathon participants!

📊 Statistics:
   Total: 500
   Confirmed: 402
   Pending: 98
   T-shirts Distributed: 121
   Male: 245
   Female: 255

🎉 Done! You can now test the T-shirt distribution system.

💡 Tip: Visit /tshirt-distribution to see the fake data in action!

👋 Database connection closed
```

---

## Tips

1. **Run Multiple Times**: Data is randomized each time
2. **Test Different Scenarios**: Each run creates different distributions
3. **Mix with Real Data**: Don't run in production!
4. **Performance Testing**: 500 records is good for testing load
5. **UI Testing**: Use to test edge cases and layouts

---

## Support

If you encounter issues:
1. Check backend logs for detailed errors
2. Verify MongoDB is running
3. Check `.env` configuration
4. Clear browser cache if UI issues
5. Restart backend server after running script

---

**Last Updated:** January 17, 2026  
**Script Version:** 1.0  
**Status:** ✅ Ready to Use
