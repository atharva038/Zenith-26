# Women's Tournament Admin Integration - Documentation

## Overview
Successfully integrated Women's Tournament registration data with the admin panel. All form submissions are now stored in MongoDB and can be viewed, filtered, and managed by admins.

## Features Implemented

### 🎯 Backend (Node.js + MongoDB)

#### 1. Database Model (`backend/models/WomenTournament.js`)
- **Fields:**
  - name, registrationNumber, mobileNumber
  - selectedCategory (category1, category2, category3)
  - selectedSports (array of sport names)
  - category3TeamName (optional, for team events)
  - status (pending, confirmed, cancelled)
  - paymentStatus (pending, completed, failed, not_required)
  - totalAmount (auto-calculated based on category)
  - timestamps (createdAt, updatedAt)
  
- **Auto-calculation Logic:**
  - Category 1: ₹49 (unlimited pool)
  - Category 2: ₹49 × number of sports selected
  - Category 3: ₹199 × number of sports selected

#### 2. API Routes (`backend/routes/womenTournament.routes.js`)

**Public Routes:**
- `POST /api/women-tournament/register` - Submit registration

**Admin Routes (Protected):**
- `GET /api/women-tournament/admin/registrations` - List all registrations with filters
- `GET /api/women-tournament/admin/registrations/:id` - Get single registration details
- `PATCH /api/women-tournament/admin/registrations/:id/status` - Update status/payment status
- `DELETE /api/women-tournament/admin/registrations/:id` - Delete registration
- `GET /api/women-tournament/admin/registrations/export/csv` - Export to CSV

**Query Parameters for Listing:**
- `page`, `limit` - Pagination
- `search` - Search by name, registration number, or mobile
- `category` - Filter by category (category1, category2, category3)
- `status` - Filter by status (confirmed, pending, cancelled)
- `sortBy`, `sortOrder` - Sorting options

#### 3. Server Integration (`backend/server.js`)
- Added route: `/api/women-tournament`
- Imported WomenTournament model

### 🎨 Frontend (React)

#### 1. Registration Form Updates (`frontend/src/pages/WomenTournamentPage.jsx`)
- Integrated with backend API
- Shows loading state during submission
- Displays success/error messages using toast notifications
- Auto-calculates and displays total amount
- Form validation before submission
- Proper error handling

#### 2. Admin Panel (`frontend/src/pages/AdminWomenTournament.jsx`)

**Statistics Dashboard:**
- Total Registrations count
- Total Revenue (₹)
- Confirmed vs Pending counts
- Category-wise breakdown (Cat 1, 2, 3)

**Filters & Search:**
- Search by name, registration number, or mobile
- Filter by category
- Filter by status
- Pagination support

**Registration Table:**
- Displays all registrations in a sortable table
- Shows: Date, Name, Reg No, Mobile, Category, Sports Count, Amount, Status
- Click "View" to see full details

**Details Modal:**
- Full registration information
- Update status (confirmed/pending/cancelled)
- Update payment status (pending/completed/failed/not_required)
- Delete registration (with confirmation)

**Export Functionality:**
- Export filtered data to CSV
- Includes all registration details

#### 3. Navigation Updates
- Added "Women's Tournament" to admin sidebar
- Icon: 👩‍🎓
- Route: `/admin/women-tournament`

#### 4. App Routes (`frontend/src/App.jsx`)
- Added protected route: `/admin/women-tournament`

## API Endpoints Reference

### Public Endpoint
```
POST /api/women-tournament/register
Body: {
  name: string,
  registrationNumber: string,
  mobileNumber: string,
  selectedCategory: "category1" | "category2" | "category3",
  selectedSports: string[],
  category3TeamName?: string
}
```

### Admin Endpoints (Require Authentication)
```
GET /api/women-tournament/admin/registrations?page=1&limit=50&search=&category=&status=
GET /api/women-tournament/admin/registrations/:id
PATCH /api/women-tournament/admin/registrations/:id/status
DELETE /api/women-tournament/admin/registrations/:id
GET /api/women-tournament/admin/registrations/export/csv
```

## How to Use

### For Users:
1. Visit `/women-tournament`
2. Click "Register Now" on any category
3. Fill out the form with personal details
4. Select category from dropdown
5. Select sports (checkboxes)
6. For Category 3, enter team name
7. Submit registration
8. Receive confirmation with total amount

### For Admins:
1. Login to admin panel
2. Navigate to "Women's Tournament" in sidebar
3. View statistics dashboard
4. Use filters to search/filter registrations
5. Click "View" on any registration to see details
6. Update status or payment status as needed
7. Export data to CSV for offline analysis

## Database Schema

```javascript
{
  name: String (required),
  registrationNumber: String (required, indexed),
  mobileNumber: String (required),
  selectedCategory: String (enum, required),
  selectedSports: [String] (required),
  category3TeamName: String (optional),
  status: String (enum: pending/confirmed/cancelled),
  paymentStatus: String (enum: pending/completed/failed/not_required),
  totalAmount: Number (auto-calculated),
  notes: String,
  ipAddress: String,
  userAgent: String,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Testing Checklist

### Frontend Testing:
- ✅ Form submission works
- ✅ Validation messages display correctly
- ✅ Toast notifications appear
- ✅ Form resets after successful submission
- ✅ Category dropdown shows/hides sports correctly
- ✅ Team name field appears for Category 3

### Backend Testing:
- ✅ Registration creates database entry
- ✅ Duplicate registration number is prevented
- ✅ Amount is calculated correctly
- ✅ Admin can view all registrations
- ✅ Filters and search work
- ✅ Status updates save correctly
- ✅ CSV export works

### Admin Panel Testing:
- ✅ Statistics display correctly
- ✅ Table loads with data
- ✅ Pagination works
- ✅ Search filters data
- ✅ Details modal shows full info
- ✅ Status updates work
- ✅ Delete functionality works

## Security Features

1. **Admin Routes Protected:** All admin endpoints require authentication
2. **Input Validation:** Server-side validation for all fields
3. **Duplicate Prevention:** Checks for duplicate registration numbers
4. **XSS Protection:** Using parameterized queries with Mongoose
5. **Rate Limiting:** Consider adding rate limiting for public registration endpoint

## Future Enhancements

1. **Email Notifications:** Send confirmation emails after registration
2. **Payment Integration:** Add payment gateway integration
3. **QR Code Scanner:** Real QR codes for payment verification
4. **Analytics:** Add detailed analytics and charts
5. **Bulk Operations:** Bulk status updates, bulk delete
6. **Advanced Filters:** Date range, amount range filters
7. **Registration Dashboard:** Public page to check registration status

## Files Created/Modified

### Created:
- `backend/models/WomenTournament.js`
- `backend/routes/womenTournament.routes.js`
- `frontend/src/pages/AdminWomenTournament.jsx`

### Modified:
- `backend/server.js`
- `frontend/src/pages/WomenTournamentPage.jsx`
- `frontend/src/App.jsx`
- `frontend/src/components/AdminSidebar.jsx`

## Support

For issues or questions, check:
1. Browser console for frontend errors
2. Backend logs for API errors
3. MongoDB for data verification
4. Network tab for API request/response debugging
