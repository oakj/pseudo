CREATE OR REPLACE FUNCTION UpdateCollectionNameByUserId(
    p_collection_id UUID,
    p_collection_name VARCHAR(255),
    p_user_id UUID
)
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    UPDATE collection
    SET 
        name = p_collection_name,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_collection_id
    AND user_id = p_user_id
    AND deleted_at IS NULL
    RETURNING id, name, updated_at;
END;
$$ LANGUAGE plpgsql; 