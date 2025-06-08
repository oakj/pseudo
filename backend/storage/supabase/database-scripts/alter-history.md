This document contains a history of any database schema alterations that has happened since creating the original tables.

6/7/2025:
```sql
-- As part of an effort to remove references to leetcode, we are removing the leetcode_id fiels from the public.question table. 
ALTER TABLE question
DROP COLUMN leetcode_id;

-- also dropped and updated SelectQuestionsByUserId. See commit for this change.
```