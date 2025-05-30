CREATE OR REPLACE FUNCTION SelectDefaultCollectionByUserId(
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
        dc.id as collection_id,
        dc.name as collection_name,
        dcq.question_id,
        uq.solved,
        uq.blob_url,
        q.difficulty,
        ARRAY_AGG(dp.name::text) as design_patterns
    FROM default_collection dc
    LEFT JOIN default_collection_question dcq ON dc.id = dcq.default_collection_id
    LEFT JOIN user_question uq ON dcq.question_id = uq.question_id AND uq.user_id = p_user_id
    LEFT JOIN question q ON dcq.question_id = q.id
    LEFT JOIN question_design_pattern qdp ON q.id = qdp.question_id
    LEFT JOIN design_pattern dp ON qdp.design_pattern_id = dp.id
    WHERE dc.id = p_collection_id
    AND dc.deleted_at IS NULL
    GROUP BY 
        dc.id,
        dc.name,
        dcq.question_id,
        uq.solved,
        uq.blob_url,
        q.difficulty;
END;
$$ LANGUAGE plpgsql; 