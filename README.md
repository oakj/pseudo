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

## Incomplete Todos
- [ ] Install/implement capabilities for using Expo EAS build. This is only needed for production builds.
    - [ ] Bonus task for implementing a CI/CD pipeline via GitHub repository.