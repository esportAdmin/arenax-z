
-- Create polls table
CREATE TABLE public.club_polls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  message_id UUID REFERENCES public.club_messages(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL,
  question TEXT NOT NULL,
  is_multiple_choice BOOLEAN NOT NULL DEFAULT false,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  ends_at TIMESTAMP WITH TIME ZONE,
  is_closed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create poll options table
CREATE TABLE public.club_poll_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES public.club_polls(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create poll votes table
CREATE TABLE public.club_poll_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES public.club_polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES public.club_poll_options(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(poll_id, option_id, user_id)
);

-- Enable RLS
ALTER TABLE public.club_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_poll_votes ENABLE ROW LEVEL SECURITY;

-- Polls policies
CREATE POLICY "Club members can view polls"
ON public.club_polls FOR SELECT
USING (EXISTS (
  SELECT 1 FROM club_members
  WHERE club_members.club_id = club_polls.club_id
  AND club_members.user_id = auth.uid()
));

CREATE POLICY "Club members can create polls"
ON public.club_polls FOR INSERT
WITH CHECK (
  auth.uid() = creator_id
  AND EXISTS (
    SELECT 1 FROM club_members
    WHERE club_members.club_id = club_polls.club_id
    AND club_members.user_id = auth.uid()
  )
);

CREATE POLICY "Poll creators and admins can update polls"
ON public.club_polls FOR UPDATE
USING (
  auth.uid() = creator_id
  OR EXISTS (
    SELECT 1 FROM club_members
    WHERE club_members.club_id = club_polls.club_id
    AND club_members.user_id = auth.uid()
    AND club_members.role IN ('owner', 'admin')
  )
);

-- Poll options policies
CREATE POLICY "Club members can view poll options"
ON public.club_poll_options FOR SELECT
USING (EXISTS (
  SELECT 1 FROM club_polls p
  JOIN club_members cm ON cm.club_id = p.club_id
  WHERE p.id = club_poll_options.poll_id
  AND cm.user_id = auth.uid()
));

CREATE POLICY "Poll creators can add options"
ON public.club_poll_options FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM club_polls p
  WHERE p.id = club_poll_options.poll_id
  AND p.creator_id = auth.uid()
));

-- Poll votes policies
CREATE POLICY "Club members can view votes"
ON public.club_poll_votes FOR SELECT
USING (EXISTS (
  SELECT 1 FROM club_polls p
  JOIN club_members cm ON cm.club_id = p.club_id
  WHERE p.id = club_poll_votes.poll_id
  AND cm.user_id = auth.uid()
));

CREATE POLICY "Club members can vote"
ON public.club_poll_votes FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM club_polls p
    JOIN club_members cm ON cm.club_id = p.club_id
    WHERE p.id = club_poll_votes.poll_id
    AND cm.user_id = auth.uid()
    AND p.is_closed = false
  )
);

CREATE POLICY "Users can remove their votes"
ON public.club_poll_votes FOR DELETE
USING (auth.uid() = user_id);

-- Enable realtime for polls
ALTER PUBLICATION supabase_realtime ADD TABLE public.club_polls;
ALTER PUBLICATION supabase_realtime ADD TABLE public.club_poll_votes;
