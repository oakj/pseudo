# Learnings
- Cursor AI using clause-3.5-sonnet did not do well with generating boilerplate code using React Native, Expo, Expo Router, TypeScript, Nativewind, React Native Reusables, Supabase, PostgreSQL, and SQLite. In the future, use the following commands in the same order to generate boilerplate code:
  1. Setup React Native and Expo SDK: 
    1. `npx create-expo-app@latest <app-name>` # Creates a boilerplate project using TypeScript and the latest Expo SDK. This includes expo-router and other default expo package`.
    2. `npm reset-project` # Resets the project to the boilerplate code.
    3. `npx expo install @react-native-async-storage/async-storage` # allows for offline storage of data.
    3. run the application in development mode to confirm there are no issues: `npx expo start`
  2. Setup Nativewind and Tailwind:
    1. `npm install nativewind tailwindcss`.
    2. `npx tailwindcss init` # Creates a tailwind.config.js file.
    3. update tailwind.config.js to include the paths to all of your component files (refer to NativeWind docs).
    4. create a global.css file in the root of the project with tailwind directives (refer to NativeWind docs).
    5. create a babel.config.js file in the root of the project (refer to NativeWind docs).
    6. create a metro.config.js file in the root of the project (refer to NativeWind docs).
    7. import global.css into app/_layout.tsx.
    8. setup typescript for nativewind by creating a nativewind-env.d.ts file in the root of the project (refer to NativeWind docs).
    9. run the application in development mode to confirm there are no issues: `npx expo start`
  3. Setup React Native Reusables (https://rnr-docs.vercel.app/getting-started/initial-setup/):
    1. `npx expo install tailwindcss-animate class-variance-authority clsx tailwind-merge`
    2. refer to docs for new files to create.
  4. Setup Supabase (https://supabase.com/docs/reference/javascript/installing):
    1. `npm install @supabase/supabase-js`
    2. Create a lib/supabase.ts file to configure the supabase client.
    3. supabase client can be called in any component to interact with the database.
