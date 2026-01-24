
-- Create table for ban appeals
CREATE TABLE public.club_ban_appeals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_response TEXT,
  responded_by UUID,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.club_ban_appeals ENABLE ROW LEVEL SECURITY;

-- Users can view their own appeals
CREATE POLICY "Users can view their own appeals"
ON public.club_ban_appeals FOR SELECT
USING (auth.uid() = user_id);

-- Club admins can view appeals for their club
CREATE POLICY "Club admins can view appeals"
ON public.club_ban_appeals FOR SELECT
USING (EXISTS (
  SELECT 1 FROM club_members
  WHERE club_members.club_id = club_ban_appeals.club_id
  AND club_members.user_id = auth.uid()
  AND club_members.role IN ('owner', 'admin')
));

-- Banned users can create appeals
CREATE POLICY "Banned users can create appeals"
ON public.club_ban_appeals FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM club_banned_members
    WHERE club_banned_members.club_id = club_ban_appeals.club_id
    AND club_banned_members.user_id = auth.uid()
  )
  AND NOT EXISTS (
    SELECT 1 FROM club_ban_appeals existing
    WHERE existing.club_id = club_ban_appeals.club_id
    AND existing.user_id = auth.uid()
    AND existing.status = 'pending'
  )
);

-- Admins can update appeals
CREATE POLICY "Club admins can update appeals"
ON public.club_ban_appeals FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM club_members
  WHERE club_members.club_id = club_ban_appeals.club_id
  AND club_members.user_id = auth.uid()
  AND club_members.role IN ('owner', 'admin')
));

-- Function to submit a ban appeal
CREATE OR REPLACE FUNCTION public.submit_ban_appeal(
  p_club_id UUID,
  p_reason TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_appeal_id UUID;
  v_club_name TEXT;
BEGIN
  -- Check if user is banned
  IF NOT EXISTS (
    SELECT 1 FROM club_banned_members
    WHERE club_id = p_club_id AND user_id = v_user_id
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Vous n''êtes pas banni de ce club');
  END IF;
  
  -- Check for existing pending appeal
  IF EXISTS (
    SELECT 1 FROM club_ban_appeals
    WHERE club_id = p_club_id AND user_id = v_user_id AND status = 'pending'
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Vous avez déjà un appel en cours');
  END IF;
  
  -- Create appeal
  INSERT INTO club_ban_appeals (club_id, user_id, reason)
  VALUES (p_club_id, v_user_id, p_reason)
  RETURNING id INTO v_appeal_id;
  
  -- Get club name
  SELECT name INTO v_club_name FROM clubs WHERE id = p_club_id;
  
  -- Notify admins
  INSERT INTO user_notifications (user_id, type, title, message, value)
  SELECT 
    cm.user_id,
    'ban_appeal',
    '📝 Nouvel appel de bannissement',
    'Un membre banni fait appel de son bannissement dans ' || v_club_name,
    v_appeal_id::text
  FROM club_members cm
  WHERE cm.club_id = p_club_id AND cm.role IN ('owner', 'admin');
  
  RETURN json_build_object('success', true, 'appeal_id', v_appeal_id);
END;
$$;

-- Function to respond to a ban appeal
CREATE OR REPLACE FUNCTION public.respond_to_ban_appeal(
  p_appeal_id UUID,
  p_approved BOOLEAN,
  p_response TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_admin_id UUID := auth.uid();
  v_appeal record;
  v_user_name TEXT;
BEGIN
  -- Get appeal
  SELECT * INTO v_appeal FROM club_ban_appeals WHERE id = p_appeal_id;
  
  IF v_appeal IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Appel non trouvé');
  END IF;
  
  IF v_appeal.status != 'pending' THEN
    RETURN json_build_object('success', false, 'error', 'Cet appel a déjà été traité');
  END IF;
  
  -- Check if admin has permission
  IF NOT EXISTS (
    SELECT 1 FROM club_members
    WHERE club_id = v_appeal.club_id
    AND user_id = v_admin_id
    AND role IN ('owner', 'admin')
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Non autorisé');
  END IF;
  
  -- Update appeal
  UPDATE club_ban_appeals
  SET 
    status = CASE WHEN p_approved THEN 'approved' ELSE 'rejected' END,
    admin_response = p_response,
    responded_by = v_admin_id,
    responded_at = now()
  WHERE id = p_appeal_id;
  
  -- If approved, unban the user
  IF p_approved THEN
    DELETE FROM club_banned_members
    WHERE club_id = v_appeal.club_id AND user_id = v_appeal.user_id;
    
    -- Log moderation action
    INSERT INTO club_moderation_logs (club_id, moderator_id, action_type, target_user_id, message_content)
    VALUES (v_appeal.club_id, v_admin_id, 'unban', v_appeal.user_id, 'Débannissement suite à appel accepté');
  END IF;
  
  -- Notify the user
  INSERT INTO user_notifications (user_id, type, title, message, value)
  VALUES (
    v_appeal.user_id,
    CASE WHEN p_approved THEN 'appeal_approved' ELSE 'appeal_rejected' END,
    CASE WHEN p_approved THEN '✅ Appel accepté' ELSE '❌ Appel refusé' END,
    CASE 
      WHEN p_approved THEN 'Votre appel a été accepté. Vous pouvez rejoindre le club.'
      ELSE 'Votre appel a été refusé.' || COALESCE(' Raison: ' || p_response, '')
    END,
    v_appeal.club_id::text
  );
  
  RETURN json_build_object('success', true, 'approved', p_approved);
END;
$$;
