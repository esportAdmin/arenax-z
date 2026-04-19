"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SeasonClubLeaderboardEntry {
  season_id: string;
  season_name: string;
  club_id: string;
  club_name: string;
  logo_url: string | null;
  total_xp: number;
  war_wins: number;
  war_losses: number;
  elo_rating: number;
  rank: number;
}

export function useSeasonLeaderboard() {
  const [data, setData] = useState<SeasonClubLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: result, error } = await (supabase as any)
        .from("active_season_club_leaderboard")
        .select("*")
        .order("rank", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      setData(
        (result ?? []).map((row: any) => ({
          season_id: row.season_id,
          season_name: row.season_name,
          club_id: row.club_id,
          club_name: row.club_name,
          logo_url: row.logo_url ?? null,
          total_xp: Number(row.total_xp ?? 0),
          war_wins: Number(row.war_wins ?? 0),
          war_losses: Number(row.war_losses ?? 0),
          elo_rating: Number(row.elo_rating ?? 0),
          rank: Number(row.rank ?? 0),
        })),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch season leaderboard",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    data,
    loading,
    error,
    refetch: fetchLeaderboard,
  };
}
