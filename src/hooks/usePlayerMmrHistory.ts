"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isLocalQaUser } from "@/lib/dev-auth";

export interface PlayerMmrHistoryPoint {
  id: string;
  war_id: string | null;
  mmr_before: number;
  mmr_after: number;
  mmr_delta: number;
  result: "win" | "loss";
  created_at: string;
}

export interface MmrHistorySummary {
  startMmr: number;
  currentMmr: number;
  netDelta: number;
  wins: number;
  losses: number;
  winRate: number;
  peakMmr: number;
  lowestMmr: number;
}

const FALLBACK_MMR_HISTORY: PlayerMmrHistoryPoint[] = [
  {
    id: "mmr-1",
    war_id: "war-1",
    mmr_before: 1710,
    mmr_after: 1734,
    mmr_delta: 24,
    result: "win",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "mmr-2",
    war_id: "war-2",
    mmr_before: 1734,
    mmr_after: 1716,
    mmr_delta: -18,
    result: "loss",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "mmr-3",
    war_id: "war-3",
    mmr_before: 1716,
    mmr_after: 1762,
    mmr_delta: 46,
    result: "win",
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "mmr-4",
    war_id: "war-4",
    mmr_before: 1762,
    mmr_after: 1840,
    mmr_delta: 78,
    result: "win",
    created_at: new Date().toISOString(),
  },
];

export function usePlayerMmrHistory(limit = 30) {
  const [data, setData] = useState<PlayerMmrHistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchHistory() {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (isLocalQaUser(user)) {
          if (!cancelled) {
            setData(FALLBACK_MMR_HISTORY);
            setLoading(false);
          }
          return;
        }

        if (!user) {
          if (!cancelled) {
            setData(FALLBACK_MMR_HISTORY);
            setError("Showing featured MMR history while ranked telemetry syncs.");
            setLoading(false);
          }
          return;
        }

        const safeLimit = Math.max(1, Math.min(100, limit));

        const { data: rows, error: rowsError } = await supabase
          .from("player_mmr_history")
          .select("id, war_id, mmr_before, mmr_after, mmr_delta, result, created_at")
          .eq("player_id", user.id)
          .order("created_at", { ascending: true })
          .limit(safeLimit);

        if (rowsError) throw rowsError;
        if (cancelled) return;

        const mappedRows = (rows ?? []).map((row) => ({
          id: String(row.id),
          war_id: row.war_id ? String(row.war_id) : null,
          mmr_before: Number(row.mmr_before),
          mmr_after: Number(row.mmr_after),
          mmr_delta: Number(row.mmr_delta),
          result: row.result as "win" | "loss",
          created_at: String(row.created_at),
        }));

        if (mappedRows.length === 0) {
          setData(FALLBACK_MMR_HISTORY);
          setError("Showing featured MMR history while ranked telemetry syncs.");
          return;
        }

        setData(mappedRows);
      } catch {
        if (!cancelled) {
          setData(FALLBACK_MMR_HISTORY);
          setError("Showing featured MMR history while ranked telemetry syncs.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchHistory();

    const channel = supabase
      .channel("mmr-history-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "player_mmr_history" },
        () => {
          if (!cancelled) void fetchHistory();
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [limit]);

  const summary = useMemo<MmrHistorySummary | null>(() => {
    if (data.length === 0) return null;

    const wins = data.filter((point) => point.result === "win").length;
    const losses = data.filter((point) => point.result === "loss").length;
    const allMmr = data.map((point) => point.mmr_after);

    return {
      startMmr: data[0].mmr_before,
      currentMmr: data[data.length - 1].mmr_after,
      netDelta: data[data.length - 1].mmr_after - data[0].mmr_before,
      wins,
      losses,
      winRate: data.length > 0 ? Math.round((wins / data.length) * 100) : 0,
      peakMmr: Math.max(...allMmr),
      lowestMmr: Math.min(...allMmr),
    };
  }, [data]);

  return { data, summary, loading, error };
}
