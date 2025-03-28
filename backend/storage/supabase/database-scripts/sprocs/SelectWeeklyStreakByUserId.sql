CREATE OR REPLACE FUNCTION SelectWeeklyStreakByUserId(p_user_id UUID)
RETURNS INTEGER[] AS $$
BEGIN
    RETURN (
        SELECT ws.streak_days
        FROM weekly_streak ws
        WHERE ws.user_id = p_user_id
        AND CURRENT_DATE >= ws.week_start 
        AND CURRENT_DATE < ws.week_start + INTERVAL '7 days'
        ORDER BY ws.week_start DESC
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql;
