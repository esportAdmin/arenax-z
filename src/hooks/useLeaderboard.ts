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

      const { data, error } = await (supabase as any)
        .from("leaderboard_global")
        .select("*")
        .limit(limit);

      if (error) {
        console.error("[leaderboard]", error);
        setError("Failed to load leaderboard");
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
    } catch (err) {
      console.error("[leaderboard crash]", err);
      setError("Unexpected error");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    load();

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
      const { data } = await (supabase as any)
        .from("badges")
        .select("*")
        .order("rarity", { ascending: false });

      setBadges(normalizeBadges(data));
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
      const { data } = await (supabase as any)
        .from("weekly_rewards")
        .select("*")
        .order("rank_from", { ascending: true });

      setRewards(
        (data ?? []).map((reward: any, index: number) => ({
          id: String(reward?.id ?? `weekly-reward-${index}`),
          rank_from: Number(reward?.rank_from ?? index + 1),
          rank_to: Number(reward?.rank_to ?? reward?.rank_from ?? index + 1),
          description: reward?.description ?? null,
          arena_points: Number(reward?.arena_points ?? 0),
        })),
      );
      setLoading(false);
    }

    void load();
  }, []);

  return { rewards, loading };
}
