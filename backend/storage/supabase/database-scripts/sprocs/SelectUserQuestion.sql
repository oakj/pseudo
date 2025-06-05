CREATE OR REPLACE FUNCTION SelectUserQuestion(
    p_user_id UUID,
    p_question_id UUID
)
RETURNS TABLE (
    user_question_id UUID,
    user_id UUID,
    question_id UUID,
    solved BOOLEAN,
    blob_url VARCHAR(255)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        uq.id AS user_question_id,
        uq.user_id,
        uq.question_id,
        uq.solved,
        uq.blob_url
    FROM user_question uq
    WHERE uq.user_id = p_user_id
    AND uq.question_id = p_question_id
    AND uq.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;