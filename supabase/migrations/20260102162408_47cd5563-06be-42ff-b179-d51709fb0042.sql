
-- Create function to notify club members when a new poll is created
CREATE OR REPLACE FUNCTION public.notify_new_poll()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_creator_name text;
  v_club_name text;
  v_member record;
BEGIN
  -- Get creator name
  SELECT display_name INTO v_creator_name
  FROM profiles
  WHERE user_id = NEW.creator_id;
  
  -- Get club name
  SELECT name INTO v_club_name
  FROM clubs
  WHERE id = NEW.club_id;
  
  -- Notify all club members except the creator
  FOR v_member IN 
    SELECT user_id FROM club_members 
    WHERE club_id = NEW.club_id 
    AND user_id != NEW.creator_id
  LOOP
    INSERT INTO user_notifications (user_id, type, title, message, value)
    VALUES (
      v_member.user_id,
      'poll_created',
      '📊 Nouveau sondage',
      COALESCE(v_creator_name, 'Un membre') || ' a créé un sondage dans ' || v_club_name || ': "' || 
        CASE 
          WHEN LENGTH(NEW.question) > 50 THEN LEFT(NEW.question, 50) || '...'
          ELSE NEW.question
        END || '"',
      NEW.id::text
    );
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new polls
CREATE TRIGGER on_poll_created
AFTER INSERT ON public.club_polls
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_poll();
