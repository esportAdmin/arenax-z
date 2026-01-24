-- =============================================
-- TASK 1: Match Resolution Engine
-- =============================================

-- Create resolve_match function with admin security check
CREATE OR REPLACE FUNCTION public.resolve_match(p_match_id text, p_winning_team text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_prediction RECORD;
  v_user_profile RECORD;
  v_xp_result json;
  v_resolved_count int := 0;
  v_won_count int := 0;
  v_lost_count int := 0;
BEGIN
  -- Security Check: Only allow admins to run this function
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Admin access required');
  END IF;

  -- Validate inputs
  IF p_match_id IS NULL OR p_match_id = '' THEN
    RETURN json_build_object('success', false, 'error', 'Match ID is required');
  END IF;

  IF p_winning_team IS NULL OR p_winning_team = '' THEN
    RETURN json_build_object('success', false, 'error', 'Winning team is required');
  END IF;

  -- Loop through all pending predictions for this match
  FOR v_prediction IN 
    SELECT * FROM predictions 
    WHERE match_id = p_match_id 
    AND status = 'pending'
  LOOP
    v_resolved_count := v_resolved_count + 1;

    -- Get current user profile
    SELECT * INTO v_user_profile 
    FROM profiles 
    WHERE user_id = v_prediction.user_id;

    IF v_prediction.selected_team = p_winning_team THEN
      -- WINNER
      v_won_count := v_won_count + 1;

      -- Update prediction status to 'won'
      UPDATE predictions 
      SET status = 'won', resolved_at = now()
      WHERE id = v_prediction.id;

      -- Add potential_winnings to user's arena_balance
      UPDATE profiles 
      SET 
        arena_balance = arena_balance + v_prediction.potential_winnings,
        total_wins = total_wins + 1,
        active_streak = active_streak + 1,
        prediction_accuracy = CASE 
          WHEN total_predictions > 0 
          THEN ROUND(((total_wins + 1)::numeric / total_predictions::numeric) * 100, 2)
          ELSE 100
        END,
        updated_at = now()
      WHERE user_id = v_prediction.user_id;

      -- Insert entry in arena_ledger (source: 'prediction_win')
      INSERT INTO arena_ledger (user_id, amount, source, description, reference_id)
      VALUES (
        v_prediction.user_id,
        v_prediction.potential_winnings,
        'prediction_win',
        'Match ' || p_match_id || ' - Victoire (' || p_winning_team || ')',
        v_prediction.id::text
      );

      -- Call add_xp function to give 50 XP
      SELECT public.add_xp(v_prediction.user_id, 50) INTO v_xp_result;

    ELSE
      -- LOSER
      v_lost_count := v_lost_count + 1;

      -- Update prediction status to 'lost'
      UPDATE predictions 
      SET status = 'lost', resolved_at = now()
      WHERE id = v_prediction.id;

      -- Reset active_streak to 0 and update accuracy
      UPDATE profiles 
      SET 
        active_streak = 0,
        prediction_accuracy = CASE 
          WHEN total_predictions > 0 
          THEN ROUND((total_wins::numeric / total_predictions::numeric) * 100, 2)
          ELSE 0
        END,
        updated_at = now()
      WHERE user_id = v_prediction.user_id;

      -- Insert entry in arena_ledger (source: 'prediction_loss', amount: 0)
      INSERT INTO arena_ledger (user_id, amount, source, description, reference_id)
      VALUES (
        v_prediction.user_id,
        0,
        'prediction_loss',
        'Match ' || p_match_id || ' - Défaite (Équipe: ' || v_prediction.selected_team || ')',
        v_prediction.id::text
      );
    END IF;
  END LOOP;

  RETURN json_build_object(
    'success', true,
    'match_id', p_match_id,
    'winning_team', p_winning_team,
    'resolved_count', v_resolved_count,
    'won_count', v_won_count,
    'lost_count', v_lost_count
  );
END;
$$;

-- =============================================
-- TASK 2: Subscriptions Table
-- =============================================

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  status text NOT NULL DEFAULT 'inactive',
  current_period_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscription"
ON public.subscriptions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions"
ON public.subscriptions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);

-- =============================================
-- TASK 3A: Add referred_by column to profiles
-- =============================================

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES auth.users(id);

-- =============================================
-- TASK 3B: Update arena_prizes - Remove cash gifts, add partner promos
-- =============================================

-- Deactivate existing cash/gift card prizes
UPDATE arena_prizes 
SET active = false 
WHERE category IN ('gift_card', 'cash') 
   OR name ILIKE '%amazon%' 
   OR name ILIKE '%cash%'
   OR name ILIKE '%gift%';

-- Insert partner promo code prizes (zero cost rewards)
INSERT INTO arena_prizes (name, description, price_arena, stock, category, sku, usd_value, active)
VALUES 
  ('Code Promo VPN -20%', 'Obtenez 20% de réduction sur un abonnement VPN premium de notre partenaire. Valable 30 jours.', 500, -1, 'promo_code', 'PROMO-VPN-20', 0, true),
  ('Réduction Gaming Gear -5€', 'Code promotionnel de 5€ de réduction sur du matériel gaming chez notre partenaire.', 800, -1, 'promo_code', 'PROMO-GEAR-5', 0, true),
  ('Pack Boosters Exclusif', 'Code pour débloquer des boosters exclusifs dans nos jeux partenaires.', 300, -1, 'promo_code', 'PROMO-BOOST-PACK', 0, true),
  ('Badge Discord Exclusif', 'Rôle et badge exclusif sur notre serveur Discord officiel.', 200, -1, 'digital', 'BADGE-DISCORD-VIP', 0, true),
  ('Wallpaper Pack HD', 'Pack de fonds d''écran HD exclusifs Esport Arena.', 100, -1, 'digital', 'WALLPAPER-HD-PACK', 0, true)
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_arena = EXCLUDED.price_arena,
  active = true;

-- Enable realtime for subscriptions table
ALTER PUBLICATION supabase_realtime ADD TABLE public.subscriptions;