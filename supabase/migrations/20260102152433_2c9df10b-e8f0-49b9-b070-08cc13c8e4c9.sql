-- Table for club wars
CREATE TABLE public.club_wars (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenger_id uuid NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  defender_id uuid NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  challenger_xp integer NOT NULL DEFAULT 0,
  defender_xp integer NOT NULL DEFAULT 0,
  challenger_predictions integer NOT NULL DEFAULT 0,
  defender_predictions integer NOT NULL DEFAULT 0,
  challenger_wins integer NOT NULL DEFAULT 0,
  defender_wins integer NOT NULL DEFAULT 0,
  winner_id uuid REFERENCES public.clubs(id),
  xp_reward integer NOT NULL DEFAULT 200,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT different_clubs CHECK (challenger_id != defender_id)
);

-- Enable RLS
ALTER TABLE public.club_wars ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view club wars" ON public.club_wars
FOR SELECT USING (true);

CREATE POLICY "Club admins can create wars" ON public.club_wars
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM club_members 
    WHERE club_id = challenger_id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

CREATE POLICY "Involved club admins can update wars" ON public.club_wars
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM club_members 
    WHERE (club_id = challenger_id OR club_id = defender_id)
    AND user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

-- Function to create a club war
CREATE OR REPLACE FUNCTION public.create_club_war(
  p_defender_id uuid,
  p_duration_days integer DEFAULT 7
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_challenger_id uuid;
  v_war_id uuid;
BEGIN
  -- Get user's club
  SELECT club_id INTO v_challenger_id 
  FROM club_members 
  WHERE user_id = v_user_id AND role IN ('owner', 'admin');
  
  IF v_challenger_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Vous devez être admin d''un club');
  END IF;
  
  IF v_challenger_id = p_defender_id THEN
    RETURN json_build_object('success', false, 'error', 'Vous ne pouvez pas défier votre propre club');
  END IF;
  
  -- Check for existing active war
  IF EXISTS (
    SELECT 1 FROM club_wars 
    WHERE status IN ('pending', 'active')
    AND (challenger_id = v_challenger_id OR defender_id = v_challenger_id)
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Votre club a déjà une guerre en cours');
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM club_wars 
    WHERE status IN ('pending', 'active')
    AND (challenger_id = p_defender_id OR defender_id = p_defender_id)
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Ce club a déjà une guerre en cours');
  END IF;
  
  -- Create war
  INSERT INTO club_wars (challenger_id, defender_id, end_date)
  VALUES (v_challenger_id, p_defender_id, now() + (p_duration_days || ' days')::interval)
  RETURNING id INTO v_war_id;
  
  -- Log activity
  INSERT INTO club_activities (club_id, user_id, activity_type, title, description)
  VALUES (v_challenger_id, v_user_id, 'war_declared', 'Guerre déclarée', 'A défié un club en duel');
  
  RETURN json_build_object('success', true, 'war_id', v_war_id);
END;
$$;

-- Function to accept/decline a war
CREATE OR REPLACE FUNCTION public.respond_to_war(
  p_war_id uuid,
  p_accept boolean
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_war record;
BEGIN
  SELECT * INTO v_war FROM club_wars WHERE id = p_war_id;
  
  IF v_war IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Guerre non trouvée');
  END IF;
  
  IF v_war.status != 'pending' THEN
    RETURN json_build_object('success', false, 'error', 'Cette guerre n''est plus en attente');
  END IF;
  
  -- Check if user is admin of defender club
  IF NOT EXISTS (
    SELECT 1 FROM club_members 
    WHERE club_id = v_war.defender_id 
    AND user_id = v_user_id 
    AND role IN ('owner', 'admin')
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Non autorisé');
  END IF;
  
  IF p_accept THEN
    UPDATE club_wars 
    SET status = 'active', start_date = now(), updated_at = now()
    WHERE id = p_war_id;
    
    -- Log activity for both clubs
    INSERT INTO club_activities (club_id, user_id, activity_type, title, description)
    VALUES 
      (v_war.defender_id, v_user_id, 'war_accepted', 'Guerre acceptée', 'Le défi a été accepté'),
      (v_war.challenger_id, NULL, 'war_started', 'Guerre commencée', 'Le club adverse a accepté le défi');
    
    RETURN json_build_object('success', true, 'message', 'Guerre acceptée');
  ELSE
    UPDATE club_wars 
    SET status = 'declined', updated_at = now()
    WHERE id = p_war_id;
    
    RETURN json_build_object('success', true, 'message', 'Guerre refusée');
  END IF;
END;
$$;

-- Function to update war stats (called when predictions are made)
CREATE OR REPLACE FUNCTION public.update_war_stats(
  p_club_id uuid,
  p_xp_earned integer,
  p_is_win boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update challenger stats
  UPDATE club_wars 
  SET 
    challenger_xp = challenger_xp + p_xp_earned,
    challenger_predictions = challenger_predictions + 1,
    challenger_wins = challenger_wins + CASE WHEN p_is_win THEN 1 ELSE 0 END,
    updated_at = now()
  WHERE challenger_id = p_club_id AND status = 'active';
  
  -- Update defender stats
  UPDATE club_wars 
  SET 
    defender_xp = defender_xp + p_xp_earned,
    defender_predictions = defender_predictions + 1,
    defender_wins = defender_wins + CASE WHEN p_is_win THEN 1 ELSE 0 END,
    updated_at = now()
  WHERE defender_id = p_club_id AND status = 'active';
END;
$$;

-- Function to complete a war
CREATE OR REPLACE FUNCTION public.complete_club_war(p_war_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_war record;
  v_winner_id uuid;
BEGIN
  SELECT * INTO v_war FROM club_wars WHERE id = p_war_id;
  
  IF v_war IS NULL OR v_war.status != 'active' THEN
    RETURN json_build_object('success', false, 'error', 'Guerre non trouvée ou non active');
  END IF;
  
  -- Determine winner
  IF v_war.challenger_xp > v_war.defender_xp THEN
    v_winner_id := v_war.challenger_id;
  ELSIF v_war.defender_xp > v_war.challenger_xp THEN
    v_winner_id := v_war.defender_id;
  ELSE
    v_winner_id := NULL; -- Draw
  END IF;
  
  UPDATE club_wars 
  SET status = 'completed', winner_id = v_winner_id, updated_at = now()
  WHERE id = p_war_id;
  
  -- Award XP to winner
  IF v_winner_id IS NOT NULL THEN
    UPDATE clubs SET total_xp = total_xp + v_war.xp_reward WHERE id = v_winner_id;
    
    INSERT INTO club_activities (club_id, activity_type, title, description, xp_amount)
    VALUES (v_winner_id, 'war_won', 'Guerre gagnée', 'Victoire dans la guerre de clubs', v_war.xp_reward);
  END IF;
  
  RETURN json_build_object('success', true, 'winner_id', v_winner_id);
END;
$$;