-- Create moderation logs table
CREATE TABLE public.club_moderation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  moderator_id uuid NOT NULL,
  action_type text NOT NULL, -- 'delete', 'pin', 'unpin'
  target_message_id uuid,
  target_user_id uuid,
  message_content text, -- Store content of deleted message
  message_author_name text, -- Store author name of deleted message
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_moderation_logs_club_id ON public.club_moderation_logs(club_id);
CREATE INDEX idx_moderation_logs_created_at ON public.club_moderation_logs(created_at DESC);

-- Enable RLS
ALTER TABLE public.club_moderation_logs ENABLE ROW LEVEL SECURITY;

-- Only club admins can view moderation logs
CREATE POLICY "Club admins can view moderation logs"
ON public.club_moderation_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM club_members
    WHERE club_members.club_id = club_moderation_logs.club_id
    AND club_members.user_id = auth.uid()
    AND club_members.role IN ('owner', 'admin')
  )
);

-- System can insert logs
CREATE POLICY "System can insert moderation logs"
ON public.club_moderation_logs
FOR INSERT
WITH CHECK (true);

-- Create function to log message deletion
CREATE OR REPLACE FUNCTION public.log_message_deletion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_author_name text;
BEGIN
  -- Get author name
  SELECT display_name INTO v_author_name
  FROM profiles
  WHERE user_id = OLD.user_id;
  
  -- Only log if deleted by someone other than the author (moderation)
  -- or if the author deleted their own message (we still want to track it for moderators to see)
  INSERT INTO club_moderation_logs (
    club_id,
    moderator_id,
    action_type,
    target_message_id,
    target_user_id,
    message_content,
    message_author_name
  ) VALUES (
    OLD.club_id,
    auth.uid(),
    'delete',
    OLD.id,
    OLD.user_id,
    OLD.content,
    v_author_name
  );
  
  RETURN OLD;
END;
$$;

-- Create trigger for message deletion
CREATE TRIGGER on_message_delete
  BEFORE DELETE ON public.club_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.log_message_deletion();

-- Create function to log pin/unpin actions
CREATE OR REPLACE FUNCTION public.log_pin_action()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_author_name text;
  v_action text;
BEGIN
  -- Only log if is_pinned changed
  IF OLD.is_pinned IS DISTINCT FROM NEW.is_pinned THEN
    -- Get author name
    SELECT display_name INTO v_author_name
    FROM profiles
    WHERE user_id = NEW.user_id;
    
    v_action := CASE WHEN NEW.is_pinned THEN 'pin' ELSE 'unpin' END;
    
    INSERT INTO club_moderation_logs (
      club_id,
      moderator_id,
      action_type,
      target_message_id,
      target_user_id,
      message_content,
      message_author_name
    ) VALUES (
      NEW.club_id,
      auth.uid(),
      v_action,
      NEW.id,
      NEW.user_id,
      NEW.content,
      v_author_name
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for pin/unpin
CREATE TRIGGER on_message_pin
  AFTER UPDATE ON public.club_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.log_pin_action();