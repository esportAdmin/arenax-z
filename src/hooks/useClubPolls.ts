import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface PollOption {
  id: string;
  option_text: string;
  option_order: number;
  vote_count: number;
}

export interface Poll {
  id: string;
  club_id: string;
  message_id: string | null;
  creator_id: string;
  question: string;
  is_multiple_choice: boolean;
  is_anonymous: boolean;
  ends_at: string | null;
  is_closed: boolean;
  created_at: string;
  options: PollOption[];
  user_votes: string[];
  total_votes: number;
}

export const useClubPolls = (clubId: string | null) => {
  const { user } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPolls = useCallback(async () => {
    if (!clubId) return;
    setLoading(true);
    
    try {
      // Fetch polls
      const { data: pollsData, error: pollsError } = await supabase
        .from('club_polls')
        .select('*')
        .eq('club_id', clubId)
        .order('created_at', { ascending: false });

      if (pollsError) throw pollsError;
      if (!pollsData?.length) {
        setPolls([]);
        return;
      }

      // Fetch options for all polls
      const pollIds = pollsData.map(p => p.id);
      const { data: optionsData } = await supabase
        .from('club_poll_options')
        .select('*')
        .in('poll_id', pollIds)
        .order('option_order', { ascending: true });

      // Fetch votes for all polls
      const { data: votesData } = await supabase
        .from('club_poll_votes')
        .select('*')
        .in('poll_id', pollIds);

      // Build polls with options and votes
      const enrichedPolls: Poll[] = pollsData.map(poll => {
        const pollOptions = optionsData?.filter(o => o.poll_id === poll.id) || [];
        const pollVotes = votesData?.filter(v => v.poll_id === poll.id) || [];
        const userVotes = pollVotes.filter(v => v.user_id === user?.id).map(v => v.option_id);

        return {
          ...poll,
          options: pollOptions.map(opt => ({
            id: opt.id,
            option_text: opt.option_text,
            option_order: opt.option_order,
            vote_count: pollVotes.filter(v => v.option_id === opt.id).length
          })),
          user_votes: userVotes,
          total_votes: pollVotes.length
        };
      });

      setPolls(enrichedPolls);
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
    }
  }, [clubId, user?.id]);

  const createPoll = async (
    question: string,
    options: string[],
    isMultipleChoice: boolean = false,
    isAnonymous: boolean = false,
    endsAt?: Date
  ) => {
    if (!clubId || !user) return null;

    try {
      // Create poll
      const { data: pollData, error: pollError } = await supabase
        .from('club_polls')
        .insert({
          club_id: clubId,
          creator_id: user.id,
          question,
          is_multiple_choice: isMultipleChoice,
          is_anonymous: isAnonymous,
          ends_at: endsAt?.toISOString() || null
        })
        .select()
        .single();

      if (pollError) throw pollError;

      // Create options
      const optionsToInsert = options.map((text, index) => ({
        poll_id: pollData.id,
        option_text: text,
        option_order: index
      }));

      const { error: optionsError } = await supabase
        .from('club_poll_options')
        .insert(optionsToInsert);

      if (optionsError) throw optionsError;

      // Also create a message for the poll
      await supabase
        .from('club_messages')
        .insert({
          club_id: clubId,
          user_id: user.id,
          content: `📊 Sondage: ${question}`,
          message_type: 'poll'
        });

      toast.success('Sondage créé !');
      await fetchPolls();
      return pollData.id;
    } catch (error) {
      console.error('Error creating poll:', error);
      toast.error('Erreur lors de la création du sondage');
      return null;
    }
  };

  const vote = async (pollId: string, optionId: string) => {
    if (!user) return;

    const poll = polls.find(p => p.id === pollId);
    if (!poll) return;

    try {
      if (poll.is_multiple_choice) {
        // Toggle vote for multiple choice
        const hasVoted = poll.user_votes.includes(optionId);
        if (hasVoted) {
          await supabase
            .from('club_poll_votes')
            .delete()
            .eq('poll_id', pollId)
            .eq('option_id', optionId)
            .eq('user_id', user.id);
        } else {
          await supabase
            .from('club_poll_votes')
            .insert({
              poll_id: pollId,
              option_id: optionId,
              user_id: user.id
            });
        }
      } else {
        // Single choice - remove previous vote first
        await supabase
          .from('club_poll_votes')
          .delete()
          .eq('poll_id', pollId)
          .eq('user_id', user.id);

        await supabase
          .from('club_poll_votes')
          .insert({
            poll_id: pollId,
            option_id: optionId,
            user_id: user.id
          });
      }

      await fetchPolls();
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Erreur lors du vote');
    }
  };

  const closePoll = async (pollId: string) => {
    try {
      await supabase
        .from('club_polls')
        .update({ is_closed: true })
        .eq('id', pollId);

      toast.success('Sondage fermé');
      await fetchPolls();
    } catch (error) {
      console.error('Error closing poll:', error);
      toast.error('Erreur lors de la fermeture');
    }
  };

  return {
    polls,
    loading,
    fetchPolls,
    createPoll,
    vote,
    closePoll
  };
};
