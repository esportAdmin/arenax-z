// ============================================================
// ESPORT HIGHLIGHT SYSTEM
// ============================================================
//
// Détecte et score les moments clés d'un match.
// Utilisé par : replayMontage.ts, MatchSummary.tsx, ReplayViewer.tsx
//
// Hiérarchie de scores cohérente avec getNarrativePriority() du hook :
//   ace 100 | teamwipe 90 | multi_kill 80 | clutch 75 | kill 60 | ultimate 50 | teamfight 40
//
// Path : @/lib/esport/highlightSystem

export type HighlightType =
  | "kill"
  | "multi_kill"
  | "clutch"
  | "teamwipe"
  | "ace"
  | "ultimate"
  | "teamfight";

export interface RawEvent {
  attackerId: string;
  defenderId: string;
  damage?: number;
  isKill?: boolean;
  killStreak?: number;
  highlight?: string;
  type?: string;
  /** Timestamp ISO du serveur (tick_route) — utilisé pour navigation précise */
  server_ts?: string;
}

export interface Highlight {
  type: HighlightType;
  score: number;
  /** Index de l'event dans le tableau du round */
  eventIndex: number;
  /** Timestamp ISO si disponible, sinon null */
  timestamp: string | null;
  /** Attaquant déclencheur */
  attackerId: string;
}

// ============================================================
// CORE SCORING
// ============================================================

/**
 * Score narratif d'un event — aligné avec getNarrativePriority()
 * dans useSpectatorCamera pour cohérence entre le live et le replay.
 */
export function getNarrativeScore(event: RawEvent): { score: number; type: HighlightType } | null {
  if (event.highlight === "ace")                          return { score: 100, type: "ace" };
  if (event.highlight === "teamwipe")                     return { score: 90,  type: "teamwipe" };
  if (event.killStreak && event.killStreak >= 3)          return { score: 80,  type: "multi_kill" };
  if (event.highlight === "clutch")                       return { score: 75,  type: "clutch" };
  if (event.isKill)                                       return { score: 60,  type: "kill" };
  if (event.type === "ultimate")                          return { score: 50,  type: "ultimate" };
  return null;
}

// ============================================================
// TEAMFIGHT DETECTION
// ============================================================

/**
 * Détecte les teamfights dans un round.
 *
 * Critère : une fenêtre de 5 events consécutifs contenant
 * au moins 3 events avec damage > 0 ou type "ultimate".
 * Évite les faux positifs sur des events isolés.
 */
function detectTeamfightEvents(events: RawEvent[]): number[] {
  const WINDOW   = 5;
  const THRESHOLD = 3;
  const indices: number[] = [];

  for (let i = 0; i <= events.length - WINDOW; i++) {
    const window = events.slice(i, i + WINDOW);
    const activeCount = window.filter(
      (e) => Number(e.damage ?? 0) > 0 || e.type === "ultimate",
    ).length;

    if (activeCount >= THRESHOLD) {
      // Centre de la fenêtre = moment pic
      const peakIdx = i + Math.floor(WINDOW / 2);
      if (!indices.includes(peakIdx)) indices.push(peakIdx);
    }
  }

  return indices;
}

// ============================================================
// PUBLIC API
// ============================================================

/**
 * Extrait les highlights d'un tableau d'events (un round).
 *
 * @param events  Events du round
 * @param roundIndex  Index du round dans le tableau global (pour navigation)
 * @returns Highlights triés par score DESC
 */
export function extractHighlights(
  events: RawEvent[],
  roundIndex = 0,
): (Highlight & { roundIndex: number })[] {
  const highlights: (Highlight & { roundIndex: number })[] = [];
  const seenIndices = new Set<number>();

  // ── Events individuels ──
  events.forEach((e, i) => {
    const scored = getNarrativeScore(e);
    if (!scored) return;

    highlights.push({
      type:       scored.type,
      score:      scored.score,
      eventIndex: i,
      roundIndex,
      // Fix A : utiliser server_ts ISO si disponible
      timestamp:  e.server_ts ?? null,
      attackerId: e.attackerId,
    });
    seenIndices.add(i);
  });

  // ── Teamfights détectés sur la fenêtre ──
  detectTeamfightEvents(events).forEach((peakIdx) => {
    if (seenIndices.has(peakIdx)) return; // déjà couvert par un event individuel
    const e = events[peakIdx];
    if (!e) return;

    highlights.push({
      type:       "teamfight",
      score:      40,
      eventIndex: peakIdx,
      roundIndex,
      timestamp:  e.server_ts ?? null,
      attackerId: e.attackerId,
    });
  });

  return highlights.sort((a, b) => b.score - a.score);
}

/**
 * Calcule le MVP du match (unité avec le meilleur score global).
 *
 * Score par unité = Σ (damage + kill×50 + ultimate×30) sur tous les events.
 * Retourne l'attackerId du MVP ou null si aucun event.
 */
export function computeMVP(allEvents: RawEvent[]): string | null {
  const scores = new Map<string, number>();

  for (const e of allEvents) {
    const id = e.attackerId;
    if (!id) continue;
    const prev  = scores.get(id) ?? 0;
    let value   = Number(e.damage ?? 0);
    if (e.isKill)             value += 50;
    if (e.type === "ultimate") value += 30;
    scores.set(id, prev + value);
  }

  if (!scores.size) return null;
  return [...scores.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}
