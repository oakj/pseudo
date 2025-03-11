# Dummy Data for Supabase

The process below should be used to create dummy data for testing. The steps are:
1. (One time setup) Create initial dummy data to be shared across all users.
2. When a user is created in Supabase via ```auth.users```, a trigger (```after_user_insert```) will invoke the function ```insert_app_user```, which creates a user in the table ```public.app_user```.
3. The function ```generate_user_dummy_data```, triggered by ```trigger_generate_user_dummy_data``` will generate dummy data for the new user whenever a record is inserted into ```public.app_user```.
4. See below for how to test "weekly_streak" functionality.
5. See below for how to use the dummy data.
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

TBD
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
