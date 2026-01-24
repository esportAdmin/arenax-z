-- Add reply_to_id column to club_messages for quote/reply functionality
ALTER TABLE public.club_messages 
ADD COLUMN reply_to_id uuid REFERENCES public.club_messages(id) ON DELETE SET NULL;

-- Create index for faster reply lookups
CREATE INDEX idx_club_messages_reply_to_id ON public.club_messages(reply_to_id);