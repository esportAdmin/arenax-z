-- Create storage bucket for club chat files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'club-chat-files', 
  'club-chat-files', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Allow club members to upload files
CREATE POLICY "Club members can upload files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'club-chat-files' 
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM club_members 
    WHERE club_members.user_id = auth.uid()
  )
);

-- Allow anyone to view club chat files (public bucket)
CREATE POLICY "Anyone can view club chat files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'club-chat-files');

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'club-chat-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add file_url column to club_messages
ALTER TABLE public.club_messages 
ADD COLUMN file_url text,
ADD COLUMN file_name text,
ADD COLUMN file_type text;