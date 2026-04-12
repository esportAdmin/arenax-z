"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface GlobalPlayerRanking {
  user_id: string;
  username: string;
  avatar_url: string | null;
  total_xp: number;
  contributions: number;
  rank: number;
}

export function useTopPlayersGlobal() {
  const [data, setData] = useState<GlobalPlayerRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: result, error } = await (supabase as any)
        .from("global_player_ranking")
        .select("*")
        .order("rank", { ascending: true })
        .limit(20);

      if (error) {
        throw new Error(error.message);
      }

      setData(
        (result ?? []).map((row: any) => ({
          user_id: row.user_id,
          username: row.username ?? "Anonymous",
          avatar_url: row.avatar_url ?? null,
          total_xp: Number(row.total_xp ?? 0),
          contributions: Number(row.contributions ?? 0),
          rank: Number(row.rank ?? 0),
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch players");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  useEffect(() => {
    const channel = supabase
      .channel("global-players-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "war_contributions",
        },
        () => {
          fetchPlayers();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPlayers]);

  return {
    data,
    loading,
    error,
    refetch: fetchPlayers,
  };
}
