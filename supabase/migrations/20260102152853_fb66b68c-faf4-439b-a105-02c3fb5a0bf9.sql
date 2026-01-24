-- Function to notify club members about war events
CREATE OR REPLACE FUNCTION public.notify_club_war_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_member record;
  v_challenger_name text;
  v_defender_name text;
BEGIN
  -- Get club names
  SELECT name INTO v_challenger_name FROM clubs WHERE id = NEW.challenger_id;
  SELECT name INTO v_defender_name FROM clubs WHERE id = NEW.defender_id;
  
  -- Handle new war (pending)
  IF TG_OP = 'INSERT' THEN
    -- Notify defender club members
    FOR v_member IN 
      SELECT user_id FROM club_members WHERE club_id = NEW.defender_id
    LOOP
      INSERT INTO user_notifications (user_id, type, title, message, value)
      VALUES (
        v_member.user_id,
        'war_challenge',
        '⚔️ Défi reçu !',
        v_challenger_name || ' vous défie en guerre de clubs !',
        NEW.id::text
      );
    END LOOP;
    
    RETURN NEW;
  END IF;
  
  -- Handle status changes
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    -- War accepted - notify both clubs
    IF NEW.status = 'active' THEN
      -- Notify challenger
      FOR v_member IN 
        SELECT user_id FROM club_members WHERE club_id = NEW.challenger_id
      LOOP
        INSERT INTO user_notifications (user_id, type, title, message, value)
        VALUES (
          v_member.user_id,
          'war_started',
          '🔥 Guerre commencée !',
          v_defender_name || ' a accepté votre défi. Que le meilleur club gagne !',
          NEW.id::text
        );
      END LOOP;
      
      -- Notify defender
      FOR v_member IN 
        SELECT user_id FROM club_members WHERE club_id = NEW.defender_id
      LOOP
        INSERT INTO user_notifications (user_id, type, title, message, value)
        VALUES (
          v_member.user_id,
          'war_started',
          '🔥 Guerre commencée !',
          'La guerre contre ' || v_challenger_name || ' commence maintenant !',
          NEW.id::text
        );
      END LOOP;
    END IF;
    
    -- War declined
    IF NEW.status = 'declined' THEN
      FOR v_member IN 
        SELECT user_id FROM club_members WHERE club_id = NEW.challenger_id AND role IN ('owner', 'admin')
      LOOP
        INSERT INTO user_notifications (user_id, type, title, message, value)
        VALUES (
          v_member.user_id,
          'war_declined',
          '❌ Défi refusé',
          v_defender_name || ' a refusé votre défi de guerre.',
          NEW.id::text
        );
      END LOOP;
    END IF;
    
    -- War completed
    IF NEW.status = 'completed' THEN
      -- Notify winner
      IF NEW.winner_id IS NOT NULL THEN
        FOR v_member IN 
          SELECT user_id FROM club_members WHERE club_id = NEW.winner_id
        LOOP
          INSERT INTO user_notifications (user_id, type, title, message, value)
          VALUES (
            v_member.user_id,
            'war_won',
            '🏆 Victoire !',
            'Votre club a remporté la guerre ! +' || NEW.xp_reward || ' XP',
            NEW.id::text
          );
        END LOOP;
        
        -- Notify loser
        FOR v_member IN 
          SELECT user_id FROM club_members 
          WHERE club_id IN (NEW.challenger_id, NEW.defender_id) 
          AND club_id != NEW.winner_id
        LOOP
          INSERT INTO user_notifications (user_id, type, title, message, value)
          VALUES (
            v_member.user_id,
            'war_lost',
            '💔 Défaite',
            'Votre club a perdu la guerre. Préparez-vous pour la prochaine !',
            NEW.id::text
          );
        END LOOP;
      ELSE
        -- Draw - notify both clubs
        FOR v_member IN 
          SELECT user_id FROM club_members 
          WHERE club_id IN (NEW.challenger_id, NEW.defender_id)
        LOOP
          INSERT INTO user_notifications (user_id, type, title, message, value)
          VALUES (
            v_member.user_id,
            'war_draw',
            '🤝 Égalité',
            'La guerre s''est terminée par une égalité !',
            NEW.id::text
          );
        END LOOP;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for club wars
DROP TRIGGER IF EXISTS on_club_war_change ON public.club_wars;
CREATE TRIGGER on_club_war_change
  AFTER INSERT OR UPDATE ON public.club_wars
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_club_war_event();