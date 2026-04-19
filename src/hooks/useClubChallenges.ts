import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ChallengeTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  challenge_type: string;
  target_value: number;
  xp_reward: number;
  arena_points_reward: number;
  duration_days: number;
  difficulty: 'easy' | 'normal' | 'hard' | 'legendary';
}

interface Contribution {
  user_id: string;
  contribution_value: number;
  profile?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

export interface ClubChallenge {
  id: string;
  club_id: string;
  template_id: string;
  current_value: number;
  target_value: number;
  status: 'active' | 'completed' | 'failed' | 'expired';
  start_date: string;
  end_date: string;
  completed_at: string | null;
  rewards_claimed: boolean;
  template: ChallengeTemplate;
  contributions?: Contribution[];
}

export const useClubChallenges = (clubId?: string) => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<ChallengeTemplate[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<ClubChallenge | null>(null);
  const [pastChallenges, setPastChallenges] = useState<ClubChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [userClubId, setUserClubId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchUserClub = useCallback(async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('club_members')
      .select('club_id, role')
      .eq('user_id', user.id)
      .single();
    
    if (data) {
      setUserClubId(data.club_id);
      setIsAdmin(['owner', 'admin'].includes(data.role));
    }
  }, [user]);

  const fetchTemplates = useCallback(async () => {
    const { data, error } = await supabase
      .from('club_challenge_templates')
      .select('*')
      .eq('active', true)
      .order('difficulty');

    if (!error && data) {
      setTemplates(data.map(t => ({
        ...t,
        difficulty: t.difficulty as ChallengeTemplate['difficulty']
      })));
    }
  }, []);

  const fetchChallenges = useCallback(async () => {
    const targetClubId = clubId || userClubId;
    if (!targetClubId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('club_challenges')
        .select(`
          *,
          template:club_challenge_templates(*)
        `)
        .eq('club_id', targetClubId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const challenges: ClubChallenge[] = (data || []).map(c => ({
        ...c,
        status: c.status as ClubChallenge['status'],
        template: {
          ...c.template,
          difficulty: c.template.difficulty as ChallengeTemplate['difficulty']
        },
        contributions: undefined
      }));

      const activeIndex = challenges.findIndex(c => c.status === 'active');
      
      if (activeIndex !== -1) {
        const active = challenges[activeIndex];
        // Fetch contributions for active challenge
        const { data: contributions } = await supabase
          .from('club_challenge_contributions')
          .select('user_id, contribution_value')
          .eq('challenge_id', active.id)
          .order('contribution_value', { ascending: false });

        if (contributions && contributions.length > 0) {
          // Fetch profiles for contributors
          const { data: profiles } = await supabase
            .from('profiles')
            .select('user_id, display_name, avatar_url')
            .in('user_id', contributions.map(c => c.user_id));

          challenges[activeIndex] = {
            ...active,
            contributions: contributions.map(c => ({
              ...c,
              profile: profiles?.find(p => p.user_id === c.user_id)
            }))
          };
        }

        setActiveChallenge(challenges[activeIndex]);
      } else {
        setActiveChallenge(null);
      }

      setPastChallenges(challenges.filter(c => c.status !== 'active'));
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  }, [clubId, userClubId]);

  const startChallenge = async (templateId: string) => {
    try {
      const { data, error } = await supabase.rpc('start_club_challenge', {
        p_template_id: templateId
      });

      if (error) throw error;
      
      const result = data as { success: boolean; error?: string };
      if (result.success) {
        await fetchChallenges();
      }
      return result;
    } catch (error) {
      console.error('Error starting challenge:', error);
      return { success: false, error: 'Erreur lors du lancement' };
    }
  };

  const claimReward = async (challengeId: string) => {
    try {
      const { data, error } = await supabase.rpc('claim_club_challenge_reward', {
        p_challenge_id: challengeId
      });

      if (error) throw error;
      
      const result = data as { success: boolean; error?: string };
      if (result.success) {
        await fetchChallenges();
      }
      return result;
    } catch (error) {
      console.error('Error claiming reward:', error);
      return { success: false, error: 'Erreur lors de la réclamation' };
    }
  };

  useEffect(() => {
    void fetchUserClub();
    void fetchTemplates();
  }, [fetchUserClub, fetchTemplates]);

  useEffect(() => {
    if (clubId || userClubId) {
      void fetchChallenges();
    }
  }, [clubId, userClubId, fetchChallenges]);

  return {
    templates,
    activeChallenge,
    pastChallenges,
    loading,
    isAdmin,
    startChallenge,
    claimReward,
    refresh: fetchChallenges
  };
};
