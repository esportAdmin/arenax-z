-- Allow club admins and owners to delete any message in their club
CREATE POLICY "Club admins can delete messages"
ON public.club_messages
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM club_members
    WHERE club_members.club_id = club_messages.club_id
    AND club_members.user_id = auth.uid()
    AND club_members.role IN ('owner', 'admin', 'moderator')
  )
);