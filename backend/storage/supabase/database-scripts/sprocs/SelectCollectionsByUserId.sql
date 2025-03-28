CREATE OR REPLACE FUNCTION SelectCollectionsByUserId(p_user_id UUID)
RETURNS TABLE (
    collection_id UUID,
    user_id UUID,
    collection_name VARCHAR(255),
    is_default BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    -- Get user's collections
    SELECT 
        c.id as collection_id,
        c.user_id,
        c.name as collection_name,
        false as is_default
    FROM collection c
    WHERE c.user_id = p_user_id
    AND c.deleted_at IS NULL
    
    UNION ALL
    
    -- Get default collections
    SELECT 
        dc.id as collection_id,
        NULL::UUID as user_id,
        dc.name as collection_name,
        true as is_default
    FROM default_collection dc
    WHERE dc.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql; 