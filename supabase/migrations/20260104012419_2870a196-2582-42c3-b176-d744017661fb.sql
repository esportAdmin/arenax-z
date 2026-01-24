-- Clean up duplicate/conflicting profile policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- The "Authenticated users can view profiles" policy already exists from the previous migration
-- No further changes needed - the profiles table now has:
-- 1. "Authenticated users can view profiles" - for authenticated users
-- 2. "Users can view their own profile" - for anon users (login flows)
-- 3. "Users can insert their own profile" - for profile creation
-- 4. "Users can update their own profile" - for profile updates