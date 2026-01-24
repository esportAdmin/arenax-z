-- Table for club challenge templates
CREATE TABLE public.club_challenge_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'target',
  challenge_type text NOT NULL, -- 'predictions', 'wins', 'xp', 'accuracy'
  target_value integer NOT NULL,
  xp_reward integer NOT NULL DEFAULT 100,
  arena_points_reward integer NOT NULL DEFAULT 50,
  duration_days integer NOT NULL DEFAULT 7,
  difficulty text NOT NULL DEFAULT 'normal', -- 'easy', 'normal', 'hard', 'legendary'
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Table for active club challenges
CREATE TABLE public.club_challenges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id uuid NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  template_id uuid NOT NULL REFERENCES public.club_challenge_templates(id),
  current_value integer NOT NULL DEFAULT 0,
  target_value integer NOT NULL,
  status text NOT NULL DEFAULT 'active', -- 'active', 'completed', 'failed', 'expired'
  start_date timestamp with time zone NOT NULL DEFAULT now(),
  end_date timestamp with time zone NOT NULL,
  completed_at timestamp with time zone,
  rewards_claimed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Table for member contributions to challenges
CREATE TABLE public.club_challenge_contributions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id uuid NOT NULL REFERENCES public.club_challenges(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  contribution_value integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

-- Enable RLS
ALTER TABLE public.club_challenge_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_challenge_contributions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view active templates" ON public.club_challenge_templates
FOR SELECT USING (active = true);

CREATE POLICY "Club members can view their challenges" ON public.club_challenges
FOR SELECT USING (
  EXISTS (SELECT 1 FROM club_members WHERE club_id = club_challenges.club_id AND user_id = auth.uid())
);

CREATE POLICY "Club admins can create challenges" ON public.club_challenges
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM club_members WHERE club_id = club_challenges.club_id AND user_id = auth.uid() AND role IN ('owner', 'admin'))
);

CREATE POLICY "System can update challenges" ON public.club_challenges
FOR UPDATE USING (true);

CREATE POLICY "Members can view contributions" ON public.club_challenge_contributions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM club_challenges cc
    JOIN club_members cm ON cm.club_id = cc.club_id
    WHERE cc.id = club_challenge_contributions.challenge_id AND cm.user_id = auth.uid()
  )
);

CREATE POLICY "System can manage contributions" ON public.club_challenge_contributions
FOR ALL USING (true);

-- Insert default challenge templates
INSERT INTO public.club_challenge_templates (title, description, icon, challenge_type, target_value, xp_reward, arena_points_reward, duration_days, difficulty) VALUES
('Prédicteurs Unis', 'Faites 50 pronostics en équipe', 'target', 'predictions', 50, 150, 75, 7, 'easy'),
('Les Gagnants', 'Remportez 25 pronostics ensemble', 'trophy', 'wins', 25, 250, 100, 7, 'normal'),
('Machine à XP', 'Accumulez 1000 XP collectivement', 'zap', 'xp', 1000, 300, 150, 7, 'normal'),
('Chasseurs de Victoires', 'Remportez 50 pronostics', 'flame', 'wins', 50, 400, 200, 7, 'hard'),
('L''Armée Invincible', 'Faites 100 pronostics avec 60% de précision', 'shield', 'predictions', 100, 500, 250, 7, 'hard'),
('Légende du Club', 'Accumulez 5000 XP en une semaine', 'crown', 'xp', 5000, 750, 400, 7, 'legendary');

-- Function to start a club challenge
CREATE OR REPLACE FUNCTION public.start_club_challenge(p_template_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_club_id uuid;
  v_template record;
  v_challenge_id uuid;
BEGIN
  -- Get user's club
  SELECT club_id INTO v_club_id 
  FROM club_members 
  WHERE user_id = v_user_id AND role IN ('owner', 'admin');
  
  IF v_club_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Vous devez être admin d''un club');
  END IF;
  
  -- Check if club has an active challenge
  IF EXISTS (
    SELECT 1 FROM club_challenges 
    WHERE club_id = v_club_id AND status = 'active'
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Votre club a déjà un défi actif');
  END IF;
  
  -- Get template
  SELECT * INTO v_template FROM club_challenge_templates WHERE id = p_template_id AND active = true;
  
  IF v_template IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Défi non trouvé');
  END IF;
  
  -- Create challenge
  INSERT INTO club_challenges (club_id, template_id, target_value, end_date)
  VALUES (v_club_id, p_template_id, v_template.target_value, now() + (v_template.duration_days || ' days')::interval)
  RETURNING id INTO v_challenge_id;
  
  -- Log activity
  INSERT INTO club_activities (club_id, user_id, activity_type, title, description)
  VALUES (v_club_id, v_user_id, 'challenge_started', 'Défi lancé', v_template.title);
  
  -- Notify all members
  INSERT INTO user_notifications (user_id, type, title, message, value)
  SELECT 
    cm.user_id,
    'club_challenge',
    '🎯 Nouveau défi de club !',
    v_template.title || ' - ' || v_template.description,
    v_challenge_id::text
  FROM club_members cm WHERE cm.club_id = v_club_id;
  
  RETURN json_build_object('success', true, 'challenge_id', v_challenge_id);
END;
$$;

-- Function to contribute to a club challenge
CREATE OR REPLACE FUNCTION public.contribute_to_club_challenge(
  p_club_id uuid,
  p_contribution_type text,
  p_value integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_challenge record;
BEGIN
  -- Find active challenge matching type
  SELECT cc.* INTO v_challenge
  FROM club_challenges cc
  JOIN club_challenge_templates cct ON cct.id = cc.template_id
  WHERE cc.club_id = p_club_id 
    AND cc.status = 'active'
    AND cct.challenge_type = p_contribution_type;
  
  IF v_challenge IS NULL THEN
    RETURN;
  END IF;
  
  -- Update or insert contribution
  INSERT INTO club_challenge_contributions (challenge_id, user_id, contribution_value)
  VALUES (v_challenge.id, v_user_id, p_value)
  ON CONFLICT (challenge_id, user_id) 
  DO UPDATE SET 
    contribution_value = club_challenge_contributions.contribution_value + p_value,
    updated_at = now();
  
  -- Update challenge progress
  UPDATE club_challenges 
  SET current_value = current_value + p_value
  WHERE id = v_challenge.id;
  
  -- Check if completed
  IF (v_challenge.current_value + p_value) >= v_challenge.target_value THEN
    UPDATE club_challenges 
    SET status = 'completed', completed_at = now()
    WHERE id = v_challenge.id;
    
    -- Notify all members
    INSERT INTO user_notifications (user_id, type, title, message, value)
    SELECT 
      cm.user_id,
      'challenge_completed',
      '🎉 Défi complété !',
      'Votre club a complété le défi collectif !',
      v_challenge.id::text
    FROM club_members cm WHERE cm.club_id = p_club_id;
    
    -- Log activity
    INSERT INTO club_activities (club_id, activity_type, title, description)
    VALUES (p_club_id, 'challenge_completed', 'Défi complété', 'Le club a complété un défi collectif');
  END IF;
END;
$$;

-- Function to claim challenge rewards
CREATE OR REPLACE FUNCTION public.claim_club_challenge_reward(p_challenge_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_challenge record;
  v_template record;
BEGIN
  -- Get challenge
  SELECT cc.*, cct.xp_reward, cct.arena_points_reward
  INTO v_challenge
  FROM club_challenges cc
  JOIN club_challenge_templates cct ON cct.id = cc.template_id
  WHERE cc.id = p_challenge_id;
  
  IF v_challenge IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Défi non trouvé');
  END IF;
  
  IF v_challenge.status != 'completed' THEN
    RETURN json_build_object('success', false, 'error', 'Défi non complété');
  END IF;
  
  IF v_challenge.rewards_claimed THEN
    RETURN json_build_object('success', false, 'error', 'Récompenses déjà réclamées');
  END IF;
  
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM club_members 
    WHERE club_id = v_challenge.club_id AND user_id = v_user_id AND role IN ('owner', 'admin')
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Non autorisé');
  END IF;
  
  -- Mark as claimed
  UPDATE club_challenges SET rewards_claimed = true WHERE id = p_challenge_id;
  
  -- Add XP to club
  UPDATE clubs SET total_xp = total_xp + v_challenge.xp_reward WHERE id = v_challenge.club_id;
  
  -- Log activity
  INSERT INTO club_activities (club_id, user_id, activity_type, title, description, xp_amount)
  VALUES (v_challenge.club_id, v_user_id, 'reward_claimed', 'Récompense de défi', 'Récompense du défi collectif réclamée', v_challenge.xp_reward);
  
  RETURN json_build_object('success', true, 'xp_reward', v_challenge.xp_reward, 'arena_points_reward', v_challenge.arena_points_reward);
END;
$$;