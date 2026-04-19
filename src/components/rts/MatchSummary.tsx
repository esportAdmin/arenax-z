"use client";

import { useMemo } from "react";

import {
  extractHighlights,
  computeMVP,
  type RawEvent,
  type HighlightType,
} from "@/lib/esport/highlightSystem";

// ============================================================
// TYPES
// ============================================================

interface ReplayRound {
  round: number;
  meta?: {
    totalDamage: number;
    kills: number;
    ultimates: number;
    teamCalls?: number;
    crits?: number;
  };
  events: RawEvent[];
}

interface Props {
  rounds: ReplayRound[];
}

// ============================================================
// HELPERS
// ============================================================

const HIGHLIGHT_LABELS: Record<HighlightType, string> = {
  ace:        "🏆 Ace",
  teamwipe:   "💥 Teamwipe",
  multi_kill: "🔥 Multi Kill",
  clutch:     "⚡ Clutch",
  kill:       "💀 Kill",
  ultimate:   "✨ Ultimate",
  teamfight:  "⚔️ Team Fight",
};

/** Tronque un UUID pour affichage caster : "a1b2c3d4-…" → "a1b2c3d4" */
function shortId(id: string | null): string {
  if (!id) return "—";
  return id.length > 8 ? id.slice(0, 8) : id;
}

// ============================================================
// COMPONENT
// ============================================================

/**
 * MatchSummary — analytics post-game du match complet.
 *
 * Sections :
 * - Stats globales : damage total, kills, ultimates, crits
 * - Peak round : round le plus intense (damage + kills combinés)
 * - MVP : unité avec le meilleur score global (damage + kills + ults)
 * - Highlights breakdown : comptage par type sur l'ensemble du match
 *
 * Path : @/components/rts/MatchSummary
 */
export default function MatchSummary({ rounds }: Props) {
  const {
    totalDamage, totalKills, totalUlt, totalCrits,
    peakRound, mvpId, highlightCounts,
  } = useMemo(() => {
    let totalDamage = 0;
    let totalKills  = 0;
    let totalUlt    = 0;
    let totalCrits  = 0;

    // Peak round = round avec le score combiné le plus élevé
    let peakScore  = -1;
    let peakRound  = 1;

    const allEvents: RawEvent[] = [];
    const counts: Partial<Record<HighlightType, number>> = {};

    rounds.forEach((r, i) => {
      const d  = r.meta?.totalDamage ?? 0;
      const k  = r.meta?.kills       ?? 0;
      const u  = r.meta?.ultimates   ?? 0;
      const cr = r.meta?.crits       ?? 0;

      totalDamage += d;
      totalKills  += k;
      totalUlt    += u;
      totalCrits  += cr;

      // Peak round scoring : damage + kills×30
      const roundScore = d + k * 30;
      if (roundScore > peakScore) { peakScore = roundScore; peakRound = r.round; }

      allEvents.push(...r.events);

      // Highlights breakdown
      extractHighlights(r.events, i).forEach((h) => {
        counts[h.type] = (counts[h.type] ?? 0) + 1;
      });
    });

    return {
      totalDamage,
      totalKills,
      totalUlt,
      totalCrits,
      peakRound,
      mvpId: computeMVP(allEvents),
      highlightCounts: counts,
    };
  }, [rounds]);

  const highlightEntries = Object.entries(highlightCounts) as [HighlightType, number][];
  // Trier par count DESC
  highlightEntries.sort((a, b) => b[1] - a[1]);

  return (
    <div className="rounded-lg border border-white/10 bg-black/70 p-4 text-white space-y-4">
      {/* Header */}
      <div className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
        Match Summary
      </div>

      {/* Global stats */}
      <div className="grid grid-cols-4 gap-3 text-center">
        {[
          { label: "Damage",    value: totalDamage },
          { label: "Kills",     value: totalKills  },
          { label: "Ultimates", value: totalUlt    },
          { label: "Crits",     value: totalCrits  },
        ].map(({ label, value }) => (
          <div key={label} className="rounded bg-white/5 p-2">
            <div className="text-lg font-bold">{value}</div>
            <div className="text-[11px] text-white/55">{label}</div>
          </div>
        ))}
      </div>

      {/* Peak round + MVP */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded bg-white/5 p-3">
          <div className="text-[11px] text-white/50 uppercase tracking-wide">Peak Round</div>
          <div className="mt-1 text-base font-bold text-yellow-300">Round {peakRound}</div>
          <div className="text-[11px] text-white/40">Most intense combat</div>
        </div>

        <div className="rounded bg-white/5 p-3">
          <div className="text-[11px] text-white/50 uppercase tracking-wide">MVP</div>
          <div className="mt-1 text-base font-bold font-mono text-cyan-300">
            {shortId(mvpId)}
          </div>
          <div className="text-[11px] text-white/40">Highest combat score</div>
        </div>
      </div>

      {/* Highlights breakdown */}
      {highlightEntries.length > 0 && (
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-white/50">
            Highlights
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {highlightEntries.map(([type, count]) => (
              <div
                key={type}
                className="flex items-center justify-between rounded bg-white/5 px-2 py-1 text-xs"
              >
                <span>{HIGHLIGHT_LABELS[type]}</span>
                <span className="font-bold text-white/80">×{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-[10px] text-white/25 text-right">
        {rounds.length} rounds analyzed
      </div>
    </div>
  );
}
