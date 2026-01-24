
-- Create badge categories enum
CREATE TYPE public.badge_category AS ENUM ('prediction', 'streak', 'engagement', 'achievement', 'special');

-- Create badge rarity enum
CREATE TYPE public.badge_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');

-- Create badges table
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category badge_category NOT NULL,
  rarity badge_rarity NOT NULL DEFAULT 'common',
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL DEFAULT 1,
  arena_points_reward INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_badges table
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create weekly_rewards table
CREATE TABLE public.weekly_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rank_from INTEGER NOT NULL,
  rank_to INTEGER NOT NULL,
  arena_points INTEGER NOT NULL,
  badge_id UUID REFERENCES public.badges(id),
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create weekly_rankings table for snapshots
CREATE TABLE public.weekly_rankings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  final_rank INTEGER,
  arena_score INTEGER NOT NULL DEFAULT 0,
  predictions_count INTEGER NOT NULL DEFAULT 0,
  accuracy NUMERIC(5,2) NOT NULL DEFAULT 0,
  rewards_claimed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_start)
);

-- Enable RLS on all tables
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_rankings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for badges (public read)
CREATE POLICY "Anyone can view badges"
ON public.badges FOR SELECT
USING (true);

-- RLS Policies for user_badges
CREATE POLICY "Anyone can view user badges"
ON public.user_badges FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own badges"
ON public.user_badges FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for weekly_rewards (public read)
CREATE POLICY "Anyone can view weekly rewards"
ON public.weekly_rewards FOR SELECT
USING (active = true);

-- RLS Policies for weekly_rankings
CREATE POLICY "Anyone can view weekly rankings"
ON public.weekly_rankings FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own rankings"
ON public.weekly_rankings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rankings"
ON public.weekly_rankings FOR UPDATE
USING (auth.uid() = user_id);

-- Enable realtime for profiles (leaderboard)
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Insert default badges
INSERT INTO public.badges (name, description, icon, category, rarity, requirement_type, requirement_value, arena_points_reward) VALUES
('Premier Pas', 'Faire votre première prédiction', '🎯', 'prediction', 'common', 'predictions_count', 1, 50),
('Prédicteur', 'Atteindre 10 prédictions', '📊', 'prediction', 'common', 'predictions_count', 10, 100),
('Oracle', 'Atteindre 100 prédictions', '🔮', 'prediction', 'rare', 'predictions_count', 100, 500),
('Légende', 'Atteindre 1000 prédictions', '👑', 'prediction', 'legendary', 'predictions_count', 1000, 2000),
('En Feu', 'Série de 3 victoires consécutives', '🔥', 'streak', 'common', 'win_streak', 3, 75),
('Inarrêtable', 'Série de 7 victoires consécutives', '⚡', 'streak', 'rare', 'win_streak', 7, 300),
('Invincible', 'Série de 15 victoires consécutives', '💎', 'streak', 'epic', 'win_streak', 15, 1000),
('Précision', '70% de précision sur 20+ prédictions', '🎯', 'achievement', 'rare', 'accuracy', 70, 400),
('Sniper', '85% de précision sur 50+ prédictions', '🎖️', 'achievement', 'epic', 'accuracy', 85, 1500),
('Top 10', 'Atteindre le Top 10 hebdomadaire', '🏆', 'achievement', 'rare', 'weekly_rank', 10, 500),
('Champion', 'Terminer #1 de la semaine', '🥇', 'achievement', 'legendary', 'weekly_rank', 1, 3000),
('Early Adopter', 'Parmi les 100 premiers utilisateurs', '🌟', 'special', 'epic', 'special', 1, 1000);

-- Insert default weekly rewards
INSERT INTO public.weekly_rewards (rank_from, rank_to, arena_points, description) VALUES
(1, 1, 5000, 'Champion de la semaine'),
(2, 2, 3000, 'Vice-champion'),
(3, 3, 2000, 'Podium Bronze'),
(4, 10, 1000, 'Top 10'),
(11, 50, 500, 'Top 50'),
(51, 100, 250, 'Top 100');
