# Test Data Auto-Fill Feature

## Overview
Added a development tool to quickly fill test data in the sports registration form for faster testing.

## Changes Made

### 1. Schedule Page Date Update
**File:** `frontend/src/pages/Schedule.jsx`

**Updated Event Dates:**
- ❌ Old: July 17, 2026
- ✅ New: **February 20-22, 2026**

```jsx
<p className="text-gray-400 mt-2">
  📅 <span className="font-semibold text-white">20th - 22nd February 2026</span>
</p>
```

### 2. Test Data Auto-Fill Function
**File:** `frontend/src/pages/UniversalRegistration.jsx`

**New Function:** `fillTestData()`

**Features:**
- ✅ Fills all basic form fields with realistic test data
- ✅ Auto-generates team members for team sports
- ✅ Respects sport-specific configurations (min/max players)
- ✅ Fills accommodation details
- ✅ Sets captain selection to first player

**Test Data Filled:**
```javascript
{
  captain_name: "Atharva Sharma",
  institution: "MIT College of Engineering",
  captain_contact: "9876543210",
  email: "atharva.test@example.com",
  team_name: "Thunder Strikers" (for Cricket) / "{Sport} Warriors",
  num_players: (Auto-calculated based on sport config),
  city: "Pune",
  college_address: "MIT Campus, Paud Road, Kothrud, Pune - 411038",
  alternate_contact: "9123456789",
  need_accommodation: true,
  accommodation_days: "3",
  accommodation_people: "5"
}
```

**Team Members:**
- Auto-generates players: "Player 1", "Player 2", etc.
- Contact numbers: 9876543201, 9876543202, etc.
- Number of players matches sport requirements

### 3. UI Button Added
**Location:** Step 1 - Sport Selection page

**Button Features:**
- 🧪 Blue gradient design (distinguishes it from main actions)
- Only appears after a sport is selected
- Positioned on the left side (Continue button on the right)
- Smooth hover animations
- Success toast notification on click

**Visual Design:**
```jsx
<button className="bg-gradient-to-r from-blue-600 to-blue-500">
  🧪 Fill Test Data
</button>
```

## Usage Instructions

### How to Use:
1. Navigate to `/register-sports` page
2. Select any sport (e.g., Cricket, Football, Basketball)
3. Click **"🧪 Fill Test Data"** button (appears in bottom-left)
4. Click **"Continue →"** to proceed to next step
5. All form fields will be pre-filled with test data
6. Team members (if applicable) will be auto-added

### Benefits:
- ⚡ **Faster Testing** - No need to manually type test data
- ✅ **Valid Data** - All fields follow validation rules
- 🎯 **Sport-Specific** - Respects team size requirements
- 🧪 **Development Only** - Easy to identify with 🧪 emoji

## Validation Compliance

The test data fills values that pass all validations:
- ✅ Captain contact: 10 digits
- ✅ Email: Valid format
- ✅ Team size: Matches sport requirements
- ✅ All required fields filled
- ✅ Accommodation data: Valid numbers

## Important Notes

### Production Consideration:
⚠️ This is a **development tool**. Consider:
- Adding environment check: `import.meta.env.DEV`
- Hiding button in production builds
- Or keeping it for admin testing purposes

### Example Implementation (Optional):
```jsx
{import.meta.env.DEV && selectedSport && (
  <button onClick={fillTestData}>
    🧪 Fill Test Data
  </button>
)}
```

## Testing Scenarios

### Test Case 1: Cricket Registration
1. Select "Cricket"
2. Click "Fill Test Data"
3. Expected: 11 players auto-added (Cricket requirement)

### Test Case 2: Individual Sport
1. Select "Athletics 100m"
2. Click "Fill Test Data"
3. Expected: No team members (individual sport)

### Test Case 3: Team Sport with Range
1. Select "Football" (11-15 players)
2. Click "Fill Test Data"
3. Expected: 11 players auto-added (minimum requirement)

## File Changes Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `frontend/src/pages/Schedule.jsx` | Updated | Fixed event dates to Feb 20-22, 2026 |
| `frontend/src/pages/UniversalRegistration.jsx` | Added Function | `fillTestData()` function |
| `frontend/src/pages/UniversalRegistration.jsx` | Added UI | Blue "Fill Test Data" button |

## Success Indicators

✅ Schedule page shows correct dates: **February 20-22, 2026**
✅ Button appears after sport selection
✅ All form fields auto-fill on click
✅ Team members auto-generate for team sports
✅ Success toast shows: "Test data filled successfully! 🎉"
✅ Can proceed through all registration steps with test data

## Future Enhancements (Optional)

1. **Multiple Test Profiles:**
   ```javascript
   fillTestData('profile1') // Different test user
   fillTestData('profile2') // Another test user
   ```

2. **Random Data Generation:**
   - Use libraries like `faker.js` for realistic names
   - Generate random valid emails
   - Vary contact numbers

3. **Document Upload Simulation:**
   - Create mock file objects
   - Test file upload functionality

4. **Environment-Aware:**
   - Auto-hide in production
   - Show only for admin users
   - Add to developer portal

---

**Last Updated:** February 10, 2026
**Feature Status:** ✅ Implemented & Working
