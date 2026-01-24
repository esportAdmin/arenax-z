-- Fix search_path for xp_for_level function
CREATE OR REPLACE FUNCTION public.xp_for_level(level_num integer)
RETURNS integer
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT FLOOR(100 * POWER(1.5, level_num - 1))::integer;
$$;