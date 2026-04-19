"use client";
import {
  getRankFromMmr,
  formatDivision,
  mmrToNextTier,
  type RankTier,
} from "@/lib/ranked/rankSystem";
import { PROGRESSION_CONFIG } from "@/lib/ranked/rankProgression";
import type { PlayerRankedStats } from "@/hooks/usePlayerRanked";

// ============================================================
// CONFIG — design ArenaX original préservé
// ============================================================

const TIER_CONFIG: Record<RankTier, {
  label:  string;
  color:  string;
  border: string;
  glow:   string;
  badge:  string;
  icon:   string;
}> = {
  bronze:   { label: "Bronze",   color: "text-amber-600",  border: "border-amber-700/50",  glow: "rgba(180,83,9,0.35)",   badge: "bg-amber-900/40",  icon: "🥉" },
  silver:   { label: "Silver",   color: "text-slate-300",  border: "border-slate-400/50",  glow: "rgba(148,163,184,0.3)", badge: "bg-slate-700/40",  icon: "🥈" },
  gold:     { label: "Gold",     color: "text-yellow-400", border: "border-yellow-500/50", glow: "rgba(234,179,8,0.35)",  badge: "bg-yellow-900/40", icon: "🥇" },
  platinum: { label: "Platinum", color: "text-cyan-300",   border: "border-cyan-400/50",   glow: "rgba(34,211,238,0.35)", badge: "bg-cyan-900/40",   icon: "💎" },
  diamond:  { label: "Diamond",  color: "text-violet-300", border: "border-violet-400/50", glow: "rgba(167,139,250,0.4)", badge: "bg-violet-900/40", icon: "👑" },
};

// ============================================================
// TYPES
// ============================================================

interface SeasonStats {
  mmr?: number | null;
  rank_tier?: string | null;
  rank_division?: number | null;
  rank_points?: number | null;
  /** Phase 9 — placements */
  placement_matches_played?: number | null;
  placement_complete?: boolean | null;
  /** Phase 8 — protection anti-demotion */
  demotion_protected_until?: string | null;
}

interface Props {
  stats: PlayerRankedStats | null;
  /** Phase 7 — stats saison active (optionnel, rétrocompatible) */
  seasonStats?: SeasonStats | null;
}

// ============================================================
// COMPONENT
// ============================================================

/**
 * PlayerRankCard — carte MMR du joueur.
 *
 * Phase 7 : affiche tier + division (ex: "Gold II") + LP.
 * Design ArenaX original (glassmorphism + neon glow par tier) conservé.
 * seasonStats est prioritaire sur stats globales pour le rang.
 */
export function PlayerRankCard({ stats, seasonStats }: Props) {
  const effectiveMmr = Number(seasonStats?.mmr ?? stats?.mmr ?? 1000);
  const toNextTier = mmrToNextTier(effectiveMmr);

  if (!stats) {
    return (
      <div className="rounded-xl border border-white/10 bg-black/60 p-6 text-white backdrop-blur">
        <p className="text-sm text-white/50">
          No ranked data yet — play your first match to appear on the ladder.
        </p>
      </div>
    );
  }

  // ── Rang — Phase 7 ──────────────────────────────────────────────────
  // Priorité : stats saison DB → stats globales DB → calcul client
  const derived      = getRankFromMmr(effectiveMmr);

  const tier     = ((seasonStats?.rank_tier ?? stats.rank_tier ?? derived.tier) as RankTier);
  const statsRecord = stats as unknown as Record<string, unknown>;
  const division = Number(seasonStats?.rank_division ?? statsRecord.rank_division ?? derived.division);
  const lp       = Number(seasonStats?.rank_points   ?? statsRecord.rank_points   ?? derived.points);

  const config     = TIER_CONFIG[tier] ?? TIER_CONFIG.bronze;
  const divLabel   = tier !== "diamond" ? ` ${formatDivision(division)}` : "";

  // Winrate
  const winrate = stats.total_games > 0
    ? Math.round((stats.total_wins / stats.total_games) * 100)
    : 0;

  // LP progress bar (0–100, capé pour l'affichage)
  const lpProgress = Math.max(0, Math.min(100, lp));

  // ── Phase 9 : état de placement ──────────────────────────────────────
  const placementPlayed   = seasonStats?.placement_matches_played ?? null;
  const placementComplete = seasonStats?.placement_complete ?? true; // true = no data = post-placement
  const inPlacement       = placementPlayed !== null && !placementComplete;
  const placementLeft     = inPlacement
    ? Math.max(0, PROGRESSION_CONFIG.PLACEMENT_MATCHES_REQUIRED - (placementPlayed ?? 0))
    : 0;

  // ── Phase 8 : protection anti-demotion ───────────────────────────────
  const demotionProtectedUntil = seasonStats?.demotion_protected_until ?? null;
  const isProtected = demotionProtectedUntil
    ? new Date(demotionProtectedUntil).getTime() > Date.now()
    : false;

  return (
    <div
      className={`rounded-xl border ${config.border} bg-black/60 p-6 text-white backdrop-blur`}
      style={{ boxShadow: `0 0 32px ${config.glow}` }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-widest text-white/40">
          Ranked Profile
        </div>

        <div className="flex items-center gap-2">
          {/* Phase 9 — badge placements */}
          {inPlacement && (
            <span className="rounded-full bg-white/8 px-2.5 py-1 text-[10px] font-semibold text-white/50">
              Placement Matches {(placementPlayed ?? 0) + 1}/{PROGRESSION_CONFIG.PLACEMENT_MATCHES_REQUIRED}
            </span>
          )}

          {/* Phase 8 — shield protection */}
          {isProtected && !inPlacement && (
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
              🛡 Protected
            </span>
          )}

          {/* Badge tier + division */}
          <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ${config.badge} ${config.color}`}>
            <span>{config.icon}</span>
            <span>{inPlacement ? "?" : `${config.label}${divLabel}`}</span>
          </div>
        </div>
      </div>

      {/* ── MMR + LP ── */}
      <div className="mt-4 flex items-end gap-3">
        <div className={`text-5xl font-black tracking-tight ${inPlacement ? "text-white/30" : config.color}`}>
          {inPlacement ? "????" : effectiveMmr.toLocaleString()}
        </div>
        <div className="mb-1 flex flex-col gap-0.5 text-sm text-white/40">
          {inPlacement ? (
            <span>{placementLeft} placement{placementLeft !== 1 ? "s" : ""} left</span>
          ) : (
            <>
              <span>MMR · Peak {stats.peak_mmr.toLocaleString()}</span>
              <span className={`font-semibold ${config.color}`}>{lp} LP</span>
            </>
          )}
        </div>
      </div>

      {/* ── Barre LP de division ── */}
      {tier !== "diamond" && !inPlacement && (
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-[10px] text-white/30">
            <span>0 LP</span>
            <span>100 LP</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width:      `${lpProgress}%`,
                background: config.glow.replace("rgba", "rgb").replace(/,[\d.]+\)/, ")"),
              }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-white/25">
            {isProtected && (
              <span className="text-emerald-400/60">🛡 Demotion blocked</span>
            )}
            {toNextTier !== null && toNextTier > 0 && (
              <span className="ml-auto">{toNextTier} MMR to next tier</span>
            )}
          </div>
        </div>
      )}

      {/* ── Stats grid — identique à l'original ── */}
      <div className="mt-5 grid grid-cols-4 gap-3">
        {[
          { label: "Games",     value: stats.total_games },
          { label: "Wins",      value: stats.total_wins },
          { label: "Winrate",   value: `${winrate}%` },
          { label: "Streak 🔥", value: stats.current_win_streak > 0 ? `+${stats.current_win_streak}` : stats.current_win_streak },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg bg-white/5 p-2 text-center">
            <div className="text-lg font-bold">{value}</div>
            <div className="text-[10px] text-white/40">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlayerRankCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-black/60 p-6 text-white backdrop-blur">
      <div className="animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-3 w-28 rounded bg-white/10" />
          <div className="h-8 w-28 rounded-full bg-white/10" />
        </div>
        <div className="flex items-end gap-3">
          <div className="h-12 w-32 rounded bg-white/10" />
          <div className="space-y-2">
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="h-3 w-16 rounded bg-white/10" />
          </div>
        </div>
        <div className="h-2 w-full rounded bg-white/10" />
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-lg bg-white/5 p-2">
              <div className="mx-auto mb-2 h-5 w-10 rounded bg-white/10" />
              <div className="mx-auto h-3 w-12 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
