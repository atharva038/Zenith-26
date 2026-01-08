# Unified Logic Architecture - Women's Tournament

## 🎯 Overview
The mobile and desktop views for Women's Tournament Admin now share **100% identical logic**. Only the UI presentation differs.

## 🏗️ Architecture Pattern

### Single Source of Truth (Parent Component)
**File:** `/frontend/src/pages/AdminWomenTournament.jsx`

**Responsibilities:**
- ✅ Fetch registrations from API
- ✅ Manage all filters state (`search`, `category`, `sport`, `status`)
- ✅ Handle status updates
- ✅ Handle registration rejection/restoration
- ✅ Filter registrations by sport (client-side)
- ✅ Separate active vs rejected registrations
- ✅ Provide category-sports mapping
- ✅ Export CSV functionality

### Shared Logic Flow

```javascript
// 1. Parent fetches data from API
fetchRegistrations() → registrations array

// 2. Parent applies sport filter (client-side)
filteredRegistrations = registrations.filter(reg => 
  filters.sport ? reg.selectedSports?.includes(filters.sport) : true
)

// 3. Parent separates active vs rejected
activeRegistrations = filteredRegistrations.filter(reg => !reg.isRejected)
rejectedRegistrations = filteredRegistrations.filter(reg => reg.isRejected)

// 4. Parent passes data to child components
<MobileView 
  registrations={registrations}
  filters={filters}
  activeRegistrations={activeRegistrations}
  rejectedRegistrations={rejectedRegistrations}
  onFilterChange={(filter) => setFilters({...filters, ...filter})}
/>
```

## 📱 Mobile Component (Presentation Layer)
**File:** `/frontend/src/components/mobile/WomenTournamentRegistrations.jsx`

**Receives from Parent:**
```javascript
{
  registrations,           // Full list
  loading,                 // Loading state
  filters,                 // Current filter values
  onFilterChange,          // Update filter callback
  categorySportsMap,       // Sports by category
  onViewDetails,           // View modal callback
  onUpdateStatus,          // Status update callback
  onReject,                // Reject/restore callback
  activeRegistrations,     // Pre-filtered active list
  rejectedRegistrations    // Pre-filtered rejected list
}
```

**Only UI Responsibilities:**
- 🎨 Render mobile-optimized search bar
- 🎨 Render filter toggle and panels
- 🎨 Render registration cards
- 🎨 Render rejected registrations section
- 🎨 Generate PDF exports (same logic as desktop)

**Does NOT:**
- ❌ Manage its own filter state
- ❌ Filter registrations locally
- ❌ Call APIs directly
- ❌ Make status update decisions

## 🖥️ Desktop Component (Presentation Layer)
**File:** `/frontend/src/pages/AdminWomenTournament.jsx` (desktop section)

**Uses Same Data:**
- Uses `activeRegistrations` for table
- Uses `rejectedRegistrations` for rejected section
- Uses `filters` state for filter dropdowns
- Calls same handlers (`handleStatusUpdate`, `handleDelete`)

**Only UI Differences:**
- 🎨 Table layout instead of cards
- 🎨 Different filter UI (dropdowns instead of panels)
- 🎨 Statistics cards visible
- 🎨 CSV export button alongside PDF

## 🔄 Filter Synchronization

### How Filters Work (Identical Logic):

```javascript
// 1. User changes filter in mobile/desktop
onFilterChange({ category: "category1" })

// 2. Parent updates state
setFilters({...filters, category: "category1", sport: ""}) // Reset sport

// 3. Parent re-fetches from API with new filters
useEffect(() => {
  fetchRegistrations()
}, [filters])

// 4. API returns filtered data
// 5. Parent applies client-side sport filter
// 6. Parent separates active/rejected
// 7. Both mobile and desktop receive updated data
```

### Filter Reset Logic (Identical):

**Mobile:**
```javascript
const handleClearFilters = () => {
  onFilterChange({ search: "", category: "", sport: "", status: "" });
};
```

**Desktop:**
```javascript
// Direct state update (parent level)
setFilters({ search: "", category: "", sport: "", status: "", page: 1, limit: 50 });
```

### Category Change Logic (Identical):

```javascript
const handleCategoryChange = (category) => {
  onFilterChange({
    category: category,
    sport: "", // Always reset sport when category changes
  });
};
```

## 📄 PDF Export (Identical Logic)

Both mobile and desktop use **exactly the same** PDF generation:

```javascript
const handleExportToPDF = () => {
  // 1. Same title and date
  doc.text("Zenith 2026 - Women's Tournament", 14, 20);
  
  // 2. Same filter info display
  if (filters.status || filters.category || filters.sport) {
    // Display filter info
  }
  
  // 3. Same data source
  const tableData = activeRegistrations.map((reg, index) => [
    index + 1,
    reg.name || "N/A",
    reg.mobileNumber || "N/A",
    reg.selectedCategory === "category1" ? "Cat 1" : 
      reg.selectedCategory === "category2" ? "Cat 2" : "Cat 3",
    reg.selectedSports?.join(", ") || "N/A",
    reg.category3TeamName || "-",
  ]);
  
  // 4. Same column configuration
  columnStyles: {
    0: { cellWidth: 10, halign: 'center' },  // #
    1: { cellWidth: 45 },                     // Name
    2: { cellWidth: 30 },                     // Mobile
    3: { cellWidth: 20, halign: 'center' },  // Category
    4: { cellWidth: 55 },                     // Sports
    5: { cellWidth: 35 },                     // Team
  }
  
  // 5. Same filename generation
  let fileName = "Zenith_2026_Women_Tournament";
  if (filters.category) fileName += "_Cat1/2/3";
  if (filters.sport) fileName += "_SportName";
  fileName += `_${date}.pdf`;
};
```

## 🛡️ Benefits of Unified Architecture

### 1. **Single Source of Truth**
- One place to fix bugs
- One place to add features
- One place to update logic

### 2. **Consistency Guaranteed**
- Mobile and desktop always show same data
- Filters work identically
- Status updates reflected everywhere

### 3. **Easier Maintenance**
- Change logic once, affects both views
- No sync issues between mobile/desktop
- Clear separation of concerns

### 4. **Type Safety**
- Props explicitly define contract
- Parent controls all data flow
- Children are pure presentation

### 5. **Testing Benefits**
- Test logic once in parent
- Test UI separately for mobile/desktop
- Mock props for isolated testing

## 🎯 Key Principles

### ✅ DO:
1. Keep all business logic in parent
2. Pass data down via props
3. Use callbacks for user actions
4. Keep children stateless (UI state only)
5. Share helper functions/constants

### ❌ DON'T:
1. Duplicate filtering logic in children
2. Make API calls from children
3. Store filters in child state
4. Implement different logic per view
5. Let children make data decisions

## 🔍 Example: Adding New Filter

**✅ Correct Way:**

1. Add filter to parent state:
```javascript
const [filters, setFilters] = useState({
  search: "",
  category: "",
  sport: "",
  status: "",
  paymentStatus: "", // NEW
});
```

2. Update API call to include new filter
3. Pass filter to both mobile and desktop
4. Add UI in mobile component:
```javascript
<select 
  value={filters.paymentStatus || ""} 
  onChange={(e) => onFilterChange({ paymentStatus: e.target.value })}
>
  <option value="">All Payment Status</option>
  <option value="completed">Completed</option>
  <option value="pending">Pending</option>
</select>
```

5. Add UI in desktop component (same logic, different style)

**❌ Wrong Way:**
```javascript
// Mobile component
const [paymentFilter, setPaymentFilter] = useState(""); // ❌ Local state
const filtered = registrations.filter(r => 
  paymentFilter ? r.paymentStatus === paymentFilter : true
); // ❌ Local filtering
```

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────┐
│   AdminWomenTournament (Parent)         │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ State Management                │   │
│  │ - filters                       │   │
│  │ - registrations                 │   │
│  │ - statistics                    │   │
│  │ - loading                       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Business Logic                  │   │
│  │ - fetchRegistrations()          │   │
│  │ - handleStatusUpdate()          │   │
│  │ - handleDelete()                │   │
│  │ - Filter by sport (client)      │   │
│  │ - Separate active/rejected      │   │
│  └─────────────────────────────────┘   │
│                                         │
└───────────┬─────────────────┬───────────┘
            │                 │
            ▼                 ▼
┌─────────────────┐  ┌─────────────────┐
│  Mobile View    │  │  Desktop View   │
│  (UI Only)      │  │  (UI Only)      │
│                 │  │                 │
│ - Cards         │  │ - Table         │
│ - Bottom Nav    │  │ - Statistics    │
│ - Mobile PDF    │  │ - Desktop PDF   │
└─────────────────┘  └─────────────────┘
```

## 🚀 Future Additions

When adding new features, always ask:

1. **Is this business logic or UI?**
   - Business logic → Add to parent
   - UI → Add to child component

2. **Does mobile and desktop need this?**
   - Yes → Add to parent, pass down
   - No → Keep in specific child

3. **Will this affect data?**
   - Yes → Handle in parent
   - No → Handle in child (UI state only)

## 📝 Conclusion

This architecture ensures:
- ✅ **Zero logic duplication** between mobile and desktop
- ✅ **Single source of truth** for all data and state
- ✅ **Easy maintenance** - fix once, works everywhere
- ✅ **Type-safe props** - clear contracts between components
- ✅ **Testable** - logic and UI tested separately

**Remember:** Parent controls the data, children control the presentation. Keep it that way! 🎯
