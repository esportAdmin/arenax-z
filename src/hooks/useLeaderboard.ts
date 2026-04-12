"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Badge } from "@/components/leaderboard/BadgeDisplay";

export interface LeaderboardEntry {
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  total_xp: number;
  contributions: number;
  arena_score: number;
  rank: number;
  tier: string;
  badges: Badge[];
  nextTier: string | null;
  progressPercent: number;
  total_predictions: number;
  prediction_accuracy: number;
  change: number;
}

export interface WeeklyReward {
  id: string;
  rank_from: number;
  rank_to: number;
  description: string | null;
  arena_points: number;
}

interface UseLeaderboardReturn {
  data: LeaderboardEntry[];
  entries: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const USE_STATIC_LEADERBOARD = process.env.NODE_ENV !== "production";

const FALLBACK_LEADERBOARD: LeaderboardEntry[] = [
  {
    user_id: "player-shadowking",
    username: "SHADOWKING",
    display_name: "SHADOWKING",
    avatar_url: null,
    total_xp: 125800,
    contributions: 45280,
    arena_score: 125800,
    rank: 1,
    tier: "diamond",
    badges: [],
    nextTier: null,
    progressPercent: 100,
    total_predictions: 820,
    prediction_accuracy: 89,
    change: 2,
  },
  {
    user_id: "player-phoenixlord",
    username: "PHOENIXLORD",
    display_name: "PHOENIXLORD",
    avatar_url: null,
    total_xp: 123500,
    contributions: 42750,
    arena_score: 123500,
    rank: 2,
    tier: "diamond",
    badges: [],
    nextTier: null,
    progressPercent: 100,
    total_predictions: 801,
    prediction_accuracy: 87,
    change: 1,
  },
  {
    user_id: "player-titanslayer",
    username: "TITANSLAYER",
    display_name: "TITANSLAYER",
    avatar_url: null,
    total_xp: 121200,
    contributions: 40890,
    arena_score: 121200,
    rank: 3,
    tier: "diamond",
    badges: [],
    nextTier: null,
    progressPercent: 100,
    total_predictions: 760,
    prediction_accuracy: 85,
    change: 0,
  },
];

const FALLBACK_BADGES: Badge[] = [
  {
    id: "badge-legend",
    name: "Legendary Contributor",
    description: "Stayed active across every prime-time reset window.",
    icon: "🏆",
    category: "prestige",
    rarity: "legendary",
    arena_points_reward: 500,
  },
  {
    id: "badge-strategist",
    name: "Master Strategist",
    description: "Built a stable prediction hit rate above the pack.",
    icon: "🧠",
    category: "prediction",
    rarity: "epic",
    arena_points_reward: 250,
  },
];

const FALLBACK_WEEKLY_REWARDS: WeeklyReward[] = [
  { id: "reward-1", rank_from: 1, rank_to: 1, description: "Elite weekly crown", arena_points: 5000 },
  { id: "reward-2", rank_from: 2, rank_to: 10, description: "Top 10 prestige bundle", arena_points: 2500 },
  { id: "reward-3", rank_from: 11, rank_to: 25, description: "Climb bonus crate", arena_points: 1000 },
];

function normalizeBadges(raw: any): Badge[] {
  if (!Array.isArray(raw)) return [];

  return raw.map((badge: any, index: number) => ({
    id: String(badge?.id ?? `badge-${index}`),
    name: String(badge?.name ?? "Badge"),
    description: String(badge?.description ?? ""),
    icon: String(badge?.icon ?? "🏆"),
    category: String(badge?.category ?? "general"),
    rarity: String(badge?.rarity ?? "common"),
    arena_points_reward: Number(badge?.arena_points_reward ?? 0),
  }));
}

export function useLeaderboard(limit: number = 10): UseLeaderboardReturn {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_STATIC_LEADERBOARD) {
        setData(FALLBACK_LEADERBOARD.slice(0, limit));
        return;
      }

      const { data, error } = await (supabase as any)
        .from("leaderboard_global")
        .select("*")
        .limit(limit);

      if (error) {
        setData(FALLBACK_LEADERBOARD.slice(0, limit));
        setError("Showing featured leaderboard while live rankings sync.");
        return;
      }

      const cleaned: LeaderboardEntry[] = (data ?? []).map(
        (row: any, index: number) => ({
          user_id: row.user_id,
          username: row.username ?? "Anonymous",
          display_name: row.display_name ?? row.username ?? "Anonymous",
          avatar_url: row.avatar_url ?? null,
          total_xp: Number(row.total_xp ?? 0),
          contributions: Number(row.contributions ?? 0),
          arena_score: Number(row.arena_score ?? row.total_xp ?? 0),
          rank: Number(row.rank ?? index + 1),
          tier: String(row.tier ?? "bronze"),
          badges: normalizeBadges(row.badges),
          nextTier: row.next_tier ?? null,
          progressPercent: Number(row.progress_percent ?? 0),
          total_predictions: Number(row.total_predictions ?? 0),
          prediction_accuracy: Number(row.prediction_accuracy ?? 0),
          change: Number(row.change ?? 0),
        }),
      );

      setData(cleaned);
    } catch {
      setData(FALLBACK_LEADERBOARD.slice(0, limit));
      setError("Showing featured leaderboard while live rankings sync.");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    load();

    if (USE_STATIC_LEADERBOARD) {
      return;
    }

    const channel = supabase
      .channel("leaderboard-live")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "war_contributions",
        },
        load,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  return {
    data,
    entries: data,
    loading,
    error,
    refetch: load,
  };
}

export function useBadges() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (USE_STATIC_LEADERBOARD) {
        setBadges(FALLBACK_BADGES);
        setLoading(false);
        return;
      }

      const { data } = await (supabase as any)
        .from("badges")
        .select("*")
        .order("rarity", { ascending: false });

      setBadges(data && data.length > 0 ? normalizeBadges(data) : FALLBACK_BADGES);
      setLoading(false);
    }

    void load();
  }, []);

  return { badges, loading };
}

export function useWeeklyRewards() {
  const [rewards, setRewards] = useState<WeeklyReward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (USE_STATIC_LEADERBOARD) {
        setRewards(FALLBACK_WEEKLY_REWARDS);
        setLoading(false);
        return;
      }

      const { data } = await (supabase as any)
        .from("weekly_rewards")
        .select("*")
        .order("rank_from", { ascending: true });

      if (!data || data.length === 0) {
        setRewards(FALLBACK_WEEKLY_REWARDS);
      } else {
        setRewards(
          data.map((reward: any, index: number) => ({
            id: String(reward?.id ?? `weekly-reward-${index}`),
            rank_from: Number(reward?.rank_from ?? index + 1),
            rank_to: Number(reward?.rank_to ?? reward?.rank_from ?? index + 1),
            description: reward?.description ?? null,
            arena_points: Number(reward?.arena_points ?? 0),
          })),
        );
      }
      setLoading(false);
    }

    void load();
  }, []);

  return { rewards, loading };
}
