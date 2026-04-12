"use client";

/**
 * RankedSection
 * ─────────────────────────────────────────────
 * Composant autonome injecté dans profile/page.tsx.
 * Phase 7 : passe seasonStats à PlayerRankCard pour afficher
 * tier + division + LP depuis la saison active.
 */

import { usePlayerRanked } from "@/hooks/usePlayerRanked";
import {
  PlayerRankCard,
  PlayerRankCardSkeleton,
} from "@/components/ranked/PlayerRankCard";
import { MatchHistory, MatchHistorySkeleton } from "@/components/ranked/MatchHistory";

export function RankedSection() {
  const { data, loading, error } = usePlayerRanked();

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <PlayerRankCardSkeleton />
        <MatchHistorySkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-300">
        <span className="font-semibold">Ranked unavailable:</span> {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Phase 7 — seasonStats prioritaire sur stats globales pour le rang */}
      <PlayerRankCard
        stats={data?.stats ?? null}
        seasonStats={data?.seasonStats ?? null}
      />

      <MatchHistory
        matches={[]}           // À brancher sur usePlayerMatchHistory si disponible
        currentUserId={data?.playerId ?? null}
      />
    </div>
  );
}
