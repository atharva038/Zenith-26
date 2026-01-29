# Fake Sports Registration Data Generator

## Overview
This script generates realistic fake sports registration data for testing and development purposes. It creates 300+ player registrations distributed across 15 different sports with randomized data including teams, players, institutions, payment statuses, and documents.

## Features

### 📊 Data Generation
- **300+ Registrations** distributed across 15 sports
- **Realistic Indian Data**: College names, cities, Indian names
- **Random Distribution**: Sports, statuses, payment statuses
- **Complete Player Details**: Teams with multiple players
- **Accommodation Data**: 60% registrations include accommodation
- **Document URLs**: Simulated Cloudinary URLs for documents

### 🏆 Sports Included
1. Cricket (11-15 players)
2. Football (11-16 players)
3. Basketball (5-12 players)
4. Volleyball (6-12 players)
5. Badminton (1-4 players)
6. Table Tennis (1-4 players)
7. Chess (1 player)
8. Carrom (1-2 players)
9. Athletics (1-10 players)
10. Swimming (1-8 players)
11. Kabaddi (7-12 players)
12. Kho-Kho (9-12 players)
13. Hockey (11-16 players)
14. Lawn Tennis (1-4 players)
15. Squash (1-2 players)

### 📋 Generated Data Fields
Each registration includes:
- **Basic Info**: Name, email, phone, institution, city
- **Sport Details**: Sport name, team name, number of players
- **Player List**: Array of players with names and years
- **Accommodation**: Needs, number of days, number of people, fees
- **Payment**: Status (completed/pending/failed), amount (₹500 base)
- **Status**: Registration status (confirmed/pending/cancelled)
- **Documents**: Permission letter, transaction receipt, captain ID card
- **Metadata**: IP address, user agent, registration number, timestamps

## Usage

### Prerequisites
1. MongoDB running locally or connection URI in `.env`
2. Node.js installed
3. Backend dependencies installed

### Environment Setup
Ensure your `.env` file has:
```env
MONGODB_URI=mongodb://localhost:27017/zenith26
```

### Running the Script

#### Generate 300 registrations (default):
```bash
cd backend
node scripts/generateFakeSportsData.js
```

#### Generate custom number of registrations:
```bash
node scripts/generateFakeSportsData.js 500
```

### Script Output
The script will:
1. ✅ Connect to MongoDB
2. 🗑️ Clear existing registrations (optional - can be commented out)
3. 🎲 Generate fake registrations
4. 💾 Insert into database
5. 📊 Display statistics by sport
6. 📈 Show overall statistics

### Sample Output
```
🚀 Fake Sports Registration Data Generator
======================================================================
Generating 300 registrations...

✅ Connected to MongoDB
🗑️  Clearing existing registrations...
✅ Existing data cleared
🎲 Generating 300 fake registrations...
  📝 Generating 20 registrations for Cricket...
  📝 Generating 20 registrations for Football...
  ...
💾 Inserting registrations into database...

✅ Successfully generated 300 fake registrations!

📊 Registration Statistics:
──────────────────────────────────────────────────────────────────────
Sport                Total      Confirmed    Pending      Cancelled   
──────────────────────────────────────────────────────────────────────
Athletics            20         12           5            3           
Badminton            20         13           4            3           
Basketball           20         14           3            3           
Carrom               20         11           6            3           
Chess                20         12           5            3           
Cricket              20         13           4            3           
Football             20         15           2            3           
Hockey               20         12           5            3           
Kabaddi              20         14           3            3           
Kho-Kho              20         13           4            3           
Lawn Tennis          20         11           6            3           
Squash               20         12           5            3           
Swimming             20         13           4            3           
Table Tennis         20         14           3            3           
Volleyball           20         15           2            3           
──────────────────────────────────────────────────────────────────────

📈 Overall Statistics:
   Total Registrations: 300
   Confirmed: 194
   Pending: 61
   Cancelled: 45
   Payment Completed: 170
   Payment Pending: 85

✨ Data generation complete!
👋 Disconnected from MongoDB
🎉 Script completed successfully!
```

## Data Characteristics

### Randomized Elements
1. **Names**: 40 first names + 30 last names = 1,200 combinations
2. **Colleges**: 40 real Indian engineering colleges
3. **Cities**: 30 major Indian cities
4. **Phone Numbers**: Realistic 10-digit Indian mobile numbers
5. **Email Addresses**: Generated from name + college domain
6. **Registration Numbers**: Format `ZEN-[SPORT]-2026-[NUMBER]`
7. **Timestamps**: Distributed over last 30 days

### Status Distribution
- **Registration Status**: Random (confirmed/pending/cancelled)
- **Payment Status**: 
  - Confirmed registrations: completed/pending (random)
  - Cancelled registrations: failed
- **Accommodation**: 60% need accommodation, 40% don't

### Player Teams
- Each team has random number of players within sport limits
- Captain is always first player
- Additional players generated with random names and years (1-4)

## Cloudinary Integration

### Document URLs
The script uses sample Cloudinary URLs for three document types:
1. **Permission Letter**: `.pdf`, `.jpg`, `.png` formats
2. **Transaction Receipt**: `.jpg`, `.png`, `.pdf` formats
3. **Captain ID Card**: `.jpg`, `.png` formats

### Customizing Document URLs
To use your own Cloudinary documents:
1. Upload sample documents to your Cloudinary account
2. Copy the public URLs
3. Update the `SAMPLE_DOCUMENTS` object in the script:

```javascript
const SAMPLE_DOCUMENTS = {
  permissionLetter: [
    "https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/permission1.pdf",
    "https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/permission2.jpg",
  ],
  transactionReceipt: [
    "https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/receipt1.jpg",
    "https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/receipt2.png",
  ],
  captainIdCard: [
    "https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/id1.jpg",
    "https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/id2.png",
  ],
};
```

## Safety Features

### Data Preservation
By default, the script **CLEARS ALL EXISTING REGISTRATIONS** before generating new data.

To preserve existing data, comment out this line:
```javascript
// await Registration.deleteMany({});
```

### Error Handling
- Connection errors are caught and displayed
- Insert errors are logged
- MongoDB connection is always closed properly

## Testing Workflow

### 1. Generate Test Data
```bash
node scripts/generateFakeSportsData.js 300
```

### 2. Start Backend Server
```bash
npm run dev
```

### 3. Test Admin Panel
1. Login as admin
2. Navigate to `/admin/sports-registrations`
3. View statistics (should show ~300 total)
4. Filter by sport, status, payment
5. Search for specific institutions/cities
6. Export to PDF/CSV
7. View registration details
8. Test document viewing (Cloudinary URLs)

### 4. Verify Data
Check MongoDB directly:
```bash
mongosh
use zenith26
db.registrations.countDocuments()
db.registrations.find().limit(5).pretty()
```

## Advanced Configuration

### Adjusting Sport Distribution
Modify the distribution logic in `generateFakeData()`:
```javascript
// Equal distribution (default)
const regsPerSport = Math.floor(numRegistrations / SPORTS.length);

// Custom distribution (e.g., more Cricket registrations)
const customDistribution = {
  Cricket: 50,
  Football: 40,
  Basketball: 30,
  // ... rest get equal share
};
```

### Adjusting Status Ratios
Modify the `STATUSES` array weights:
```javascript
// More confirmed registrations
const generateStatus = () => {
  const rand = Math.random();
  if (rand < 0.7) return "confirmed";  // 70%
  if (rand < 0.9) return "pending";    // 20%
  return "cancelled";                   // 10%
};
```

### Adjusting Date Range
Modify the date generation:
```javascript
// Last 60 days instead of 30
const daysAgo = randomNumber(0, 60);
```

## Troubleshooting

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Duplicate Key Error
```
Error: E11000 duplicate key error
```
**Solution**: Clear existing data or disable unique constraints temporarily

### Out of Memory
```
JavaScript heap out of memory
```
**Solution**: Generate data in batches
```bash
# Generate 100 at a time
node scripts/generateFakeSportsData.js 100
node scripts/generateFakeSportsData.js 100
node scripts/generateFakeSportsData.js 100
```

## Database Cleanup

### Clear All Fake Data
```bash
mongosh
use zenith26
db.registrations.deleteMany({})
```

### Clear Specific Sport
```bash
db.registrations.deleteMany({ eventName: "Cricket" })
```

### Clear By Date Range
```bash
# Delete registrations older than 7 days
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
db.registrations.deleteMany({ createdAt: { $lt: sevenDaysAgo } })
```

## Performance

### Generation Speed
- **300 registrations**: ~2-3 seconds
- **1000 registrations**: ~5-7 seconds
- **5000 registrations**: ~20-30 seconds

### Database Size
- **Each registration**: ~2-3 KB
- **300 registrations**: ~600-900 KB
- **1000 registrations**: ~2-3 MB

## Future Enhancements

### Potential Additions
1. ✨ **Real Cloudinary Upload**: Upload actual sample documents
2. 📸 **Image Generation**: Generate fake IDs and receipts using Canvas
3. 🔄 **Incremental Updates**: Add new registrations without clearing
4. 📧 **Email Testing**: Send actual confirmation emails to test addresses
5. 🎯 **Weighted Distribution**: More realistic sport popularity
6. 🌐 **Multi-language**: Names from different Indian states
7. 📊 **Analytics**: Generate analytics-ready datasets

## License
Part of Zenith-26 project. Internal use only.

## Support
For issues or questions, contact the development team.

---
**Version**: 1.0  
**Last Updated**: January 2026  
**Author**: Zenith Development Team
