
-- Create table for banned members
CREATE TABLE public.club_banned_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  banned_by UUID NOT NULL,
  reason TEXT,
  banned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(club_id, user_id)
);

-- Enable RLS
ALTER TABLE public.club_banned_members ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Club admins can view bans"
ON public.club_banned_members FOR SELECT
USING (EXISTS (
  SELECT 1 FROM club_members
  WHERE club_members.club_id = club_banned_members.club_id
  AND club_members.user_id = auth.uid()
  AND club_members.role IN ('owner', 'admin')
));

CREATE POLICY "Club admins can ban members"
ON public.club_banned_members FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM club_members
  WHERE club_members.club_id = club_banned_members.club_id
  AND club_members.user_id = auth.uid()
  AND club_members.role IN ('owner', 'admin')
));

CREATE POLICY "Club admins can unban members"
ON public.club_banned_members FOR DELETE
USING (EXISTS (
  SELECT 1 FROM club_members
  WHERE club_members.club_id = club_banned_members.club_id
  AND club_members.user_id = auth.uid()
  AND club_members.role IN ('owner', 'admin')
));

-- Function to check if a user is banned from a club
CREATE OR REPLACE FUNCTION public.is_user_banned(p_club_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM club_banned_members
    WHERE club_id = p_club_id
    AND user_id = p_user_id
  )
$$;

-- Function to ban a member
CREATE OR REPLACE FUNCTION public.ban_club_member(
  p_club_id UUID,
  p_user_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_admin_id UUID := auth.uid();
  v_target_role TEXT;
  v_admin_role TEXT;
  v_target_name TEXT;
BEGIN
  -- Get admin role
  SELECT role INTO v_admin_role
  FROM club_members
  WHERE club_id = p_club_id AND user_id = v_admin_id;
  
  IF v_admin_role IS NULL OR v_admin_role NOT IN ('owner', 'admin') THEN
    RETURN json_build_object('success', false, 'error', 'Non autorisé');
  END IF;
  
  -- Get target role
  SELECT role INTO v_target_role
  FROM club_members
  WHERE club_id = p_club_id AND user_id = p_user_id;
  
  IF v_target_role IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Membre non trouvé');
  END IF;
  
  -- Cannot ban owner
  IF v_target_role = 'owner' THEN
    RETURN json_build_object('success', false, 'error', 'Impossible de bannir le propriétaire');
  END IF;
  
  -- Admin cannot ban another admin
  IF v_admin_role = 'admin' AND v_target_role = 'admin' THEN
    RETURN json_build_object('success', false, 'error', 'Impossible de bannir un autre admin');
  END IF;
  
  -- Get target name for notification
  SELECT display_name INTO v_target_name
  FROM profiles
  WHERE user_id = p_user_id;
  
  -- Remove from club members first
  DELETE FROM club_members
  WHERE club_id = p_club_id AND user_id = p_user_id;
  
  -- Update member count
  UPDATE clubs SET member_count = member_count - 1 WHERE id = p_club_id;
  
  -- Add to banned list
  INSERT INTO club_banned_members (club_id, user_id, banned_by, reason)
  VALUES (p_club_id, p_user_id, v_admin_id, p_reason)
  ON CONFLICT (club_id, user_id) DO UPDATE SET
    banned_by = v_admin_id,
    reason = p_reason,
    banned_at = now();
  
  -- Remove any active mutes
  DELETE FROM club_muted_members
  WHERE club_id = p_club_id AND user_id = p_user_id;
  
  -- Log moderation action
  INSERT INTO club_moderation_logs (club_id, moderator_id, action_type, target_user_id, message_content)
  VALUES (p_club_id, v_admin_id, 'ban', p_user_id, 'Bannissement. Raison: ' || COALESCE(p_reason, 'Non spécifiée'));
  
  -- Notify the banned user
  INSERT INTO user_notifications (user_id, type, title, message, value)
  VALUES (
    p_user_id,
    'banned',
    '⛔ Vous avez été banni',
    'Vous avez été banni du club.' || 
      CASE WHEN p_reason IS NOT NULL THEN ' Raison: ' || p_reason ELSE '' END,
    p_club_id::text
  );
  
  RETURN json_build_object('success', true);
END;
$$;

-- Function to unban a member
CREATE OR REPLACE FUNCTION public.unban_club_member(p_club_id UUID, p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_admin_id UUID := auth.uid();
BEGIN
  -- Check if admin has permission
  IF NOT EXISTS (
    SELECT 1 FROM club_members
    WHERE club_id = p_club_id 
    AND user_id = v_admin_id
    AND role IN ('owner', 'admin')
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Non autorisé');
  END IF;
  
  -- Remove ban
  DELETE FROM club_banned_members
  WHERE club_id = p_club_id AND user_id = p_user_id;
  
  -- Log moderation action
  INSERT INTO club_moderation_logs (club_id, moderator_id, action_type, target_user_id, message_content)
  VALUES (p_club_id, v_admin_id, 'unban', p_user_id, 'Débannissement');
  
  RETURN json_build_object('success', true);
END;
$$;
