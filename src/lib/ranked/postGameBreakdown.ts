/**
 * postGameBreakdown.ts
 * ─────────────────────────────────────────────────────────────────────
 * Transforme une row club_wars en modèle UI post-game complet.
 *
 * Corrections vs doc :
 *   - baseDelta calculé depuis mmr_before snapshots (exact) plutôt
 *     qu'estimé depuis winProb (approx). Voir computeBaseDeltaExact().
 *   - contextAdjustment = finalDelta - baseDelta (différence réelle)
 *   - isAttacker / playerWon / mmrDelta exposés dans le return
 *     → la page n'a pas à les recalculer
 *   - buildMvpCard retourne null si aucune info pertinente disponible
 *     plutôt que de toujours retourner quelque chose
 * ─────────────────────────────────────────────────────────────────────
 */

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface PostGameWarRow {
  id: string;
  territory_id: string | null;
  challenger_id: string | null;
  defender_id: string | null;
  winner_club_id: string | null;
  attacker_player_id: string | null;
  defender_player_id: string | null;
  mmr_delta_attacker: number | null;
  mmr_delta_defender: number | null;
  /** Snapshots MMR avant/après — stockés par resolveWarMmr étape 6 */
  attacker_mmr_before: number | null;
  attacker_mmr_after: number | null;
  defender_mmr_before: number | null;
  defender_mmr_after: number | null;
  win_probability_attacker: number | null;
  win_probability_defender: number | null;
  match_quality_score: number | null;
  match_quality_label: string | null;
  mmr_diff_at_match: number | null;
}

export type Tone = "neutral" | "good" | "bad" | "accent";

export interface PostGameTimelineEntry {
  title: string;
  value: string;
  tone: Tone;
}

export interface PostGameHighlight {
  label: string;
  value: string;
  tone: Tone;
}

export interface PostGameMvpCard {
  title: string;
  subtitle: string;
  score?: string;
}

export interface PostGameBreakdown {
  /** POV du visiteur */
  playerWon: boolean;
  isAttacker: boolean;
  isParticipant: boolean;
  roleLabel: "Attacker" | "Defender" | "Spectator";
  flavor: string | null;
  resultTitle: "VICTORY" | "DEFEAT";

  /** Qualité du match */
  matchQualityScore: number | null;
  matchQualityLabel: string | null;

  /** Probabilités */
  playerWinProbability: number | null;
  opponentWinProbability: number | null;
  expectedOutcome: "Favored" | "Underdog" | "Even" | null;

  /** MMR */
  mmrBefore: number | null;
  mmrAfter: number | null;
  mmrDelta: number | null;
  /** Base ELO delta K=32 standard, calculé depuis snapshots mmr_before */
  mmrBaseDelta: number | null;
  /** Différence entre final et base — ajustement contextuel réel */
  mmrContextAdjustment: number | null;

  mmrDiffAtPairing: number | null;

  highlights: PostGameHighlight[];
  timeline: PostGameTimelineEntry[];
  /** Null si aucune info pertinente disponible */
  mvp: PostGameMvpCard | null;
}

// ─────────────────────────────────────────────
// HELPERS PRIVÉS
// ─────────────────────────────────────────────

function formatSigned(value: number | null, suffix = ""): string {
  if (value == null) return "—";
  return `${value > 0 ? "+" : ""}${value}${suffix}`;
}

/**
 * Calcule le baseDelta ELO standard (K=32) depuis les snapshots MMR stockés.
 * Plus précis que d'estimer depuis winProb car on connaît le MMR réel
 * au moment du match.
 *
 * Retourne null si les snapshots ne sont pas disponibles (anciennes wars).
 */
function computeBaseDeltaExact(
  playerMmrBefore: number | null,
  opponentMmrBefore: number | null,
  playerWon: boolean,
): number | null {
  if (playerMmrBefore == null || opponentMmrBefore == null) return null;

  const K        = 32;
  const expected = 1 / (1 + Math.pow(10, (opponentMmrBefore - playerMmrBefore) / 400));
  return Math.round(K * ((playerWon ? 1 : 0) - expected));
}

function outcomeFlavor(winProb: number | null, isWin: boolean): string | null {
  if (winProb == null) return null;
  if (isWin  && winProb <= 35) return "Upset Victory";
  if (isWin  && winProb >= 65) return "Expected Victory";
  if (!isWin && winProb >= 65) return "Unexpected Defeat";
  if (!isWin && winProb <= 35) return "Valiant Effort";
  return "Even Match";
}

function expectedOutcomeLabel(winProb: number | null): PostGameBreakdown["expectedOutcome"] {
  if (winProb == null) return null;
  if (winProb >= 60) return "Favored";
  if (winProb <= 40) return "Underdog";
  return "Even";
}

function buildHighlights(
  playerWinProb: number | null,
  qualityScore: number | null,
  mmrDelta: number | null,
  playerWon: boolean,
): PostGameHighlight[] {
  const items: PostGameHighlight[] = [];

  if (qualityScore != null) {
    items.push({
      label: "Match Quality",
      value: `${qualityScore}%`,
      tone: qualityScore >= 80 ? "good" : qualityScore >= 60 ? "accent" : qualityScore >= 40 ? "neutral" : "bad",
    });
  }

  if (playerWinProb != null) {
    items.push({
      label: "Expected Win Chance",
      value: `${playerWinProb}%`,
      tone: playerWinProb >= 60 ? "accent" : playerWinProb <= 40 ? "neutral" : "neutral",
    });
  }

  if (mmrDelta != null) {
    items.push({
      label: "Final MMR",
      value: formatSigned(mmrDelta),
      tone: mmrDelta > 0 ? "good" : mmrDelta < 0 ? "bad" : "neutral",
    });
  }

  if (playerWon && playerWinProb != null && playerWinProb <= 35) {
    items.push({ label: "Upset Bonus", value: "Activated", tone: "good" });
  }

  if (!playerWon && playerWinProb != null && playerWinProb >= 65) {
    items.push({ label: "Penalty Tier", value: "Unexpected loss", tone: "bad" });
  }

  return items;
}

function buildTimeline(
  expectedOutcome: PostGameBreakdown["expectedOutcome"],
  qualityLabel: string | null,
  playerWinProb: number | null,
  baseDelta: number | null,
  contextAdjustment: number | null,
  finalDelta: number | null,
): PostGameTimelineEntry[] {
  return [
    {
      title: "Pairing",
      value: qualityLabel ? `Quality: ${qualityLabel}` : "Quality unavailable",
      tone: "accent",
    },
    {
      title: "Pre-match expectation",
      value: playerWinProb == null
        ? "No probability snapshot"
        : `${expectedOutcome ?? "Even"} · ${playerWinProb}% win chance`,
      tone: "neutral",
    },
    {
      title: "Base ELO delta",
      value: formatSigned(baseDelta, " MMR"),
      tone: baseDelta == null ? "neutral" : baseDelta > 0 ? "good" : baseDelta < 0 ? "bad" : "neutral",
    },
    {
      title: "Context adjustment",
      value: contextAdjustment == null ? "—"
        : contextAdjustment === 0 ? "No adjustment"
        : formatSigned(contextAdjustment, " MMR"),
      tone: contextAdjustment == null ? "neutral" : contextAdjustment > 0 ? "good" : contextAdjustment < 0 ? "bad" : "neutral",
    },
    {
      title: "Final resolved MMR",
      value: formatSigned(finalDelta, " MMR"),
      tone: finalDelta == null ? "neutral" : finalDelta > 0 ? "good" : finalDelta < 0 ? "bad" : "neutral",
    },
  ];
}

/**
 * Retourne null sauf si le flavor apporte une vraie information narrative.
 * Évite l'effet "Performance Spotlight" toujours rempli de texte générique.
 */
function buildMvpCard(
  flavor: string | null,
  qualityScore: number | null,
): PostGameMvpCard | null {
  if (flavor === "Upset Victory") {
    return {
      title: "Performance Spotlight",
      subtitle: "You flipped a low-probability match.",
      score: qualityScore != null ? `${qualityScore}% quality` : undefined,
    };
  }
  if (flavor === "Unexpected Defeat") {
    return {
      title: "Review Candidate",
      subtitle: "This was a favored match. Replay review is recommended.",
      score: qualityScore != null ? `${qualityScore}% quality` : undefined,
    };
  }
  // Even Match / Expected win / Expected loss / null → pas de spotlight
  return null;
}

// ─────────────────────────────────────────────
// API PUBLIQUE
// ─────────────────────────────────────────────

export function buildPostGameBreakdown(params: {
  war: PostGameWarRow;
  viewerPlayerId: string | null;
}): PostGameBreakdown {
  const { war, viewerPlayerId } = params;

  const isAttacker    = viewerPlayerId != null && war.attacker_player_id === viewerPlayerId;
  const isDefender    = viewerPlayerId != null && war.defender_player_id === viewerPlayerId;
  const isParticipant = isAttacker || isDefender;

  const attackerWon = war.winner_club_id === war.challenger_id;
  const playerWon   = isParticipant ? (isAttacker ? attackerWon : !attackerWon) : attackerWon;

  const playerWinProbability   = isAttacker ? war.win_probability_attacker
    : isDefender               ? war.win_probability_defender
    : war.win_probability_attacker;

  const opponentWinProbability = isAttacker ? war.win_probability_defender
    : isDefender               ? war.win_probability_attacker
    : war.win_probability_defender;

  const mmrDelta  = isAttacker ? war.mmr_delta_attacker
    : isDefender   ? war.mmr_delta_defender
    : war.mmr_delta_attacker;

  const mmrBefore = isAttacker ? war.attacker_mmr_before
    : isDefender   ? war.defender_mmr_before
    : war.attacker_mmr_before;

  const mmrAfter  = isAttacker ? war.attacker_mmr_after
    : isDefender   ? war.defender_mmr_after
    : war.attacker_mmr_after;

  // baseDelta exact depuis snapshots (pas d'estimation depuis winProb)
  const opponentMmrBefore = isAttacker ? war.defender_mmr_before
    : isDefender             ? war.attacker_mmr_before
    : war.defender_mmr_before;

  const mmrBaseDelta         = computeBaseDeltaExact(mmrBefore, opponentMmrBefore, playerWon);
  const mmrContextAdjustment = mmrDelta != null && mmrBaseDelta != null
    ? mmrDelta - mmrBaseDelta
    : null;

  const expectedOutcome = expectedOutcomeLabel(playerWinProbability);
  const flavor          = outcomeFlavor(playerWinProbability, playerWon);

  const highlights = buildHighlights(playerWinProbability, war.match_quality_score, mmrDelta, playerWon);
  const timeline   = buildTimeline(expectedOutcome, war.match_quality_label, playerWinProbability, mmrBaseDelta, mmrContextAdjustment, mmrDelta);
  const mvp        = buildMvpCard(flavor, war.match_quality_score);

  return {
    playerWon,
    isAttacker,
    isParticipant,
    roleLabel: !isParticipant ? "Spectator" : isAttacker ? "Attacker" : "Defender",
    flavor,
    resultTitle: playerWon ? "VICTORY" : "DEFEAT",
    matchQualityScore:      war.match_quality_score,
    matchQualityLabel:      war.match_quality_label,
    playerWinProbability,
    opponentWinProbability,
    expectedOutcome,
    mmrBefore,
    mmrAfter,
    mmrDelta,
    mmrBaseDelta,
    mmrContextAdjustment,
    mmrDiffAtPairing: war.mmr_diff_at_match,
    highlights,
    timeline,
    mvp,
  };
}
