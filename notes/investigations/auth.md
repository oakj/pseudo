# Authentication Implementation Plan

## Overview
This document outlines the implementation plan for authentication in the Pseudo app using Supabase Auth, React Native, and React Native Reusables (RNR) components.

## File Structure
```
frontend/pseudo/app/
├── (auth)/
│   ├── _layout.tsx        # Auth navigation layout
│   ├── login.tsx         # Main login screen
│   ├── signup.tsx        # Signup screen
│   └── forgot.tsx        # Forgot password screen
├── components/auth/
│   ├── EmailLoginForm.tsx    # Email/password login form
│   ├── SocialButtons.tsx     # Google/Apple login buttons
│   └── AuthHeader.tsx        # Common auth header
├── contexts/
│   └── AuthContext.tsx       # Global auth state management
```

## Authentication Context
```typescript
// contexts/AuthContext.tsx
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
```

## Screen Implementations

### Login Screen (`login.tsx`)
- Header with app logo
- Email/password form
- Social login buttons (Google, Apple)
- "Forgot password?" link
- "Sign up" link
- Error handling and loading states
- RNR Components:
  - Input for email/password
  - Button for submit
  - Text for labels and links
  - Toast for error messages

### Signup Screen (`signup.tsx`)
- Similar layout to login
- Additional fields (confirm password)
- Terms of service acceptance
- Email verification flow

### Forgot Password Screen (`forgot.tsx`)
- Email input
- Submit button
- Success/error states
- Back to login link

## Navigation Flow
```typescript
// app/(auth)/_layout.tsx
export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="signup"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="forgot"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
```

## Implementation Steps

### 1. Setup Auth Context
- Create AuthContext with necessary state and methods
- Implement session persistence using AsyncStorage
- Add loading and error states
- Create hooks for auth state management

### 2. Create Reusable Components
- EmailLoginForm component with validation
- SocialButtons component for OAuth
- AuthHeader component with logo
- Loading and error components

### 3. Implement Login Screen
- Create form layout using RNR components
- Implement email/password validation
- Add social login buttons
- Handle loading and error states
- Add navigation to signup/forgot password

### 4. Implement OAuth Flow
- Configure OAuth providers in Supabase
- Update app configuration for deep linking
- Handle OAuth callbacks
- Implement error handling

### 5. Add Protected Route Logic
- Create auth guard in root layout
- Redirect unauthenticated users to login
- Handle session expiration

## Testing Plan
- Test email/password login
- Test social logins
- Test form validation
- Test error handling
- Test session persistence
- Test protected routes
- Test deep linking

## Security Considerations
- Implement proper password validation
- Add rate limiting for login attempts
- Secure storage of auth tokens
- Handle session expiration
- Implement proper OAuth flow

## Dependencies
- Supabase Auth
- React Native Async Storage
- React Native Reusables
- Expo Router

## OAuth Configuration
### Google OAuth
- Update Google API Console with:
  - Authorized JavaScript origins
  - Authorized redirect URLs
  - Client ID and Secret in Supabase

### Apple OAuth
- Requirements:
  - Apple Developer Program account
  - OAuth Client ID and Secret
  - Authorized redirect URLs in Apple Developer Account
  - Enable Apple OAuth in Supabase

## Notes
- Currently using test user ID for development
- Will need to transition from test user to proper auth
- Consider adding GitHub OAuth in future
- Need to handle deep linking for OAuth callbacks
