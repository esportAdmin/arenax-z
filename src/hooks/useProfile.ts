import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  arena_score: number;
  arena_balance: number;
  total_predictions: number;
  total_wins: number;
  active_streak: number;
  prediction_accuracy: number | null;
  current_xp: number;
  current_level: number;
  created_at: string;
}

export interface UserBadge {
  id: string;
  badge_id: string;
  earned_at: string;
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    category: string;
    arena_points_reward: number;
  };
}

export interface PredictionHistory {
  id: string;
  match_id: string;
  selected_team: string;
  stake_amount: number;
  potential_winnings: number;
  odds: number;
  status: string;
  created_at: string;
  resolved_at: string | null;
}

// Calculate XP needed for a given level
export function calculateXpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [predictions, setPredictions] = useState<PredictionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [xpForNextLevel, setXpForNextLevel] = useState(100);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserBadges();
      fetchPredictions();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error && data) {
      setProfile(data as UserProfile);
      setXpForNextLevel(calculateXpForLevel(data.current_level));
    }
    setLoading(false);
  };

  const fetchUserBadges = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        id,
        badge_id,
        earned_at,
        badge:badges (
          id,
          name,
          description,
          icon,
          rarity,
          category,
          arena_points_reward
        )
      `)
      .eq('user_id', user.id)
      .order('earned_at', { ascending: false });

    if (!error && data) {
      // Transform the data to match our interface
      const transformedData = data.map((item: any) => ({
        id: item.id,
        badge_id: item.badge_id,
        earned_at: item.earned_at,
        badge: item.badge
      }));
      setUserBadges(transformedData);
    }
  };

  const fetchPredictions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setPredictions(data);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return { error: new Error('No user or profile') };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (!error) {
      setProfile({ ...profile, ...updates });
    }

    return { error };
  };

  return {
    profile,
    userBadges,
    predictions,
    loading,
    xpForNextLevel,
    updateProfile,
    refetch: () => {
      fetchProfile();
      fetchUserBadges();
      fetchPredictions();
    }
  };
}
