-- Daily challenges table
CREATE TABLE public.daily_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  xp_reward integer NOT NULL DEFAULT 25,
  challenge_type text NOT NULL, -- 'predictions', 'streak', 'accuracy', 'login'
  requirement_value integer NOT NULL DEFAULT 1,
  icon text NOT NULL DEFAULT 'target',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- User challenge completions tracking
CREATE TABLE public.user_daily_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id uuid NOT NULL REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
  challenge_date date NOT NULL DEFAULT CURRENT_DATE,
  progress integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  xp_claimed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, challenge_id, challenge_date)
);

-- Enable RLS
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_challenges ENABLE ROW LEVEL SECURITY;

-- RLS policies for daily_challenges (public read)
CREATE POLICY "Anyone can view active challenges"
ON public.daily_challenges FOR SELECT
USING (active = true);

-- RLS policies for user_daily_challenges
CREATE POLICY "Users can view their own challenge progress"
ON public.user_daily_challenges FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own challenge progress"
ON public.user_daily_challenges FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenge progress"
ON public.user_daily_challenges FOR UPDATE
USING (auth.uid() = user_id);

-- Function to claim XP reward for completed challenge
CREATE OR REPLACE FUNCTION public.claim_challenge_reward(p_user_challenge_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_xp_reward integer;
  v_completed boolean;
  v_xp_claimed boolean;
  v_result json;
BEGIN
  -- Get challenge details
  SELECT udc.user_id, dc.xp_reward, udc.completed, udc.xp_claimed
  INTO v_user_id, v_xp_reward, v_completed, v_xp_claimed
  FROM user_daily_challenges udc
  JOIN daily_challenges dc ON dc.id = udc.challenge_id
  WHERE udc.id = p_user_challenge_id;
  
  -- Validate
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Challenge not found');
  END IF;
  
  IF v_user_id != auth.uid() THEN
    RETURN json_build_object('success', false, 'error', 'Not authorized');
  END IF;
  
  IF NOT v_completed THEN
    RETURN json_build_object('success', false, 'error', 'Challenge not completed');
  END IF;
  
  IF v_xp_claimed THEN
    RETURN json_build_object('success', false, 'error', 'XP already claimed');
  END IF;
  
  -- Mark as claimed
  UPDATE user_daily_challenges SET xp_claimed = true WHERE id = p_user_challenge_id;
  
  -- Add XP
  SELECT add_xp(v_user_id, v_xp_reward) INTO v_result;
  
  RETURN json_build_object('success', true, 'xp_earned', v_xp_reward, 'level_info', v_result);
END;
$$;

-- Insert default daily challenges
INSERT INTO public.daily_challenges (title, description, xp_reward, challenge_type, requirement_value, icon) VALUES
('Premier pronostic', 'Faites votre premier pronostic du jour', 25, 'predictions', 1, 'target'),
('Triple menace', 'Faites 3 pronostics aujourd''hui', 50, 'predictions', 3, 'zap'),
('Précision parfaite', 'Obtenez 2 pronostics corrects', 75, 'accuracy', 2, 'check-circle'),
('Connexion quotidienne', 'Connectez-vous à l''application', 10, 'login', 1, 'log-in'),
('Série en cours', 'Maintenez une série de 3 jours', 100, 'streak', 3, 'flame');