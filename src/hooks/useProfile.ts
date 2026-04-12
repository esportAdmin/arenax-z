import { useCallback, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { isLocalQaUser } from "@/lib/dev-auth";

export interface UserProfile {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  arena_score: number;
  arena_balance: number;
  total_live_calls: number;
  total_predictions: number;
  total_wins: number;
  active_streak: number;
  signal_accuracy: number | null;
  prediction_accuracy: number | null;
  current_xp: number;
  current_level: number;
  season_wins: number;
  last_season_rank: number | null;
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
    rarity: "common" | "rare" | "epic" | "legendary";
    category: string;
    arena_points_reward: number;
  };
}

export interface LiveCallHistory {
  id: string;
  match_id: string;
  selected_team: string;
  activityCommitment: number;
  projectedImpact: number;
  signalWeight: number;
  status: string;
  created_at: string;
  resolved_at: string | null;
}

type LegacyLiveCallHistory = {
  id: string;
  match_id: string;
  selected_team: string;
  stake_amount: number;
  potential_winnings: number;
  odds: number;
  status: string;
  created_at: string;
  resolved_at: string | null;
};

const FALLBACK_BADGES: UserBadge[] = [
  {
    id: "qa-badge-1",
    badge_id: "legendary-shotcaller",
    earned_at: new Date().toISOString(),
    badge: {
      id: "legendary-shotcaller",
      name: "Legendary Shotcaller",
      description: "Recognized for guiding high-pressure plays.",
      icon: "crown",
      rarity: "legendary",
      category: "leadership",
      arena_points_reward: 500,
    },
  },
  {
    id: "qa-badge-2",
    badge_id: "daily-grinder",
    earned_at: new Date(Date.now() - 86400000).toISOString(),
    badge: {
      id: "daily-grinder",
      name: "Daily Grinder",
      description: "Showed up often enough to build real momentum.",
      icon: "flame",
      rarity: "epic",
      category: "consistency",
      arena_points_reward: 250,
    },
  },
];

const FALLBACK_LIVE_CALLS: LiveCallHistory[] = [
  {
    id: "qa-prediction-1",
    match_id: "match-valorant-1",
    selected_team: "Nova Prime",
    activityCommitment: 150,
    projectedImpact: 285,
    signalWeight: 1.9,
    status: "won",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    resolved_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "qa-prediction-2",
    match_id: "match-lol-2",
    selected_team: "Titan Force",
    activityCommitment: 200,
    projectedImpact: 360,
    signalWeight: 1.8,
    status: "pending",
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    resolved_at: null,
  },
];

// XP formula
export function calculateXpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

function mapLegacyLiveCall(row: LegacyLiveCallHistory): LiveCallHistory {
  return {
    id: row.id,
    match_id: row.match_id,
    selected_team: row.selected_team,
    activityCommitment: row.stake_amount,
    projectedImpact: row.potential_winnings,
    signalWeight: row.odds,
    status: row.status,
    created_at: row.created_at,
    resolved_at: row.resolved_at,
  };
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [liveCalls, setLiveCalls] = useState<LiveCallHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [xpForNextLevel, setXpForNextLevel] = useState(100);
  const isLocalQa = isLocalQaUser(user);

  const fetchProfile = useCallback(async () => {
    if (!user) return;

    if (isLocalQa) {
      setProfile({
        id: user.id,
        display_name:
          user.user_metadata?.display_name ??
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          "ArenaX QA Operator",
        username:
          user.user_metadata?.user_name ??
          user.user_metadata?.preferred_username ??
          "qa_operator",
        avatar_url: user.user_metadata?.avatar_url ?? null,
        arena_score: 12450,
        arena_balance: 3275,
        total_live_calls: 48,
        total_predictions: 48,
        total_wins: 31,
        active_streak: 6,
        signal_accuracy: 64.6,
        prediction_accuracy: 64.6,
        current_xp: 1420,
        current_level: 8,
        season_wins: 17,
        last_season_rank: 42,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
      });
      setXpForNextLevel(calculateXpForLevel(8));
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
        id,
        display_name,
        username,
        avatar_url,
        arena_score,
        arena_balance,
        total_predictions,
        total_wins,
        active_streak,
        prediction_accuracy,
        current_xp,
        current_level,
        season_wins,
        last_season_rank,
        created_at
      `,
      )
      .eq("id", user.id)
      .single();

    if (error || !data) {
      setProfile({
        id: user.id,
        display_name:
          user.user_metadata?.display_name ??
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          user.email?.split("@")[0] ??
          "ArenaX Player",
        username:
          user.user_metadata?.user_name ??
          user.user_metadata?.preferred_username ??
          user.email?.split("@")[0] ??
          "player",
        avatar_url: user.user_metadata?.avatar_url ?? null,
        arena_score: 0,
        arena_balance: 0,
        total_live_calls: 0,
        total_predictions: 0,
        total_wins: 0,
        active_streak: 0,
        signal_accuracy: 0,
        prediction_accuracy: 0,
        current_xp: 0,
        current_level: 1,
        season_wins: 0,
        last_season_rank: null,
        created_at: new Date().toISOString(),
      });
      setLoading(false);
      return;
    }

    // 🔥 Cast sécurisé pour éviter erreur TS
    const safeProfile = data as unknown as UserProfile;

    setProfile({
      ...safeProfile,
      total_live_calls: safeProfile.total_predictions ?? 0,
      signal_accuracy: safeProfile.prediction_accuracy ?? 0,
      season_wins: safeProfile.season_wins ?? 0,
      last_season_rank: safeProfile.last_season_rank ?? null,
    });

    setXpForNextLevel(calculateXpForLevel(safeProfile.current_level));
    setLoading(false);
  }, [isLocalQa, user]);

  const fetchUserBadges = useCallback(async () => {
    if (!user) return;

    if (isLocalQa) {
      setUserBadges(FALLBACK_BADGES);
      return;
    }

    const { data, error } = await supabase
      .from("user_badges")
      .select(
        `
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
      `,
      )
      .eq("user_id", user.id)
      .order("earned_at", { ascending: false });

    if (!error && data) {
      const transformedData = data.map((item: any) => ({
        id: item.id,
        badge_id: item.badge_id,
        earned_at: item.earned_at,
        badge: item.badge,
      }));
      setUserBadges(transformedData);
    }
  }, [isLocalQa, user]);

  const fetchLiveCalls = useCallback(async () => {
    if (!user) return;

    if (isLocalQa) {
      setLiveCalls(FALLBACK_LIVE_CALLS);
      return;
    }

    const { data, error } = await supabase
      .from("predictions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setLiveCalls((data as LegacyLiveCallHistory[]).map(mapLegacyLiveCall));
    }
  }, [isLocalQa, user]);

  useEffect(() => {
    if (user) {
      void fetchProfile();
      void fetchUserBadges();
      void fetchLiveCalls();
    } else {
      setLoading(false);
    }
  }, [user, fetchProfile, fetchUserBadges, fetchLiveCalls]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return { error: new Error("No user or profile") };

    if (isLocalQa) {
      setProfile({ ...profile, ...updates });
      return { error: null };
    }

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (!error) {
      setProfile({ ...profile, ...updates });
    }

    return { error };
  };

  return {
    profile,
    userBadges,
    liveCalls,
    loading,
    xpForNextLevel,
    updateProfile,
    refetch: () => {
      fetchProfile();
      fetchUserBadges();
      fetchLiveCalls();
    },
  };
}
