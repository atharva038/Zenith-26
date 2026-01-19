# Marathon Status Simplification

## Overview
Simplified the Marathon registration model from having two separate status fields (`status` and `paymentDetails.paymentStatus`) to a single unified `status` field.

## Previous Complex Flow ❌
- **Registration Status**: `pending`, `confirmed`, `cancelled`
- **Payment Status**: `pending`, `verified`, `failed`
- Required managing two separate status fields
- Created confusion about which status represented what
- Made logic complicated across frontend and backend

## New Simplified Flow ✅

### Single Status Field
- **`pending`**: User registered, waiting for admin approval
- **`confirmed`**: Admin approved the registration (payment verified implicitly)
- **`cancelled`**: Registration rejected by admin

### Logic
1. User submits marathon registration → Status: `pending`
2. Admin reviews payment screenshot and registration details
3. Admin clicks "Confirm" → Status: `confirmed` (implies payment is verified)
4. Admin clicks "Reject" → Status: `cancelled` (implies payment/registration invalid)

## What Changed

### Backend Changes

#### `models/Marathon.js`
- ✅ Removed `paymentDetails.paymentStatus` field
- ✅ Kept single `status` field as source of truth
- ✅ Updated comments to explain the simplified flow
- ✅ `paymentDetails` still stores transaction info and screenshot for reference

#### `controllers/marathon.controller.js`
- ✅ Removed `paymentStatus` parameter handling in `updateRegistrationStatus()`
- ✅ Removed automatic payment status updates when confirming/cancelling
- ✅ Removed "Payment Status" column from CSV export
- ✅ Simplified the status update logic

### Frontend Changes

#### `pages/admin/AdminMarathon.jsx`
- ✅ Removed `verifyPayment()` function
- ✅ Removed `paymentStatus: "verified"` from confirm registration
- ✅ Simplified status update to only send `status` field
- ✅ Payment screenshot viewing still works (stored in `paymentDetails.paymentScreenshot`)

## Benefits

1. **Simpler Logic**: One status field instead of managing two
2. **Less Confusion**: Clear what each status means
3. **Easier Maintenance**: Fewer edge cases to handle
4. **Better UX**: Admin only needs to approve/reject, not manage payment separately
5. **Cleaner Code**: Removed redundant paymentStatus logic throughout

## Migration Notes

- Existing registrations with `paymentDetails.paymentStatus` will still have that data in the database, but it's no longer used
- The model will ignore the old `paymentStatus` field
- No data migration needed - the field will simply be ignored
- Future registrations won't have `paymentStatus` at all

## Status Meanings

| Status | Meaning | Admin Action |
|--------|---------|--------------|
| `pending` | Awaiting approval | Review screenshot & approve/reject |
| `confirmed` | Approved & payment verified | Registration complete |
| `cancelled` | Rejected | Registration invalid |

## Related Files
- `/backend/models/Marathon.js`
- `/backend/controllers/marathon.controller.js`
- `/frontend/src/pages/admin/AdminMarathon.jsx`
