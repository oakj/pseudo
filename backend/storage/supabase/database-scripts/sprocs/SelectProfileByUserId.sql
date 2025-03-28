-- Using LANGUAGE sql instead of LANGUAGE plpgsql because this is a simple SELECT query.
-- LANGUAGE sql is more performant as it has no procedural overhead and is directly executed by the query planner.
-- LANGUAGE plpgsql would be needed if we required variables, control flow, or multiple statements.
--
-- Using RETURNS TABLE even though we're returning a single record because:
-- 1. It provides explicit type definitions for each column
-- 2. It works the same whether returning one row or multiple rows
-- 3. It's more type-safe than alternatives like RETURNS RECORD
-- 4. The query planner handles single-row results efficiently
CREATE OR REPLACE FUNCTION SelectProfileByUserId(p_user_id UUID)
RETURNS TABLE (
    user_id UUID,
    user_email VARCHAR(255),
    user_avatar_url VARCHAR(255),
    user_dark_mode_preference VARCHAR(20)
) AS $$
    SELECT 
        au.id as user_id,
        au.email as user_email,
        au.avatar_url as user_avatar_url,
        au.dark_mode_preference as user_dark_mode_preference
    FROM app_user au
    WHERE au.id = p_user_id
    AND au.deleted_at IS NULL;
$$ LANGUAGE sql; 