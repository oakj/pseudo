CREATE OR REPLACE FUNCTION insert_user_question(
    p_user_id UUID,
    p_question_id UUID,
    p_blob_url VARCHAR(255)
) RETURNS public.user_question AS $$
    INSERT INTO public.user_question (
        user_id,
        question_id,
        solved,
        blob_url
    )
    VALUES (
        p_user_id,
        p_question_id,
        FALSE,
        p_blob_url
    )
    RETURNING *;
$$ LANGUAGE sql;