-- Make the club-chat-files bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'club-chat-files';

-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can view club chat files" ON storage.objects;

-- Create a new policy that requires club membership to view files
CREATE POLICY "Club members can view club files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'club-chat-files'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    -- Extract club_id from path: user_id/club_id/filename
    SELECT 1 FROM public.club_members cm
    WHERE cm.user_id = auth.uid()
    AND cm.club_id::text = (string_to_array(name, '/'))[2]
  )
);