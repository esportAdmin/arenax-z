-- Drop the overly permissive public read policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a new policy that requires authentication
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Allow public access only to the user's own profile (for login flows)
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO anon
USING (auth.uid() = user_id);