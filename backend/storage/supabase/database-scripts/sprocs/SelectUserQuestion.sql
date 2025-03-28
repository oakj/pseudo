CREATE OR REPLACE FUNCTION SelectUserQuestion(
    p_user_id UUID,
    p_question_id UUID
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    question_id UUID,
    solved BOOLEAN,
    blob_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        id as user_question_id,
        user_id,
        question_id,
        solved,
        blob_url
    FROM user_question
    WHERE user_id = p_user_id
    AND question_id = p_question_id
    AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql; 