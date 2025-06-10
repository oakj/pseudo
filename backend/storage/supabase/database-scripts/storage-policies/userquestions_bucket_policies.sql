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