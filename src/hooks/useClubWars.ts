import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Club {
  id: string;
  name: string;
  logo_url: string | null;
  member_count: number;
}

export interface ClubWar {
  id: string;
  challenger_id: string;
  defender_id: string;
  status: 'pending' | 'active' | 'completed' | 'declined';
  start_date: string | null;
  end_date: string | null;
  challenger_xp: number;
  defender_xp: number;
  challenger_predictions: number;
  defender_predictions: number;
  challenger_wins: number;
  defender_wins: number;
  winner_id: string | null;
  xp_reward: number;
  created_at: string;
  challenger: Club;
  defender: Club;
}

export const useClubWars = (clubId?: string) => {
  const { user } = useAuth();
  const [wars, setWars] = useState<ClubWar[]>([]);
  const [activeWar, setActiveWar] = useState<ClubWar | null>(null);
  const [pendingWars, setPendingWars] = useState<ClubWar[]>([]);
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

  const fetchWars = useCallback(async () => {
    try {
      const targetClubId = clubId || userClubId;
      if (!targetClubId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('club_wars')
        .select(`
          *,
          challenger:clubs!club_wars_challenger_id_fkey(id, name, logo_url, member_count),
          defender:clubs!club_wars_defender_id_fkey(id, name, logo_url, member_count)
        `)
        .or(`challenger_id.eq.${targetClubId},defender_id.eq.${targetClubId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typedWars = (data || []).map(w => ({
        ...w,
        status: w.status as ClubWar['status'],
        challenger: w.challenger as Club,
        defender: w.defender as Club
      }));

      setWars(typedWars);
      setActiveWar(typedWars.find(w => w.status === 'active') || null);
      setPendingWars(typedWars.filter(w => w.status === 'pending' && w.defender_id === targetClubId));
    } catch (error) {
      console.error('Error fetching wars:', error);
    } finally {
      setLoading(false);
    }
  }, [clubId, userClubId]);

  const createWar = async (defenderId: string, durationDays: number = 7) => {
    try {
      const { data, error } = await supabase.rpc('create_club_war', {
        p_defender_id: defenderId,
        p_duration_days: durationDays
      });

      if (error) throw error;
      
      const result = data as { success: boolean; error?: string; war_id?: string };
      if (result.success) {
        await fetchWars();
      }
      return result;
    } catch (error) {
      console.error('Error creating war:', error);
      return { success: false, error: 'Erreur lors de la création' };
    }
  };

  const respondToWar = async (warId: string, accept: boolean) => {
    try {
      const { data, error } = await supabase.rpc('respond_to_war', {
        p_war_id: warId,
        p_accept: accept
      });

      if (error) throw error;
      
      const result = data as { success: boolean; error?: string };
      if (result.success) {
        await fetchWars();
      }
      return result;
    } catch (error) {
      console.error('Error responding to war:', error);
      return { success: false, error: 'Erreur lors de la réponse' };
    }
  };

  useEffect(() => {
    void fetchUserClub();
  }, [fetchUserClub]);

  useEffect(() => {
    if (clubId || userClubId) {
      void fetchWars();
    }
  }, [clubId, userClubId, fetchWars]);

  return {
    wars,
    activeWar,
    pendingWars,
    loading,
    userClubId,
    isAdmin,
    createWar,
    respondToWar,
    refresh: fetchWars
  };
};
