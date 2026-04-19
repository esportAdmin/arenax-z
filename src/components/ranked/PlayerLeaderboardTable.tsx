"use client";

import {
  getRankFromMmr,
  formatDivision,
  getTierDisplay,
} from "@/lib/ranked/rankSystem";
import type {
  PlayerLeaderboardEntry,
  PlayerGlobalPosition,
} from "@/hooks/usePlayerLeaderboard";

// ─────────────────────────────────────────────
// TYPES & CONSTANTS
// ─────────────────────────────────────────────

interface Props {
  entries: PlayerLeaderboardEntry[];
  loading?: boolean;
  page: number;
  pageSize: number;
  hasMore: boolean;
  /** Position globale du joueur — affichée même si hors page */
  currentUserPosition?: PlayerGlobalPosition | null;
  onPrev: () => void;
  onNext: () => void;
}

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-lg leading-none">🥇</span>;
  if (rank === 2) return <span className="text-lg leading-none">🥈</span>;
  if (rank === 3) return <span className="text-lg leading-none">🥉</span>;
  return (
    <span className="text-sm font-bold tabular-nums text-white/50">
      #{rank}
    </span>
  );
}

function winrateOf(entry: PlayerLeaderboardEntry): number {
  if (entry.total_games <= 0) return 0;
  return Math.round((entry.total_wins / entry.total_games) * 100);
}

/** Bannière "Your Position" — toujours visible même hors page */
function GlobalPositionBanner({
  position,
}: {
  position: PlayerGlobalPosition;
}) {
  const tierLabel =
    position.tier.charAt(0).toUpperCase() + position.tier.slice(1);
  const tierColor =
    position.tier === "diamond"
      ? "text-violet-300"
      : position.tier === "platinum"
        ? "text-cyan-300"
        : position.tier === "gold"
          ? "text-yellow-400"
          : position.tier === "silver"
            ? "text-slate-300"
            : "text-amber-500";

  return (
    <div className="mb-4 flex items-center justify-between rounded-xl border border-cyan-400/20 bg-cyan-500/8 px-5 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
        <span className="text-sm font-semibold text-cyan-200">Your Position</span>
        <span className={`text-sm font-bold ${tierColor}`}>{tierLabel}</span>
        <span className="text-sm tabular-nums text-white/50">
          {position.mmr.toLocaleString()} MMR
        </span>
      </div>
      <div className="text-sm font-black text-white/70">
        Rank #{position.rank.toLocaleString()}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────

export function PlayerLeaderboardTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-black/50 backdrop-blur-xl">
      <div className="border-b border-white/6 px-5 py-4">
        <div className="h-3 w-32 animate-pulse rounded-full bg-white/8" />
        <div className="mt-2 h-3 w-20 animate-pulse rounded-full bg-white/6" />
      </div>
      <div className="divide-y divide-white/4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-5 py-3.5"
          >
            <div className="h-4 w-8 animate-pulse rounded-full bg-white/8" />
            <div className="h-4 flex-1 animate-pulse rounded-full bg-white/8" />
            <div className="h-4 w-24 animate-pulse rounded-full bg-white/8" />
            <div className="hidden h-4 w-14 animate-pulse rounded-full bg-white/6 md:block" />
            <div className="hidden h-4 w-14 animate-pulse rounded-full bg-white/6 md:block" />
            <div className="hidden h-4 w-10 animate-pulse rounded-full bg-white/6 md:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TABLE
// ─────────────────────────────────────────────

export function PlayerLeaderboardTable({
  entries,
  loading = false,
  page,
  pageSize,
  hasMore,
  currentUserPosition,
  onPrev,
  onNext,
}: Props) {
  if (loading) return <PlayerLeaderboardTableSkeleton />;

  const isUserOnPage = entries.some((e) => e.isCurrentUser);

  return (
    <div>
      {/* Bannière position globale — uniquement si hors page visible */}
      {currentUserPosition && !isUserOnPage && (
        <GlobalPositionBanner position={currentUserPosition} />
      )}

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-white/8 bg-black/50 p-10 text-center backdrop-blur-xl">
          <div className="text-4xl">🏆</div>
          <div className="mt-4 text-sm font-semibold text-white/40">
            No ranked players yet
          </div>
          <div className="mt-1 text-xs text-white/25">
            Complete ranked matches to appear here
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/8 bg-black/50 backdrop-blur-xl">
          {/* ── Header ── */}
          <div className="flex items-center justify-between border-b border-white/6 px-5 py-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400/60">
                Ranked Ladder
              </div>
              <div className="mt-0.5 text-sm text-white/35">
                Page {page} · {pageSize} players
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPrev}
                disabled={page <= 1}
                className="rounded-lg border border-white/10 bg-white/4 px-3 py-1.5 text-xs font-semibold text-white/50 transition-all hover:border-white/20 hover:text-white/80 disabled:cursor-not-allowed disabled:opacity-30"
              >
                ← Prev
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={!hasMore}
                className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition-all hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          </div>

          {/* ── Column headers ── */}
          <div className="hidden grid-cols-[60px_1fr_140px_90px_90px_100px] gap-4 border-b border-white/4 px-5 py-2.5 md:grid">
            {["Rank", "Player", "Tier / MMR", "Games", "Winrate", "Streak"].map(
              (h) => (
                <div
                  key={h}
                  className="text-[10px] font-semibold uppercase tracking-widest text-white/25"
                >
                  {h}
                </div>
              ),
            )}
          </div>

          {/* ── Rows ── */}
          <div className="divide-y divide-white/4">
            {entries.map((entry) => {
              // Phase 7 — rang dérivé du MMR via rankSystem
              // Priorité : valeurs DB si disponibles, sinon calcul côté client
              const derived = getRankFromMmr(entry.mmr);
              const tier     = derived.tier;
              const division = entry.rank_division ?? derived.division;
              const lp       = entry.rank_points   ?? derived.points;
              const cfg      = getTierDisplay(tier);
              const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
              const winrate = winrateOf(entry);
              const isTop3 = entry.rank <= 3;

              return (
                <div
                  key={entry.player_id}
                  className={`
                    grid grid-cols-1 gap-3 px-5 py-3.5 transition-colors
                    md:grid-cols-[60px_1fr_140px_90px_90px_100px] md:items-center
                    ${
                      entry.isCurrentUser
                        ? "bg-cyan-500/8 hover:bg-cyan-500/12"
                        : isTop3
                          ? "bg-white/3 hover:bg-white/5"
                          : "hover:bg-white/3"
                    }
                  `}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center">
                    <RankBadge rank={entry.rank} />
                  </div>

                  {/* Player */}
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold ${
                          isTop3 ? "text-white" : "text-white/80"
                        }`}
                      >
                        {entry.display_name}
                      </span>
                      {entry.isCurrentUser && (
                        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-cyan-300">
                          You
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-[10px] text-white/20">
                      {entry.player_id.slice(0, 12)}…
                    </div>
                  </div>

                  {/* Tier / MMR */}
                  <div className="flex flex-col gap-0.5">
                    <span
                      className={`inline-flex w-fit items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold shadow ${cfg.badge} ${cfg.color} ${cfg.glow}`}
                    >
                      {tierLabel}
                      {tier !== "diamond" && (
                        <span className="opacity-70">{formatDivision(division)}</span>
                      )}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] tabular-nums text-white/50">
                      <span>{entry.mmr.toLocaleString()} MMR</span>
                      <span className="text-white/20">·</span>
                      <span className={cfg.color}>{lp} LP</span>
                    </div>
                  </div>

                  {/* Games */}
                  <div className="text-sm tabular-nums text-white/55">
                    {entry.total_games}
                  </div>

                  {/* Winrate */}
                  <div className="flex flex-col gap-1">
                    <div
                      className={`text-sm font-semibold tabular-nums ${
                        winrate >= 60
                          ? "text-emerald-400"
                          : winrate >= 50
                            ? "text-white/70"
                            : "text-red-400/70"
                      }`}
                    >
                      {winrate}%
                    </div>
                    <div className="h-0.5 w-16 overflow-hidden rounded-full bg-white/8">
                      <div
                        className={`h-full rounded-full ${
                          winrate >= 60
                            ? "bg-emerald-400"
                            : winrate >= 50
                              ? "bg-white/40"
                              : "bg-red-400/60"
                        }`}
                        style={{ width: `${Math.min(100, winrate)}%` }}
                      />
                    </div>
                  </div>

                  {/* Streak */}
                  <div className="flex items-center gap-1.5">
                    {entry.current_win_streak > 0 ? (
                      <>
                        <span className="text-xs text-amber-400/70">🔥</span>
                        <span className="text-sm font-bold text-amber-400">
                          +{entry.current_win_streak}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-white/25">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
