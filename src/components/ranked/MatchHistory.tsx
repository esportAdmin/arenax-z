"use client";

import type { MatchHistoryItem } from "@/hooks/usePlayerRanked";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(new Date(iso));
  } catch { return "—"; }
}

function qualityTone(score: number | null): string {
  if (score == null) return "border-white/8 bg-white/4 text-white/40";
  if (score >= 80)   return "border-emerald-500/20 bg-emerald-500/8 text-emerald-300";
  if (score >= 60)   return "border-cyan-500/20 bg-cyan-500/8 text-cyan-300";
  if (score >= 40)   return "border-amber-500/20 bg-amber-500/8 text-amber-300";
  return "border-red-500/20 bg-red-500/8 text-red-300";
}

function deltaTone(delta: number | null): string {
  if (delta == null) return "text-white/35";
  if (delta > 0) return "text-emerald-400";
  if (delta < 0) return "text-red-400";
  return "text-white/50";
}

function formatDelta(delta: number | null): string {
  if (delta == null) return "— MMR";
  return `${delta > 0 ? "+" : ""}${delta} MMR`;
}

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

function StatCell({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-lg border border-white/6 bg-white/3 px-3 py-2">
      <div className="text-[9px] font-semibold uppercase tracking-widest text-white/25">{label}</div>
      <div className={`mt-0.5 text-xs font-bold ${tone ?? "text-white/70"}`}>{value}</div>
    </div>
  );
}

function OutcomeFlavorBadge({ flavor }: { flavor: MatchHistoryItem["outcomeFlavor"] }) {
  if (!flavor) return null;
  return (
    <span className="rounded-full border border-white/8 bg-white/4 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-white/40">
      {flavor}
    </span>
  );
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

interface Props {
  matches: MatchHistoryItem[];
  currentUserId?: string | null;
  loading?: boolean;
}

export function MatchHistory({ matches, currentUserId, loading = false }: Props) {
  void currentUserId;
  if (loading) return <MatchHistorySkeleton />;

  if (!matches || matches.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-white/8 bg-black/50 p-8 text-center backdrop-blur-xl">
        <div className="text-3xl">⚔️</div>
        <div className="mt-3 text-sm font-semibold text-white/40">No ranked matches yet</div>
        <div className="mt-1 text-xs text-white/25">
          Complete ranked wars to build your match history
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-black/50 backdrop-blur-xl">
      {/* Header */}
      <div className="border-b border-white/6 px-5 py-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400/60">
          Match History
        </div>
        <div className="mt-0.5 text-sm text-white/30">Last {matches.length} ranked results</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/4">
        {matches.map((match) => {
          const replayHref = match.territory_id
            ? `/wars/${match.territory_id}/replay`
            : `/replay/${match.id}`;

          return (
            <div
              key={match.id}
              className={`px-5 py-4 transition-colors ${
                match.isWin ? "hover:bg-emerald-500/4" : "hover:bg-red-500/3"
              }`}
            >
              {/* Row principale */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Gauche — résultat + rôle + date */}
                <div className="flex items-center gap-3">
                  <span
                    className={`w-[72px] rounded-lg py-1.5 text-center text-xs font-bold uppercase tracking-wider ${
                      match.isWin
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-red-500/12 text-red-400"
                    }`}
                  >
                    {match.isWin ? "Victory" : "Defeat"}
                  </span>

                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white/80">
                        {match.wasAttacker ? "Attacker" : "Defender"}
                      </span>
                      <OutcomeFlavorBadge flavor={match.outcomeFlavor} />
                    </div>
                    <div className="text-[10px] text-white/25">
                      {formatDate(match.created_at)}
                    </div>
                  </div>
                </div>

                {/* Droite — badges inline */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Match quality */}
                  <span
                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${qualityTone(match.match_quality_score)}`}
                  >
                    {match.match_quality_label ?? "Unknown"} · {match.match_quality_score ?? "—"}%
                  </span>

                  {/* Win chance */}
                  {match.expectedWinProbability != null && (
                    <span className="rounded-lg border border-white/8 bg-white/4 px-2.5 py-1 text-[11px] font-semibold text-white/55">
                      Win chance · {match.expectedWinProbability}%
                    </span>
                  )}

                  {/* MMR delta */}
                  <span
                    className={`rounded-lg border border-white/8 bg-white/4 px-2.5 py-1 text-[11px] font-bold tabular-nums ${deltaTone(match.mmrDelta)}`}
                  >
                    {formatDelta(match.mmrDelta)}
                  </span>

                  {/* Replay */}
                  <a
                    href={replayHref}
                    className="rounded-lg border border-white/8 bg-white/4 px-2.5 py-1 text-[11px] font-semibold text-white/45 transition hover:border-cyan-400/30 hover:text-cyan-300"
                  >
                    Replay ↗
                  </a>
                </div>
              </div>

              {/* Détail — grille 3 cellules */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                <StatCell
                  label="Expected outcome"
                  value={
                    match.outcomeFlavor === "Expected win"  ? "Favored"  :
                    match.outcomeFlavor === "Upset"         ? "Underdog" :
                    match.outcomeFlavor === "Expected loss" ? "Favored (D)" :
                    "Even"
                  }
                />
                <StatCell
                  label="Match quality"
                  value={match.match_quality_label ?? "Unknown"}
                  tone={qualityTone(match.match_quality_score).split(" ")[2]}
                />
                <StatCell
                  label="MMR resolved"
                  value={formatDelta(match.mmrDelta)}
                  tone={deltaTone(match.mmrDelta)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MatchHistorySkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-black/50 backdrop-blur-xl">
      <div className="border-b border-white/6 px-5 py-4">
        <div className="h-3 w-28 animate-pulse rounded-full bg-white/8" />
      </div>
      <div className="divide-y divide-white/4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-[72px] animate-pulse rounded-lg bg-white/8" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-3 w-24 animate-pulse rounded-full bg-white/8" />
                  <div className="h-2 w-16 animate-pulse rounded-full bg-white/5" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-7 w-28 animate-pulse rounded-lg bg-white/6" />
                <div className="h-7 w-20 animate-pulse rounded-lg bg-white/6" />
                <div className="h-7 w-20 animate-pulse rounded-lg bg-white/6" />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[1,2,3].map((j) => (
                <div key={j} className="h-12 animate-pulse rounded-lg bg-white/4" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
