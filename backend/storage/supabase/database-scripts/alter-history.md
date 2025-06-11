This document contains a history of any database schema alterations that has happened since creating the original tables.

6/11/2025:
```sql
-- As part of an effort to add roe level security for our supabase psql tables
-- Note: we likely want to remove the `insert` policy on weekly_streaks table so that our system can insert records

-- Enable RLS on all tables
ALTER TABLE public.app_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_pattern ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_design_pattern ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.default_collection ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.default_collection_question ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_question ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_question ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_streak ENABLE ROW LEVEL SECURITY;

-- app_user policies
CREATE POLICY "Users can view their own profile"
ON public.app_user
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.app_user
FOR UPDATE
USING (auth.uid() = id);

-- question policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view questions"
ON public.question
FOR SELECT
USING (auth.role() = 'authenticated');

-- design_pattern policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view design patterns"
ON public.design_pattern
FOR SELECT
USING (auth.role() = 'authenticated');

-- question_design_pattern policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view question design patterns"
ON public.question_design_pattern
FOR SELECT
USING (auth.role() = 'authenticated');

-- default_collection policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view default collections"
ON public.default_collection
FOR SELECT
USING (auth.role() = 'authenticated');

-- default_collection_question policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view default collection questions"
ON public.default_collection_question
FOR SELECT
USING (auth.role() = 'authenticated');

-- collection policies
CREATE POLICY "Users can view their own collections"
ON public.collection
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own collections"
ON public.collection
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections"
ON public.collection
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections"
ON public.collection
FOR DELETE
USING (auth.uid() = user_id);

-- collection_question policies
CREATE POLICY "Users can view their collection questions"
ON public.collection_question
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.collection
        WHERE id = collection_id
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can add questions to their collections"
ON public.collection_question
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.collection
        WHERE id = collection_id
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can remove questions from their collections"
ON public.collection_question
FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.collection
        WHERE id = collection_id
        AND user_id = auth.uid()
    )
);

-- user_question policies
CREATE POLICY "Users can view their own question attempts"
ON public.user_question
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own question attempts"
ON public.user_question
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own question attempts"
ON public.user_question
FOR UPDATE
USING (auth.uid() = user_id);

-- weekly_streak policies
CREATE POLICY "Users can view their own streaks"
ON public.weekly_streak
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own streaks"
ON public.weekly_streak
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks"
ON public.weekly_streak
FOR UPDATE
USING (auth.uid() = user_id);
```

6/9/2025:
```sql
-- As part of an effort to add row level security for our supabase buckets so that users can update/insert/delete/etc userQuestionFiles.

-- Enable RLS on the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create a function to check if a user ID is either the authenticated user or the test user
CREATE OR REPLACE FUNCTION storage.is_owner_or_test_user(folder_name text)
RETURNS boolean AS $$
BEGIN
  -- Check if the folder name matches either:
  -- 1. The authenticated user's ID (if there is one)
  -- 2. The test user ID
  RETURN 
    folder_name = COALESCE(auth.uid()::text, '') OR  -- authenticated user
    folder_name = '3b68160b-4d21-41da-8856-a9549cd85577';  -- test user ID
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policies for the userquestions bucket
CREATE POLICY "Users can read their own question data" ON storage.objects
FOR SELECT
USING (
  bucket_id = 'userquestions' AND 
  storage.is_owner_or_test_user((storage.foldername(name))[1])
);

CREATE POLICY "Users can insert their own question data" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'userquestions' AND 
  storage.is_owner_or_test_user((storage.foldername(name))[1])
);

CREATE POLICY "Users can update their own question data" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'userquestions' AND 
  storage.is_owner_or_test_user((storage.foldername(name))[1])
)
WITH CHECK (
  bucket_id = 'userquestions' AND 
  storage.is_owner_or_test_user((storage.foldername(name))[1])
);

CREATE POLICY "Users can delete their own question data" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'userquestions' AND 
  storage.is_owner_or_test_user((storage.foldername(name))[1])
); 
```

6/7/2025:
```sql
-- As part of an effort to remove references to leetcode, we are removing the leetcode_id fiels from the public.question table. 
ALTER TABLE question
DROP COLUMN leetcode_id;

-- also dropped and updated SelectQuestionsByUserId. See commit for this change.
```