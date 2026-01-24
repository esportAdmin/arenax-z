
-- Function to alert admins when a member is muted multiple times
CREATE OR REPLACE FUNCTION public.check_repeat_mute_offender()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_mute_count INTEGER;
  v_user_name TEXT;
  v_club_name TEXT;
  v_admin record;
  v_threshold INTEGER := 3; -- Alert after 3 mutes
BEGIN
  -- Only process mute actions
  IF NEW.action_type != 'mute' THEN
    RETURN NEW;
  END IF;
  
  -- Count how many times this user has been muted in this club
  SELECT COUNT(*) INTO v_mute_count
  FROM club_moderation_logs
  WHERE club_id = NEW.club_id
    AND target_user_id = NEW.target_user_id
    AND action_type = 'mute';
  
  -- If threshold reached, alert admins
  IF v_mute_count >= v_threshold AND v_mute_count % v_threshold = 0 THEN
    -- Get user name
    SELECT display_name INTO v_user_name
    FROM profiles
    WHERE user_id = NEW.target_user_id;
    
    -- Get club name
    SELECT name INTO v_club_name
    FROM clubs
    WHERE id = NEW.club_id;
    
    -- Notify all admins and owner
    FOR v_admin IN 
      SELECT user_id FROM club_members 
      WHERE club_id = NEW.club_id 
      AND role IN ('owner', 'admin')
    LOOP
      INSERT INTO user_notifications (user_id, type, title, message, value)
      VALUES (
        v_admin.user_id,
        'repeat_offender',
        '⚠️ Récidiviste détecté',
        COALESCE(v_user_name, 'Un membre') || ' a été mute ' || v_mute_count || ' fois dans ' || v_club_name || '. Envisagez un bannissement.',
        NEW.club_id::text
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER on_moderation_action_check_repeat
AFTER INSERT ON public.club_moderation_logs
FOR EACH ROW
EXECUTE FUNCTION public.check_repeat_mute_offender();
