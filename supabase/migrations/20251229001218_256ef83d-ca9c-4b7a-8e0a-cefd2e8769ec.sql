-- Create enum for ledger sources
CREATE TYPE public.arena_source AS ENUM ('purchase', 'contest_refill', 'refund', 'prize', 'manual', 'prediction_win', 'prediction_loss', 'staking_reward');

-- Create arena_ledger table for transaction history
CREATE TABLE public.arena_ledger (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  amount BIGINT NOT NULL, -- positive or negative
  source arena_source NOT NULL,
  reference_id VARCHAR(64), -- stripe_charge, contest_id, prediction_id...
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_arena_ledger_user_id ON public.arena_ledger(user_id);
CREATE INDEX idx_arena_ledger_created_at ON public.arena_ledger(created_at DESC);

-- Enable RLS
ALTER TABLE public.arena_ledger ENABLE ROW LEVEL SECURITY;

-- Users can view their own ledger entries
CREATE POLICY "Users can view their own ledger"
ON public.arena_ledger
FOR SELECT
USING (auth.uid() = user_id);

-- Only system can insert (via service role or edge functions)
CREATE POLICY "Service role can insert ledger entries"
ON public.arena_ledger
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create arena_prizes table for redeemable rewards
CREATE TABLE public.arena_prizes (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(32) UNIQUE NOT NULL, -- amazon_10, nitro_month...
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price_arena INTEGER NOT NULL, -- cost in ARENA credits
  usd_value NUMERIC(6,2),
  stock INTEGER DEFAULT -1, -- -1 = unlimited
  category VARCHAR(32), -- gift_card, subscription, merch...
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.arena_prizes ENABLE ROW LEVEL SECURITY;

-- Everyone can view active prizes
CREATE POLICY "Anyone can view active prizes"
ON public.arena_prizes
FOR SELECT
USING (active = true);

-- Create trigger for updated_at
CREATE TRIGGER update_arena_prizes_updated_at
BEFORE UPDATE ON public.arena_prizes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample prizes
INSERT INTO public.arena_prizes (sku, name, description, price_arena, usd_value, category) VALUES
('amazon_10', 'Amazon Gift Card $10', 'Redeem for a $10 Amazon gift card', 10000, 10.00, 'gift_card'),
('amazon_25', 'Amazon Gift Card $25', 'Redeem for a $25 Amazon gift card', 22500, 25.00, 'gift_card'),
('amazon_50', 'Amazon Gift Card $50', 'Redeem for a $50 Amazon gift card', 42500, 50.00, 'gift_card'),
('nitro_month', 'Discord Nitro (1 Month)', 'One month of Discord Nitro subscription', 8000, 9.99, 'subscription'),
('steam_20', 'Steam Gift Card $20', 'Redeem for a $20 Steam wallet credit', 18000, 20.00, 'gift_card'),
('fanarenaPro_merch', 'FanArena Pro T-Shirt', 'Exclusive FanArena Pro branded t-shirt', 15000, 25.00, 'merch');