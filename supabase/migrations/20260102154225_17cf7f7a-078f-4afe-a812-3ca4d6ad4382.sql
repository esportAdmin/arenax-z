-- Table for message reactions
CREATE TABLE public.club_message_reactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id uuid NOT NULL REFERENCES public.club_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  emoji text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);

-- Create index for faster queries
CREATE INDEX idx_message_reactions_message ON public.club_message_reactions(message_id);

-- Enable RLS
ALTER TABLE public.club_message_reactions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Club members can view reactions" ON public.club_message_reactions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM club_messages cm
    JOIN club_members cmem ON cmem.club_id = cm.club_id
    WHERE cm.id = club_message_reactions.message_id AND cmem.user_id = auth.uid()
  )
);

CREATE POLICY "Club members can add reactions" ON public.club_message_reactions
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM club_messages cm
    JOIN club_members cmem ON cmem.club_id = cm.club_id
    WHERE cm.id = club_message_reactions.message_id AND cmem.user_id = auth.uid()
  )
);

CREATE POLICY "Users can remove their own reactions" ON public.club_message_reactions
FOR DELETE USING (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.club_message_reactions;