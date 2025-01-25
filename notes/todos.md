# TODO 
###### Note: this is a temporary list while we find a place to centralize notes
---
- [x] install file structure for an expo go app for development
```bash
# Command to create a new expo app per Expo docs
npx create-expo-app@latest

# Run the app in Expo Go
cd frontend/pseudo
# remove node_modules and package-lock.json if necessary
npm install # if not already installed
npm start # (or npx expo start)
```
- [ ] install dependencies including react-native-reusables
```bash
# Install React Native Reusables using their CLI:
npx @react-native-reusables/cli@latest init
# After initialization, you can add specific components using:
npx @react-native-reusables/cli@latest add
```
- [ ] install file structure for an expo EAS build app for production
- [ ] create file structure for instructions.md
    - use chat with perplexity regarding how to structure react native app/components/etc.
- [ ] learn about react native async storage versus sqlite. When to use which?
