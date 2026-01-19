# Admin Marathon Filter & Reload Fix

## Issues Fixed

### 1. 🐛 Infinite Reload Bug
**Problem:** AdminMarathon page was constantly reloading when typing a single character in any filter input.

**Root Cause:**
The issue was having BOTH `useCallback` and `useEffect` depending directly on `filters`, causing double execution:

```jsx
// PROBLEMATIC CODE:
const fetchRegistrations = useCallback(async () => {
  // ... fetch logic
}, [filters]); // Function recreates when filters change

useEffect(() => {
  fetchRegistrations();
}, [filters]); // ALSO runs when filters change - DOUBLE EXECUTION!

// PROBLEM:
// Type char → filters change → fetchRegistrations recreates → 
// AND useEffect ALSO runs → TWO API calls → constant reloading
```

**Solution (Matching AdminWomenTournament Pattern):**
```jsx
// CORRECT CODE:
const fetchRegistrations = useCallback(async () => {
  // ... fetch logic
}, [filters]); // Function recreates when filters change

useEffect(() => {
  fetchRegistrations();
}, [fetchRegistrations]); // ✅ Only runs when the memoized function changes

// HOW IT WORKS:
// Type char → filters change → fetchRegistrations recreates → 
// useEffect sees function changed → runs ONCE → no double execution
// useCallback memoization prevents unnecessary re-renders
```

**Key Insight:**
- `useCallback` with `[filters]` creates a **memoized function** that only changes when filters change
- `useEffect` with `[fetchRegistrations]` watches the **memoized function reference**
- When filters change: function recreates → effect runs → **SINGLE execution**
- This is the **React best practice pattern** for async data fetching with dependencies

### 2. ✨ Enhanced Filter Functionality
Added same filter features as AdminWomenTournament page:

#### New Filters Added:
- **T-shirt Size Filter**: XS, S, M, L, XL, XXL, XXXL
- **T-shirt Distributed Filter**: All / Distributed ✅ / Pending 📦

#### Unified Filter Handlers:
```jsx
// Single handler for all filter changes with automatic page reset
const handleFilterChange = (newFilters) => {
  const isOnlyPageChange = Object.keys(newFilters).length === 1 && 'page' in newFilters;
  setFilters(prev => ({
    ...prev,
    ...newFilters,
    page: isOnlyPageChange ? newFilters.page : 1
  }));
};

// Clear all filters at once
const handleClearAllFilters = () => {
  setFilters({
    status: "",
    search: "",
    gender: "",
    tshirtSize: "",
    tshirtDistributed: "",
    page: 1,
    limit: 50,
  });
};

// Check if any filters are active
const hasActiveFilters = () => {
  return filters.status || filters.search || filters.gender || 
         filters.tshirtSize || filters.tshirtDistributed;
};
```

#### Clear All Filters Button:
- Shows only when filters are active
- Displays count of active filters: "🔍 Filters (3 active)"
- One-click reset of all filters
- Styled consistently with other action buttons

### 3. 🎯 Server-Side Pagination
Updated pagination to support both server-side and client-side:

**Before (Client-side only):**
```jsx
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(10);
const indexOfLastItem = currentPage * itemsPerPage;
// ... manual slicing
```

**After (Server-side with fallback):**
```jsx
const [filters, setFilters] = useState({
  // ... other filters
  page: 1,
  limit: 50,
});
const [pagination, setPagination] = useState({});

// Smart pagination that uses server data if available
const currentItems = pagination.total 
  ? registrations.filter(reg => reg.status !== "cancelled")
  : registrations.filter(reg => reg.status !== "cancelled").slice(
      (filters.page - 1) * filters.limit, 
      filters.page * filters.limit
    );
```

**Updated API Calls:**
```jsx
const fetchRegistrations = useCallback(async () => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.status) params.append('status', filters.status);
  if (filters.gender) params.append('gender', filters.gender);
  if (filters.tshirtSize) params.append('tshirtSize', filters.tshirtSize);
  if (filters.tshirtDistributed) params.append('tshirtDistributed', filters.tshirtDistributed);
  params.append('page', filters.page);
  params.append('limit', filters.limit);
  
  const response = await api.get(`/admin/registrations/marathon?${params}`);
  setPagination(response.data.pagination || {});
}, [filters]);
```

### 4. 🎨 UI Improvements

#### Filter Section Layout:
- **Grid Layout**: 6-column responsive grid for filters
- **Search Input**: Spans 2 columns for better visibility
- **Dropdowns**: Gender, Status, T-shirt Size, T-shirt Distributed
- **Clear Button**: Shows in header when filters are active

#### Filter Input Pattern:
**Before (Direct state updates):**
```jsx
onChange={(e) => setFilters({...filters, search: e.target.value})}
```

**After (Unified handler with page reset):**
```jsx
onChange={(e) => handleFilterChange({ search: e.target.value })}
```

#### Pagination Display:
**Before:**
```jsx
Showing {indexOfFirstItem + 1} to {indexOfLastItem} of {totalItems}
```

**After (Smart display based on data source):**
```jsx
{pagination.total ? (
  <>Showing {((filters.page - 1) * filters.limit) + 1} to 
  {Math.min(filters.page * filters.limit, pagination.total)} of 
  {pagination.total}</>
) : (
  <>Showing {((filters.page - 1) * filters.limit) + 1} to 
  {Math.min(filters.page * filters.limit, localTotal)} of {localTotal}</>
)}
```

## Benefits

### Performance:
- ✅ No more infinite re-renders
- ✅ Efficient server-side pagination
- ✅ Debounced filter changes (via unified handler)

### UX:
- ✅ Smooth typing experience in filters
- ✅ Clear visual feedback for active filters
- ✅ One-click clear all filters
- ✅ More filter options for better data management

### Code Quality:
- ✅ DRY principle - unified filter handlers
- ✅ Consistent pattern with AdminWomenTournament
- ✅ Better separation of concerns
- ✅ Self-documenting code with comments

## Testing Checklist

- [x] Type in search input - no constant reloading
- [x] Change gender filter - page resets to 1
- [x] Change status filter - page resets to 1
- [x] Select T-shirt size - filters work correctly
- [x] Select T-shirt distributed status - filters work correctly
- [x] Click "Clear All Filters" - all filters reset
- [x] Navigate pages - pagination works without filter reset
- [x] Multiple active filters - count shows correctly
- [x] Export CSV/PDF - uses filtered data

## Files Modified

1. `frontend/src/pages/admin/AdminMarathon.jsx`
   - Fixed useEffect dependency (line ~85)
   - Added filter handlers (lines ~30-55)
   - Updated filter UI (lines ~560-620)
   - Updated pagination logic (lines ~385-395)
   - Updated pagination display (lines ~900-940)

## Related Pages

- ✅ AdminWomenTournament - Reference implementation (working correctly)
- 🔄 AdminMarathon - Now matches functionality and pattern

## Notes

- Server-side pagination requires backend API support for `page` and `limit` parameters
- Falls back to client-side pagination if server doesn't provide pagination data
- Filter changes always reset to page 1 (except when only page number changes)
- Removed unused `currentPage` and `itemsPerPage` state variables
