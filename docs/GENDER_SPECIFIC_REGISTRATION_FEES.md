# Gender-Specific Registration Fees Implementation

## Overview
Added support for gender-specific registration fees in the sports registration form. Sports with different fees for men's and women's teams now display a gender selection option in **Step 1** (Sport Selection) instead of Step 2.

## Sports Included in Registration

The registration form now only includes sports that are available in SportsGrid and GameVerse:

| Sport | Type | Men's Fee | Women's Fee | Standard Fee |
|-------|------|-----------|-------------|--------------|
| Football | Team | - | - | ₹3,000 |
| Basketball | Team | ₹2,500 | ₹1,500 | - |
| Cricket | Team | - | - | ₹6,500 |
| Volleyball | Team | ₹2,200 | ₹1,500 | - |
| Badminton | Individual | ₹500 | ₹400 | - |
| Handball | Team | - | - | ₹1,500 |
| Kabaddi | Team | ₹2,200 | ₹1,500 | - |
| Chess | Individual | - | - | ₹200 |
| Rink Football | Team | ₹2,200 | ₹1,500 | - |
| Kho-Kho | Team | ₹1,500 | ₹1,200 | - |
| Athletics | Individual | - | - | ₹200-₹700 |
| Powerlifting | Individual | - | - | ₹300 |

**Note**: Removed sports not in SportsGrid: Box Cricket, Table Tennis, Swimming, Hockey, Lawn Tennis, Squash, Tug of War, Basketball 3x3, Carrom

## Implementation Details

### 1. **Sports Data Structure**
- Updated SPORTS_DATA to only include 12 sports from SportsGrid
- Updated SPORT_ICONS mapping to match available sports
- Updated TEAM_SPORTS array with only team-based sports

### 2. **Gender Selection Location: Step 1**
- **NEW**: Gender selection now appears in **Step 1** (after sport selection)
- Displays automatically when user selects a sport with gender-specific fees
- Shows side-by-side cards with:
  - Gender icon (👨 for Men's, 👩 for Women's)
  - "Men's Team" / "Women's Team" label
  - Fee amount specific to that category
  - Fee note
  - Visual checkmark when selected
- Responsive design with hover and tap animations

### 3. **Validation Updates**
- Gender validation moved to Step 1
- Required validation: User must select gender before proceeding if sport has gender-specific fees
- Error message: "Please select team category (Men's or Women's)"
- Removed duplicate validation from Step 2

### 4. **Fee Display Logic** (Unchanged)
- **Payment Step (Step 5)**: Dynamically shows correct fee based on selected gender
- Shows category label: "(Men's Category)" or "(Women's Category)"

### 5. **Review Step** (Unchanged)
- Displays selected team category in Personal Details section
- Format: "Team Category: Men's" or "Team Category: Women's"

## User Experience

### Registration Flow
1. **Select Sport** (Step 1):
   - User selects a sport from the grid
   - **IF** sport has gender-specific fees:
     - Gender selection cards appear below the sport grid
     - User must select either Men's or Women's category
     - Each card shows the fee for that category
   - **ELSE**: User proceeds directly to Step 2

2. **Enter Details** (Step 2):
   - User enters personal information
   - No gender selection here (moved to Step 1)

3. **Continue Registration**:
   - Selected gender affects displayed fees throughout
   - Payment step shows correct fee amount
   - Review step confirms selected category

### Benefits of Moving to Step 1

1. **Better UX Flow**: Users know the exact fee upfront when selecting the sport
2. **Clearer Intent**: Gender selection is tied to sport selection, making the relationship obvious
3. **Admin Benefits**: Gender tag is set early, helping admin team segregate teams from the start
4. **Reduced Confusion**: No need to wait until Step 2 to see different fees

## Technical Details

### Files Modified
1. **ModernRegistration.jsx**:
   - **SPORTS_DATA**: Reduced from 22 sports to 12 (only SportsGrid sports)
   - **SPORT_ICONS**: Updated to match 12 sports
   - **TEAM_SPORTS**: Updated to 8 team sports
   - **Step 1 UI**: Added gender selection cards after sport grid
   - **Validation**: Moved gender validation from Step 2 to Step 1
   - **Step 2 UI**: Removed duplicate gender selection interface

### Sports Removed
- Box Cricket (not in SportsGrid)
- Table Tennis (not in SportsGrid)
- Swimming (not in SportsGrid)
- Hockey (not in SportsGrid)
- Lawn Tennis (not in SportsGrid)
- Squash (not in SportsGrid)
- Tug of War (not in SportsGrid)
- Basketball 3x3 (not in SportsGrid)
- Carrom (not in SportsGrid)

### Sports with Gender-Specific Fees (6 total)
1. Basketball: ₹2,500 (M) | ₹1,500 (W)
2. Volleyball: ₹2,200 (M) | ₹1,500 (W)
3. Badminton: ₹500 (M) | ₹400 (W)
4. Kabaddi: ₹2,200 (M) | ₹1,500 (W)
5. Rink Football: ₹2,200 (M) | ₹1,500 (W)
6. Kho-Kho: ₹1,500 (M) | ₹1,200 (W)

## Admin Panel Benefits

The `teamGender` field (values: "male" or "female") is saved with each registration and can be used for:

1. **Team Segregation**: Filter and view men's teams vs women's teams separately
2. **Category Management**: Organize tournaments/events by gender category
3. **Statistics**: Generate reports on participation by gender
4. **Prize Distribution**: Different prize structures for men's/women's categories
5. **Scheduling**: Separate match schedules for men's and women's teams

## Testing Checklist

- ✅ Only 12 sports from SportsGrid appear in selection
- ✅ Gender selection only appears for 6 sports with gender-specific fees
- ✅ Gender selection appears in Step 1 (after sport selection)
- ✅ Gender selection removed from Step 2
- ✅ Validation prevents proceeding without gender selection
- ✅ Correct fee displays based on selected gender
- ✅ Gender category shows in review step
- ✅ Data is saved with registration
- ✅ Responsive design works on mobile
- ✅ Animations work smoothly

## Migration Notes

**Breaking Changes**:
- 9 sports removed from registration (not available in SportsGrid)
- Users who bookmarked direct sport links may need to reselect
- Gender selection moved from Step 2 to Step 1

**No Data Loss**:
- Existing registrations are unaffected
- `teamGender` field works the same way (just set earlier in the flow)

## Future Enhancements

Possible improvements:
- Add "Mixed Team" option for sports that allow it
- Support for age-based categories in addition to gender
- Dynamic sport list fetched from backend
- Real-time availability checking
