# Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack Documentation](#tech-stack-documentation)
3. [Core Functionalities](#core-functionalities)
4. [Database](#database)
5. [Blob Storage](#blob-storage)
6. [Prompt Engineering Guidelines and Pseudocode Validation](#prompt-engineering-guidelines-and-pseudocode-validation)
7. [Python Data Models](#python-data-models)
8. [Project File Structure](#project-file-structure)

# Project Overview
Pseudo is a mobile application that allows users to solve coding interview questions using pseudocode.

You will be using the following technologies:
- React Native
- React Native Async Storage
- Expo SDK (for Expo Go)
- Expo Router
- TypeScript
- Nativewind
- React Native Reusables (RNR)
- Supabase (for authentication and postgresql database)
- S3 Blob Storage

# Tech Stack Documentation
- React Native: https://reactnative.dev/docs/getting-started
- React Native Async Storage: https://react-native-async-storage.github.io/async-storage/docs/usage
- Expo: https://docs.expo.dev/
- Expo Router: https://docs.expo.dev/router/introduction/
- TypeScript: https://www.typescriptlang.org/docs/
- NativeWind: https://www.nativewind.dev/
- React Native Reusables: https://rnr-docs.vercel.app/getting-started/initial-setup/
    - Icons: https://lucide.dev/guide/basics/color
    - Components:
        - Accordion: https://rnr-docs.vercel.app/components/accordion
        - Alert: https://rnr-docs.vercel.app/components/alert
        - Alert Dialog: https://rnr-docs.vercel.app/components/alert-dialog
        - Aspect Ratio: https://rnr-docs.vercel.app/components/aspect-ratio
        - Avatar: https://rnr-docs.vercel.app/components/avatar
        - Badge: https://rnr-docs.vercel.app/components/badge
        - Button: https://rnr-docs.vercel.app/components/button
        - Card: https://rnr-docs.vercel.app/components/card
        - Checkbox: https://rnr-docs.vercel.app/components/checkbox
        - Collapsible: https://rnr-docs.vercel.app/components/collapsible
        - Context Menu: https://rnr-docs.vercel.app/components/context-menu
        - Dialog: https://rnr-docs.vercel.app/components/dialog
        - Dropdown Menu: https://rnr-docs.vercel.app/components/dropdown-menu
        - Hover Card: https://rnr-docs.vercel.app/components/hover-card
        - Input: https://rnr-docs.vercel.app/components/input
        - Label: https://rnr-docs.vercel.app/components/label
        - Menubar: https://rnr-docs.vercel.app/components/menubar
        - Navigation Menu: https://rnr-docs.vercel.app/components/navigation-menu
        - Popover: https://rnr-docs.vercel.app/components/popover
        - Progress: https://rnr-docs.vercel.app/components/progress
        - Radio Group: https://rnr-docs.vercel.app/components/radio-group
        - Select: https://rnr-docs.vercel.app/components/select
        - Separator: https://rnr-docs.vercel.app/components/separator
        - Skeleton: https://rnr-docs.vercel.app/components/skeleton
        - Switch: https://rnr-docs.vercel.app/components/switch
        - Table: https://rnr-docs.vercel.app/components/table
        - Tabs: https://rnr-docs.vercel.app/components/tabs
        - Text: https://rnr-docs.vercel.app/components/text
        - Textarea: https://rnr-docs.vercel.app/components/textarea
        - Toggle: https://rnr-docs.vercel.app/components/toggle
        - Toggle Group: https://rnr-docs.vercel.app/components/toggle-group
        - Tooltip: https://rnr-docs.vercel.app/components/tooltip
        - Typography: https://rnr-docs.vercel.app/components/typography
- Supabase: https://supabase.com/docs
- PostgreSQL: https://www.postgresql.org/docs/

# Core Functionalities
1. Login/Signup Screen:
    1. The login screen should have a header with the name PseudoSolve and a user profile avatar.
    2. If a user is not logged in, direct them to the login screen.
    3. The login screen should allow users to login using an e-mail/password, Google OAuth, or Apple OAuth via Supabase.
    4. The login screen should have a "Forgot password?" link that will send the user an e-mail to reset their password.
    5. The login screen should have a "Sign up" link that will open a screen with a form to signup.
    6. The signup screen should allow the user to signup using an e-mail/password, Google OAuth, or Apple OAuth via Supabase.
2. Home Screen:
    1. The home screen should have a header with the name PseudoSolve and a user profile avatar.
    2. If a user is logged in, direct them to the home screen.
    3. The home screen should have a "Weekly Streak" section that shows which days of the week the user has solved a question.
    4. The home screen should have a "Question Groups" section that shows the question groups. The last card should be a "More" card that will take the user to the question groups screen.
    5. The home screen should have a "Questions" sections that shows the questions.
    6. The questions should be filterable by difficulty and design pattern.
    7. The questions should be clickable and will take the user to the solve screen.
    8. The questions should have a filled green circle icon if the user has solved the question.
    9. The questions should have an empty circle icon if the user has not solved the question.
    10. When filtered by difficulty, the questions should have a badge that shows the design patterns used in the question.
    11. When filtered by design pattern, the questions should have a badge that shows the difficulty of the question.
3. Profile Screen:
    1. The profile screen should have a header with the name PseudoSolve and a user profile avatar.
    2. The profile screen should have a "Change Avatar" section that shows a list of default avatars that the user can select.
    3. The profile screen should have a "Dark Mode" setting that allows the user to select either light mode, dark mode, or system default.
    4. The profile screen should have a "Logout" button that will log the user out of the app.
    5. The profile screen should have a "Back" gesture that will take the user back to the previous screen and also save all profile changes.
3. QuestionGroup Screen:
    1. The question group screen should have a header with the name PseudoSolve and a user profile avatar.
    2. The question group screen should have a heading with the question group name.
    3. Adjacent to the question group heading, there should be an "Edit" button that will allow the user to change the question group name.
    4. Adjacent to the "Edit" button, there should be a "Delete" button that will allow the user to delete the question group.
    5. The question group screen should have a section with the questions in the question group.
    6. The questions in the question group should be filterable by difficulty and design pattern.
    7. The questions in the question group should be clickable and will take the user to the solve screen.
    8. The questions in the question group should have a filled green circle icon if the user has solved the question.
    9. The questions in the question group should have an empty circle icon if the user has not solved the question.
    10. When filtered by difficulty, the questions should have a badge that shows the design patterns used in the question.
    11. When filtered by design pattern, the questions should have a badge that shows the difficulty of the question.
    12. The question group screen should have a "Back" gesture that will take the user back to the previous screen.
4. Solve Screen:
    1. The solve screen should have a header with the name PseudoSolve and a user profile avatar.
    2. The solve screen will have a section with the question title and description.
    3. The solve screen will have a section to write the pseudocode.
    4. The solve screen should have a "Back" gesture that will take the user back to the previous screen.
    5. The solve screen should have a "Submit" button that will submit the user's solution.
    6. The solve screen should have a "Hints" button that will open a bottom sheet with a chatbot that will give the user hints.

# Database
```sql
-- User Table
CREATE TABLE app_user ( -- user is a reserved keyword
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    avatar_url VARCHAR(255),
    dark_mode_preference VARCHAR(20) DEFAULT 'system',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Question Table
CREATE TABLE question (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    blob_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Design Pattern Table
CREATE TABLE design_pattern (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Question Design Pattern Table
CREATE TABLE question_design_pattern (
    question_id UUID REFERENCES question(id),
    design_pattern_id UUID REFERENCES design_pattern(id),
    PRIMARY KEY (question_id, design_pattern_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Default Collection Table
CREATE TABLE default_collection (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Default Collection Question Table
CREATE TABLE default_collection_question (
    default_collection_id UUID REFERENCES default_collection(id),
    question_id UUID REFERENCES question(id),
    PRIMARY KEY (default_collection_id, question_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Collection Table
CREATE TABLE collection (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES app_user(id),
    default_collection_id UUID REFERENCES default_collection(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Collection Question Table
CREATE TABLE collection_question (
    collection_id UUID REFERENCES collection(id),
    question_id UUID REFERENCES question(id),
    PRIMARY KEY (collection_id, question_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- User Question Table
CREATE TABLE user_question (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES app_user(id),
    question_id UUID REFERENCES question(id),
    solved BOOLEAN,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	blob_url VARCHAR(255), -- URL to S3 file containing user pseudocode and chat history with the hints bot
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Weekly Streak Table
CREATE TABLE weekly_streak (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES app_user(id),
    week_start DATE NOT NULL,
    streak_days INTEGER[] DEFAULT '{}',
    UNIQUE (user_id, week_start),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a function to be called by the on_auth_user_created trigger.
CREATE OR REPLACE FUNCTION insert_app_user()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.app_user (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$;

-- Create a trigger to insert a record into app_user when a new user signs up via Supabase auth (e.g. user inserted into auth.users table).
create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute procedure public.insert_app_user();
```

# Blob Storage
For the most up-to-date JSON schema and formatting guidelines, see [backend/storage/blob/formatting.md](../backend/storage/blob/formatting.md).

```json
// Question description and solutions (Question json files)
{
    "question_id": "001",
    "title": "Two Sum",
    "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    "solutions": [
        {
            "language": "python",
            "pseudocode": "def two_sum(nums, target):\n    # Create a dictionary to store complement values\n    num_dict = {}\n    \n    # Iterate through the array\n    for i, num in enumerate(nums):\n        complement = target - num\n        \n        # Check if complement exists in the dictionary\n        if complement in num_dict:\n            # Return indices of the two numbers\n            return [num_dict[complement], i]\n        \n        # Add current number and its index to the dictionary\n        num_dict[num] = i\n    \n    # If no solution is found, return an empty list\n    return []"
        }
    ]
}

// User pseudocode and chat history with the hints bot (UserQuestion json files)
{
    "pseudocode": "# first create a dictionary called numDictionary\n# then iterate over nums to populate the dictionary\n\ndef two_sum(nums, target):\n    numDictionary = {}\n    for i in range(len(nums)):\n        complement = target - nums[i]\n        if complement in numDictionary:\n            return [numDictionary[complement], i]\n        numDictionary[nums[i]] = i\n    return []",
    "hint": {
        "messages": [
            {
                "from": "hint_bot",
                "message": "Hello! I'm here to help. Based on what you have so far, let me give you some suggestions!"
            },
            {
                "from": "user",
                "message": "I'm still not following, can you break it down further for me?"
            },
            {
                "from": "hint_bot",
                "message": "Certainly! Let's break it down step by step:\n\n1. Create an empty dictionary called `numDictionary`.\n2. Iterate through the `nums` list using a for loop and its index.\n3. For each number, calculate its complement (target - current number).\n4. Check if the complement exists in the dictionary.\n5. If it does, return the indices of the complement and the current number.\n6. If not, add the current number and its index to the dictionary.\n7. If no solution is found after the loop, return an empty list.\n\nDoes this help clarify the approach?"
            }
        ]
    }
}

```

# Prompt Engineering Guidelines and Pseudocode Validation
The prompt engineering guidelines and validation rules for pseudocode solutions are detailed in [backend/storage/blob/formatting.md](../backend/storage/blob/formatting.md).

## Solution Validation Flow
1. **User Submits Solution**
   ```json
   {
     "questionId": "001",
     "solution": "def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []"
   }
   ```

2. **Backend Prepares Context**
   - Fetches question JSON from S3
   - Combines question metadata with user solution
   ```json
   {
     "prompt": {
       "role": "strict programming instructor",
       "question": {
         "title": "Two Sum",
         "complexity": {
           "time": "O(n)",
           "space": "O(n)"
         },
         "requiredConcepts": ["hash table", "array iteration"],
         "testCases": ["[2,7,11,15], 9", "[3,2,4], 6"]
       },
       "userSolution": "def twoSum(nums, target)...",
       "evaluationCriteria": {
         "correctness": 40,
         "complexity": 30,
         "implementation": 30
       }
     }
   }
   ```

3. **LLM Evaluation Response**
   ```json
   {
     "score": 95,
     "feedback": {
       "correctness": {
         "score": 40,
         "comments": "Solution correctly handles all test cases"
       },
       "complexity": {
         "score": 28,
         "comments": "Achieves O(n) time and O(n) space as required"
       },
       "implementation": {
         "score": 27,
         "comments": "Good use of hash table, clear variable names. Consider adding input validation."
       }
     },
     "suggestions": [
       "Add input validation for empty arrays",
       "Consider documenting the space-time tradeoff"
     ]
   }
   ```

4. **Application Response to User**
   ```json
   {
     "success": true,
     "score": 95,
     "passed": true,
     "feedback": {
       "summary": "Excellent solution! Meets all core requirements.",
       "improvements": [
         "Add input validation for empty arrays",
         "Consider documenting the space-time tradeoff"
       ]
     }
   }
   ```

## Key Components
1. **Validation Process**:
   - Solutions are evaluated for correctness, complexity, and style
   - LLM acts as a strict programming instructor
   - Scoring is based on a 0-100 scale with detailed feedback

2. **Evaluation Criteria**:
   - Correctness (handles all test cases)
   - Time and space complexity requirements
   - Proper implementation of required concepts
   - Code clarity and style

3. **Feedback System**:
   - Provides specific feedback on errors
   - Suggests improvements
   - Identifies common anti-patterns
   - References specific test cases when needed

For complete implementation details and prompt templates, refer to the formatting guide.

# Python Data Models
```python
from pydantic import BaseModel, UUID4
from typing import Optional, List
from datetime import datetime

class User(BaseModel):
    id: UUID4
    email: str
    avatar_url: Optional[str]
    dark_mode_preference: str = "system"
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]

class Question(BaseModel):
    id: UUID4
    title: str
    difficulty: str
    blob_url: str
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]

class DesignPattern(BaseModel):
    id: UUID4
    name: str
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]

class Collection(BaseModel):
    id: UUID4
    name: str
    user_id: UUID4
    default_collection_id: Optional[UUID4]
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]

class UserQuestion(BaseModel):
    id: UUID4
    user_id: UUID4
    question_id: UUID4
    solved: bool
    submitted_at: datetime
    blob_url: str
    updated_at: datetime
    deleted_at: Optional[datetime]

class WeeklyStreak(BaseModel):
    id: UUID4
    user_id: UUID4
    week_start: datetime
    streak_days: List[int]
    created_at: datetime
    updated_at: datetime

```

# Project File Structure
```
how to:
1. open command prompt
2. navigate to the root directory of the project
3. ``
```