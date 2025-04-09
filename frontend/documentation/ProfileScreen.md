# Profile Screen Documentation

## Overview
The Profile Screen allows users to customize their app experience, manage their avatar, adjust display preferences, and handle authentication settings.

## Core Functions
1. Display and update user avatar
2. Manage dark mode preferences
3. Handle user logout
4. Save profile changes automatically on back gesture
5. Display user information

## API Endpoints

### Get Profile Data
```typescript
// GET /rest/v1/app_user
interface ProfileResponse {
  id: string
  email: string
  avatar_url: string
  dark_mode_preference: "light" | "dark" | "system"
}
```

### Update Avatar
```typescript
// PATCH /rest/v1/app_user
interface UpdateAvatarRequest {
  avatar_url: string
}
```

### Update Dark Mode
```typescript
// PATCH /rest/v1/app_user
interface UpdateDarkModeRequest {
  dark_mode_preference: "light" | "dark" | "system"
}
```

### Logout
```typescript
// POST /auth/v1/logout
// Logs out user and invalidates session
```

## Data Flows

### Initial Load
1. Screen mounts → useProfile hook fetches user data
2. Data loaded from Supabase
3. Local state initialized with fetched data

### Avatar Update
1. User selects new avatar
2. Local state updates immediately
3. API call made to update backend
4. Success: No action needed
5. Failure: Revert to previous avatar, show error

### Dark Mode Update
1. User selects preference
2. Local state and theme update immediately
3. API call made to update backend
4. Failure: Revert to previous setting, show error

### Logout Flow
1. User taps logout → Show confirmation
2. If confirmed:
   - Call logout endpoint
   - Clear local storage/state
   - Navigate to login screen
3. If cancelled: Dismiss dialog

### Auto-save on Back
1. Compare current vs initial state
2. If changes detected:
   - Save all pending changes
   - Navigate back
   - Show error toast if API fails
3. If no changes: Navigate back immediately

## File Structure
```
frontend/pseudo/
├── app/
│   └── (profile)/
│       ├── _layout.tsx        # Profile navigation configuration
│       └── profile.tsx        # Main profile screen component
├── components/
│   ├── profile/
│   │   ├── AvatarSelector.tsx # Avatar selection grid
│   │   ├── DarkModeToggle.tsx # Dark mode preference selector
│   │   └── LogoutButton.tsx   # Logout functionality
│   └── shared/
│       └── Header.tsx         # Common header component
├── hooks/
│   └── useProfile.ts         # Profile management logic
```

## Component Details

### ProfileScreen (profile.tsx)
- Main container component
- Manages profile state via useProfile hook
- Handles back gesture and save functionality
- Props: None
- State: Managed by useProfile hook

### Header (Header.tsx)
- Displays "Profile" title
- Shows current user avatar
- Props: 
  - title?: string (optional)

### AvatarSelector (AvatarSelector.tsx)
- Displays grid of available avatars
- Highlights currently selected avatar
- Props:
  - selectedAvatar: string
  - onSelect: (avatar: string) => void
- Data Structure:
```typescript
interface Avatar {
  id: string
  url: string
}
```

### DarkModeToggle (DarkModeToggle.tsx)
- Provides three-way toggle for appearance
- Syncs with system settings
- Props:
  - value: "light" | "dark" | "system"
  - onChange: (mode: string) => void
- Data Structure:
```typescript
type DarkModePreference = "light" | "dark" | "system"
```

### LogoutButton (LogoutButton.tsx)
- Handles user logout flow
- Confirms action with user
- Props:
  - onLogout: () => void

## Hooks

### useProfile
- Manages profile state and updates
- Handles avatar selection
- Manages dark mode preference
- Returns:
```typescript
interface ProfileState {
  avatar: string
  darkMode: DarkModePreference
  isLoading: boolean
  error: string | null
  isDirty: boolean  // tracks unsaved changes
  updateAvatar: (avatar: string) => void
  updateDarkMode: (mode: DarkModePreference) => void
  logout: () => void
}
```

## Error Handling
```typescript
interface ErrorResponse {
  code: string
  message: string
  details?: string
}
```

Each API call handles:
1. Network errors
2. Authentication errors (redirect to login)
3. Validation errors
4. Server errors

## Styles
All styles use NativeWind (Tailwind CSS for React Native) classes:

### Container Layout
```tsx
// Main container
className="flex-1 bg-white dark:bg-gray-900"

// Section containers
className="px-4 py-6 space-y-4"
```

### Avatar Selection
```tsx
// Avatar grid container
className="grid grid-cols-4 gap-4"

// Individual avatar
className="w-16 h-16 rounded-full"

// Selected avatar indicator
className="border-2 border-blue-500"
```

### Dark Mode Toggle
```tsx
// Toggle container
className="flex flex-row justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"

// Toggle options
className="px-4 py-2 rounded-md"

// Selected option
className="bg-blue-500 text-white"
```

### Logout Button
```tsx
// Button container
className="mt-8 px-4 py-3 bg-red-500 rounded-lg"

// Button text
className="text-center text-white font-semibold"
```

### Common Text Styles
```tsx
// Section headers
className="text-lg font-semibold text-gray-900 dark:text-white"

// Description text
className="text-sm text-gray-600 dark:text-gray-400"
```

## Navigation Flow
1. User taps profile avatar → Profile Screen
2. Back gesture → Previous screen (auto-saves changes)
3. Logout → Login Screen

## Database Schema
```sql
CREATE TABLE app_user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url VARCHAR(255),
    dark_mode_preference VARCHAR(20) DEFAULT 'system',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
```

## Changelog

### Version 1.1.0
- Added API endpoints documentation
- Added detailed data flow descriptions
- Added error handling documentation
- Added database schema
- Enhanced useProfile hook documentation

### Version 1.0.0 (Initial Implementation)
- Created basic profile screen structure
- Implemented avatar selection grid
- Added dark mode preference toggle
- Implemented logout functionality
- Added auto-save on back gesture
- Created documentation

### Future Improvements
1. Add profile picture upload capability
2. Implement account deletion
3. Add email change functionality
4. Add password change functionality
5. Implement proper state persistence
6. Add loading states for async operations
7. Add unit tests for components
8. Implement proper error handling
9. Add accessibility features
