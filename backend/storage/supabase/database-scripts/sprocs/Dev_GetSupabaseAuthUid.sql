   CREATE OR REPLACE FUNCTION public.dev_get_auth_uid()
   RETURNS text AS $$
   BEGIN
     RETURN auth.uid()::text;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
