# Home Screen Documentation

## Overview
The Home Screen serves as the main interface for users to view their weekly progress, access collections, and browse questions by difficulty and design patterns.

## Core Functions
1. Display weekly streak progress
2. Show collections with quick access
3. List questions by difficulty and design patterns
4. Provide navigation to other sections via tab bar
5. Access to user profile
6. View expanded collections via bottom drawer

## File Structure
```
frontend/pseudo/
├── app/
│   └── (tabs)/
│       ├── _layout.tsx        # Tab navigation configuration
│       ├── home.tsx          # Main home screen component
│       ├── search.tsx        # Search screen placeholder
│       ├── stats.tsx         # Stats screen placeholder
│       └── settings.tsx      # Settings screen placeholder
├── components/
│   ├── home/
│   │   ├── Collections.tsx   # Grid of collection cards
│   │   ├── MoreCollections.tsx # Expanded collections in drawer
│   │   ├── QuestionsByCategory.tsx # Questions list component
│   │   └── WeeklyStreak.tsx  # Weekly progress tracker
│   └── shared/
│       └── Header.tsx        # Common header component
├── hooks/
│   └── useDrawer.ts         # Bottom drawer animation logic
└── styles/
    └── home.ts              # Shared styles for home screen
```

## Component Details

### HomeScreen (home.tsx)
- Main container component
- Manages drawer state via useDrawer hook
- Renders all sub-components in a scrollable view
- Props: None
- State: Managed by useDrawer hook

### Header (Header.tsx)
- Displays app title "PseudoSolve"
- Shows user profile avatar
- Props: 
  - title?: string (optional)

### WeeklyStreak (WeeklyStreak.tsx)
- Shows 7-day progress tracker
- Visual indicators for completed/missed days
- Props: None
- Data Structure:
```typescript
interface DayStreak {
  day: string
  completed: boolean
}
```

### Collections (Collections.tsx)
- Displays grid of collection cards
- "More" button triggers bottom drawer
- Props:
  - onMorePress: () => void
- Data Structure:
```typescript
interface Collection {
  name: string
  icon: string
}
```

### QuestionsByCategory (QuestionsByCategory.tsx)
- Lists questions with completion status
- Shows time estimates via badges
- Props:
  - type: "difficulty" | "pattern"
- Data Structure:
```typescript
interface Question {
  name: string
  completed: boolean
  time: string
}
```

### MoreCollections (MoreCollections.tsx)
- Extended collection grid in bottom drawer
- Props: None
- Data Structure: Same as Collections

## Hooks

### useDrawer
- Manages bottom drawer animation state
- Returns:
  - drawerVisible: boolean
  - translateY: Animated.Value
  - showDrawer: () => void
  - hideDrawer: () => void

## Styles
All styles are centralized in `home.ts` and organized by component:
- Container and layout styles
- Header styles
- Weekly streak styles
- Collection card styles
- Question list styles
- Drawer animation styles

## Navigation Flow
1. User opens app → Home Screen
2. Tab Bar Navigation:
   - Home
   - Search
   - Stats
   - Settings
3. Profile access via header
4. Collections expansion via bottom drawer

## Changelog

### Version 1.0.0 (Initial Implementation)
- Migrated from single file to organized component structure
- Implemented Expo Router tab navigation
- Separated drawer logic into custom hook
- Added TypeScript interfaces for props and data structures
- Created placeholder screens for other tabs
- Centralized styles in dedicated file
- Added documentation

### Future Improvements
1. Implement data fetching for collections and questions
2. Add loading states for async operations
3. Implement profile navigation
4. Add error boundaries
5. Implement proper state management
6. Add unit tests for components
7. Implement proper navigation types
8. Add accessibility features
