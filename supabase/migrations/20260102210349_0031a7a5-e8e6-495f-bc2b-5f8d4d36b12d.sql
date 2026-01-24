-- Enable realtime for admin_audit_logs
ALTER PUBLICATION supabase_realtime ADD TABLE admin_audit_logs;

-- Create function to notify admins when audit log is created
CREATE OR REPLACE FUNCTION public.notify_admins_on_audit_log()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_admin record;
  v_action_text text;
BEGIN
  -- Map action types to readable text
  v_action_text := CASE NEW.action_type
    WHEN 'give_arena_points' THEN 'Attribution d''Arena Points'
    WHEN 'add_role' THEN 'Ajout de rôle'
    WHEN 'remove_role' THEN 'Retrait de rôle'
    WHEN 'create_prize' THEN 'Création de prix'
    WHEN 'update_prize' THEN 'Modification de prix'
    WHEN 'delete_prize' THEN 'Suppression de prix'
    WHEN 'update_redemption' THEN 'Mise à jour d''échange'
    ELSE NEW.action_type
  END;

  -- Notify all admins except the one who performed the action
  FOR v_admin IN 
    SELECT ur.user_id 
    FROM user_roles ur 
    WHERE ur.role = 'admin' 
    AND ur.user_id != NEW.admin_id
  LOOP
    INSERT INTO user_notifications (user_id, type, title, message, value)
    VALUES (
      v_admin.user_id,
      'admin_audit',
      '🔔 Action admin',
      v_action_text || ' sur ' || NEW.target_type,
      NEW.id::text
    );
  END LOOP;

  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER on_audit_log_created
  AFTER INSERT ON admin_audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION notify_admins_on_audit_log();