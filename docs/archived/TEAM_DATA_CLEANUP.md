# Team Member Data Cleanup Scripts

This directory contains scripts to clear all team member data (both database records and Cloudinary photos).

## ⚠️ WARNING

These scripts will **permanently delete ALL team member data**:
- All team member records from MongoDB
- All team member photos from Cloudinary
- **This action CANNOT be undone!**

## Usage

### Option 1: Using the Shell Script (Recommended)

```bash
cd scripts
./clear-team-data.sh
```

This script will:
1. Show a warning message
2. Ask for confirmation (you must type 'yes')
3. Run the cleanup script
4. Show detailed progress and results

### Option 2: Using Node.js Directly

```bash
cd backend
node scripts/clearAllTeamMembers.js
```

## What Gets Deleted

### From MongoDB:
- All documents in the `TeamMember` collection
- Includes all fields: name, committee, position, phoneNumber, photo URLs, etc.

### From Cloudinary:
- All team member photos stored in your Cloudinary account
- Uses the `photoPublicId` field to identify and delete each image

## Script Output

The script provides detailed output including:
- Number of team members found
- Photo deletion progress (with success/failure for each)
- Final summary with counts
- Error messages if any deletions fail

### Example Output:
```
🚀 Starting Team Member Data Cleanup...

✅ Connected to MongoDB

📊 Found 25 team member(s) to delete

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🗑️  Deleting photos from Cloudinary...

✅ Deleted photo for: Atharva Patil (MEDIA & WEB)
✅ Deleted photo for: Rahul Kumar (EVENT MANAGEMENT)
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📸 Cloudinary Deletion Summary:
   ✅ Successfully deleted: 25
   ❌ Failed: 0

🗄️  Deleting team members from database...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ CLEANUP COMPLETE!

📊 Final Summary:
   • Team members deleted from database: 25
   • Photos deleted from Cloudinary: 25/25

🎉 All dummy team member data has been cleared!
✅ Ready for fresh team member uploads.

👋 Disconnected from MongoDB
```

## Requirements

- Node.js installed
- MongoDB connection configured in `.env`
- Cloudinary credentials configured in `.env`
- All dependencies installed (`npm install` in backend directory)

## Environment Variables

Make sure these are set in your `backend/.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Safety Features

1. **Confirmation Prompt**: Shell script asks for confirmation before proceeding
2. **Detailed Logging**: Shows exactly what is being deleted
3. **Error Handling**: Continues even if some photos fail to delete
4. **Summary Report**: Shows success/failure counts

## When to Use

Use these scripts when you want to:
- Clear all dummy/test team member data
- Start fresh with team member uploads
- Remove all team data before production
- Clean up after testing

## After Running

After successfully running the cleanup:
1. Database will be empty of team members
2. Cloudinary photos will be deleted
3. Team management page will show "No team members yet"
4. Ready to add real team members

## Troubleshooting

### Script won't run
```bash
# Make script executable
chmod +x scripts/clear-team-data.sh
```

### MongoDB connection fails
- Check your `MONGODB_URI` in `.env`
- Ensure MongoDB is running
- Verify network connectivity

### Cloudinary deletion fails
- Check Cloudinary credentials in `.env`
- Verify API key has deletion permissions
- Check if photos still exist in Cloudinary dashboard

## Files

- `backend/scripts/clearAllTeamMembers.js` - Main Node.js cleanup script
- `scripts/clear-team-data.sh` - Shell wrapper with confirmation prompt
- `scripts/TEAM_DATA_CLEANUP.md` - This documentation file
