-- Level rewards table (without unique constraint on level_required)
CREATE TABLE public.level_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level_required integer NOT NULL,
  reward_type text NOT NULL,
  reward_value text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'gift',
  rarity text NOT NULL DEFAULT 'common',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- User claimed rewards tracking
CREATE TABLE public.user_level_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id uuid NOT NULL REFERENCES public.level_rewards(id) ON DELETE CASCADE,
  claimed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, reward_id)
);

-- Enable RLS
ALTER TABLE public.level_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_level_rewards ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view level rewards"
ON public.level_rewards FOR SELECT USING (true);

CREATE POLICY "Users can view their claimed rewards"
ON public.user_level_rewards FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can claim their own rewards"
ON public.user_level_rewards FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to claim level reward
CREATE OR REPLACE FUNCTION public.claim_level_reward(p_reward_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_user_level integer;
  v_reward_level integer;
  v_reward_type text;
  v_reward_value text;
  v_already_claimed boolean;
  v_xp_result json;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM user_level_rewards WHERE user_id = v_user_id AND reward_id = p_reward_id
  ) INTO v_already_claimed;
  
  IF v_already_claimed THEN
    RETURN json_build_object('success', false, 'error', 'Reward already claimed');
  END IF;
  
  SELECT current_level INTO v_user_level FROM profiles WHERE user_id = v_user_id;
  
  SELECT level_required, reward_type, reward_value 
  INTO v_reward_level, v_reward_type, v_reward_value
  FROM level_rewards WHERE id = p_reward_id;
  
  IF v_reward_level IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Reward not found');
  END IF;
  
  IF v_user_level < v_reward_level THEN
    RETURN json_build_object('success', false, 'error', 'Level too low');
  END IF;
  
  INSERT INTO user_level_rewards (user_id, reward_id) VALUES (v_user_id, p_reward_id);
  
  CASE v_reward_type
    WHEN 'xp_bonus' THEN
      SELECT add_xp(v_user_id, v_reward_value::integer) INTO v_xp_result;
    WHEN 'arena_points' THEN
      UPDATE profiles SET arena_balance = arena_balance + v_reward_value::integer WHERE user_id = v_user_id;
    WHEN 'badge' THEN
      INSERT INTO user_badges (user_id, badge_id) VALUES (v_user_id, v_reward_value::uuid) ON CONFLICT DO NOTHING;
    ELSE NULL;
  END CASE;
  
  RETURN json_build_object('success', true, 'reward_type', v_reward_type, 'reward_value', v_reward_value);
END;
$$;

-- Insert level rewards
INSERT INTO public.level_rewards (level_required, reward_type, reward_value, title, description, icon, rarity) VALUES
(2, 'arena_points', '100', 'Premier pas', 'Bonus de bienvenue pour le niveau 2', 'gift', 'common'),
(3, 'xp_bonus', '50', 'Boost XP', 'Bonus XP pour votre progression', 'zap', 'common'),
(5, 'arena_points', '250', 'Demi-chemin', 'Récompense pour le niveau 5', 'trophy', 'common'),
(7, 'xp_bonus', '100', 'Momentum', 'Bonus XP pour maintenir l''élan', 'trending-up', 'rare'),
(10, 'arena_points', '500', 'Double chiffres', 'Bienvenue dans les grands ligues!', 'star', 'rare'),
(10, 'title', 'Pronostiqueur', 'Titre: Pronostiqueur', 'Débloquez le titre Pronostiqueur', 'badge', 'rare'),
(15, 'xp_bonus', '200', 'Expert en devenir', 'Vous êtes sur la bonne voie', 'award', 'rare'),
(20, 'arena_points', '1000', 'Vétéran', 'Récompense massive niveau 20', 'crown', 'epic'),
(20, 'title', 'Vétéran', 'Titre: Vétéran', 'Débloquez le titre Vétéran', 'shield', 'epic'),
(25, 'feature', 'custom_avatar', 'Avatar personnalisé', 'Débloquez les avatars personnalisés', 'image', 'epic'),
(30, 'arena_points', '2000', 'Maître', 'Vous êtes un vrai maître!', 'gem', 'epic'),
(30, 'title', 'Maître', 'Titre: Maître', 'Débloquez le titre prestigieux', 'sparkles', 'epic'),
(40, 'arena_points', '3000', 'Élite', 'Récompense élite', 'flame', 'legendary'),
(50, 'arena_points', '5000', 'Légende', 'Vous êtes une légende!', 'star', 'legendary'),
(50, 'title', 'Légende', 'Titre: Légende', 'Le titre ultime', 'crown', 'legendary');