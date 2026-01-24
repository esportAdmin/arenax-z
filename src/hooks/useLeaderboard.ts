// src/hooks/useLeaderboard.ts
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

// Public leaderboard entry - only non-sensitive fields from the public_leaderboard view
interface PublicLeaderboardProfile {
  user_id: string | null;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  arena_score: number | null;
  total_predictions: number | null;
  total_wins: number | null;
  prediction_accuracy: number | null;
  active_streak: number | null;
  current_level: number | null;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  arena_points_reward: number;
}

interface WeeklyReward {
  id: string;
  rank_from: number;
  rank_to: number;
  arena_points: number;
  description: string | null;
}

export interface LeaderboardEntry extends Omit<
  PublicLeaderboardProfile,
  "user_id"
> {
  user_id: string;
  rank: number;
  change: number;
  badges: Badge[];
}

/**
 * Type guard: keep only rows with a non-empty user_id.
 *
 * @example
 * const rows = (data ?? []).filter(hasUserId);
 */
function hasUserId(
  p: PublicLeaderboardProfile,
): p is PublicLeaderboardProfile & { user_id: string } {
  return typeof p.user_id === "string" && p.user_id.length > 0;
}

/**
 * Type guard: remove null/undefined from arrays.
 *
 * @example
 * [null, "a"].filter(isNonNullable); // ["a"]
 */
function isNonNullable<T>(v: T | null | undefined): v is T {
  return v !== null && v !== undefined;
}

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    setError(null);

    try {
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from("public_leaderboard")
        .select("*")
        .order("arena_score", { ascending: false, nullsFirst: false })
        .limit(100);

      if (leaderboardError) throw leaderboardError;

      const rows = (leaderboardData ?? []).filter(hasUserId);
      const userIds = rows.map((p) => p.user_id);

      // Fetch user badges for all users
      const { data: userBadges } = await supabase
        .from("user_badges")
        .select(
          `
          id,
          user_id,
          badge_id,
          earned_at,
          badges (*)
        `,
        )
        .in("user_id", userIds);

      // Map badges to users
      const badgesByUser = new Map<string, Badge[]>();
      (userBadges ?? []).forEach((ub: any) => {
        const userId: string | null | undefined = ub?.user_id;
        if (!userId) return;

        if (!badgesByUser.has(userId)) badgesByUser.set(userId, []);
        if (ub?.badges) badgesByUser.get(userId)?.push(ub.badges as Badge);
      });

      const entriesWithRank: LeaderboardEntry[] = rows.map(
        (profile, index) => ({
          ...profile,
          user_id: profile.user_id,
          rank: index + 1,
          change: Math.floor(Math.random() * 7) - 3, // Simulated change for now
          badges: badgesByUser.get(profile.user_id) ?? [],
        }),
      );

      setEntries(entriesWithRank);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch leaderboard",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLeaderboard();

    // Subscribe to realtime updates on public_leaderboard view
    const channel = supabase
      .channel("leaderboard-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "public_leaderboard",
        },
        (
          _payload: RealtimePostgresChangesPayload<PublicLeaderboardProfile>,
        ) => {
          void fetchLeaderboard();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLeaderboard]);

  return { entries, loading, error, refetch: fetchLeaderboard };
}

export function useBadges() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      const { data } = await supabase
        .from("badges")
        .select("*")
        .order("rarity", { ascending: true });

      setBadges((data ?? []).filter(isNonNullable) as Badge[]);
      setLoading(false);
    };

    void fetchBadges();
  }, []);

  return { badges, loading };
}

export function useWeeklyRewards() {
  const [rewards, setRewards] = useState<WeeklyReward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      const { data } = await supabase
        .from("weekly_rewards")
        .select("*")
        .eq("active", true)
        .order("rank_from", { ascending: true });

      setRewards((data ?? []).filter(isNonNullable) as WeeklyReward[]);
      setLoading(false);
    };

    void fetchRewards();
  }, []);

  return { rewards, loading };
}
