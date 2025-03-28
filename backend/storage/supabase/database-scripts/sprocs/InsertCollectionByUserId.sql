CREATE OR REPLACE FUNCTION InsertCollectionByUserId(
    p_user_id UUID,
    p_collection_name VARCHAR(255)
)
RETURNS UUID AS $$
DECLARE
    v_collection_id UUID;
BEGIN
    INSERT INTO collection (
        name,
        user_id
    ) VALUES (
        p_collection_name,
        p_user_id
    )
    RETURNING id INTO v_collection_id;
    
    RETURN v_collection_id;
END;
$$ LANGUAGE plpgsql; 