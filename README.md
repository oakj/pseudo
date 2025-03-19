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
    - [ ] Create SQL scripts and/or stored procedures to be used by the app.
    - [ ] Setup S3/Blob-storage dummy data.
        - [ ] Start by storing dummy data in the backend/s3/dummy-data folder.
            - [ ] Create file for each Question
            - [ ] Create a dummy file for each test user's user_question record
        - [ ] Once we feel comfortable testing with dummy data, we should start to move them to a real blob storage service (or use local storage on the python server).
- [ ] Setup Login/Signup screen.
- [ ] Setup Home screen.
- [ ] Setup Profile screen.
- [ ] Setup Question Groups screen.
- [ ] Setup Questions screen.
- [ ] Setup Solve screen (using dummy data for hints ai chat bot and pseudocode validation engine)
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
- [ ] Consider charging a fair price once we see users are happy with the product.
- [ ] Consider adding a "Flashcard" feature to the app.
