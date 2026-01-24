
-- Create table for muted members
CREATE TABLE public.club_muted_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  muted_by UUID NOT NULL,
  reason TEXT,
  muted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(club_id, user_id)
);

-- Enable RLS
ALTER TABLE public.club_muted_members ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Club members can view mutes"
ON public.club_muted_members FOR SELECT
USING (EXISTS (
  SELECT 1 FROM club_members
  WHERE club_members.club_id = club_muted_members.club_id
  AND club_members.user_id = auth.uid()
));

CREATE POLICY "Club admins can mute members"
ON public.club_muted_members FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM club_members
  WHERE club_members.club_id = club_muted_members.club_id
  AND club_members.user_id = auth.uid()
  AND club_members.role IN ('owner', 'admin', 'moderator')
));

CREATE POLICY "Club admins can unmute members"
ON public.club_muted_members FOR DELETE
USING (EXISTS (
  SELECT 1 FROM club_members
  WHERE club_members.club_id = club_muted_members.club_id
  AND club_members.user_id = auth.uid()
  AND club_members.role IN ('owner', 'admin', 'moderator')
));

CREATE POLICY "Club admins can update mutes"
ON public.club_muted_members FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM club_members
  WHERE club_members.club_id = club_muted_members.club_id
  AND club_members.user_id = auth.uid()
  AND club_members.role IN ('owner', 'admin', 'moderator')
));

-- Function to check if a user is muted in a club
CREATE OR REPLACE FUNCTION public.is_user_muted(p_club_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM club_muted_members
    WHERE club_id = p_club_id
    AND user_id = p_user_id
    AND expires_at > now()
  )
$$;

-- Function to mute a member
CREATE OR REPLACE FUNCTION public.mute_club_member(
  p_club_id UUID,
  p_user_id UUID,
  p_duration_minutes INTEGER,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_moderator_id UUID := auth.uid();
  v_target_role TEXT;
  v_moderator_role TEXT;
BEGIN
  -- Get moderator role
  SELECT role INTO v_moderator_role
  FROM club_members
  WHERE club_id = p_club_id AND user_id = v_moderator_id;
  
  IF v_moderator_role IS NULL OR v_moderator_role NOT IN ('owner', 'admin', 'moderator') THEN
    RETURN json_build_object('success', false, 'error', 'Non autorisé');
  END IF;
  
  -- Get target role
  SELECT role INTO v_target_role
  FROM club_members
  WHERE club_id = p_club_id AND user_id = p_user_id;
  
  IF v_target_role IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Membre non trouvé');
  END IF;
  
  -- Cannot mute owner
  IF v_target_role = 'owner' THEN
    RETURN json_build_object('success', false, 'error', 'Impossible de mute le propriétaire');
  END IF;
  
  -- Cannot mute someone with equal or higher role
  IF v_moderator_role = 'moderator' AND v_target_role IN ('admin', 'moderator') THEN
    RETURN json_build_object('success', false, 'error', 'Impossible de mute un admin ou modérateur');
  END IF;
  
  IF v_moderator_role = 'admin' AND v_target_role = 'admin' THEN
    RETURN json_build_object('success', false, 'error', 'Impossible de mute un autre admin');
  END IF;
  
  -- Upsert mute (insert or update if exists)
  INSERT INTO club_muted_members (club_id, user_id, muted_by, reason, expires_at)
  VALUES (p_club_id, p_user_id, v_moderator_id, p_reason, now() + (p_duration_minutes || ' minutes')::interval)
  ON CONFLICT (club_id, user_id) 
  DO UPDATE SET 
    muted_by = v_moderator_id,
    reason = p_reason,
    muted_at = now(),
    expires_at = now() + (p_duration_minutes || ' minutes')::interval;
  
  -- Log moderation action
  INSERT INTO club_moderation_logs (club_id, moderator_id, action_type, target_user_id, message_content)
  VALUES (p_club_id, v_moderator_id, 'mute', p_user_id, 'Mute pour ' || p_duration_minutes || ' minutes. Raison: ' || COALESCE(p_reason, 'Non spécifiée'));
  
  -- Notify the muted user
  INSERT INTO user_notifications (user_id, type, title, message, value)
  VALUES (
    p_user_id,
    'muted',
    '🔇 Vous avez été mute',
    'Vous ne pouvez plus envoyer de messages pendant ' || p_duration_minutes || ' minutes.' || 
      CASE WHEN p_reason IS NOT NULL THEN ' Raison: ' || p_reason ELSE '' END,
    p_club_id::text
  );
  
  RETURN json_build_object('success', true, 'expires_at', now() + (p_duration_minutes || ' minutes')::interval);
END;
$$;

-- Function to unmute a member
CREATE OR REPLACE FUNCTION public.unmute_club_member(p_club_id UUID, p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_moderator_id UUID := auth.uid();
BEGIN
  -- Check if moderator has permission
  IF NOT EXISTS (
    SELECT 1 FROM club_members
    WHERE club_id = p_club_id 
    AND user_id = v_moderator_id
    AND role IN ('owner', 'admin', 'moderator')
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Non autorisé');
  END IF;
  
  -- Remove mute
  DELETE FROM club_muted_members
  WHERE club_id = p_club_id AND user_id = p_user_id;
  
  -- Log moderation action
  INSERT INTO club_moderation_logs (club_id, moderator_id, action_type, target_user_id, message_content)
  VALUES (p_club_id, v_moderator_id, 'unmute', p_user_id, 'Unmute');
  
  RETURN json_build_object('success', true);
END;
$$;
