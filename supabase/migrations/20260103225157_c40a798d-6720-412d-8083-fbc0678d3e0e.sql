-- Create table for daily pro picks
CREATE TABLE public.daily_pro_picks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  pick_date date NOT NULL DEFAULT CURRENT_DATE,
  matches jsonb NOT NULL, -- Store the 3 matches with selections
  total_potential_reward numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending', -- pending, won, lost, partial
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  resolved_at timestamp with time zone,
  
  CONSTRAINT unique_daily_pick UNIQUE (user_id, pick_date)
);

-- Enable RLS
ALTER TABLE public.daily_pro_picks ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own daily picks"
ON public.daily_pro_picks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily picks"
ON public.daily_pro_picks FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending picks"
ON public.daily_pro_picks FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending');

-- Create index for faster lookups
CREATE INDEX idx_daily_pro_picks_user_date ON public.daily_pro_picks (user_id, pick_date);
CREATE INDEX idx_daily_pro_picks_created ON public.daily_pro_picks (created_at);

-- Update streak when user submits daily pick
CREATE OR REPLACE FUNCTION public.update_user_streak()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last_pick_date date;
  v_current_streak integer;
BEGIN
  -- Get the last pick date before today
  SELECT pick_date INTO v_last_pick_date
  FROM daily_pro_picks
  WHERE user_id = NEW.user_id AND pick_date < NEW.pick_date
  ORDER BY pick_date DESC
  LIMIT 1;
  
  -- Get current streak
  SELECT active_streak INTO v_current_streak
  FROM profiles
  WHERE user_id = NEW.user_id;
  
  -- Calculate new streak
  IF v_last_pick_date IS NULL THEN
    -- First pick ever
    v_current_streak := 1;
  ELSIF v_last_pick_date = NEW.pick_date - INTERVAL '1 day' THEN
    -- Consecutive day
    v_current_streak := COALESCE(v_current_streak, 0) + 1;
  ELSE
    -- Streak broken
    v_current_streak := 1;
  END IF;
  
  -- Update profile
  UPDATE profiles
  SET active_streak = v_current_streak, updated_at = now()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Trigger to update streak on new daily pick
CREATE TRIGGER on_daily_pick_created
  AFTER INSERT ON public.daily_pro_picks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_streak();

-- Enable realtime for daily picks
ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_pro_picks;