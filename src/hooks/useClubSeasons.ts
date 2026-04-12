"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useClubSeasons() {
  const [season, setSeason] = useState<any>(null);
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSeason = async () => {
    setLoading(true);

    /* active season */

    const { data: seasonData } = await supabase
      .from("club_seasons")
      .select("*")
      .eq("status", "active")
      .maybeSingle();

    if (!seasonData) {
      setLoading(false);
      return;
    }

    setSeason(seasonData);

    /* rankings */

    const { data: rankingsData } = await supabase
      .from("club_season_rankings")
      .select(
        `
        id,
        total_xp,
        total_predictions,
        total_wins,
        rank,
        rewards_claimed,
        club:clubs (
          id,
          name,
          logo_url,
          member_count
        )
      `,
      )
      .eq("season_id", seasonData.id)
      .order("rank", { ascending: true });

    setRankings(rankingsData || []);
    setLoading(false);
  };

  const claimReward = async (rankingId: string) => {
    const { data, error } = await (supabase as any).rpc(
      "claim_club_season_reward",
      {
        p_ranking_id: rankingId,
      },
    );

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    await loadSeason();

    return data;
  };

  useEffect(() => {
    loadSeason();
  }, []);

  return {
    season,
    rankings,
    loading,
    claimReward,
    refresh: loadSeason,
  };
}
