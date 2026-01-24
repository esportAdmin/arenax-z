-- Add pinned column to club_messages
ALTER TABLE public.club_messages 
ADD COLUMN is_pinned boolean NOT NULL DEFAULT false,
ADD COLUMN pinned_at timestamp with time zone,
ADD COLUMN pinned_by uuid REFERENCES auth.users(id);

-- Create index for faster pinned messages lookup
CREATE INDEX idx_club_messages_pinned ON public.club_messages(club_id, is_pinned) WHERE is_pinned = true;

-- Allow club admins to update messages (for pinning)
CREATE POLICY "Club admins can pin messages"
ON public.club_messages
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM club_members
    WHERE club_members.club_id = club_messages.club_id
    AND club_members.user_id = auth.uid()
    AND club_members.role IN ('owner', 'admin')
  )
);