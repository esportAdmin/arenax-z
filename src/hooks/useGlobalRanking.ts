"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface GlobalClubRanking {
  club_id: string;
  club_name: string;
  logo_url: string | null;
  total_xp: number;
  territories: number;
  rank: number;
}

export function useGlobalRanking() {
  const [data, setData] = useState<GlobalClubRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRanking = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: result, error } = await (supabase as any)
        .from("global_club_ranking")
        .select("*")
        .order("rank", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      setData(
        (result ?? []).map((row: any) => ({
          club_id: row.club_id,
          club_name: row.club_name,
          logo_url: row.logo_url ?? null,
          total_xp: Number(row.total_xp ?? 0),
          territories: Number(row.territories ?? 0),
          rank: Number(row.rank ?? 0),
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch ranking");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRanking();
  }, [fetchRanking]);

  useEffect(() => {
    const channel = supabase
      .channel("global-ranking-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "club_season_stats",
        },
        () => {
          fetchRanking();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRanking]);

  return {
    data,
    loading,
    error,
    refetch: fetchRanking,
  };
}
