CREATE OR REPLACE FUNCTION DeleteCollectionByUserId(p_id UUID)
RETURNS TABLE (
    collection_id UUID,
    deleted_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    UPDATE collection
    SET 
        deleted_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING id AS collection_id, deleted_at;
END;
$$ LANGUAGE plpgsql; 