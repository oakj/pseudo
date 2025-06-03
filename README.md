# Pseudo
Welcome to Pseudo. We are building a mobile application that allows users to solve coding interview questions using pseudocode.

## Project Documentation
Refer to ./instructions/instructions.md for high level details on the project such as:
    - Project Overview
    - Core Functionalities (features and screens)
    - Database Schema
    - S3 Blob Storage Structure
    - Python Data Models (for FastAPI backend)
    - Project File Structure

## Git Workflow
- <b>main</b> for production
- <b>dev</b> for development
    - Can be merged into main after review and testing.
    - Intended to be used if there are multiple feature branches in progress and requires joint testing.
- <b>feature/<feature-name></b> for new features
    - Can be merged into main after review and testing.

## Repository Structure
- .github: for copilot-instructions.md if we decide to use GitHub Copilot.
- backend: for Pseudo, a FastAPI backend and any future backend services.
- frontend: for Pseudo, a React Native frontend and any future frontend services.
- instructions: for file used to give LLMs context on specific parts of the project.
- notes: for unorganized or random notes and utils for the project.

## Todos
- [ ] Move specific, non-instruction and non-README files to Notion (or other markdown-compatible markdown editors).
    - We don't want to leak any sensitive design information or queries in the git history.
- [ ] Setup Supabase authentication and postgresql database. Include some dummy data for testing.
    - [ ] Setup Supabase authenticaton
        - [ ] Setup e-mail/password authentication
            - [X] Enable e-mail/password authentication in Supabase
        - [ ] Setup Google authentication
            - [X] Google OAuth Client ID and Client Secret created
            - [X] Enable Google OAuth in Supabase
            - [ ] Need to update Google API Console with authorized Javascript origins and authorized redirect URLs
        - [ ] Setup Apple authentication
            - [ ] Probably need an Apple Developer Program account for this
            - [ ] Apple OAuth Client ID and Client Secret created
            - [ ] Enable Apple OAuth in Supabase
            - [ ] Need to update Apple Developer Account with authorized redirect URLs
        - [ ] Consider adding a GitHub OAuth also
    - [x] Setup Supabase database
    - [X] Create a database function and trigger to automatically create a record in app_user table when a new user signs up via Supabase auth.
    - [] Setup Supabase dummy data.
        - [X] Delete old dummy data
        - [X] Create a new database trigger that will create dummy data when a record is inserted into app_user table
        - [X] Update dummy-data.md to reflect the new script and process for enabling/disabling the trigger
        - [ ] Maybe we can keep the dummy data and create a new database for production that has real data?
    - [X] Create SQL scripts and/or stored procedures to be used by the app.
    - [X] Setup S3/Blob-storage dummy data.
        - [X] Start by storing dummy data in the backend/dummy-data folder.
            - [X] Create 10 questions. Each question should have it's own file.
            - [X] Create a userquestion record for (10) of the questions. Half are solved, half are not.
        - [ ] Once we feel comfortable testing with dummy data, we should start to move them to a real blob storage service (or use local storage on the python server).
- Note: we are developing the frontend "first" because we want to POC the app using dummy data. Typically the backend is developed first.
- [ ] Setup Home screen.
- [ ] Setup Question Groups screen.
- [ ] Setup Questions screen.
- [ ] Setup Solve screen (using dummy data for hints ai chat bot and pseudocode validation engine)
    - [ ] At this point we should have a hard-decision on how we want to use the hints and ai chat bot. At this point I think it should be a one-way chat bot that only gives hints.
- [ ] Setup Login/Signup screen. This is near the end because we need to POC that the other screens can work as intended. Login/Signup implementation is straight forward.
- [ ] Setup Profile screen. This is near the end because we need to POC that the other screens can work as intended. Profile implementation is straight forward.
- [ ] Develop the FastAPI backend.
    - [ ] Create endpoint contracts
    - [ ] Create endpoints
- [ ] Setup server for running python backend and storing blob storage data.
    - [ ] Consider Digital Ocean for hosting and see if it can store blob data.
    - [ ] Consider S3 alternatives for blob storage if we cannot store it in Digital Ocean.
- [ ] Consider splitting the supabase project into separate development and production projects.
- [ ] Install/implement capabilities for using Expo EAS build. This is only needed for production builds.
- [ ] Setup CI/CD pipelines. This should only happen after sampling the app to real users to see if its even worth brining to market with consistent updates.
    - [ ] Bonus task for implementing a CI/CD pipeline via GitHub repository.
    - [ ] Bonus task for implementing a CI/CD pipeline for database migrations using Supabase (probably should be part of backend/pseudo python project)
        - Note that the initial DB table creations were created via SQL editor in Supabase. We should have this in code somewhere for historical purposes.
        - For Supabase database migrations, it's recommended to use the Supabase CLI. We can build this as part of GitHub Actions.
- [ ] Create a landing page for the app.
- [ ] Once we get a decent MVP in production, we should start sampling the app with real users.
    - [ ] Reach out to Codesmith users.
    - [ ] Reach out to Coffee & Code users.
    - [ ] Reach out to coding subreddits/online communities.
- [ ] Consider setting up a feedback loop screen in the app.
    - [ ] Brainstorm the best way to get feature review and feedback from users. Do we want a screen for all requests? Do we want a review feature for each question?
- [ ] Consider charging a fair price once we see users are happy with the product. Consider different pricing models.
    - Consider a freemium-premium model where flashcards and games are free and the pseudocode evaluator is premium.
- [ ] Consider adding a "Flashcard" feature to the app.
- [ ] Create a markdown file discussing major flows in the app. Emphasis on how data is inserted, updated, fetched, indexed, cached, stored, and served to the user.
    - [ ] Consider adding a "pattern matching" flow to the pseudocode evaluator. Intent is to avoid going to an LLM if we don't need to.

## On-going Changes To Consider
| Status |
|--------|
| 🟢 **Implemented** |
| 🟡 **Under Consideration** OR **Not Yet Implemented** |
| 🔴 **Not Implementing** |

| #  | Priority | Title                                  | Description                                                              | Notes                                                                                                         | Status                         | Decision                                                                 |
|----|----------|----------------------------------------|--------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|--------------------------------|-------------------------------------------------------------------------|
| 1  | Low      | Difficulty Field Type in Question Table | Use ENUM data type in the API and app. INT in the database.                                 | Could improve lookup speed. Is this change beneficial at this point?                                            | 🔴                              | Not implementing. At this point in the project, the benefits do not outweigh the work required to make this change. |
| 2  | Low      | Pseudocode Evaluator as Premium Feature | Making pseudocode evaluator a paid feature                              | Could offer flashcards and study games as free features. May help manage user expectations and feedback because the pseudocode evaluator will be finicky. | 🟡                              | Under consideration. This should be considered with other pricing options once the MVP is complete. |
| 3  | Medium   | Question Loading Strategy               | Current method of fetching all questions on login may cause performance issues as question count grows; need alternative strategy | Consider creating a RecentlyVisited table for questions and collections a user visited recently and load those plus default collections and "default"/hand-picked questions. | 🟡                              | Not yet implemented. We need a design document showing the necessary changes. This project is better suited for when we are at (or close to) MVP. |
| 4  | High     | User ID Integer Field                   | Adding user_id_int field to public.app_user table                       | Could significantly improve SQL query performance by using integer comparisons instead of string comparisons   | 🟡                              | Not yet implemented. Will target this after some initial testing of the app. |
| 5  | Low      | Dark Mode Preference Data Type          | Changing dark_mode_preference from VARCHAR to INT                        | Using an enumerable data type could represent different modes more efficiently (0 for system default, 1 for light, 2 for dark) | 🔴                              | Not implementing. At this point in the project, the benefits do not outweigh the work required to make this change. |
| 6  | High     | User Question Record Creation           | Creating user_question records on first attempt                         | Implement to create records when a user first attempts a specific question, rather than pre-creating for all questions | 🟡                              | Not yet implemented. This will likely be implemented once we start coding the app and api. |
| 7  | Medium   | Weekly Streak Record Management         | Handling weekly_streak records                                          | Implemented solution to insert or update weekly_streak records when a user successfully solves a problem. | 🟢                              | Implemented as much as we can in terms of where we are at currently with the app development. |
| 8  | High     | Collection Table Simplification         | Simplifying the collection system                                       | Implement a single Collection table with a "default" boolean column to distinguish between default and custom collection. | 🔴                              | Not implementing. It is a technical decision to keep two separate tables (Collection and DefaultCollection). |
| 9  | Medium     | Hints and AI Chat Bot                   | Make a decision on how the AI chat bot will work for MVP.                                                 | Implement a one-way chat bot that only gives hints OR implement a two-way chat bot where users can ask for hints. | 🟡                              | Under consideration. This will likely be decided on and implemented with the Solve screen. |
| 10 | Low     | Admin page                   | We need admin endpoints for creating, updating, and deleting questions and default collections.                                                 | Should this live with the app's landing page or its own webapp? | 🟡                              | Under consideration. This is close to MVP or post MVP. Leading towards adding this to the landing page. Will need a hidden route and auth for the page. |


## Project File Tree
```
pseudo
├─ backend
│  └─ storage
│     ├─ blob
│     │  ├─ formatting.md
│     │  └─ submission-eval-flow.md
│     ├─ dummy-data
│     │  ├─ blob-dummy-data.md
│     │  ├─ questions
│     │  │  ├─ L-1.json
│     │  │  ├─ L-102.json
│     │  │  ├─ L-121.json
│     │  │  ├─ L-127.json
│     │  │  ├─ L-15.json
│     │  │  ├─ L-20.json
│     │  │  ├─ L-200.json
│     │  │  ├─ L-23.json
│     │  │  ├─ L-295.json
│     │  │  └─ L-3.json
│     │  ├─ sql-dummy-data.md
│     │  └─ userquestions
│     │     ├─ 294a924b-4591-45ea-b3dd-c6c9c6112b2e.json
│     │     ├─ 510f9dcc-464e-48ff-a920-43518eabbd54.json
│     │     ├─ 803d9755-94ed-4749-9ed9-83e7b3f5abba.json
│     │     ├─ 83481541-f24b-4906-b867-751125527037.json
│     │     ├─ 8f580c6e-3c8e-4502-91de-21aafa7521f7.json
│     │     ├─ 9756b403-0988-428f-9368-d16e8a520687.json
│     │     ├─ cc61c2ec-30cf-405c-ba27-77708eac1ab2.json
│     │     ├─ dba22364-c980-4a6e-bc54-566b609914c8.json
│     │     ├─ df576c81-0d19-4471-83ae-511e1bbc4271.json
│     │     └─ e69cbd17-09f6-4864-968a-de42da46df10.json
│     └─ supabase
│        └─ database-scripts
│           ├─ README.md
│           ├─ sprocs
│           │  ├─ DeleteCollectionByUserId.sql
│           │  ├─ InsertCollectionByUserId.sql
│           │  ├─ InsertUserQuestion.sql
│           │  ├─ SelectCollectionByUserId.sql
│           │  ├─ SelectCollectionsByUserId.sql
│           │  ├─ SelectDefaultCollectionByUserId.sql
│           │  ├─ SelectProfileByUserId.sql
│           │  ├─ SelectQuestionsByUserId.sql
│           │  ├─ SelectUserQuestion.sql
│           │  ├─ SelectWeeklyStreakByUserId.sql
│           │  ├─ UpdateCollectionNameByUserId.sql
│           │  ├─ UpdateProfileByUserId.sql
│           │  ├─ UpdateUserQuestion.sql
│           │  └─ UpdateWeeklyStreakByUserId.sql
│           └─ upscripts
├─ frontend
│  ├─ documentation
│  │  ├─ Assets.md
│  │  ├─ build.md
│  │  ├─ eas-init.png
│  │  ├─ header-v1.png
│  │  ├─ HomeScreen
│  │  │  ├─ collections-v1.png
│  │  │  ├─ collectionsbottomdrawer-v1.png
│  │  │  ├─ homescreen-v1.png
│  │  │  ├─ HomeScreen.md
│  │  │  ├─ questions-v1.png
│  │  │  ├─ savequestiontocollectionbottomdrawer-v1.png
│  │  │  └─ weeklystreak-v1.png
│  │  ├─ ProfileScreen
│  │  │  └─ ProfileScreen.md
│  │  └─ styling.md
│  └─ pseudo
│     ├─ .env
│     ├─ app
│     │  ├─ (tabs)
│     │  │  ├─ algorithms.tsx
│     │  │  ├─ flashcards.tsx
│     │  │  ├─ home.tsx
│     │  │  └─ _layout.tsx
│     │  ├─ collection.tsx
│     │  ├─ components
│     │  │  ├─ home
│     │  │  │  ├─ Collections.tsx
│     │  │  │  ├─ CollectionsBottomDrawer.tsx
│     │  │  │  ├─ Questions.tsx
│     │  │  │  ├─ QuestionsByCategory.tsx
│     │  │  │  ├─ SaveQuestionToCollectionBottomDrawer.tsx
│     │  │  │  ├─ SortQuestionsBottomDrawer.tsx
│     │  │  │  └─ WeeklyStreak
│     │  │  │     ├─ DayColumn.tsx
│     │  │  │     └─ index.tsx
│     │  │  ├─ shared
│     │  │  │  ├─ BottomSpacer.tsx
│     │  │  │  └─ Header.tsx
│     │  │  └─ ui
│     │  │     ├─ avatar.tsx
│     │  │     ├─ badge.tsx
│     │  │     ├─ button.tsx
│     │  │     ├─ card.tsx
│     │  │     ├─ dropdown-menu.tsx
│     │  │     ├─ input.tsx
│     │  │     ├─ radio-group.tsx
│     │  │     ├─ select.tsx
│     │  │     ├─ separator.tsx
│     │  │     └─ text.tsx
│     │  ├─ contexts
│     │  │  └─ AvatarContext.tsx
│     │  ├─ hooks
│     │  │  ├─ useDrawer.ts
│     │  │  └─ useHomeData.ts
│     │  ├─ index.tsx
│     │  ├─ lib
│     │  │  ├─ icons
│     │  │  │  ├─ ArrowLeft.tsx
│     │  │  │  ├─ Bell.tsx
│     │  │  │  ├─ BellRing.tsx
│     │  │  │  ├─ Bookmark.tsx
│     │  │  │  ├─ Bug.tsx
│     │  │  │  ├─ Check.tsx
│     │  │  │  ├─ ChevronDown.tsx
│     │  │  │  ├─ ChevronRight.tsx
│     │  │  │  ├─ ChevronsDown.tsx
│     │  │  │  ├─ ChevronsDownUp.tsx
│     │  │  │  ├─ ChevronsRight.tsx
│     │  │  │  ├─ ChevronsUpDown.tsx
│     │  │  │  ├─ ChevronUp.tsx
│     │  │  │  ├─ Circle.tsx
│     │  │  │  ├─ CircleCheck.tsx
│     │  │  │  ├─ Ellipsis.tsx
│     │  │  │  ├─ House.tsx
│     │  │  │  ├─ iconWithClassName.ts
│     │  │  │  ├─ IdCard.tsx
│     │  │  │  ├─ Layers.tsx
│     │  │  │  ├─ Palette.tsx
│     │  │  │  ├─ Pencil.tsx
│     │  │  │  ├─ Sparkles.tsx
│     │  │  │  ├─ SquareTerminal.tsx
│     │  │  │  └─ UserRoundPen.tsx
│     │  │  ├─ useColorScheme.tsx
│     │  │  └─ utils.ts
│     │  ├─ profile.tsx
│     │  ├─ questions.tsx
│     │  ├─ solve.tsx
│     │  ├─ testing.tsx
│     │  └─ _layout.tsx
│     ├─ app.config.js
│     ├─ assets
│     │  ├─ avatars
│     │  │  ├─ 1.png
│     │  │  ├─ 2.png
│     │  │  ├─ 3.png
│     │  │  ├─ 4.png
│     │  │  ├─ 5.png
│     │  │  ├─ 6.png
│     │  │  ├─ 7.png
│     │  │  ├─ 8.png
│     │  │  └─ bosty-1.png
│     │  ├─ fonts
│     │  │  ├─ Montserrat
│     │  │  │  ├─ Montserrat-Italic-VariableFont_wght.ttf
│     │  │  │  ├─ Montserrat-VariableFont_wght.ttf
│     │  │  │  ├─ OFL.txt
│     │  │  │  ├─ README.txt
│     │  │  │  └─ static
│     │  │  │     ├─ Montserrat-Black.ttf
│     │  │  │     ├─ Montserrat-BlackItalic.ttf
│     │  │  │     ├─ Montserrat-Bold.ttf
│     │  │  │     ├─ Montserrat-BoldItalic.ttf
│     │  │  │     ├─ Montserrat-ExtraBold.ttf
│     │  │  │     ├─ Montserrat-ExtraBoldItalic.ttf
│     │  │  │     ├─ Montserrat-ExtraLight.ttf
│     │  │  │     ├─ Montserrat-ExtraLightItalic.ttf
│     │  │  │     ├─ Montserrat-Italic.ttf
│     │  │  │     ├─ Montserrat-Light.ttf
│     │  │  │     ├─ Montserrat-LightItalic.ttf
│     │  │  │     ├─ Montserrat-Medium.ttf
│     │  │  │     ├─ Montserrat-MediumItalic.ttf
│     │  │  │     ├─ Montserrat-Regular.ttf
│     │  │  │     ├─ Montserrat-SemiBold.ttf
│     │  │  │     ├─ Montserrat-SemiBoldItalic.ttf
│     │  │  │     ├─ Montserrat-Thin.ttf
│     │  │  │     └─ Montserrat-ThinItalic.ttf
│     │  │  └─ SpaceMono-Regular.ttf
│     │  └─ images
│     │     ├─ adaptive-icon.png
│     │     ├─ favicon.png
│     │     ├─ icon.png
│     │     ├─ partial-react-logo.png
│     │     ├─ react-logo.png
│     │     ├─ react-logo@2x.png
│     │     ├─ react-logo@3x.png
│     │     └─ splash-icon.png
│     ├─ babel.config.js
│     ├─ eas.json
│     ├─ example.env
│     ├─ expo-env.d.ts
│     ├─ global.css
│     ├─ metro.config.js
│     ├─ nativewind-env.d.ts
│     ├─ package-lock.json
│     ├─ package.json
│     ├─ README.md
│     ├─ supabase.ts
│     ├─ tailwind.config.js
│     └─ tsconfig.json
├─ instructions
│  └─ instructions.md
├─ notes
│  ├─ lessons-learned.md
│  ├─ pretty-json-template.json
│  └─ README.md
└─ README.md

```