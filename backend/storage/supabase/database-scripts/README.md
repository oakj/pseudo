### SPROCS

| ID | Name | Inputs | Outputs | Screens Used | Indexes | Description | Considerations |
|----|------|---------|---------|--------------|---------|-------------|----------------|
| 1  | *_SelectWeeklyStreakByUserId_* | user_id | integer[] | Home | PK Only | Retrieves the streak days array for the current week for a given user. | None |
| 2  | *_SelectCollectionsByUserId_* | user_id | collection_id, user_id, collection_name, is_default | Home | PK Only | Retrieves all collections (both user-created and default) for a specific user. | None |
| 3  | *_SelectQuestionsByUserId_* | user_id | question_id, question_title, question_difficulty, question_blob_url, design_patterns, is_solved | Home | PK Only | Retrieves all questions with their design patterns and solved status for a specific user. | None |
| 4  | *_SelectProfileByUserId_* | user_id | user_id, user_email, user_avatar_url, user_dark_mode_preference | All Screens | PK Only | Retrieves user profile information including email, avatar, and display preferences. | 1. Consider indexing or caching this data on the user's device.<br><br>2. Consider adding a display_name field to the app_user table. |
| 5  | *_UpdateProfileByUserId_* | user_id, avatar_url, dark_mode_preference | user_id, user_avatar_url, user_dark_mode_preference | Profile | PK Only | Updates a user's avatar and dark mode preferences. | Consider adding capability to update user email and user display name. |
| 6  | *_SelectCollectionByUserId_* | user_id, collection_id | collection_id, collection_name, question_id, solved, blob_url, difficulty, design_patterns | Collection | PK Only | Retrieves detailed information about a specific collection including its questions and their status. | None |
| 7  | *_UpdateCollectionNameByUserId_* | collection_id, collection_name, user_id | id, name, updated_at | Collection | PK Only | Updates the name of a specific collection for a user. | None |
| 8  | *_DeleteCollectionByUserId_* | collection_id | collection_id, deleted_at | Collection | PK Only | Performs a soft delete on a collection by setting its deleted_at timestamp. | Consider soft deleting related records in the collection_question table. |
| 9  | *_SelectUserQuestion_* | user_id, question_id | id, user_id, question_id, solved, blob_url | Solve | PK Only | Retrieves a specific user's question attempt and status. | None |
| 10 | *_InsertUserQuestion_* | user_id, question_id, blob_url | user_question_id, user_id, question_id, solved, blob_url | Solve | PK Only | Creates a new user question attempt record with initial solved status of false. | None |
| 11 | *_UpdateUserQuestion_* | user_question_id, is_solved | user_question_id, is_solved, updated_at | Solve | PK Only | Updates the solved status of a user's question attempt. | Consider if this should be an INSERT or an UPSERT. |
| 12 | *_UpdateWeeklyStreakByUserId_* | user_id | streak_days | Solve | PK Only | Updates or creates a weekly streak record by adding today's day-of-week to the streak array. | None |
| 13 | *_InsertCollectionByUserId_* | user_id, collection_name | UUID (collection_id) | Collection | PK Only | Creates a new collection for a specific user. | None |
| 14 | *_SelectDefaultCollectionByUserId_* | user_id, collection_id | collection_id, collection_name, question_id, solved, blob_url, difficulty, design_patterns | Collection | PK Only | Retrieves detailed information about a default collection including its questions and their status. | None |

### UPSCRIPTS

| ID | Name                                                      | Description           | Executed Via                     |
|----|-----------------------------------------------------------|----------------------|----------------------------------|
| 1  | *TBD: add upscripts already ran manually via Supabase console* | *Insert Description* | Supabase console or CI/CD Pipeline |
| 2  | *Insert Name*                                             | *Insert Description* | Supabase console or CI/CD Pipeline |

### Data Management
- [ ] Consider a "reaping" feature that will move all soft deleted records to an archived table. This will only be needed if selects for non-deleted records are slowing down due to the size of the table.
