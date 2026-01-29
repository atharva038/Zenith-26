# Sports Registrations Admin Panel Documentation

## Overview
Complete admin panel for managing sports event registrations at Zenith 2026. Provides comprehensive tools for viewing, filtering, exporting, and managing all sports registrations.

## Access
**URL:** `/admin/sports-registrations`  
**Authentication:** Requires admin login  
**Menu Location:** Admin Sidebar → "Sports Registrations" (🏆 icon)

---

## Features

### 📊 Dashboard Statistics
Real-time statistics displayed at the top of the page:

1. **Total Teams** - Number of teams registered across all sports
2. **Total Players** - Sum of all players from all teams
3. **Need Accommodation** - Count of teams requiring accommodation
4. **Payment Pending** - Count of registrations with pending payments

### 🏆 Sport-wise Statistics
Visual breakdown showing registration count for each sport:
- Cricket, Football, Basketball, Volleyball, Badminton
- Table Tennis, Chess, Carrom, Athletics, Swimming
- Kabaddi, Kho-Kho, Hockey, Lawn Tennis, Squash

**Interactive:** Click any sport card to filter registrations for that sport.

### 🔍 Advanced Filters

#### Sport Filter
- Dropdown with all 15 sports + "All Sports" option
- Instantly filters table to show only selected sport
- Default: "All Sports"

#### Status Filter
- **Confirmed** - Registration approved
- **Pending** - Awaiting review
- **Cancelled** - Registration cancelled
- **Waitlist** - On waiting list
- Default: All statuses

#### Payment Status Filter
- **Pending** - Payment verification pending
- **Completed** - Payment verified
- **Failed** - Payment failed
- Default: All payment statuses

#### Accommodation Filter
- **Need Accommodation** - Teams requiring accommodation
- **No Accommodation** - Teams not requiring accommodation
- Default: All teams

#### Search Filter
Real-time search across:
- Team name
- Captain name
- Email address
- Phone number
- Institution name
- Registration number

#### Clear Filters
One-click button to reset all filters to defaults.

---

## 📋 Registrations Table

### Columns:
1. **#** - Serial number
2. **Reg. No.** - Unique registration number (clickable)
3. **Sport** - Sport name in purple
4. **Team Name** - Team's name
5. **Captain** - Captain's full name
6. **Contact** - Captain's phone number
7. **Institution** - College/University name
8. **Players** - Number of team members
9. **Status** - Color-coded badge:
   - 🟢 Green: Confirmed
   - 🟡 Yellow: Pending
   - 🔴 Red: Cancelled
   - ⚪ Gray: Other
10. **Actions** - "View Details" button

### Table Features:
- **Pagination** - 50 items per page (configurable)
- **Loading States** - Smooth loading spinners
- **Hover Effects** - Row highlights on hover
- **Responsive** - Horizontal scroll on mobile
- **Smooth Animations** - Fade-in animations for rows

---

## 📄 Export Functions

### Export to PDF
**Features:**
- Professional PDF layout with title and generation date
- Table format with all key registration details
- Filtered by current sport selection
- Auto-generated filename: `sports-registrations-{sport}-{timestamp}.pdf`

**Includes:**
- Registration number
- Sport name
- Team name
- Captain name and contact
- Institution
- Number of players
- Status

**Library:** jsPDF with autoTable plugin

### Export to CSV
**Features:**
- Complete data export with all fields
- Excel-compatible format
- Filtered by current sport selection
- Auto-generated filename: `sports-registrations-{sport}-{timestamp}.csv`

**Includes All Fields:**
- Registration number
- Sport
- Team details (name, players)
- Captain details (name, contact, email)
- Institution details (name, city, address)
- Alternate contact
- Accommodation requirement
- Status and payment status
- Amount paid
- Registration date

---

## 👁️ Registration Details Modal

### Overview Section
- **Registration Number** - Prominently displayed
- **Close Button** - Top-right corner

### Information Sections

#### 1. Sport Information
- Sport name
- Registration date

#### 2. Team Information
- Team name
- Number of players

#### 3. Captain Information
- Full name
- Primary contact number
- Email address
- Alternate contact number

#### 4. Institution Information
- Institution name
- City
- Full college address

#### 5. Accommodation
- Visual indicator (✓ or ✗)
- "Accommodation Required" or "No Accommodation Required"

#### 6. Payment Information
- Entry fee amount (₹500)
- Payment status with color-coded badge

### Documents Section
Three document cards (clickable to view):

1. **Permission Letter**
   - Official college permission
   - Click to open full-screen viewer

2. **Transaction Receipt**
   - Payment proof/screenshot
   - Click to open full-screen viewer

3. **Captain ID Card**
   - College ID proof
   - Click to open full-screen viewer

### Status Update Actions
Two action buttons at bottom:

1. **✓ Confirm Registration** (Green)
   - Changes status to "confirmed"
   - Only shown if status is not already confirmed
   - Triggers confirmation email

2. **✗ Cancel Registration** (Red)
   - Changes status to "cancelled"
   - Only shown if status is not already cancelled
   - Confirmation recommended

### Modal Features:
- **Click Outside to Close** - Click backdrop to dismiss
- **Scroll Lock** - Page scrolling disabled when modal open
- **Smooth Animations** - Fade and scale entrance/exit
- **Responsive** - Adapts to mobile screens
- **Max Height** - Scrollable content if too tall

---

## 🖼️ Screenshot/Document Viewer Modal

### Features:
- **Full-Screen Viewing** - Large display of document image
- **White Background** - Clear viewing experience
- **Document Title** - Shows type (Permission Letter, etc.)
- **Close Button** - Top-right corner
- **Click Outside** - Dismiss by clicking backdrop
- **Responsive** - Scales to fit any screen size
- **Smooth Animations** - Fade and scale effects

### Supported Formats:
- Images: JPG, PNG
- Note: PDFs display as embedded object

---

## 🎨 UI/UX Features

### Color Scheme
- **Background:** Gradient from gray-900 via purple-900 to gray-900
- **Cards:** White/10 opacity with backdrop blur
- **Borders:** White/20 opacity
- **Primary Accent:** Purple-400 to Pink-400 gradient
- **Text:** White (primary), Gray-300/400 (secondary)

### Responsive Design
- **Desktop:** Full table with all columns
- **Tablet:** Maintained structure with horizontal scroll
- **Mobile:** Optimized cards, stacked filters

### Animations
- **Page Load:** Stats cards fade in with stagger (0.1s delay each)
- **Table Rows:** Fade in with stagger (0.05s delay each)
- **Modals:** Scale and fade entrance/exit
- **Hover Effects:** Smooth color transitions

### Loading States
1. **Initial Load:** Full-page spinner (first data fetch)
2. **Filter Changes:** Table-only spinner (preserves UI)
3. **Button Disabled:** Gray opacity on disabled export buttons

---

## 🔄 Data Flow

### Registration Fetch Flow
```
User applies filters → handleFilterChange → setFilters (page reset to 1)
→ useEffect triggers → fetchRegistrations
→ API call to /api/registrations with query params
→ Filter sports-only registrations (exclude Marathon, Women's)
→ Apply accommodation filter client-side (if set)
→ Calculate statistics
→ Update UI
```

### Status Update Flow
```
User clicks Confirm/Cancel → handleUpdateStatus
→ PATCH /api/registrations/:id/status
→ Success: Re-fetch registrations + Close modal + Toast notification
→ Error: Show error toast
```

### Export Flow
```
User clicks Export → exportToPDF/exportToCSV
→ Generate file from current registrations array
→ Respect current filter (sport selection)
→ Create blob → Trigger download
→ Success toast notification
```

---

## 🛠️ Technical Implementation

### Frontend Stack
- **React** 18 with Hooks (useState, useEffect, useCallback)
- **React Router** - Navigation and routing
- **Framer Motion** - Animations and modals
- **React Toastify** - Notifications
- **jsPDF + autoTable** - PDF generation
- **Custom Hooks** - useScrollLock for modal management

### State Management
```javascript
const [registrations, setRegistrations] = useState([]);
const [stats, setStats] = useState(null);
const [initialLoading, setInitialLoading] = useState(true);
const [loading, setLoading] = useState(false);
const [selectedRegistration, setSelectedRegistration] = useState(null);
const [showDetailsModal, setShowDetailsModal] = useState(false);
const [showScreenshotModal, setShowScreenshotModal] = useState(false);
const [selectedScreenshot, setSelectedScreenshot] = useState(null);
const [filters, setFilters] = useState({...});
const [pagination, setPagination] = useState({});
```

### API Endpoints Used

#### GET /api/registrations
**Query Parameters:**
- `eventName` - Filter by sport name
- `status` - Filter by registration status
- `paymentStatus` - Filter by payment status
- `search` - Search query
- `page` - Current page number
- `limit` - Items per page

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 247,
    "itemsPerPage": 50
  }
}
```

#### PATCH /api/registrations/:id/status
**Body:**
```json
{
  "status": "confirmed" | "cancelled" | "pending" | "waitlist"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration confirmed successfully",
  "data": {...}
}
```

### Key Functions

#### fetchRegistrations()
- Builds query parameters from filters
- Fetches data from API
- Filters sports-only registrations
- Calculates statistics
- Updates state

#### calculateStats(data)
- Sport-wise counts
- Total teams and players
- Accommodation requirements
- Payment pending count
- Confirmed registrations count

#### handleFilterChange(newFilters)
- Merges new filters with existing
- Resets page to 1 (except when only page changes)
- Triggers re-fetch

#### handleClearAllFilters()
- Resets all filters to defaults
- Triggers re-fetch

#### exportToPDF()
- Creates PDF document
- Adds title and metadata
- Generates table with autoTable
- Triggers download

#### exportToCSV()
- Maps registrations to CSV format
- Creates CSV string
- Generates blob and download link
- Triggers download

---

## 🚀 Performance Optimizations

### 1. useCallback for fetchRegistrations
Prevents unnecessary re-renders and re-fetches.

### 2. Pagination
Limits data transfer to 50 items per page.

### 3. Client-side Statistics
Calculates stats from fetched data (no extra API call).

### 4. Scroll Lock Management
Custom hook prevents scroll interference.

### 5. Lazy Loading
Only loads data when needed (page change, filter change).

### 6. Debouncing (Future Enhancement)
Search filter can benefit from debounce (300ms).

---

## 📱 Mobile Responsiveness

### Breakpoints
- **lg:** Desktop (1024px+) - Full table layout
- **md:** Tablet (768px+) - Maintains structure
- **sm:** Mobile (<768px) - Optimized layout

### Mobile Optimizations
- Statistics cards stack vertically
- Filters stack vertically
- Table horizontal scroll enabled
- Modal full-screen with padding
- Touch-friendly button sizes
- Larger tap targets

---

## 🔒 Security Features

### Authentication
- All routes protected with admin authentication
- Token verification on API calls
- Automatic redirect to login if unauthorized

### Authorization
- Only admin users can access panel
- Status updates require admin privileges
- Document viewing restricted to admins

### Data Validation
- API validates all query parameters
- Status updates validate allowed values
- Registration ID validation before updates

---

## 🐛 Error Handling

### API Errors
- Network errors → Toast notification
- 401 Unauthorized → Redirect to login
- 404 Not Found → "No registrations found" message
- 500 Server Error → "Failed to fetch" toast

### User Input Errors
- Invalid filters → Graceful fallback
- Empty results → "No registrations found" with clear filters button

### Loading Failures
- Failed exports → Error toast with message
- Failed status update → Error toast, modal stays open

---

## 🧪 Testing Checklist

### Functionality Tests
- [ ] Load page → Stats display correctly
- [ ] Filter by each sport → Correct registrations shown
- [ ] Filter by status → Correct filtering
- [ ] Filter by payment status → Works as expected
- [ ] Filter by accommodation → Client-side filter works
- [ ] Search functionality → Searches all fields
- [ ] Clear filters → Resets to defaults
- [ ] Click sport card → Applies filter
- [ ] Export to PDF → File downloads correctly
- [ ] Export to CSV → File downloads with all data
- [ ] View details → Modal opens with correct data
- [ ] View documents → Screenshot modal opens
- [ ] Confirm registration → Status updates, email sent
- [ ] Cancel registration → Status updates
- [ ] Pagination → Next/Previous works

### UI Tests
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Modal closes on backdrop click
- [ ] Modal close button works
- [ ] Animations smooth
- [ ] Loading spinners display correctly
- [ ] Color-coded badges correct colors
- [ ] Hover effects work

### Edge Cases
- [ ] No registrations → Empty state message
- [ ] Single registration → Table renders correctly
- [ ] All filters active → Clear filters works
- [ ] Pagination at last page → Next disabled
- [ ] Pagination at first page → Previous disabled

---

## 🔄 Future Enhancements

### Potential Features
1. **Bulk Actions**
   - Select multiple registrations
   - Bulk confirm/cancel
   - Bulk export

2. **Advanced Analytics**
   - Gender-wise distribution
   - City-wise breakdown
   - Institution-wise stats
   - Accommodation reports

3. **Communication**
   - Send email to specific teams
   - SMS notifications
   - WhatsApp integration

4. **Payment Integration**
   - Manual payment verification
   - Payment receipt upload by admin
   - Payment history log

5. **Document Management**
   - Approve/reject documents
   - Request re-upload
   - Document status tracking

6. **Filtering Enhancements**
   - Date range filter
   - Custom date filters
   - Multiple status selection
   - Save filter presets

7. **Export Enhancements**
   - Custom field selection for export
   - Export templates
   - Scheduled exports
   - Email export to admin

---

## 📞 Support & Maintenance

### Common Issues

#### Issue: Registrations not loading
**Solution:** Check API endpoint, verify admin token, check network

#### Issue: Filters not working
**Solution:** Clear filters, refresh page, check query parameters

#### Issue: Export not downloading
**Solution:** Check browser pop-up blocker, verify registrations array

#### Issue: Modal won't close
**Solution:** Check scroll lock, verify event handlers

### Maintenance Tasks
- Monitor API performance
- Review error logs
- Update sport list if needed
- Optimize query performance
- Review user feedback

---

## 📚 Related Documentation
- `SPORTS_REGISTRATION_SYSTEM.md` - User-facing registration system
- `EVENT_SYSTEM_SIMPLIFICATION.md` - System architecture changes
- Admin authentication documentation
- Backend API documentation

---

**Last Updated:** January 2026  
**Version:** 1.0  
**Status:** ✅ Complete and Production Ready
