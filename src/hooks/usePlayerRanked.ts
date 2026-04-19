"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isLocalQaUser } from "@/lib/dev-auth";

export interface PlayerRankedStats {
  player_id: string;
  mmr: number;
  peak_mmr: number;
  total_games: number;
  total_wins: number;
  total_losses: number;
  current_win_streak: number;
  best_win_streak: number;
  rank_tier?: string | null;
  rank_division?: number | null;
  rank_points?: number | null;
  updated_at?: string | null;
}

export interface PlayerSeasonStats {
  season_id: string;
  player_id: string;
  mmr: number;
  peak_mmr: number;
  total_games: number;
  total_wins: number;
  total_losses: number;
  current_win_streak: number;
  best_win_streak: number;
  rank_tier?: string | null;
  rank_division?: number | null;
  rank_points?: number | null;
  placement_matches_played?: number | null;
  placement_complete?: boolean | null;
  demotion_protected_until?: string | null;
  updated_at?: string | null;
}

export interface WarHistoryRow {
  id: string;
  territory_id: string | null;
  challenger_id: string | null;
  defender_id: string | null;
  winner_club_id: string | null;
  attacker_player_id: string | null;
  defender_player_id: string | null;
  mmr_resolved: boolean | null;
  mmr_delta_attacker: number | null;
  mmr_delta_defender: number | null;
  match_quality_score: number | null;
  match_quality_label: string | null;
  win_probability_attacker: number | null;
  win_probability_defender: number | null;
  created_at: string;
}

export interface MatchHistoryItem extends WarHistoryRow {
  isWin: boolean;
  wasAttacker: boolean;
  mmrDelta: number | null;
  expectedWinProbability: number | null;
  outcomeFlavor: "Upset" | "Expected win" | "Expected loss" | "Even match" | null;
}

export interface PlayerRankedData {
  playerId: string;
  stats: PlayerRankedStats | null;
  seasonStats: PlayerSeasonStats | null;
  activeSeasonId: string | null;
  history: MatchHistoryItem[];
}

const GLOBAL_STATS_COLS = `
  player_id,
  mmr,
  peak_mmr,
  total_games,
  total_wins,
  total_losses,
  current_win_streak,
  best_win_streak,
  rank_tier,
  rank_division,
  rank_points,
  updated_at
` as const;

const SEASON_STATS_COLS = `
  season_id,
  player_id,
  mmr,
  peak_mmr,
  total_games,
  total_wins,
  total_losses,
  current_win_streak,
  best_win_streak,
  rank_tier,
  rank_division,
  rank_points,
  placement_matches_played,
  placement_complete,
  demotion_protected_until,
  updated_at
` as const;

const WAR_HISTORY_COLS = `
  id,
  territory_id,
  challenger_id,
  defender_id,
  winner_club_id,
  attacker_player_id,
  defender_player_id,
  mmr_resolved,
  mmr_delta_attacker,
  mmr_delta_defender,
  match_quality_score,
  match_quality_label,
  win_probability_attacker,
  win_probability_defender,
  created_at
` as const;

const FALLBACK_GLOBAL_STATS: PlayerRankedStats = {
  player_id: "demo-player",
  mmr: 1840,
  peak_mmr: 1920,
  total_games: 126,
  total_wins: 74,
  total_losses: 52,
  current_win_streak: 3,
  best_win_streak: 9,
  rank_tier: "platinum",
  rank_division: 2,
  rank_points: 61,
  updated_at: null,
};

const FALLBACK_SEASON_STATS: PlayerSeasonStats = {
  season_id: "demo-season",
  player_id: "demo-player",
  mmr: 1840,
  peak_mmr: 1920,
  total_games: 38,
  total_wins: 24,
  total_losses: 14,
  current_win_streak: 3,
  best_win_streak: 7,
  rank_tier: "platinum",
  rank_division: 2,
  rank_points: 61,
  placement_matches_played: 10,
  placement_complete: true,
  demotion_protected_until: null,
  updated_at: null,
};

const FALLBACK_HISTORY: MatchHistoryItem[] = [
  {
    id: "history-1",
    territory_id: "territory-germany",
    challenger_id: "club-shadow-legion",
    defender_id: "club-titan-force",
    winner_club_id: "club-shadow-legion",
    attacker_player_id: "demo-player",
    defender_player_id: "opponent-1",
    mmr_resolved: true,
    mmr_delta_attacker: 24,
    mmr_delta_defender: -24,
    match_quality_score: 82,
    match_quality_label: "high",
    win_probability_attacker: 46,
    win_probability_defender: 54,
    created_at: new Date().toISOString(),
    isWin: true,
    wasAttacker: true,
    mmrDelta: 24,
    expectedWinProbability: 46,
    outcomeFlavor: "Upset",
  },
  {
    id: "history-2",
    territory_id: "territory-us-east",
    challenger_id: "club-vanguard-elite",
    defender_id: "club-phoenix-rising",
    winner_club_id: "club-phoenix-rising",
    attacker_player_id: "opponent-2",
    defender_player_id: "demo-player",
    mmr_resolved: true,
    mmr_delta_attacker: 18,
    mmr_delta_defender: -18,
    match_quality_score: 75,
    match_quality_label: "medium",
    win_probability_attacker: 55,
    win_probability_defender: 45,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    isWin: false,
    wasAttacker: false,
    mmrDelta: -18,
    expectedWinProbability: 45,
    outcomeFlavor: "Even match",
  },
];

function enrichWarRow(war: WarHistoryRow, playerId: string): MatchHistoryItem {
  const wasAttacker = war.attacker_player_id === playerId;
  const myClubId = wasAttacker ? war.challenger_id : war.defender_id;
  const isWin = !!myClubId && war.winner_club_id === myClubId;

  const mmrDelta = wasAttacker ? war.mmr_delta_attacker : war.mmr_delta_defender;
  const expectedWinProbability = wasAttacker
    ? war.win_probability_attacker
    : war.win_probability_defender;

  let outcomeFlavor: MatchHistoryItem["outcomeFlavor"] = null;

  if (expectedWinProbability != null) {
    if (isWin && expectedWinProbability <= 40) outcomeFlavor = "Upset";
    else if (!isWin && expectedWinProbability >= 60) outcomeFlavor = "Expected loss";
    else if (isWin && expectedWinProbability >= 60) outcomeFlavor = "Expected win";
    else outcomeFlavor = "Even match";
  }

  return {
    ...war,
    isWin,
    wasAttacker,
    mmrDelta,
    expectedWinProbability,
    outcomeFlavor,
  };
}

function buildFallbackRankedData(playerId: string): PlayerRankedData {
  return {
    playerId,
    stats: {
      ...FALLBACK_GLOBAL_STATS,
      player_id: playerId,
    },
    seasonStats: {
      ...FALLBACK_SEASON_STATS,
      player_id: playerId,
    },
    activeSeasonId: FALLBACK_SEASON_STATS.season_id,
    history: FALLBACK_HISTORY.map((entry) => ({
      ...entry,
      attacker_player_id: entry.wasAttacker ? playerId : entry.attacker_player_id,
      defender_player_id: entry.wasAttacker ? entry.defender_player_id : playerId,
    })),
  };
}

export function usePlayerRanked() {
  const [data, setData] = useState<PlayerRankedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        const playerId = user?.id ?? "demo-player";

        if (isLocalQaUser(user)) {
          if (!cancelled) {
            setData(buildFallbackRankedData(playerId));
            setLoading(false);
          }
          return;
        }

        if (!user) {
          if (!cancelled) {
            setData(buildFallbackRankedData(playerId));
            setError("Showing featured ranked data while live ranked stats sync.");
            setLoading(false);
          }
          return;
        }

        const [statsResult, seasonIdResult] = await Promise.all([
          supabase
            .from("player_ranked_stats")
            .select(GLOBAL_STATS_COLS)
            .eq("player_id", playerId)
            .maybeSingle(),
          supabase
            .from("seasons")
            .select("id")
            .eq("is_active", true)
            .maybeSingle(),
        ]);

        if (statsResult.error) throw statsResult.error;
        if (cancelled) return;

        const activeSeasonId = seasonIdResult.data?.id ?? null;

        const [seasonResult, historyResult] = await Promise.all([
          activeSeasonId
            ? supabase
                .from("season_player_ranked_stats")
                .select(SEASON_STATS_COLS)
                .eq("season_id", activeSeasonId)
                .eq("player_id", playerId)
                .maybeSingle()
            : Promise.resolve({ data: null, error: null }),
          supabase
            .from("club_wars")
            .select(WAR_HISTORY_COLS)
            .or(`attacker_player_id.eq.${playerId},defender_player_id.eq.${playerId}`)
            .not("winner_club_id", "is", null)
            .order("created_at", { ascending: false })
            .limit(20),
        ]);

        if (cancelled) return;

        const history = ((historyResult.data ?? []) as WarHistoryRow[]).map((war) =>
          enrichWarRow(war, playerId),
        );

        setData({
          playerId,
          stats: (statsResult.data as PlayerRankedStats | null) ?? {
            ...FALLBACK_GLOBAL_STATS,
            player_id: playerId,
          },
          seasonStats: (seasonResult.data as PlayerSeasonStats | null) ?? {
            ...FALLBACK_SEASON_STATS,
            player_id: playerId,
          },
          activeSeasonId,
          history: history.length > 0 ? history : buildFallbackRankedData(playerId).history,
        });
      } catch {
        if (!cancelled) {
          setData(buildFallbackRankedData("demo-player"));
          setError("Showing featured ranked data while live ranked stats sync.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchData();

    const channel = supabase
      .channel("player-ranked-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "player_ranked_stats" },
        () => {
          if (!cancelled) void fetchData();
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "season_player_ranked_stats" },
        () => {
          if (!cancelled) void fetchData();
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "club_wars" },
        () => {
          if (!cancelled) void fetchData();
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return { data, loading, error };
}
