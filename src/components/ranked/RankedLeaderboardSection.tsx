"use client";

/**
 * RankedLeaderboardSection
 * ─────────────────────────────────────────────
 * Composant autonome injecté dans leaderboard/page.tsx.
 * Réutilise usePlayerLeaderboard + PlayerLeaderboardTable existants.
 * Non-bloquant : erreur ou données vides → état gracieux, jamais de crash.
 */

import { useState } from "react";
import { usePlayerLeaderboard } from "@/hooks/usePlayerLeaderboard";
import {
  PlayerLeaderboardTable,
  PlayerLeaderboardTableSkeleton,
} from "@/components/ranked/PlayerLeaderboardTable";

const PAGE_SIZE = 10;

export function RankedLeaderboardSection() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = usePlayerLeaderboard(page, PAGE_SIZE);

  return (
    <section className="mt-16">
      {/* ── Séparateur + titre ── */}
      <div className="mb-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400/60">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            Live
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">
            Ranked MMR Ladder
          </h2>
          <p className="text-xs text-white/35">
            {data?.source === "season" ? "Active season" : "Global"} ·{" "}
            {data?.entries.length ?? "—"} players shown
          </p>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      </div>

      {/* ── Erreur non bloquante ── */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-300">
          <span className="font-semibold">Ranked data unavailable:</span>{" "}
          {error}
        </div>
      )}

      {/* ── Table ── */}
      {loading && !data ? (
        <PlayerLeaderboardTableSkeleton />
      ) : (
        <PlayerLeaderboardTable
          entries={data?.entries ?? []}
          loading={loading}
          page={page}
          pageSize={PAGE_SIZE}
          hasMore={data?.hasMore ?? false}
          currentUserPosition={data?.currentUserPosition ?? null}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => {
            if (data?.hasMore) setPage((p) => p + 1);
          }}
        />
      )}

      {/* ── Lien vers le leaderboard dédié ── */}
      <div className="mt-4 text-center">
        <a
          href="/ranked"
          className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/8 px-4 py-2 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-500/15"
        >
          View full ranked ladder →
        </a>
      </div>
    </section>
  );
}
