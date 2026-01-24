-- Clubs table
CREATE TABLE public.clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  logo_url text,
  banner_url text,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public boolean NOT NULL DEFAULT true,
  max_members integer NOT NULL DEFAULT 50,
  member_count integer NOT NULL DEFAULT 1,
  total_xp bigint NOT NULL DEFAULT 0,
  total_predictions integer NOT NULL DEFAULT 0,
  total_wins integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Club membership table
CREATE TABLE public.club_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member', -- 'owner', 'admin', 'moderator', 'member'
  xp_contributed bigint NOT NULL DEFAULT 0,
  predictions_count integer NOT NULL DEFAULT 0,
  wins_count integer NOT NULL DEFAULT 0,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(club_id, user_id)
);

-- Club join requests for private clubs
CREATE TABLE public.club_join_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  responded_at timestamptz,
  UNIQUE(club_id, user_id)
);

-- Enable RLS
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_join_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for clubs
CREATE POLICY "Anyone can view public clubs"
ON public.clubs FOR SELECT
USING (is_public = true);

CREATE POLICY "Members can view their private clubs"
ON public.clubs FOR SELECT
USING (
  is_public = false AND 
  EXISTS (SELECT 1 FROM club_members WHERE club_id = clubs.id AND user_id = auth.uid())
);

CREATE POLICY "Users can create clubs"
ON public.clubs FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners and admins can update clubs"
ON public.clubs FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM club_members 
    WHERE club_id = clubs.id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

CREATE POLICY "Only owners can delete clubs"
ON public.clubs FOR DELETE
USING (auth.uid() = owner_id);

-- RLS policies for club_members
CREATE POLICY "Anyone can view club members"
ON public.club_members FOR SELECT
USING (true);

CREATE POLICY "Users can join public clubs"
ON public.club_members FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (SELECT 1 FROM clubs WHERE id = club_id AND is_public = true)
);

CREATE POLICY "Admins can add members"
ON public.club_members FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM club_members 
    WHERE club_id = club_members.club_id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

CREATE POLICY "Members can leave clubs"
ON public.club_members FOR DELETE
USING (auth.uid() = user_id AND role != 'owner');

CREATE POLICY "Admins can remove members"
ON public.club_members FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM club_members cm
    WHERE cm.club_id = club_members.club_id 
    AND cm.user_id = auth.uid() 
    AND cm.role IN ('owner', 'admin')
  )
  AND club_members.role NOT IN ('owner')
);

CREATE POLICY "Admins can update member roles"
ON public.club_members FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM club_members cm
    WHERE cm.club_id = club_members.club_id 
    AND cm.user_id = auth.uid() 
    AND cm.role IN ('owner', 'admin')
  )
);

-- RLS policies for join requests
CREATE POLICY "Users can view their own requests"
ON public.club_join_requests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Club admins can view requests"
ON public.club_join_requests FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM club_members 
    WHERE club_id = club_join_requests.club_id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

CREATE POLICY "Users can create join requests"
ON public.club_join_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update join requests"
ON public.club_join_requests FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM club_members 
    WHERE club_id = club_join_requests.club_id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

-- Indexes
CREATE INDEX idx_clubs_slug ON public.clubs(slug);
CREATE INDEX idx_club_members_club_id ON public.club_members(club_id);
CREATE INDEX idx_club_members_user_id ON public.club_members(user_id);

-- Function to create club with owner as member
CREATE OR REPLACE FUNCTION public.create_club(
  p_name text,
  p_description text DEFAULT NULL,
  p_is_public boolean DEFAULT true
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_club_id uuid;
  v_slug text;
BEGIN
  -- Generate slug from name
  v_slug := lower(regexp_replace(p_name, '[^a-zA-Z0-9]+', '-', 'g'));
  v_slug := trim(both '-' from v_slug);
  
  -- Check if user already owns a club
  IF EXISTS (SELECT 1 FROM clubs WHERE owner_id = v_user_id) THEN
    RETURN json_build_object('success', false, 'error', 'Vous possédez déjà un club');
  END IF;
  
  -- Create club
  INSERT INTO clubs (name, slug, description, owner_id, is_public)
  VALUES (p_name, v_slug, p_description, v_user_id, p_is_public)
  RETURNING id INTO v_club_id;
  
  -- Add owner as member
  INSERT INTO club_members (club_id, user_id, role)
  VALUES (v_club_id, v_user_id, 'owner');
  
  RETURN json_build_object('success', true, 'club_id', v_club_id);
EXCEPTION
  WHEN unique_violation THEN
    RETURN json_build_object('success', false, 'error', 'Ce nom de club existe déjà');
END;
$$;

-- Function to join a club
CREATE OR REPLACE FUNCTION public.join_club(p_club_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_club record;
BEGIN
  -- Get club info
  SELECT * INTO v_club FROM clubs WHERE id = p_club_id;
  
  IF v_club IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Club non trouvé');
  END IF;
  
  -- Check if already a member
  IF EXISTS (SELECT 1 FROM club_members WHERE club_id = p_club_id AND user_id = v_user_id) THEN
    RETURN json_build_object('success', false, 'error', 'Vous êtes déjà membre de ce club');
  END IF;
  
  -- Check member limit
  IF v_club.member_count >= v_club.max_members THEN
    RETURN json_build_object('success', false, 'error', 'Ce club est complet');
  END IF;
  
  -- If private, create join request
  IF NOT v_club.is_public THEN
    INSERT INTO club_join_requests (club_id, user_id)
    VALUES (p_club_id, v_user_id)
    ON CONFLICT (club_id, user_id) DO NOTHING;
    RETURN json_build_object('success', true, 'pending', true, 'message', 'Demande envoyée');
  END IF;
  
  -- Join public club
  INSERT INTO club_members (club_id, user_id, role)
  VALUES (p_club_id, v_user_id, 'member');
  
  -- Update member count
  UPDATE clubs SET member_count = member_count + 1 WHERE id = p_club_id;
  
  RETURN json_build_object('success', true, 'pending', false);
END;
$$;

-- Function to leave a club
CREATE OR REPLACE FUNCTION public.leave_club(p_club_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_member record;
BEGIN
  SELECT * INTO v_member FROM club_members 
  WHERE club_id = p_club_id AND user_id = v_user_id;
  
  IF v_member IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Vous n''êtes pas membre de ce club');
  END IF;
  
  IF v_member.role = 'owner' THEN
    RETURN json_build_object('success', false, 'error', 'Le propriétaire ne peut pas quitter le club');
  END IF;
  
  DELETE FROM club_members WHERE club_id = p_club_id AND user_id = v_user_id;
  UPDATE clubs SET member_count = member_count - 1 WHERE id = p_club_id;
  
  RETURN json_build_object('success', true);
END;
$$;