# React Native Development Setup Guide

## iOS Development Options on Windows

### 1. Expo Go App
- Simplest solution for development with iPhone 13
- Steps:
  1. Install Expo Go from the App Store
  2. Run your app locally
  3. Scan the QR code with your iPhone's camera
- Ideal for development and early-stage testing

### 2. Expo EAS Build
- Recommended for production builds and TestFlight distribution
- Uses Expo Application Services (EAS)
- Can trigger iOS builds from Windows:
  ```bash
  eas build --platform ios
  ```
- Requires Apple Developer account ($99/year) for TestFlight
- Builds happen in Expo's cloud - no Mac needed

### 3. Remote Mac Solutions
- Options include:
  - MacStadium
  - MacinCloud
- Provides full iOS build capabilities
- Requires paid subscription

## Android Development on Windows

Android development works natively on Windows with full capabilities.

### Development and Testing Options
1. Android Studio's emulator
2. Physical Android devices
3. Expo Go app on Android

### Creating Production Builds
Either method works:
```bash
eas build --platform android
```
or
```bash
npx react-native run-android
```

## Recommended Setup

### Development Phase
1. iOS testing: Use Expo Go on iPhone 13
2. Android testing: Use either
   - Android Studio emulator
   - Physical Android device

### Distribution Phase
- Use EAS Build for both platforms
- Provides consistent build process
- Works well for iOS and Android

---
*Reference: [Microsoft React Native for Windows Documentation](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/react-native-for-windows)*
