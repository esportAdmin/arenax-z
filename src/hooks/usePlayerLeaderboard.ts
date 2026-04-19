"use client";

import { useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface PlayerLeaderboardEntry {
  rank: number;
  player_id: string;
  display_name: string;
  mmr: number;
  peak_mmr: number;
  total_games: number;
  total_wins: number;
  total_losses: number;
  current_win_streak: number;
  best_win_streak: number;
  isCurrentUser: boolean;
  rank_division?: number | null;
  rank_points?: number | null;
}

export interface PlayerGlobalPosition {
  rank: number;
  mmr: number;
  tier: string;
  source: "season" | "global";
}

interface PlayerLeaderboardData {
  entries: PlayerLeaderboardEntry[];
  currentUserId: string | null;
  currentUserPosition: PlayerGlobalPosition | null;
  page: number;
  pageSize: number;
  hasMore: boolean;
  source: "season" | "global";
  seasonId: string | null;
}

const USE_LIVE_PLAYER_LEADERBOARD =
  process.env.NEXT_PUBLIC_ENABLE_LIVE_PLAYER_LEADERBOARD === "true";

const FALLBACK_PLAYER_LEADERBOARD: PlayerLeaderboardEntry[] = [
  {
    rank: 1,
    player_id: "player-shadowking",
    display_name: "SHADOWKING",
    mmr: 2410,
    peak_mmr: 2460,
    total_games: 812,
    total_wins: 693,
    total_losses: 119,
    current_win_streak: 9,
    best_win_streak: 18,
    isCurrentUser: false,
    rank_division: 1,
    rank_points: 92,
  },
  {
    rank: 2,
    player_id: "player-phoenixlord",
    display_name: "PHOENIXLORD",
    mmr: 2335,
    peak_mmr: 2390,
    total_games: 784,
    total_wins: 654,
    total_losses: 130,
    current_win_streak: 6,
    best_win_streak: 14,
    isCurrentUser: false,
    rank_division: 1,
    rank_points: 74,
  },
  {
    rank: 3,
    player_id: "player-titanslayer",
    display_name: "TITANSLAYER",
    mmr: 2280,
    peak_mmr: 2310,
    total_games: 760,
    total_wins: 628,
    total_losses: 132,
    current_win_streak: 4,
    best_win_streak: 12,
    isCurrentUser: false,
    rank_division: 2,
    rank_points: 58,
  },
];

function resolveDisplayName(
  profile: Record<string, unknown> | null,
  playerId: string,
): string {
  for (const key of ["display_name", "username", "full_name"]) {
    const value = profile?.[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return `${playerId.slice(0, 8)}…`;
}

const RANKED_COLUMNS = `
  player_id,
  mmr,
  peak_mmr,
  total_games,
  total_wins,
  total_losses,
  current_win_streak,
  best_win_streak,
  rank_division,
  rank_points,
  updated_at
` as const;

function mapRow(
  row: Record<string, unknown>,
  index: number,
  from: number,
  currentUserId: string | null,
  profilesMap: Map<string, Record<string, unknown>>,
): PlayerLeaderboardEntry {
  const playerId = String(row.player_id ?? "");

  return {
    rank: from + index + 1,
    player_id: playerId,
    display_name: resolveDisplayName(profilesMap.get(playerId) ?? null, playerId),
    mmr: Number(row.mmr ?? 1000),
    peak_mmr: Number(row.peak_mmr ?? 1000),
    total_games: Number(row.total_games ?? 0),
    total_wins: Number(row.total_wins ?? 0),
    total_losses: Number(row.total_losses ?? 0),
    current_win_streak: Number(row.current_win_streak ?? 0),
    best_win_streak: Number(row.best_win_streak ?? 0),
    isCurrentUser: currentUserId === playerId,
    rank_division: row.rank_division != null ? Number(row.rank_division) : null,
    rank_points: row.rank_points != null ? Number(row.rank_points) : null,
  };
}

async function fetchProfilesMap(
  sb: SupabaseClient,
  playerIds: string[],
): Promise<Map<string, Record<string, unknown>>> {
  if (playerIds.length === 0) return new Map();

  const { data } = await sb
    .from("profiles")
    .select("id, username, display_name, full_name")
    .in("id", playerIds);

  const map = new Map<string, Record<string, unknown>>();
  for (const row of data ?? []) {
    map.set(String(row.id), row as Record<string, unknown>);
  }

  return map;
}

async function fetchCurrentUserPosition(
  sb: SupabaseClient,
  currentUserId: string,
  seasonId: string | null,
  source: "season" | "global",
): Promise<PlayerGlobalPosition | null> {
  try {
    const table =
      source === "season" ? "season_player_ranked_stats" : "player_ranked_stats";

    const ownQuery = sb.from(table).select("mmr").eq("player_id", currentUserId);
    if (source === "season" && seasonId) ownQuery.eq("season_id", seasonId);

    const { data: ownRow } = await ownQuery.maybeSingle();
    if (!ownRow) return null;

    const ownMmr = Number(ownRow.mmr ?? 1000);

    const countQuery = sb
      .from(table)
      .select("player_id", { count: "exact", head: true })
      .gt("mmr", ownMmr);

    if (source === "season" && seasonId) countQuery.eq("season_id", seasonId);

    const { count } = await countQuery;

    const tier =
      ownMmr >= 2000
        ? "diamond"
        : ownMmr >= 1600
          ? "platinum"
          : ownMmr >= 1200
            ? "gold"
            : ownMmr >= 900
              ? "silver"
              : "bronze";

    return {
      rank: (count ?? 0) + 1,
      mmr: ownMmr,
      tier,
      source,
    };
  } catch {
    return null;
  }
}

function buildFallbackData(
  page: number,
  pageSize: number,
): PlayerLeaderboardData {
  return {
    entries: FALLBACK_PLAYER_LEADERBOARD.slice(0, pageSize).map((entry, index) => ({
      ...entry,
      rank: index + 1,
    })),
    currentUserId: null,
    currentUserPosition: null,
    page,
    pageSize,
    hasMore: false,
    source: "global",
    seasonId: null,
  };
}

export function usePlayerLeaderboard(page = 1, pageSize = 25) {
  const [data, setData] = useState<PlayerLeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const safePage = useMemo(() => Math.max(1, page), [page]);
  const safePageSize = useMemo(
    () => Math.max(1, Math.min(100, pageSize)),
    [pageSize],
  );

  useEffect(() => {
    let cancelled = false;

    async function fetchLeaderboard() {
      setLoading(true);
      setError(null);

      try {
        if (!USE_LIVE_PLAYER_LEADERBOARD) {
          if (!cancelled) {
            setData(buildFallbackData(safePage, safePageSize));
          }
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        const currentUserId = user?.id ?? null;
        const from = (safePage - 1) * safePageSize;
        const to = from + safePageSize;

        const { data: activeSeason, error: seasonError } = await supabase
          .from("seasons")
          .select("id")
          .eq("is_active", true)
          .maybeSingle();

        if (seasonError) throw seasonError;

        const seasonId = activeSeason?.id ?? null;
        const source: "season" | "global" = seasonId ? "season" : "global";
        const table =
          source === "season"
            ? "season_player_ranked_stats"
            : "player_ranked_stats";

        const rowQuery = supabase
          .from(table)
          .select(RANKED_COLUMNS)
          .order("mmr", { ascending: false })
          .order("updated_at", { ascending: true })
          .range(from, to);

        if (source === "season" && seasonId) {
          rowQuery.eq("season_id", seasonId);
        }

        const [{ data: rows, error: rowsError }, userPosition] = await Promise.all([
          rowQuery,
          currentUserId
            ? fetchCurrentUserPosition(supabase, currentUserId, seasonId, source)
            : Promise.resolve(null),
        ]);

        if (rowsError) throw rowsError;
        if (cancelled) return;

        const allRows = (rows ?? []) as Record<string, unknown>[];
        if (allRows.length === 0) {
          setData(buildFallbackData(safePage, safePageSize));
          setError("Showing featured ranked ladder while live rankings sync.");
          return;
        }

        const hasMore = allRows.length > safePageSize;
        const pageRows = hasMore ? allRows.slice(0, safePageSize) : allRows;
        const playerIds = pageRows.map((row) => String(row.player_id ?? ""));
        const profilesMap = await fetchProfilesMap(supabase, playerIds);

        if (cancelled) return;

        setData({
          entries: pageRows.map((row, index) =>
            mapRow(row, index, from, currentUserId, profilesMap),
          ),
          currentUserId,
          currentUserPosition: userPosition,
          page: safePage,
          pageSize: safePageSize,
          hasMore,
          source,
          seasonId,
        });
      } catch {
        if (!cancelled) {
          setData(buildFallbackData(safePage, safePageSize));
          setError("Showing featured ranked ladder while live rankings sync.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchLeaderboard();

    if (!USE_LIVE_PLAYER_LEADERBOARD) {
      return () => {
        cancelled = true;
      };
    }

    const channel = supabase
      .channel(`leaderboard:p${safePage}:ps${safePageSize}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "player_ranked_stats" },
        () => {
          if (!cancelled) void fetchLeaderboard();
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "season_player_ranked_stats" },
        () => {
          if (!cancelled) void fetchLeaderboard();
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [safePage, safePageSize]);

  return { data, loading, error };
}
