import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ClubRanking {
  id: string;
  club_id: string;
  week_start: string;
  week_end: string;
  total_xp: number;
  total_predictions: number;
  total_wins: number;
  accuracy: number;
  final_rank: number | null;
  rewards_claimed: boolean;
  club: {
    id: string;
    name: string;
    logo_url: string | null;
    member_count: number;
  };
}

interface ClubReward {
  id: string;
  rank_from: number;
  rank_to: number;
  xp_bonus: number;
  arena_points: number;
  badge_name: string | null;
  description: string | null;
}

export const useClubRankings = () => {
  const { user } = useAuth();
  const [rankings, setRankings] = useState<ClubRanking[]>([]);
  const [rewards, setRewards] = useState<ClubReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [userClubRanking, setUserClubRanking] = useState<ClubRanking | null>(null);

  const getCurrentWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const weekStart = new Date(now.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return {
      start: weekStart.toISOString().split('T')[0],
      end: weekEnd.toISOString().split('T')[0]
    };
  };

  const fetchRankings = useCallback(async () => {
    try {
      const { start } = getCurrentWeek();
      
      // Fetch current week rankings with club info
      const { data: rankingsData, error } = await supabase
        .from('club_weekly_rankings')
        .select(`
          *,
          club:clubs(id, name, logo_url, member_count)
        `)
        .eq('week_start', start)
        .order('total_xp', { ascending: false });

      if (error) throw error;

      // Calculate ranks
      const rankedData = (rankingsData || []).map((r, index) => ({
        ...r,
        final_rank: index + 1,
        club: r.club as ClubRanking['club']
      }));

      setRankings(rankedData);

      // Find user's club ranking
      if (user) {
        const { data: membership } = await supabase
          .from('club_members')
          .select('club_id')
          .eq('user_id', user.id)
          .single();

        if (membership) {
          const userRanking = rankedData.find(r => r.club_id === membership.club_id);
          setUserClubRanking(userRanking || null);
        }
      }
    } catch (error) {
      console.error('Error fetching club rankings:', error);
    }
  }, [user]);

  const fetchRewards = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('club_rewards')
        .select('*')
        .eq('active', true)
        .order('rank_from');

      if (error) throw error;
      setRewards(data || []);
    } catch (error) {
      console.error('Error fetching club rewards:', error);
    }
  }, []);

  const claimReward = async (rankingId: string) => {
    try {
      const { data, error } = await supabase.rpc('claim_club_reward', {
        p_ranking_id: rankingId
      });

      if (error) throw error;
      
      const result = data as { success: boolean; error?: string };
      if (result.success) {
        await fetchRankings();
      }
      return result;
    } catch (error) {
      console.error('Error claiming reward:', error);
      return { success: false, error: 'Erreur lors de la réclamation' };
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchRankings(), fetchRewards()]);
      setLoading(false);
    };
    void loadData();
  }, [user, fetchRankings, fetchRewards]);

  return {
    rankings,
    rewards,
    loading,
    userClubRanking,
    claimReward,
    refresh: fetchRankings,
    getCurrentWeek
  };
};
