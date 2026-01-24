-- Create predictions table for storing user bets
CREATE TABLE public.predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  match_id TEXT NOT NULL,
  selected_team TEXT NOT NULL,
  stake_amount INTEGER NOT NULL CHECK (stake_amount >= 50),
  potential_winnings INTEGER NOT NULL,
  odds NUMERIC(4,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own predictions"
ON public.predictions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own predictions"
ON public.predictions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending predictions"
ON public.predictions
FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending');

-- Enable realtime for predictions
ALTER PUBLICATION supabase_realtime ADD TABLE public.predictions;