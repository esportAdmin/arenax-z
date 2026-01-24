-- TASK 3A: Add cost to create club war (anti-inflation sink)
-- Deduct 5,000 arena_balance when creating a war

CREATE OR REPLACE FUNCTION public.create_club_war(p_defender_id uuid, p_duration_days integer DEFAULT 7)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_challenger_id uuid;
  v_war_id uuid;
  v_end_date timestamptz;
  v_war_cost integer := 5000; -- Cost in arena points
  v_user_balance integer;
BEGIN
  -- Validate duration (prevent abuse)
  IF p_duration_days < 1 OR p_duration_days > 30 THEN
    RETURN json_build_object('success', false, 'error', 'Durée invalide (1-30 jours)');
  END IF;
  
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
  
  -- Check user has enough balance to pay the war cost
  SELECT arena_balance INTO v_user_balance
  FROM profiles
  WHERE user_id = v_user_id;
  
  IF v_user_balance IS NULL OR v_user_balance < v_war_cost THEN
    RETURN json_build_object('success', false, 'error', 'Solde insuffisant. Coût: ' || v_war_cost || ' AP');
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
  
  -- Deduct war cost from user balance
  UPDATE profiles 
  SET arena_balance = arena_balance - v_war_cost, updated_at = now()
  WHERE user_id = v_user_id;
  
  -- Log the transaction in arena_ledger
  INSERT INTO arena_ledger (user_id, amount, source, description)
  VALUES (v_user_id, -v_war_cost, 'manual', 'Coût de déclaration de guerre de club');
  
  -- Calculate end date using safe make_interval
  v_end_date := now() + make_interval(days => p_duration_days);
  
  -- Create war
  INSERT INTO club_wars (challenger_id, defender_id, end_date)
  VALUES (v_challenger_id, p_defender_id, v_end_date)
  RETURNING id INTO v_war_id;
  
  -- Log activity
  INSERT INTO club_activities (club_id, user_id, activity_type, title, description)
  VALUES (v_challenger_id, v_user_id, 'war_declared', 'Guerre déclarée', 'A défié un club en duel (-' || v_war_cost || ' AP)');
  
  RETURN json_build_object('success', true, 'war_id', v_war_id, 'cost', v_war_cost);
END;
$$;