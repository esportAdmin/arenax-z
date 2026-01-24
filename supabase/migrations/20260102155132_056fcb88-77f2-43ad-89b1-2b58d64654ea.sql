-- Function to extract mentions and notify users
CREATE OR REPLACE FUNCTION public.notify_mentioned_users()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_mention text;
  v_mentioned_user record;
  v_sender_name text;
  v_club_name text;
BEGIN
  -- Get sender name
  SELECT display_name INTO v_sender_name 
  FROM profiles WHERE user_id = NEW.user_id;
  
  -- Get club name
  SELECT name INTO v_club_name 
  FROM clubs WHERE id = NEW.club_id;
  
  -- Find all @mentions in the message using regex
  FOR v_mention IN 
    SELECT (regexp_matches(NEW.content, '@([^\s@]+(?:\s[^\s@]+)?)', 'g'))[1]
  LOOP
    -- Find user by display_name (case insensitive)
    SELECT p.user_id, p.display_name INTO v_mentioned_user
    FROM profiles p
    JOIN club_members cm ON cm.user_id = p.user_id
    WHERE cm.club_id = NEW.club_id
      AND LOWER(p.display_name) = LOWER(v_mention)
      AND p.user_id != NEW.user_id; -- Don't notify yourself
    
    -- If user found, create notification
    IF v_mentioned_user.user_id IS NOT NULL THEN
      INSERT INTO user_notifications (user_id, type, title, message, value)
      VALUES (
        v_mentioned_user.user_id,
        'mention',
        '💬 ' || COALESCE(v_sender_name, 'Quelqu''un') || ' vous a mentionné',
        'Dans le chat de ' || v_club_name || ': "' || 
          CASE 
            WHEN LENGTH(NEW.content) > 50 THEN LEFT(NEW.content, 50) || '...'
            ELSE NEW.content
          END || '"',
        NEW.id::text
      );
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- Create trigger for mentions
DROP TRIGGER IF EXISTS on_chat_message_mention ON public.club_messages;
CREATE TRIGGER on_chat_message_mention
  AFTER INSERT ON public.club_messages
  FOR EACH ROW
  WHEN (NEW.content LIKE '%@%')
  EXECUTE FUNCTION public.notify_mentioned_users();