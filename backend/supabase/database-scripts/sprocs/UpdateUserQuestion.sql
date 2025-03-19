CREATE OR REPLACE FUNCTION UpdateUserQuestion(
    p_user_question_id UUID,
    p_is_solved BOOLEAN
)
RETURNS TABLE (
    user_question_id UUID,
    is_solved BOOLEAN,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    UPDATE user_question
    SET 
        solved = p_is_solved,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_user_question_id
    AND deleted_at IS NULL
    RETURNING id as user_question_id, solved as is_solved, updated_at;
END;
$$ LANGUAGE plpgsql; 