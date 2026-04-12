"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface GlobalPlayerRankingItem {
  user_id: string;
  username: string;
  avatar_url: string | null;
  total_xp: number;
  contributions: number;
  rank: number;
}

export function useGlobalPlayerRanking() {
  const [players, setPlayers] = useState<GlobalPlayerRankingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data, error } = await supabase
        .from("global_player_ranking" as any)
        .select("*")
        .order("rank", { ascending: true });

      if (!mounted) return;

      if (error) {
        console.error("[useGlobalPlayerRanking]", error);
        setLoading(false);
        return;
      }

      setPlayers(
        ((data ?? []) as any[]).map((row) => ({
          user_id: row.user_id,
          username: row.username ?? "Anonymous",
          avatar_url: row.avatar_url ?? null,
          total_xp: Number(row.total_xp ?? 0),
          contributions: Number(row.contributions ?? 0),
          rank: Number(row.rank ?? 0),
        })),
      );

      setLoading(false);
    }

    load();

    const channel = supabase
      .channel("global-player-ranking-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "war_contributions",
        },
        () => {
          load();
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    players,
    loading,
  };
}
