-- =====================================================
-- COMPLETE REMAINING SECURITY FIXES
-- =====================================================

-- Fix support_inquiries policies (use unique names)
DROP POLICY IF EXISTS "Users can view own support inquiries or admins all" ON public.support_inquiries;
DROP POLICY IF EXISTS "Anyone authenticated can create support inquiries" ON public.support_inquiries;
DROP POLICY IF EXISTS "Only admins can update support inquiries" ON public.support_inquiries;

CREATE POLICY "support_inquiries_select_policy"
ON public.support_inquiries FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "support_inquiries_insert_policy"
ON public.support_inquiries FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "support_inquiries_update_policy"
ON public.support_inquiries FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix prize_redemptions policies (use unique names)
DROP POLICY IF EXISTS "Users view own prize redemptions" ON public.prize_redemptions;
DROP POLICY IF EXISTS "Admins view all prize redemptions" ON public.prize_redemptions;
DROP POLICY IF EXISTS "Users create own prize redemptions" ON public.prize_redemptions;

CREATE POLICY "prize_redemptions_user_select"
ON public.prize_redemptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "prize_redemptions_admin_select"
ON public.prize_redemptions FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "prize_redemptions_user_insert"
ON public.prize_redemptions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);