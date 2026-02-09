# Sports Registration Filter Fix

## Issue
When Cricket registration was enabled (but Other Sports was disabled), the registration page was showing ALL sports instead of just Cricket.

## Root Cause
The `UniversalRegistration.jsx` page was using the old `isOpen` field from the registration status hook and was rendering `Object.keys(SPORTS_DATA)` (all sports) without filtering based on the new toggle states.

## Solution

### 1. Updated Registration Status Hook Usage
Changed from single `isOpen` to separate toggle states:

```javascript
// OLD
const { isOpen, loading: statusLoading, message, startDate, endDate } = useRegistrationStatus();

// NEW
const { 
  isCricketOpen, 
  isOtherSportsOpen, 
  isOpen, 
  loading: statusLoading, 
  message, 
  startDate, 
  endDate,
  paymentQrUrl 
} = useRegistrationStatus();
```

### 2. Added Sports Filtering Logic
Created `availableSports` computed value that filters sports based on toggle states:

```javascript
const availableSports = React.useMemo(() => {
  const allSports = Object.keys(SPORTS_DATA);
  
  // If both are closed, show nothing
  if (!isCricketOpen && !isOtherSportsOpen) {
    return [];
  }
  
  // If only cricket is open, show only cricket (NOT Box Cricket)
  if (isCricketOpen && !isOtherSportsOpen) {
    return allSports.filter(sport => sport === "Cricket");
  }
  
  // If only other sports are open, show other sports (excluding cricket, but including Box Cricket)
  if (!isCricketOpen && isOtherSportsOpen) {
    return allSports.filter(sport => sport !== "Cricket");
  }
  
  // If both are open, show all sports
  return allSports;
}, [isCricketOpen, isOtherSportsOpen]);
```

### 3. Updated Sports Grid Rendering
Changed the sports grid to use `availableSports` instead of all sports:

```javascript
// OLD
{Object.keys(SPORTS_DATA).map((sport, index) => (

// NEW
{availableSports.map((sport, index) => (
```

### 4. Updated "OPEN NOW!" Badge
Updated the green badge to show ONLY for Cricket (not Box Cricket):

```javascript
// OLD
{(sport === "Cricket" || sport === "Box Cricket") && selectedSport !== sport && (

// NEW
{sport === "Cricket" && selectedSport !== sport && (
```

### 5. Updated Registration Closed Check
Changed the condition to check BOTH toggles:

```javascript
// OLD
if (!isOpen) {
  return <RegistrationClosed message={message} startDate={startDate} endDate={endDate} />;
}

// NEW
if (!isCricketOpen && !isOtherSportsOpen) {
  return <RegistrationClosed message={message} startDate={startDate} endDate={endDate} />;
}
```

## Expected Behavior After Fix

| Cricket Toggle | Other Sports Toggle | Sports Shown in Registration Page |
|----------------|---------------------|-----------------------------------|
| ❌ OFF | ❌ OFF | "Coming Soon" page (no registration) |
| ✅ ON | ❌ OFF | Only Cricket (NOT Box Cricket) |
| ❌ OFF | ✅ ON | All sports EXCEPT Cricket (includes Box Cricket) |
| ✅ ON | ✅ ON | ALL sports |

## Important Note
**Box Cricket is treated as a separate sport from Cricket:**
- Cricket toggle controls ONLY "Cricket" ✅
- Other Sports toggle controls everything else including "Box Cricket" ✅
- This allows flexible registration control (e.g., open Cricket but keep Box Cricket closed)

## Testing

### Current Database State:
- 🏏 Cricket: ✅ OPEN
- ⚽ Other Sports: ❌ CLOSED

### Expected Result:
1. Navigate to `/register-sports`
2. Should see ONLY:
   - Cricket 🏏 (with green "OPEN NOW!" badge)
3. Should NOT see:
   - Box Cricket 🏏 (moved to Other Sports)
   - Football ⚽
   - Basketball 🏀
   - Volleyball 🏐
   - etc.

### Test Other Scenarios:
1. **Turn Other Sports ON** → Refresh `/register-sports` → Should see all sports
2. **Turn Cricket OFF** → Refresh `/register-sports` → Should see all sports except Cricket
3. **Turn both OFF** → Refresh `/register-sports` → Should see "Coming Soon" page

## Files Changed
- ✅ `frontend/src/pages/UniversalRegistration.jsx`
  - Added `availableSports` filtering logic
  - Updated sports grid rendering
  - Updated registration closed condition
  - Updated "OPEN NOW!" badge logic

## Notes
- **Box Cricket is treated as a separate sport, NOT grouped with Cricket**
- Box Cricket appears under "Other Sports" toggle, NOT "Cricket" toggle
- The filtering happens at render time using `React.useMemo` for performance
- The registration status is fetched from the API on page load
- Changes are immediate - no page refresh needed after toggling (but user needs to refresh the registration page to see changes)

---

**Fix Applied:** February 9, 2026  
**Updated:** February 9, 2026 (Box Cricket moved to Other Sports)  
**Status:** ✅ Complete  
**Tested:** Pending user verification
