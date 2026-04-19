// ============================================================
// REPLAY MONTAGE — Best-of automatique
// ============================================================
//
// Construit les 10 meilleurs segments d'un match à partir des highlights
// extraits par highlightSystem.ts.
//
// Un "segment" pointe vers un round + une fenêtre d'events contextuels.
// Dans ReplayViewer, on navigue par round → setIndex(roundIdx).
//
// Path : @/lib/esport/replayMontage

import { extractHighlights, type HighlightType, type RawEvent } from "./highlightSystem";

// ============================================================
// TYPES
// ============================================================

interface ReplayRound {
  round: number;
  events: RawEvent[];
}

export interface MontageSegment {
  /** Numéro de round (1-indexed, correspond à round.round) */
  round: number;
  /** Score du highlight déclencheur (0–100) */
  score: number;
  /** Type du highlight principal du segment */
  highlightType: HighlightType;
  /** Attaquant déclencheur */
  attackerId: string;
  /** Fenêtre d'events (indices dans le round) — pour un futur event-level viewer */
  eventStart: number;
  eventEnd:   number;
  /** Timestamp ISO du moment clé (si disponible) */
  timestamp: string | null;
}

// ============================================================
// PUBLIC API
// ============================================================

/**
 * Construit la liste des meilleurs segments du match (max 10).
 *
 * Algorithme :
 * 1. Pour chaque round, extrait les top 3 highlights
 * 2. Crée un segment par highlight (fenêtre ±2 events autour du pic)
 * 3. Trie tous les segments par score DESC
 * 4. Retourne les 10 meilleurs (dédupliqués par round)
 *
 * Fix C : `round` dans le segment est le numéro de round (pas l'index 0-based)
 * → ReplayViewer l'utilise via findIndex(r => r.round === segment.round).
 */
export function buildReplayMontage(rounds: ReplayRound[]): MontageSegment[] {
  const segments: MontageSegment[] = [];

  rounds.forEach((round, roundIndex) => {
    const highlights = extractHighlights(round.events, roundIndex);

    // Top 3 highlights par round
    highlights.slice(0, 3).forEach((h) => {
      segments.push({
        round:         round.round,
        score:         h.score,
        highlightType: h.type,
        attackerId:    h.attackerId,
        eventStart:    Math.max(0, h.eventIndex - 2),
        eventEnd:      Math.min(round.events.length - 1, h.eventIndex + 2),
        timestamp:     h.timestamp,
      });
    });
  });

  // Trier par score DESC, garder top 10
  return segments
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

/**
 * Label lisible pour l'affichage UI d'un segment de montage.
 */
export function getMontageLabel(segment: MontageSegment): string {
  const labels: Record<HighlightType, string> = {
    ace:        "🏆 ACE",
    teamwipe:   "💥 TEAMWIPE",
    multi_kill: `🔥 MULTI KILL`,
    clutch:     "⚡ CLUTCH",
    kill:       "💀 KILL",
    ultimate:   "✨ ULTIMATE",
    teamfight:  "⚔️ TEAM FIGHT",
  };
  return `${labels[segment.highlightType]} — Round ${segment.round}`;
}
