"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface RankedClubRow {
  club_id: string;
  club_name: string;
  logo_url: string | null;
  club_color: string;
  elo_rating: number;
  war_wins: number;
  war_losses: number;
  rank: number;
}

export function useRankedBoard() {
  const [data, setData] = useState<RankedClubRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await (supabase as any)
        .from("ranked_club_board")
        .select("*")
        .order("rank", { ascending: true });

      if (error) {
        console.error("[useRankedBoard]", error);
        setLoading(false);
        return;
      }

      setData(
        ((data ?? []) as any[]).map((row) => ({
          club_id: row.club_id,
          club_name: row.club_name,
          logo_url: row.logo_url ?? null,
          club_color: row.club_color ?? "#00d9ff",
          elo_rating: Number(row.elo_rating ?? 1000),
          war_wins: Number(row.war_wins ?? 0),
          war_losses: Number(row.war_losses ?? 0),
          rank: Number(row.rank ?? 0),
        })),
      );

      setLoading(false);
    }

    load();
  }, []);

  return { data, loading };
}
