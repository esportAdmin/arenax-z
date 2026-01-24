-- Club activity log table
CREATE TABLE public.club_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  activity_type text NOT NULL, -- 'member_joined', 'member_left', 'prediction_won', 'prediction_lost', 'level_up', 'challenge_completed'
  title text NOT NULL,
  description text,
  xp_amount integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.club_activities ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Club members can view activities"
ON public.club_activities FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM club_members 
    WHERE club_id = club_activities.club_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "System can insert activities"
ON public.club_activities FOR INSERT
WITH CHECK (true);

-- Index for faster queries
CREATE INDEX idx_club_activities_club_id ON public.club_activities(club_id);
CREATE INDEX idx_club_activities_created_at ON public.club_activities(created_at DESC);

-- Function to approve join request
CREATE OR REPLACE FUNCTION public.approve_join_request(p_request_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_request record;
  v_club record;
BEGIN
  -- Get request
  SELECT * INTO v_request FROM club_join_requests WHERE id = p_request_id;
  
  IF v_request IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Demande non trouvée');
  END IF;
  
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM club_members 
    WHERE club_id = v_request.club_id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Non autorisé');
  END IF;
  
  -- Get club
  SELECT * INTO v_club FROM clubs WHERE id = v_request.club_id;
  
  -- Check member limit
  IF v_club.member_count >= v_club.max_members THEN
    RETURN json_build_object('success', false, 'error', 'Club complet');
  END IF;
  
  -- Add member
  INSERT INTO club_members (club_id, user_id, role)
  VALUES (v_request.club_id, v_request.user_id, 'member');
  
  -- Update club member count
  UPDATE clubs SET member_count = member_count + 1 WHERE id = v_request.club_id;
  
  -- Update request status
  UPDATE club_join_requests 
  SET status = 'approved', responded_at = now() 
  WHERE id = p_request_id;
  
  -- Log activity
  INSERT INTO club_activities (club_id, user_id, activity_type, title, description)
  VALUES (v_request.club_id, v_request.user_id, 'member_joined', 'Nouveau membre', 'A rejoint le club');
  
  RETURN json_build_object('success', true);
END;
$$;

-- Function to reject join request
CREATE OR REPLACE FUNCTION public.reject_join_request(p_request_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_request record;
BEGIN
  SELECT * INTO v_request FROM club_join_requests WHERE id = p_request_id;
  
  IF v_request IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Demande non trouvée');
  END IF;
  
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM club_members 
    WHERE club_id = v_request.club_id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Non autorisé');
  END IF;
  
  -- Update request status
  UPDATE club_join_requests 
  SET status = 'rejected', responded_at = now() 
  WHERE id = p_request_id;
  
  RETURN json_build_object('success', true);
END;
$$;

-- Function to update member role
CREATE OR REPLACE FUNCTION public.update_member_role(p_member_id uuid, p_new_role text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_member record;
BEGIN
  SELECT * INTO v_member FROM club_members WHERE id = p_member_id;
  
  IF v_member IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Membre non trouvé');
  END IF;
  
  -- Check if user is owner
  IF NOT EXISTS (
    SELECT 1 FROM club_members 
    WHERE club_id = v_member.club_id 
    AND user_id = auth.uid() 
    AND role = 'owner'
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Seul le propriétaire peut modifier les rôles');
  END IF;
  
  -- Can't change owner role
  IF v_member.role = 'owner' THEN
    RETURN json_build_object('success', false, 'error', 'Impossible de modifier le rôle du propriétaire');
  END IF;
  
  -- Validate new role
  IF p_new_role NOT IN ('admin', 'moderator', 'member') THEN
    RETURN json_build_object('success', false, 'error', 'Rôle invalide');
  END IF;
  
  UPDATE club_members SET role = p_new_role WHERE id = p_member_id;
  
  RETURN json_build_object('success', true);
END;
$$;