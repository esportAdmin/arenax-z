-- Table for club chat messages
CREATE TABLE public.club_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id uuid NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  message_type text NOT NULL DEFAULT 'text', -- 'text', 'system', 'achievement'
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_club_messages_club_created ON public.club_messages(club_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.club_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Club members can view messages" ON public.club_messages
FOR SELECT USING (
  EXISTS (SELECT 1 FROM club_members WHERE club_id = club_messages.club_id AND user_id = auth.uid())
);

CREATE POLICY "Club members can send messages" ON public.club_messages
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (SELECT 1 FROM club_members WHERE club_id = club_messages.club_id AND user_id = auth.uid())
);

CREATE POLICY "Users can delete their own messages" ON public.club_messages
FOR DELETE USING (auth.uid() = user_id);

-- Enable realtime for club_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.club_messages;