-- Using LANGUAGE sql instead of LANGUAGE plpgsql because this is a simple UPDATE query.
-- LANGUAGE sql is more performant as it has no procedural overhead and is directly executed by the query planner.
-- LANGUAGE plpgsql would be needed if we required variables, control flow, or multiple statements.
--
-- Using RETURNS TABLE even though we're returning a single record because:
-- 1. It provides explicit type definitions for each column
-- 2. It works the same whether returning one row or multiple rows
-- 3. It's more type-safe than alternatives like RETURNS RECORD
-- 4. The query planner handles single-row results efficiently
CREATE OR REPLACE FUNCTION UpdateProfileByUserId(
    p_user_id UUID,
    p_avatar_url VARCHAR(255),
    p_dark_mode_preference VARCHAR(20)
)
RETURNS TABLE (
    user_id UUID,
    user_avatar_url VARCHAR(255),
    user_dark_mode_preference VARCHAR(20)
) AS $$
    UPDATE app_user
    SET 
        avatar_url = p_avatar_url,
        dark_mode_preference = p_dark_mode_preference,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_user_id
    AND deleted_at IS NULL
    RETURNING 
        id as user_id,
        avatar_url as user_avatar_url,
        dark_mode_preference as user_dark_mode_preference;
$$ LANGUAGE sql; 