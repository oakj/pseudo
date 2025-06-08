CREATE OR REPLACE FUNCTION SelectQuestionsByUserId(p_user_id UUID)
RETURNS TABLE (
    question_id UUID,
    question_title VARCHAR(255),
    question_difficulty VARCHAR(20),
    question_blob_url VARCHAR(255),
    design_patterns VARCHAR[],
    is_solved BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        q.id as question_id,
        q.title as question_title,
        q.difficulty as question_difficulty,
        q.blob_url as question_blob_url,
        ARRAY_AGG(dp.name) as design_patterns,
        uq.solved as is_solved
    FROM question q
    LEFT JOIN question_design_pattern qdp ON q.id = qdp.question_id
    LEFT JOIN design_pattern dp ON qdp.design_pattern_id = dp.id
    LEFT JOIN user_question uq ON q.id = uq.question_id AND uq.user_id = p_user_id
    WHERE q.deleted_at IS NULL
    GROUP BY 
        q.id,
        q.title,
        q.difficulty,
        q.blob_url,
        uq.solved;
END;
$$ LANGUAGE plpgsql; 