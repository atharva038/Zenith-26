# Marathon Delete Functionality Removal

## Overview
Removed the delete functionality from the Marathon registration system to prevent data tampering and maintain proper record-keeping. Replaced with reject/cancel functionality.

## Why Delete Was Removed

### Problems with Delete
1. **Data Loss**: Permanently deletes registration records
2. **No Audit Trail**: Cannot track who registered or why they were removed
3. **Legal Issues**: May need registration records for disputes or audits
4. **Analytics Impact**: Loses data for event statistics and future planning
5. **Payment Records**: Cannot track payment history if registration is deleted

### Benefits of Reject/Cancel
1. **Preserves History**: All registrations remain in database with status
2. **Audit Trail**: Can see all registrations including rejected ones
3. **Reversible**: Can restore rejected registrations if needed
4. **Analytics**: Can analyze rejection rates and reasons
5. **Compliance**: Maintains complete records for legal/financial purposes

## Status Flow

```
User Registers → Status: "pending"
     ↓
Admin Reviews
     ↓
     ├─→ Approve → Status: "confirmed" ✅
     └─→ Reject  → Status: "cancelled" ❌
            ↓
       (Can restore to "pending" if needed)
```

## What Changed

### Backend Changes

#### `routes/marathon.routes.js`
- ✅ Removed `deleteRegistration` import
- ✅ Removed DELETE route endpoint
- ✅ Route `/api/marathon/registrations/:id` (DELETE) is no longer available

#### `controllers/marathon.controller.js`
- ✅ Commented out `deleteRegistration()` function
- ✅ Added note: "DISABLED - Use reject instead"
- ✅ Function preserved in comments for emergency use only

### Frontend Changes

#### `pages/admin/AdminMarathon.jsx`
- ✅ Removed `deleteRegistration()` function
- ✅ Replaced delete buttons with "View Details" button
- ✅ Remove delete button from modal footer
- ✅ Desktop table actions: Confirm, Reject, View Details
- ✅ Mobile card actions: Same as desktop
- ✅ Cancelled tab: Shows rejected registrations with "Restore" option

### UI Changes

#### Before (With Delete) ❌
```
Actions: ✅ Confirm | ❌ Reject | 🗑️ Delete
```

#### After (Without Delete) ✅
```
Pending Actions:  ✅ Confirm | ❌ Reject | 👁️ View
Cancelled Actions: 🔄 Restore | 👁️ View
Confirmed Actions: 👁️ View
```

## Data Migration

### Script: `resetMarathonData.js`
Created a script to:
1. Delete old marathon data (500+ records with old schema)
2. Create fresh testing data with simplified model
3. Generate 21 sample registrations:
   - 10 Pending registrations
   - 8 Confirmed registrations (2 with T-shirts distributed)
   - 3 Cancelled registrations

### Running the Script
```bash
cd backend
node scripts/resetMarathonData.js
```

### Sample Data Includes
- **Pending**: 10 registrations awaiting approval
- **Confirmed**: 8 approved registrations
- **Cancelled**: 3 rejected registrations
- **T-shirt Distributed**: 2 confirmed participants received T-shirts

## Admin Workflow

### Approving Registration
1. Admin views pending registrations
2. Clicks "Confirm" or opens details modal
3. Reviews payment screenshot
4. Clicks "✅ Confirm Registration"
5. Status changes to `confirmed`
6. Email sent to participant

### Rejecting Registration
1. Admin views pending registrations
2. Clicks "Reject" or opens details modal
3. Clicks "❌ Reject"
4. Confirms rejection in popup
5. Status changes to `cancelled`
6. Registration moves to "Cancelled" tab
7. Email sent to participant

### Restoring Rejected Registration
1. Admin goes to "Cancelled" tab
2. Finds the registration to restore
3. Clicks "🔄 Restore to Pending"
4. Status changes back to `pending`
5. Registration appears in "Pending" tab

## Emergency Delete (If Absolutely Necessary)

If you absolutely must delete a registration (not recommended):

1. Uncomment the `deleteRegistration` function in `marathon.controller.js`
2. Add the route back in `marathon.routes.js`
3. Use MongoDB directly or create a one-time admin script
4. Document the reason for deletion

**Better Alternative**: Use `cancelled` status with notes in database

## Comparison with Women's Tournament

This change aligns Marathon management with Women's Tournament approach:
- ✅ No delete functionality
- ✅ Use status changes instead
- ✅ Maintain complete records
- ✅ Allow status restoration
- ✅ Preserve audit trail

## Database Schema (Simplified)

```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String,
  phone: String,
  status: "pending" | "confirmed" | "cancelled",  // Single source of truth
  paymentDetails: {
    transactionId: String,
    amount: Number,
    paymentScreenshot: String
    // No paymentStatus field anymore
  },
  registrationNumber: String,
  tshirtDistributed: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Testing Checklist

- [ ] Verify delete button is removed from all views
- [ ] Test approve functionality works
- [ ] Test reject functionality works
- [ ] Test restore functionality from cancelled tab
- [ ] Verify rejected registrations appear in cancelled tab
- [ ] Test pagination works with new data
- [ ] Verify T-shirt distribution page works
- [ ] Test search and filters work
- [ ] Verify email notifications sent on approve/reject
- [ ] Check modal doesn't show delete button

## Related Documentation
- `/docs/MARATHON_STATUS_SIMPLIFICATION.md` - Status field simplification
- `/backend/scripts/resetMarathonData.js` - Data reset script

## Future Improvements

### Soft Delete (Optional)
If you later want a "soft delete" approach:
1. Add `isDeleted: Boolean` field to schema
2. Add `deletedAt: Date` field
3. Add `deletedBy: String` field
4. Filter out soft-deleted records in queries
5. Keep for legal/audit purposes but hide from UI

### Admin Notes
Consider adding:
```javascript
adminNotes: [{
  note: String,
  adminId: ObjectId,
  timestamp: Date
}]
```
This allows admins to document rejection reasons or other important notes.

## Support

If you encounter issues:
1. Check backend console for errors
2. Verify MongoDB connection
3. Ensure `.env` file is properly configured
4. Review browser console for frontend errors
5. Check that sample data was created successfully
