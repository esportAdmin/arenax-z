-- Fix SQL injection in interval concatenation by using make_interval()
-- Also create a secure function for completing daily challenges

-- 1. Create secure function for daily challenge completion
CREATE OR REPLACE FUNCTION public.complete_daily_challenge_reward(p_xp_reward integer DEFAULT 50)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_current_streak integer;
  v_new_balance bigint;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Non authentifié');
  END IF;
  
  -- Validate reward amount (prevent manipulation)
  IF p_xp_reward < 0 OR p_xp_reward > 500 THEN
    RETURN json_build_object('success', false, 'error', 'Montant de récompense invalide');
  END IF;
  
  -- Get current streak
  SELECT active_streak INTO v_current_streak
  FROM profiles WHERE user_id = v_user_id;
  
  -- Update profile with new streak and balance
  UPDATE profiles 
  SET 
    active_streak = COALESCE(v_current_streak, 0) + 1,
    arena_balance = arena_balance + p_xp_reward,
    updated_at = now()
  WHERE user_id = v_user_id
  RETURNING arena_balance INTO v_new_balance;
  
  -- Record in ledger for auditability
  INSERT INTO arena_ledger (user_id, amount, source, description)
  VALUES (v_user_id, p_xp_reward, 'prize', 'Daily challenge completion reward');
  
  RETURN json_build_object(
    'success', true, 
    'new_streak', COALESCE(v_current_streak, 0) + 1,
    'new_balance', v_new_balance,
    'reward_amount', p_xp_reward
  );
END;
$$;

-- 2. Fix mute_club_member to use make_interval instead of string concatenation
CREATE OR REPLACE FUNCTION public.mute_club_member(p_club_id uuid, p_user_id uuid, p_duration_minutes integer, p_reason text DEFAULT NULL::text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_moderator_id UUID := auth.uid();
  v_target_role TEXT;
  v_moderator_role TEXT;
  v_expires_at timestamptz;
BEGIN
  -- Validate duration (prevent abuse)
  IF p_duration_minutes < 1 OR p_duration_minutes > 10080 THEN -- max 1 week
    RETURN json_build_object('success', false, 'error', 'Durée invalide (1 min - 1 semaine)');
  END IF;
  
  -- Get moderator role
  SELECT role INTO v_moderator_role
  FROM club_members
  WHERE club_id = p_club_id AND user_id = v_moderator_id;
  
  IF v_moderator_role IS NULL OR v_moderator_role NOT IN ('owner', 'admin', 'moderator') THEN
    RETURN json_build_object('success', false, 'error', 'Non autorisé');
  END IF;
  
  -- Get target role
  SELECT role INTO v_target_role
  FROM club_members
  WHERE club_id = p_club_id AND user_id = p_user_id;
  
  IF v_target_role IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Membre non trouvé');
  END IF;
  
  -- Cannot mute owner
  IF v_target_role = 'owner' THEN
    RETURN json_build_object('success', false, 'error', 'Impossible de mute le propriétaire');
  END IF;
  
  -- Cannot mute someone with equal or higher role
  IF v_moderator_role = 'moderator' AND v_target_role IN ('admin', 'moderator') THEN
    RETURN json_build_object('success', false, 'error', 'Impossible de mute un admin ou modérateur');
  END IF;
  
  IF v_moderator_role = 'admin' AND v_target_role = 'admin' THEN
    RETURN json_build_object('success', false, 'error', 'Impossible de mute un autre admin');
  END IF;
  
  -- Calculate expiration using safe make_interval
  v_expires_at := now() + make_interval(mins => p_duration_minutes);
  
  -- Upsert mute (insert or update if exists)
  INSERT INTO club_muted_members (club_id, user_id, muted_by, reason, expires_at)
  VALUES (p_club_id, p_user_id, v_moderator_id, p_reason, v_expires_at)
  ON CONFLICT (club_id, user_id) 
  DO UPDATE SET 
    muted_by = v_moderator_id,
    reason = p_reason,
    muted_at = now(),
    expires_at = v_expires_at;
  
  -- Log moderation action
  INSERT INTO club_moderation_logs (club_id, moderator_id, action_type, target_user_id, message_content)
  VALUES (p_club_id, v_moderator_id, 'mute', p_user_id, 'Mute pour ' || p_duration_minutes || ' minutes. Raison: ' || COALESCE(p_reason, 'Non spécifiée'));
  
  -- Notify the muted user
  INSERT INTO user_notifications (user_id, type, title, message, value)
  VALUES (
    p_user_id,
    'muted',
    '🔇 Vous avez été mute',
    'Vous ne pouvez plus envoyer de messages pendant ' || p_duration_minutes || ' minutes.' || 
      CASE WHEN p_reason IS NOT NULL THEN ' Raison: ' || p_reason ELSE '' END,
    p_club_id::text
  );
  
  RETURN json_build_object('success', true, 'expires_at', v_expires_at);
END;
$$;

-- 3. Fix create_club_war to use make_interval
CREATE OR REPLACE FUNCTION public.create_club_war(p_defender_id uuid, p_duration_days integer DEFAULT 7)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_challenger_id uuid;
  v_war_id uuid;
  v_end_date timestamptz;
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
  
  -- Calculate end date using safe make_interval
  v_end_date := now() + make_interval(days => p_duration_days);
  
  -- Create war
  INSERT INTO club_wars (challenger_id, defender_id, end_date)
  VALUES (v_challenger_id, p_defender_id, v_end_date)
  RETURNING id INTO v_war_id;
  
  -- Log activity
  INSERT INTO club_activities (club_id, user_id, activity_type, title, description)
  VALUES (v_challenger_id, v_user_id, 'war_declared', 'Guerre déclarée', 'A défié un club en duel');
  
  RETURN json_build_object('success', true, 'war_id', v_war_id);
END;
$$;

-- 4. Fix start_club_challenge to use make_interval
CREATE OR REPLACE FUNCTION public.start_club_challenge(p_template_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_club_id uuid;
  v_template record;
  v_challenge_id uuid;
  v_end_date timestamptz;
BEGIN
  -- Get user's club
  SELECT club_id INTO v_club_id 
  FROM club_members 
  WHERE user_id = v_user_id AND role IN ('owner', 'admin');
  
  IF v_club_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Vous devez être admin d''un club');
  END IF;
  
  -- Check if club has an active challenge
  IF EXISTS (
    SELECT 1 FROM club_challenges 
    WHERE club_id = v_club_id AND status = 'active'
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Votre club a déjà un défi actif');
  END IF;
  
  -- Get template
  SELECT * INTO v_template FROM club_challenge_templates WHERE id = p_template_id AND active = true;
  
  IF v_template IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Défi non trouvé');
  END IF;
  
  -- Calculate end date using safe make_interval
  v_end_date := now() + make_interval(days => v_template.duration_days);
  
  -- Create challenge
  INSERT INTO club_challenges (club_id, template_id, target_value, end_date)
  VALUES (v_club_id, p_template_id, v_template.target_value, v_end_date)
  RETURNING id INTO v_challenge_id;
  
  -- Log activity
  INSERT INTO club_activities (club_id, user_id, activity_type, title, description)
  VALUES (v_club_id, v_user_id, 'challenge_started', 'Défi lancé', v_template.title);
  
  -- Notify all members
  INSERT INTO user_notifications (user_id, type, title, message, value)
  SELECT 
    cm.user_id,
    'club_challenge',
    '🎯 Nouveau défi de club !',
    v_template.title || ' - ' || v_template.description,
    v_challenge_id::text
  FROM club_members cm WHERE cm.club_id = v_club_id;
  
  RETURN json_build_object('success', true, 'challenge_id', v_challenge_id);
END;
$$;