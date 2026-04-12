/**
 * matchQuality.ts
 * ─────────────────────────────────────────────────────────────────────
 * Calcule et expose un score de qualité de match (0–100).
 * Utilisé par :
 *   - automatic.ts : logguer la qualité au moment du pairing
 *   - MatchHistory.tsx : afficher "Match quality: 92%" dans l'historique
 *   - tick/route.ts (optionnel) : stocker dans club_wars.match_quality
 *
 * Principe :
 *   Un bon match = adversaires proches en MMR, attente raisonnable,
 *   même région, pas un rematch récent.
 *   Score 100 = match parfait. Score < 50 = match forcé.
 * ─────────────────────────────────────────────────────────────────────
 */

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface MatchQualityInput {
  mmrA: number;
  mmrB: number;
  /** Secondes d'attente du joueur A dans la queue */
  queueWaitSecondsA: number;
  /** Secondes d'attente du joueur B dans la queue */
  queueWaitSecondsB: number;
  regionA?: string | null;
  regionB?: string | null;
  /** true si les joueurs se sont affrontés récemment */
  isRematch?: boolean;
}

export interface MatchQualityResult {
  /** Score global 0–100 */
  score: number;
  /** Label lisible : "Excellent" | "Good" | "Fair" | "Poor" */
  label: "Excellent" | "Good" | "Fair" | "Poor";
  /** Couleur Tailwind CSS pour l'UI */
  color: string;
  /** Détail des composantes pour le debug */
  breakdown: {
    mmrScore:    number; // 0–100
    waitScore:   number; // 0–100 (bonus pour longue attente)
    regionScore: number; // 0 ou 100
    rematchPenalty: number; // 0 ou -30
  };
}

// ─────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────

const QUALITY_CONFIG = {
  /**
   * MMR diff "parfait" (score 100) et "catastrophique" (score 0).
   * Entre les deux : interpolation linéaire.
   */
  mmr: {
    perfect:      0,    // diff = 0 → score MMR = 100
    catastrophic: 400,  // diff >= 400 → score MMR = 0
  },

  /**
   * Pondérations des composantes dans le score final.
   * Somme = 1.0
   */
  weights: {
    mmr:    0.60,
    wait:   0.25,
    region: 0.15,
  },

  /** Pénalité absolue si rematch récent */
  rematchPenalty: 30,

  /** Attente (en secondes) au-delà de laquelle le score wait atteint 100 */
  maxWaitForFullBonus: 300, // 5 minutes
} as const;

// ─────────────────────────────────────────────
// CALCUL
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// HELPERS PARTAGÉS — exportés pour réutilisation
// ─────────────────────────────────────────────

/**
 * Détermine si deux régions sont compatibles (même région ou au moins une "global").
 * Exporté pour éviter les implémentations divergentes dans automatic.ts
 * et matchmakingScorer.ts.
 */
export function isSameRegion(a: string | null | undefined, b: string | null | undefined): boolean {
  const ra = (a ?? "global").trim().toLowerCase();
  const rb = (b ?? "global").trim().toLowerCase();
  return ra === rb || ra === "global" || rb === "global";
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

/**
 * Calcule le score qualité d'une paire de joueurs.
 *
 * Le score est indépendant du résultat du match — il mesure uniquement
 * la qualité du pairing au moment de la création de la war.
 */
export function computeMatchQuality(input: MatchQualityInput): MatchQualityResult {
  const { mmr, weights, maxWaitForFullBonus } = QUALITY_CONFIG;

  // ── Composante MMR (60%) ──────────────────────────────────────────────
  const mmrDiff  = Math.abs(input.mmrA - input.mmrB);
  const mmrScore = clamp(
    Math.round(100 - (mmrDiff / mmr.catastrophic) * 100),
    0, 100,
  );

  // ── Composante attente (25%) ──────────────────────────────────────────
  // Le joueur qui attend le plus longtemps compense la qualité du match.
  // Rationale : un mauvais match après 5min d'attente est préférable
  // à pas de match du tout.
  const maxWait  = Math.max(input.queueWaitSecondsA, input.queueWaitSecondsB);
  const waitScore = clamp(
    Math.round((maxWait / maxWaitForFullBonus) * 100),
    0, 100,
  );

  // ── Composante région (15%) ───────────────────────────────────────────
  // Utilise isSameRegion() — source de vérité unique, exportée pour automatic.ts
  const regionScore = isSameRegion(input.regionA, input.regionB) ? 100 : 0;

  // ── Pénalité rematch ──────────────────────────────────────────────────
  const rematchPenalty = input.isRematch ? QUALITY_CONFIG.rematchPenalty : 0;

  // ── Score global ──────────────────────────────────────────────────────
  const rawScore =
    mmrScore    * weights.mmr    +
    waitScore   * weights.wait   +
    regionScore * weights.region  -
    rematchPenalty;

  const score = clamp(Math.round(rawScore), 0, 100);

  // ── Label ─────────────────────────────────────────────────────────────
  const label: MatchQualityResult["label"] =
    score >= 80 ? "Excellent" :
    score >= 60 ? "Good"      :
    score >= 40 ? "Fair"      :
    "Poor";

  const color =
    score >= 80 ? "text-emerald-400" :
    score >= 60 ? "text-cyan-400"    :
    score >= 40 ? "text-amber-400"   :
    "text-red-400";

  return {
    score,
    label,
    color,
    breakdown: { mmrScore, waitScore, regionScore, rematchPenalty },
  };
}

/**
 * Version simplifiée pour l'affichage dans MatchHistory.
 * Prend directement le mmrDeltaAbs stocké dans MatchmakingCreatedMatch.
 */
export function matchQualityFromDelta(mmrDeltaAbs: number): MatchQualityResult {
  return computeMatchQuality({
    mmrA: 1000,
    mmrB: 1000 + mmrDeltaAbs,
    queueWaitSecondsA: 0,
    queueWaitSecondsB: 0,
  });
}

/**
 * Badge JSX-ready pour l'affichage inline.
 * Usage : <span className={quality.color}>{quality.label} · {quality.score}%</span>
 */
export function formatMatchQuality(result: MatchQualityResult): string {
  return `${result.label} · ${result.score}%`;
}
