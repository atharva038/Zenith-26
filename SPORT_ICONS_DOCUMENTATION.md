# Sport SVG Icons - Women's Tournament

## Overview
This document describes the custom SVG icons created for the Women's Tournament registration page. Each sport has a unique, hand-crafted SVG icon that visually represents the activity.

## Icons Created

### Category 1: ₹49/- Unlimited Pool (9 Sports)

1. **Sack Race Icon** (`SackRaceIcon`)
   - Visual: Person in a sack with legs visible at bottom
   - Colors: Dynamic (inherits from parent)
   - Size: 64x64 viewBox, responsive w-16 h-16 (4rem)

2. **Three Leg Race Icon** (`ThreeLegRaceIcon`)
   - Visual: Two figures with middle legs tied together
   - Colors: Dynamic
   - Size: 64x64 viewBox

3. **Balloon Icon** (`BalloonIcon`)
   - Visual: Classic balloon shape with string and highlights
   - Colors: Dynamic with white opacity highlights
   - Size: 64x64 viewBox

4. **Brick Icon** (`BrickIcon`)
   - Visual: Stacked bricks with vertical guideline
   - Colors: Dynamic with varying opacity
   - Size: 64x64 viewBox

5. **Musical Chair Icon** (`MusicalChairIcon`)
   - Visual: Chair with music notes
   - Colors: Dynamic
   - Size: 64x64 viewBox

6. **Lemon Spoon Icon** (`LemonSpoonIcon`)
   - Visual: Spoon with lemon on top
   - Colors: Dynamic with white highlights
   - Size: 64x64 viewBox

7. **Powerlifting Icon** (`PowerliftingIcon`)
   - Visual: Barbell with weight plates
   - Colors: Dynamic
   - Size: 64x64 viewBox

8. **Weightlifting Icon** (`WeightliftingIcon`)
   - Visual: Figure lifting barbell overhead
   - Colors: Dynamic
   - Size: 64x64 viewBox

9. **Handkerchief Icon** (`HandkerchiefIcon`)
   - Visual: Diamond-shaped handkerchief with folds
   - Colors: Dynamic with white accent lines
   - Size: 64x64 viewBox

### Category 2: ₹49/- Per Game (3 Sports)

10. **Badminton Icon** (`BadmintonIcon`)
    - Visual: Badminton racket with shuttlecock
    - Colors: Dynamic with white details
    - Size: 64x64 viewBox

11. **Chess Icon** (`ChessIcon`)
    - Visual: Chess king piece with crown spikes
    - Colors: Dynamic
    - Size: 64x64 viewBox

12. **Carrom Icon** (`CarromIcon`)
    - Visual: Carrom board with corner pockets and striker coins
    - Colors: Dynamic with varying opacity coins
    - Size: 64x64 viewBox

### Category 3: ₹199/- Per Team (6 Sports)

13. **Tug of War Icon** (`TugOfWarIcon`)
    - Visual: Two figures pulling rope with center marker
    - Colors: Dynamic
    - Size: 64x64 viewBox

14. **Volleyball Icon** (`VolleyballIcon`)
    - Visual: Volleyball with characteristic curved panels
    - Colors: Dynamic with white panel lines
    - Size: 64x64 viewBox

15. **Cricket Icon** (`CricketIcon`)
    - Visual: Cricket bat with ball
    - Colors: Dynamic with white grip details
    - Size: 64x64 viewBox

16. **Basketball Icon** (`BasketballIcon`)
    - Visual: Basketball with seam lines
    - Colors: Dynamic with white seam details
    - Size: 64x64 viewBox

17. **Football Icon** (`FootballIcon`)
    - Visual: Soccer ball with pentagon/hexagon pattern
    - Colors: Dynamic with white panels
    - Size: 64x64 viewBox

18. **Box Cricket Icon** (`BoxCricketIcon`)
    - Visual: Cricket bat inside a box frame with corner markers
    - Colors: Dynamic
    - Size: 64x64 viewBox

## Usage

### Import Icons
```jsx
import {
  SackRaceIcon,
  ThreeLegRaceIcon,
  BalloonIcon,
  // ... other icons
} from "../components/SportIcons";
```

### Use in Sports Array
```jsx
const sports = [
  {
    id: "sack-race",
    name: "Sack Race",
    icon: SackRaceIcon,  // Component reference (not JSX)
    color: "from-yellow-500 to-orange-500",
    // ...
  },
];
```

### Render Icon
```jsx
<sport.icon className="w-16 h-16 text-white" />
```

## Design Principles

1. **Simplicity**: Each icon uses simple geometric shapes for clarity
2. **Recognizability**: Icons are instantly recognizable representations
3. **Scalability**: SVG format ensures crisp rendering at any size
4. **Color Flexibility**: Icons use `currentColor` and `fill` attributes to inherit parent colors
5. **Consistency**: All icons follow the same 64x64 viewBox standard
6. **Accessibility**: Icons complement text labels, not replace them

## Technical Details

- **Format**: React functional components returning SVG elements
- **ViewBox**: 64x64 for all icons
- **Default Size**: w-12 h-12 (3rem) via className prop
- **Color System**: Inherits text color via Tailwind's `text-{color}` classes
- **Props**: Accepts `className` for custom sizing and styling
- **Opacity**: Strategic use of opacity for depth (0.3-0.8 range)
- **Stroke Width**: 2-4 pixels for optimal visibility

## Color Mapping (Tailwind Gradients)

Each sport card has a unique gradient background:
- **Yellow-Orange**: Sack Race, Carrom
- **Green-Teal**: 3 Leg Race, Rink Football
- **Pink-Rose**: Balloon Bursting, Musical Chair
- **Red-Orange**: Brick Race, Tug of War
- **Purple-Pink**: Badminton
- **Lime-Green**: Nimbu Chamach
- **Gray**: Powerlifting
- **Blue-Indigo**: Weightlifting, Box Cricket
- **Cyan-Blue**: Hankerchief Snash
- **Slate-Gray**: Chess
- **Blue-Cyan**: Volleyball
- **Green-Emerald**: Cricket
- **Orange-Red**: Basketball 3x3

## File Structure
```
frontend/
└── src/
    └── components/
        └── SportIcons.jsx     # All SVG icon components
    └── pages/
        └── WomenTournamentPage.jsx  # Uses the icons
```

## Benefits Over Emoji Icons

1. ✅ **Consistent Rendering**: SVGs look identical across all browsers/devices
2. ✅ **No Font Dependencies**: Emojis render differently on iOS, Android, Windows
3. ✅ **Customizable Colors**: Icons inherit theme colors dynamically
4. ✅ **Scalable**: Perfect quality at any size
5. ✅ **Professional Look**: Custom designs match brand identity
6. ✅ **Better Performance**: SVGs are lightweight and cache-friendly
7. ✅ **Accessibility**: Better screen reader support with proper ARIA labels

## Future Enhancements

- Add animation props (hover effects, entrance animations)
- Create monochrome versions for print materials
- Add stroke variants for outlined style
- Create mini icon versions (24x24) for compact displays
- Add ARIA labels for enhanced accessibility

## Maintenance

When adding new sports:
1. Create new icon component in `SportIcons.jsx`
2. Export the component
3. Import in `WomenTournamentPage.jsx`
4. Add sport object with icon reference
5. Test rendering at different sizes
6. Document the new icon in this file
