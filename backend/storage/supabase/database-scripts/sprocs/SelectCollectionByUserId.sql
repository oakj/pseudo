CREATE OR REPLACE FUNCTION SelectCollectionByUserId(
    p_user_id UUID,
    p_collection_id UUID
)
RETURNS TABLE (
    collection_id UUID,
    collection_name VARCHAR(255),
    question_id UUID,
    solved BOOLEAN,
    blob_url VARCHAR,
    difficulty VARCHAR(20),
    design_patterns TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id as collection_id,
        c.name as collection_name,
        cq.question_id,
        uq.solved,
        uq.blob_url,
        q.difficulty,
        ARRAY_AGG(dp.name::text) as design_patterns
    FROM collection c
    LEFT JOIN collection_question cq ON c.id = cq.collection_id
    LEFT JOIN user_question uq ON cq.question_id = uq.question_id AND uq.user_id = p_user_id
    LEFT JOIN question q ON cq.question_id = q.id
    LEFT JOIN question_design_pattern qdp ON q.id = qdp.question_id
    LEFT JOIN design_pattern dp ON qdp.design_pattern_id = dp.id
    WHERE c.id = p_collection_id
    AND c.user_id = p_user_id
    AND c.deleted_at IS NULL
    GROUP BY 
        c.id,
        c.name,
        cq.question_id,
        uq.solved,
        uq.blob_url,
        q.difficulty;
END;
$$ LANGUAGE plpgsql; 