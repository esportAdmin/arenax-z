"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface WarLeaderboardEntry {
  user_id: string;
  username: string | null;
  total_xp: number;
  contributions: number;
}

interface ReturnType {
  data: WarLeaderboardEntry[];
  loading: boolean;
  error: string | null;
}

export function useWarLeaderboard(warId: string | null): ReturnType {
  const [data, setData] = useState<WarLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!warId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await (supabase as any)
        .from("leaderboard_war")
        .select("*")
        .eq("war_id", warId)
        .order("total_xp", { ascending: false })
        .limit(10);

      if (error) {
        console.error("[war leaderboard]", error);
        setError("Failed to load war leaderboard");
        return;
      }

      const cleaned: WarLeaderboardEntry[] = (data ?? []).map((row: any) => ({
        user_id: row.user_id,
        username: row.username ?? "Anonymous",
        total_xp: Number(row.total_xp ?? 0),
        contributions: Number(row.contributions ?? 0),
      }));

      setData(cleaned);
    } catch (err) {
      console.error("[war leaderboard crash]", err);
      setError("Unexpected error");
    } finally {
      setLoading(false);
    }
  }, [warId]);

  useEffect(() => {
    load();

    const channel = supabase
      .channel(`war-leaderboard-${warId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "war_contributions",
          filter: `war_id=eq.${warId}`,
        },
        load,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load, warId]);

  return { data, loading, error };
}
