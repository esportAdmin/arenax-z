-- ============================================================
-- SECURITY FIX: Profiles RLS & Missing ARENA Functions
-- ============================================================

-- ============================================================
-- FIX 1: Restrict profiles table access
-- Drop overly permissive policy, keep user-specific + create leaderboard view
-- ============================================================

-- Drop the overly permissive policy that allows anyone to read all profiles
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Create a public leaderboard view with ONLY non-sensitive data
-- This allows leaderboard features without exposing financial data
CREATE OR REPLACE VIEW public.public_leaderboard AS
SELECT 
  user_id,
  display_name,
  username,
  avatar_url,
  arena_score,
  current_level,
  prediction_accuracy,
  total_predictions,
  total_wins,
  active_streak
FROM profiles
WHERE display_name IS NOT NULL OR username IS NOT NULL;

-- Grant access to the leaderboard view for authenticated users
GRANT SELECT ON public.public_leaderboard TO authenticated;

-- ============================================================
-- FIX 2: Create missing ARENA RPC functions
-- ============================================================

-- Function to get user's ARENA balance securely
CREATE OR REPLACE FUNCTION public.get_arena_balance()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_profile RECORD;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  
  SELECT arena_balance, arena_score, active_streak
  INTO v_profile
  FROM profiles
  WHERE user_id = v_user_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Profile not found');
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'balance', v_profile.arena_balance,
    'score', v_profile.arena_score,
    'streak', v_profile.active_streak
  );
END;
$$;

-- Function to add ARENA points securely (only allowed sources)
CREATE OR REPLACE FUNCTION public.add_arena_secure(
  p_amount bigint,
  p_source text,
  p_description text DEFAULT NULL,
  p_reference_id text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_new_balance bigint;
  v_allowed_sources text[] := ARRAY['prediction_win', 'staking_reward', 'contest_refill', 'manual', 'prize'];
BEGIN
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  
  -- Validate amount
  IF p_amount <= 0 THEN
    RETURN json_build_object('success', false, 'error', 'Amount must be positive');
  END IF;
  
  IF p_amount > 1000000 THEN
    RETURN json_build_object('success', false, 'error', 'Amount exceeds maximum allowed');
  END IF;
  
  -- Validate source (prevent unauthorized sources)
  IF NOT (p_source = ANY(v_allowed_sources)) THEN
    RETURN json_build_object('success', false, 'error', 'Invalid source');
  END IF;
  
  -- Update balance
  UPDATE profiles
  SET 
    arena_balance = arena_balance + p_amount,
    updated_at = now()
  WHERE user_id = v_user_id
  RETURNING arena_balance INTO v_new_balance;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Profile not found');
  END IF;
  
  -- Record transaction in ledger
  INSERT INTO arena_ledger (user_id, amount, source, description, reference_id)
  VALUES (v_user_id, p_amount, p_source::arena_source, p_description, p_reference_id);
  
  RETURN json_build_object('success', true, 'new_balance', v_new_balance);
END;
$$;

-- Function to spend ARENA points securely
CREATE OR REPLACE FUNCTION public.spend_arena_secure(
  p_amount bigint,
  p_source text,
  p_description text DEFAULT NULL,
  p_reference_id text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_current_balance bigint;
  v_new_balance bigint;
  v_allowed_sources text[] := ARRAY['prediction_loss', 'prize', 'manual', 'purchase'];
BEGIN
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  
  -- Validate amount
  IF p_amount <= 0 THEN
    RETURN json_build_object('success', false, 'error', 'Amount must be positive');
  END IF;
  
  -- Validate source
  IF NOT (p_source = ANY(v_allowed_sources)) THEN
    RETURN json_build_object('success', false, 'error', 'Invalid source');
  END IF;
  
  -- Check current balance
  SELECT arena_balance INTO v_current_balance
  FROM profiles
  WHERE user_id = v_user_id
  FOR UPDATE; -- Lock row to prevent race conditions
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Profile not found');
  END IF;
  
  IF v_current_balance < p_amount THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient balance');
  END IF;
  
  -- Update balance
  UPDATE profiles
  SET 
    arena_balance = arena_balance - p_amount,
    updated_at = now()
  WHERE user_id = v_user_id
  RETURNING arena_balance INTO v_new_balance;
  
  -- Record transaction in ledger (negative amount)
  INSERT INTO arena_ledger (user_id, amount, source, description, reference_id)
  VALUES (v_user_id, -p_amount, p_source::arena_source, p_description, p_reference_id);
  
  RETURN json_build_object('success', true, 'new_balance', v_new_balance);
END;
$$;

-- Function to redeem prize securely (replaces missing redeem_prize_secure)
CREATE OR REPLACE FUNCTION public.redeem_prize_secure(
  p_prize_id integer
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_prize RECORD;
  v_current_balance bigint;
  v_new_balance bigint;
  v_redemption_id uuid;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  
  -- Get prize info
  SELECT id, name, price_arena, stock, active
  INTO v_prize
  FROM arena_prizes
  WHERE id = p_prize_id
  FOR UPDATE; -- Lock to prevent race conditions
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Prize not found');
  END IF;
  
  IF NOT v_prize.active THEN
    RETURN json_build_object('success', false, 'error', 'Prize is not available');
  END IF;
  
  IF v_prize.stock = 0 THEN
    RETURN json_build_object('success', false, 'error', 'Prize out of stock');
  END IF;
  
  -- Check user balance
  SELECT arena_balance INTO v_current_balance
  FROM profiles
  WHERE user_id = v_user_id
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Profile not found');
  END IF;
  
  IF v_current_balance < v_prize.price_arena THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient balance');
  END IF;
  
  -- Deduct balance
  UPDATE profiles
  SET 
    arena_balance = arena_balance - v_prize.price_arena,
    updated_at = now()
  WHERE user_id = v_user_id
  RETURNING arena_balance INTO v_new_balance;
  
  -- Decrease stock if not unlimited (-1)
  IF v_prize.stock > 0 THEN
    UPDATE arena_prizes
    SET stock = stock - 1
    WHERE id = p_prize_id;
  END IF;
  
  -- Create redemption record
  INSERT INTO prize_redemptions (user_id, prize_id, prize_name, price_paid, status)
  VALUES (v_user_id, p_prize_id, v_prize.name, v_prize.price_arena, 'pending')
  RETURNING id INTO v_redemption_id;
  
  -- Record transaction in ledger
  INSERT INTO arena_ledger (user_id, amount, source, description, reference_id)
  VALUES (v_user_id, -v_prize.price_arena, 'prize', 'Prize redemption: ' || v_prize.name, v_redemption_id::text);
  
  RETURN json_build_object(
    'success', true,
    'new_balance', v_new_balance,
    'prize_name', v_prize.name,
    'redemption_id', v_redemption_id
  );
END;
$$;