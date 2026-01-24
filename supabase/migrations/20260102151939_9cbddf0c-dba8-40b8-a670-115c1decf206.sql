-- Table for weekly club rankings
CREATE TABLE public.club_weekly_rankings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id uuid NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  week_start date NOT NULL,
  week_end date NOT NULL,
  total_xp bigint NOT NULL DEFAULT 0,
  total_predictions integer NOT NULL DEFAULT 0,
  total_wins integer NOT NULL DEFAULT 0,
  accuracy numeric NOT NULL DEFAULT 0,
  final_rank integer,
  rewards_claimed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(club_id, week_start)
);

-- Table for club rewards
CREATE TABLE public.club_rewards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rank_from integer NOT NULL,
  rank_to integer NOT NULL,
  xp_bonus integer NOT NULL DEFAULT 0,
  arena_points integer NOT NULL DEFAULT 0,
  badge_name text,
  description text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.club_weekly_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_rewards ENABLE ROW LEVEL SECURITY;

-- RLS policies for club_weekly_rankings
CREATE POLICY "Anyone can view club rankings" ON public.club_weekly_rankings
FOR SELECT USING (true);

CREATE POLICY "System can insert rankings" ON public.club_weekly_rankings
FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update rankings" ON public.club_weekly_rankings
FOR UPDATE USING (true);

-- RLS policies for club_rewards
CREATE POLICY "Anyone can view club rewards" ON public.club_rewards
FOR SELECT USING (active = true);

-- Insert default rewards for top 3 clubs
INSERT INTO public.club_rewards (rank_from, rank_to, xp_bonus, arena_points, badge_name, description) VALUES
(1, 1, 500, 1000, 'Champion', '1ère place - Champion de la semaine'),
(2, 2, 300, 500, 'Vice-Champion', '2ème place - Vice-champion'),
(3, 3, 150, 250, 'Podium', '3ème place - Sur le podium');

-- Function to claim club rewards
CREATE OR REPLACE FUNCTION public.claim_club_reward(p_ranking_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ranking record;
  v_reward record;
  v_user_id uuid := auth.uid();
BEGIN
  -- Get ranking
  SELECT * INTO v_ranking FROM club_weekly_rankings WHERE id = p_ranking_id;
  
  IF v_ranking IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Classement non trouvé');
  END IF;
  
  IF v_ranking.rewards_claimed THEN
    RETURN json_build_object('success', false, 'error', 'Récompenses déjà réclamées');
  END IF;
  
  -- Check if user is club owner or admin
  IF NOT EXISTS (
    SELECT 1 FROM club_members 
    WHERE club_id = v_ranking.club_id 
    AND user_id = v_user_id 
    AND role IN ('owner', 'admin')
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Non autorisé');
  END IF;
  
  -- Get reward for this rank
  SELECT * INTO v_reward FROM club_rewards 
  WHERE v_ranking.final_rank BETWEEN rank_from AND rank_to AND active = true;
  
  IF v_reward IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Pas de récompense pour ce rang');
  END IF;
  
  -- Mark as claimed
  UPDATE club_weekly_rankings SET rewards_claimed = true WHERE id = p_ranking_id;
  
  -- Add XP to club
  UPDATE clubs SET total_xp = total_xp + v_reward.xp_bonus WHERE id = v_ranking.club_id;
  
  -- Log activity
  INSERT INTO club_activities (club_id, user_id, activity_type, title, description, xp_amount)
  VALUES (v_ranking.club_id, v_user_id, 'reward_claimed', 'Récompense hebdomadaire', v_reward.description, v_reward.xp_bonus);
  
  RETURN json_build_object('success', true, 'reward', row_to_json(v_reward));
END;
$$;