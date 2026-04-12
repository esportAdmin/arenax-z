"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface GuildTournamentEntry {
  tournament_id: string;
  tournament_name: string;
  status: string;
  club_id: string;
  club_name: string;
  logo_url: string | null;
  points: number;
  wins: number;
  losses: number;
  rank: number;
}

export function useGuildTournaments() {
  const [entries, setEntries] = useState<GuildTournamentEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);

    const { data, error } = await (supabase as any)
      .from("active_guild_tournament_board")
      .select("*")
      .order("tournament_id", { ascending: true })
      .order("rank", { ascending: true });

    if (error) {
      console.error("[useGuildTournaments]", error);
      setEntries([]);
      setLoading(false);
      return;
    }

    setEntries(
      (data ?? []).map((row: any) => ({
        tournament_id: row.tournament_id,
        tournament_name: row.tournament_name,
        status: row.status,
        club_id: row.club_id,
        club_name: row.club_name,
        logo_url: row.logo_url ?? null,
        points: Number(row.points ?? 0),
        wins: Number(row.wins ?? 0),
        losses: Number(row.losses ?? 0),
        rank: Number(row.rank ?? 0),
      })),
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    entries,
    loading,
    refetch: load,
  };
}
