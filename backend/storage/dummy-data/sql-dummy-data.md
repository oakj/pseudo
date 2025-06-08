# Dummy Data for Supabase

The process below should be used to create dummy data for testing. The steps are:
1. (One time setup) Create initial dummy data to be shared across all users.
2. When a user is created in Supabase via ```auth.users```, a trigger (```after_user_insert```) will invoke the function ```insert_app_user```, which creates a user in the table ```public.app_user```.
3. The function ```generate_user_dummy_data```, triggered by ```trigger_generate_user_dummy_data``` will generate dummy data for the new user whenever a record is inserted into ```public.app_user```.
4. See below for how to test "weekly_streak" functionality.
5. See below for how to use the dummy data.
6. (3/27/25 update): See below for inserted question and user_question records to match dummy question json files.
---
*Run Once:* Create initial dummy data to be shared across all users. Note that S3 paths do not link to actual files. Create data for:
- Questions
- Design Patterns
- Question-Design Pattern Relationships
- Default Collections
- Default Collection-Question Relationships
```sql
DO $$
BEGIN
    -- Only insert if questions table is empty
    IF NOT EXISTS (SELECT 1 FROM question WHERE title LIKE '[TEST]%' LIMIT 1) THEN
        -- Insert questions
        INSERT INTO question (title, difficulty, blob_url)
        SELECT 
            '[TEST] Question ' || n,
            (ARRAY['Easy', 'Medium', 'Hard'])[floor(random() * 3 + 1)],
            'https://s3.example.com/test-questions/' || md5(random()::text)
        FROM generate_series(1, 50) n;

        -- Insert design patterns
        INSERT INTO design_pattern (name)
        SELECT '[TEST] ' || pattern_name
        FROM (VALUES 
            ('Singleton'), ('Factory'), ('Observer'), ('Strategy'), ('Decorator'),
            ('Proxy'), ('Adapter'), ('Composite'), ('Command'), ('Iterator')
        ) AS patterns(pattern_name)
        WHERE NOT EXISTS (
            SELECT 1 FROM design_pattern WHERE name LIKE '[TEST]%'
        );

        -- Create question-design pattern relationships
        INSERT INTO question_design_pattern (question_id, design_pattern_id)
        SELECT 
            q.id,
            dp.id
        FROM question q
        CROSS JOIN design_pattern dp
        WHERE q.title LIKE '[TEST]%'
        AND dp.name LIKE '[TEST]%'
        ORDER BY random()
        LIMIT 100;

        -- Create default collections
        INSERT INTO default_collection (name)
        SELECT '[TEST] Default Collection for ' || n
        FROM generate_series(1, 5) n;

        -- Create default collection-question relationships
        INSERT INTO default_collection_question (default_collection_id, question_id)
        SELECT 
            dc.id,
            q.id
        FROM default_collection dc
        CROSS JOIN question q
        WHERE q.title LIKE '[TEST]%'
        ORDER BY random()
        LIMIT 100;
    END IF;
END $$;
```

Create the ```after_user_insert``` trigger.
```sql
CREATE TRIGGER after_user_insert
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION insert_app_user();
```
Create the auth schema database function ```insert_app_user```.
```sql
CREATE OR REPLACE FUNCTION insert_app_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.app_user (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

Create the ```trigger_generate_user_dummy_data``` trigger.
```sql
DROP TRIGGER IF EXISTS trigger_generate_user_dummy_data ON app_user;
CREATE TRIGGER trigger_generate_user_dummy_data
    AFTER INSERT ON app_user
    FOR EACH ROW
    EXECUTE FUNCTION generate_user_dummy_data();
```

Create the public schema function ```generate_user_dummy_data```. Generate data for:
- User custom collections (and questions mapped to the collections)
- Recent weekly streak data
```sql
CREATE OR REPLACE FUNCTION generate_user_dummy_data()
RETURNS trigger AS $$
DECLARE
    new_collection_id uuid;
BEGIN
    -- Create (1) personal collection
    INSERT INTO public.collection (name, user_id)
    VALUES ('[TEST] My Collection', NEW.id)
    RETURNING id INTO new_collection_id;

    -- Add (5) random questions to the collection
    INSERT INTO public.collection_question (collection_id, question_id)
    SELECT 
        new_collection_id,
        q.id
    FROM public.question q
    WHERE q.title LIKE '[TEST]%'  -- Only select test questions
    ORDER BY random()
    LIMIT 5;

    -- Create (5) user_question records
    INSERT INTO public.user_question (user_id, question_id, solved, blob_url)
    SELECT 
        NEW.id,
        q.id,
        (ARRAY[true, false])[floor(random() * 2 + 1)],
        'https://s3.example.com/test-solutions/' || md5(random()::text)
    FROM public.question q
    WHERE q.title LIKE '[TEST]%'  -- Only select test questions
    ORDER BY random()
    LIMIT 10;

    -- Create weekly streak data
    INSERT INTO public.weekly_streak (user_id, week_start, streak_days)
    SELECT 
        NEW.id,
        current_date - (n * 7 || ' days')::interval,
        ARRAY(SELECT generate_series(1, floor(random() * 7 + 1)::integer))
    FROM generate_series(0, 4) n;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

-- How to test "weekly_streak" functionality:
```sql
-- This is only required if has been over 7 days since the test user has been created.

-- Create recent weekly streak data for a user:
-- Note that the week_start should be a Sunday and index 0 of streak_days is Sunday.
INSERT INTO public.weekly_streak (user_id, week_start, streak_days)
VALUES 
('3b68160b-4d21-41da-8856-a9549cd85577', '2025-05-11', ARRAY[0, 1, 2, 4, 5, 6]),
('3b68160b-4d21-41da-8856-a9549cd85577', '2025-05-18', ARRAY[1, 2, 3, 4, 5]),
('3b68160b-4d21-41da-8856-a9549cd85577', '2025-05-25', ARRAY[1, 3, 5]);
```

How to use dummy data:
```sql
-- How to query just the dummy data:
SELECT * FROM question WHERE title LIKE '[TEST]%';
SELECT * FROM collection WHERE name LIKE '[TEST]%';
SELECT * FROM design_pattern WHERE name LIKE '[TEST]%';

-- How to clean all dummy data in the correct order:
DELETE FROM weekly_streak WHERE user_id IN (
    SELECT id FROM app_user WHERE email LIKE 'test_user_%@example.com'
);

DELETE FROM user_question WHERE question_id IN (
    SELECT id FROM question WHERE title LIKE '[TEST]%'
);

DELETE FROM collection_question WHERE collection_id IN (
    SELECT id FROM collection WHERE name LIKE '[TEST]%'
);

DELETE FROM collection WHERE name LIKE '[TEST]%';

DELETE FROM default_collection WHERE name LIKE '[TEST]%';

DELETE FROM question_design_pattern WHERE question_id IN (
    SELECT id FROM question WHERE title LIKE '[TEST]%'
);

DELETE FROM question WHERE title LIKE '[TEST]%';

DELETE FROM design_pattern WHERE name LIKE '[TEST]%';
```

6.a. Inserted question records to match dummy data version of question json files. This was executed on 3/27/2025 via the Supabase console's SQL editor.
```sql
INSERT INTO public.question (title, difficulty)
VALUES 
  -- L-1: Two Sum
  ('Two Sum', 'easy'),
  
  -- L-3: Longest Substring Without Repeating Characters
  ('Longest Substring Without Repeating Characters', 'medium'),
  
  -- L-15: 3Sum
  ('3Sum', 'medium'),
  
  -- L-20: Valid Parentheses
  ('Valid Parentheses', 'easy'),
  
  -- L-23: Merge k Sorted Lists
  ('Merge k Sorted Lists', 'hard'),
  
  -- L-102: Binary Tree Level Order Traversal
  ('Binary Tree Level Order Traversal', 'medium'),
  
  -- L-121: Best Time to Buy and Sell Stock
  ('Best Time to Buy and Sell Stock', 'easy'),
  
  -- L-127: Word Ladder
  ('Word Ladder', 'hard'),
  
  -- L-200: Number of Islands
  ('Number of Islands', 'medium'),
  
  -- L-295: Find Median from Data Stream
  ('Find Median from Data Stream', 'hard');

  -- To select the newly added questions, use the following query:
  select * from question where title NOT LIKE '[TEST]%';
```

6.b. Inserted user_question records to be used for dummy data versions of the user_question json files. This was executed on 3/27/2025 via the Supabase console's SQL editor. These queries use real question_ids created above. These test user tied to these user_question records are _solvepseudo-test-1@gmail.com_
```sql
INSERT INTO public.user_question (user_id, question_id, solved)
VALUES 
  -- Two Sum (solved)
  ('af6eb13c-24d3-4622-8997-b386a076ede1', 'b788a7db-c05d-4769-b231-2db1a6482a5e', true),
  
  -- Longest Substring (not solved)
  ('af6eb13c-24d3-4622-8997-b386a076ede1', '087405c7-79ca-490d-bbcb-b7d31f72112a', false),
  
  -- 3Sum (solved)
  ('af6eb13c-24d3-4622-8997-b386a076ede1', 'ea42cfe2-7e25-44e4-8e89-3c85661fa68a', true),
  
  -- Valid Parentheses (not solved)
  ('af6eb13c-24d3-4622-8997-b386a076ede1', '9d8abe9c-316d-4e12-b288-5c5540db940e', false),
  
  -- Merge k Sorted Lists (solved)
  ('af6eb13c-24d3-4622-8997-b386a076ede1', 'ec1e64cb-a249-47cd-9a80-ddc45ff37836', true),
  
  -- Binary Tree Level Order (not solved)
  ('af6eb13c-24d3-4622-8997-b386a076ede1', '781d865f-376f-495f-ab4b-52e3e9b2e35c', false),
  
  -- Best Time to Buy and Sell Stock (solved)
  ('af6eb13c-24d3-4622-8997-b386a076ede1', 'cb8b2437-6618-42ce-a771-41a7b01cca4f', true),
  
  -- Word Ladder (not solved)
  ('af6eb13c-24d3-4622-8997-b386a076ede1', 'cfde29c8-d215-420d-bfec-e632d781be9d', false),
  
  -- Number of Islands (solved)
  ('af6eb13c-24d3-4622-8997-b386a076ede1', 'beef45e6-0e2f-4ced-8a02-793660d1cba1', true),
  
  -- Find Median from Data Stream (not solved)
  ('af6eb13c-24d3-4622-8997-b386a076ede1', '8004809c-4523-4daf-bb2d-8344c4f1cb54', false);

  -- To select the newly added user_question records, use the following query:
  SELECT * FROM user_question WHERE user_id = 'af6eb13c-24d3-4622-8997-b386a076ede1' AND submitted_at > 2025-03-27 18:00:00+00' AND submitted_at < '2025-03-27 19:00:00+00'; 
```
6.b.1: The newly created user_question records for user _solvepseudo-test-1@gmail.com_ are:
| user_question_id                          | question_id                              | question_title                                      | solved |
|-------------------------------------------|------------------------------------------|----------------------------------------------------|--------|
| 803d9755-94ed-4749-9ed9-83e7b3f5abba      | b788a7db-c05d-4769-b231-2db1a6482a5e     | Two Sum                                           | true   |
| e69cbd17-09f6-4864-968a-de42da46df10      | 087405c7-79ca-490d-bbcb-b7d31f72112a     | Longest Substring Without Repeating Characters    | false  |
| 510f9dcc-464e-48ff-a920-43518eabbd54      | ea42cfe2-7e25-44e4-8e89-3c85661fa68a     | 3Sum                                              | true   |
| 8f580c6e-3c8e-4502-91de-21aafa7521f7      | 9d8abe9c-316d-4e12-b288-5c5540db940e     | Valid Parentheses                                 | false  |
| df576c81-0d19-4471-83ae-511e1bbc4271      | ec1e64cb-a249-47cd-9a80-ddc45ff37836     | Merge k Sorted Lists                              | true   |
| cc61c2ec-30cf-405c-ba27-77708eac1ab2      | 781d865f-376f-495f-ab4b-52e3e9b2e35c     | Binary Tree Level Order Traversal                 | false  |
| 294a924b-4591-45ea-b3dd-c6c9c6112b2e      | cb8b2437-6618-42ce-a771-41a7b01cca4f     | Best Time to Buy and Sell Stock                   | true   |
| dba22364-c980-4a6e-bc54-566b609914c8      | cfde29c8-d215-420d-bfec-e632d781be9d     | Word Ladder                                       | false  |
| 83481541-f24b-4906-b867-751125527037      | beef45e6-0e2f-4ced-8a02-793660d1cba1     | Number of Islands                                 | true   |
| 9756b403-0988-428f-9368-d16e8a520687      | 8004809c-4523-4daf-bb2d-8344c4f1cb54     | Find Median from Data Stream                      | false  |
