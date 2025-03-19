CREATE OR REPLACE FUNCTION UpdateWeeklyStreakByUserId(p_user_id UUID)
RETURNS TABLE (
    streak_days integer[]
) AS $$
DECLARE
    v_current_week_start DATE;
    v_today_dow INTEGER;
    v_current_streak integer[];
BEGIN
    -- Calculate the start of the current week (assuming Monday is start of week)
    v_current_week_start := date_trunc('week', CURRENT_DATE)::DATE;
    -- Get day of week (0-6, where 0 is Sunday)
    v_today_dow := EXTRACT(DOW FROM CURRENT_DATE)::INTEGER;
    
    -- Check if today is already in the streak
    SELECT streak_days INTO v_current_streak
    FROM weekly_streak
    WHERE user_id = p_user_id
    AND week_start = v_current_week_start
    AND v_today_dow = ANY(streak_days);

    -- If today is already recorded, just return current streak_days
    IF FOUND THEN
        RETURN QUERY
        SELECT ws.streak_days
        FROM weekly_streak ws
        WHERE ws.user_id = p_user_id
        AND ws.week_start = v_current_week_start;
    ELSE
        -- Insert or update the weekly streak record
        RETURN QUERY
        INSERT INTO weekly_streak (user_id, week_start, streak_days)
        VALUES (
            p_user_id, 
            v_current_week_start, 
            ARRAY[v_today_dow]
        )
        ON CONFLICT (user_id, week_start) 
        DO UPDATE SET 
            streak_days = array_append(weekly_streak.streak_days, v_today_dow),
            updated_at = CURRENT_TIMESTAMP
        RETURNING streak_days;
    END IF;
END;
$$ LANGUAGE plpgsql; 