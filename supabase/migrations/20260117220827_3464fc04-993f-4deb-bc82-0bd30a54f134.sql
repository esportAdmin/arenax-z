-- ============================================================
-- SECURITY FIX: Drop overly permissive system insert policies
-- ============================================================

-- 1. Drop permissive INSERT policies that allow any authenticated user to insert
-- These operations should only be performed via SECURITY DEFINER functions or service role

DROP POLICY IF EXISTS "System can insert activities" ON public.club_activities;
DROP POLICY IF EXISTS "System can insert rankings" ON public.club_weekly_rankings;
DROP POLICY IF EXISTS "System can insert moderation logs" ON public.club_moderation_logs;

-- 2. Recreate these policies to only allow insertions by club members with proper authorization
-- or via SECURITY DEFINER functions (which bypass RLS)

-- Club activities: Only club members can insert activities for their own user_id
CREATE POLICY "Club members can insert their activities"
ON public.club_activities FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM club_members 
    WHERE club_members.club_id = club_activities.club_id 
    AND club_members.user_id = auth.uid()
  )
);

-- Club moderation logs: Only club moderators/admins can insert logs
CREATE POLICY "Club moderators can insert moderation logs"
ON public.club_moderation_logs FOR INSERT
WITH CHECK (
  auth.uid() = moderator_id AND
  EXISTS (
    SELECT 1 FROM club_members 
    WHERE club_members.club_id = club_moderation_logs.club_id 
    AND club_members.user_id = auth.uid()
    AND club_members.role IN ('owner', 'admin', 'moderator')
  )
);

-- Club weekly rankings: Remove direct insert capability
-- Rankings should only be created via scheduled jobs with service role
-- No new policy needed - SECURITY DEFINER functions or service role will handle this