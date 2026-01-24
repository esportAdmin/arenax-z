-- Add XP and level columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS current_xp integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_level integer NOT NULL DEFAULT 1;

-- Create function to calculate XP needed for next level (exponential curve)
CREATE OR REPLACE FUNCTION public.xp_for_level(level_num integer)
RETURNS integer
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT FLOOR(100 * POWER(1.5, level_num - 1))::integer;
$$;

-- Create function to handle XP gain and level up
CREATE OR REPLACE FUNCTION public.add_xp(p_user_id uuid, p_xp_amount integer)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_xp integer;
  v_current_level integer;
  v_xp_needed integer;
  v_new_xp integer;
  v_new_level integer;
  v_leveled_up boolean := false;
BEGIN
  -- Get current XP and level
  SELECT current_xp, current_level INTO v_current_xp, v_current_level
  FROM profiles WHERE user_id = p_user_id;
  
  v_new_xp := v_current_xp + p_xp_amount;
  v_new_level := v_current_level;
  
  -- Check for level up
  LOOP
    v_xp_needed := xp_for_level(v_new_level);
    EXIT WHEN v_new_xp < v_xp_needed;
    v_new_xp := v_new_xp - v_xp_needed;
    v_new_level := v_new_level + 1;
    v_leveled_up := true;
  END LOOP;
  
  -- Update profile
  UPDATE profiles 
  SET current_xp = v_new_xp, current_level = v_new_level
  WHERE user_id = p_user_id;
  
  RETURN json_build_object(
    'new_xp', v_new_xp,
    'new_level', v_new_level,
    'leveled_up', v_leveled_up,
    'xp_for_next_level', xp_for_level(v_new_level)
  );
END;
$$;