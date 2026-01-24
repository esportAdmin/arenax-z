
-- Supprimer les contraintes FK vers auth.users pour permettre les données de démo
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_referred_by_fkey;
ALTER TABLE public.clubs DROP CONSTRAINT IF EXISTS clubs_owner_id_fkey;

-- Supprimer également les FK sur les autres tables liées aux user_id
ALTER TABLE public.club_members DROP CONSTRAINT IF EXISTS club_members_user_id_fkey;
ALTER TABLE public.predictions DROP CONSTRAINT IF EXISTS predictions_user_id_fkey;
ALTER TABLE public.user_badges DROP CONSTRAINT IF EXISTS user_badges_user_id_fkey;
ALTER TABLE public.user_daily_challenges DROP CONSTRAINT IF EXISTS user_daily_challenges_user_id_fkey;
ALTER TABLE public.user_level_rewards DROP CONSTRAINT IF EXISTS user_level_rewards_user_id_fkey;
ALTER TABLE public.user_notifications DROP CONSTRAINT IF EXISTS user_notifications_user_id_fkey;
ALTER TABLE public.weekly_rankings DROP CONSTRAINT IF EXISTS weekly_rankings_user_id_fkey;
ALTER TABLE public.club_messages DROP CONSTRAINT IF EXISTS club_messages_user_id_fkey;
ALTER TABLE public.club_message_reactions DROP CONSTRAINT IF EXISTS club_message_reactions_user_id_fkey;
ALTER TABLE public.club_join_requests DROP CONSTRAINT IF EXISTS club_join_requests_user_id_fkey;
ALTER TABLE public.club_activities DROP CONSTRAINT IF EXISTS club_activities_user_id_fkey;
ALTER TABLE public.club_muted_members DROP CONSTRAINT IF EXISTS club_muted_members_user_id_fkey;
ALTER TABLE public.club_muted_members DROP CONSTRAINT IF EXISTS club_muted_members_muted_by_fkey;
ALTER TABLE public.club_banned_members DROP CONSTRAINT IF EXISTS club_banned_members_user_id_fkey;
ALTER TABLE public.club_banned_members DROP CONSTRAINT IF EXISTS club_banned_members_banned_by_fkey;
ALTER TABLE public.club_ban_appeals DROP CONSTRAINT IF EXISTS club_ban_appeals_user_id_fkey;
ALTER TABLE public.club_moderation_logs DROP CONSTRAINT IF EXISTS club_moderation_logs_moderator_id_fkey;
ALTER TABLE public.club_polls DROP CONSTRAINT IF EXISTS club_polls_creator_id_fkey;
ALTER TABLE public.club_poll_votes DROP CONSTRAINT IF EXISTS club_poll_votes_user_id_fkey;
ALTER TABLE public.club_challenge_contributions DROP CONSTRAINT IF EXISTS club_challenge_contributions_user_id_fkey;
ALTER TABLE public.admin_audit_logs DROP CONSTRAINT IF EXISTS admin_audit_logs_admin_id_fkey;
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
