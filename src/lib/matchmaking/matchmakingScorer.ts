/**
 * matchmakingScorer.ts
 * ─────────────────────────────────────────────────────────────────────
 * Logique de scoring des paires de matchmaking — Phase 6.1.
 * Isolée d'automatic.ts pour être testable indépendamment.
 *
 * Principe : score bas = meilleure paire.
 * Le score est TOUJOURS positif grâce au floor 0 — la comparaison
 * "plus bas = meilleur" reste valide dans tous les cas.
 *
 * Composants du score :
 *   base    = MMR diff × WEIGHTS.mmr
 *   bonus   = urgence queue (décroissance linéaire, pas de paliers)
 *   penalty = région différente + rematch récent
 *
 * Seuil d'acceptabilité :
 *   Si aucun candidat ne passe MAX_ACCEPTABLE_SCORE, on retourne null
 *   plutôt que de forcer un mauvais match.
 *   Ce seuil s'élargit automatiquement en fonction du temps d'attente.
 * ─────────────────────────────────────────────────────────────────────
 */

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface ScoredCandidate {
  /** Identifiant du joueur */
  playerId: string;
  mmr: number;
  /** ISO string du moment d'entrée en queue */
  joinedAt: string;
  /** Région optionnelle — "global" si absente */
  region?: string | null;
  /** Club du joueur — utilisé pour bloquer le same-club */
  clubId: string;
}

export interface PairScore {
  score: number;
  mmrDiff: number;
  /** Réduction appliquée grâce au temps d'attente */
  queueCompensation: number;
  regionPenalty: number;
  rematchPenalty: number;
  /** true si la paire est acceptable (score ≤ seuil dynamique) */
  acceptable: boolean;
}

// ─────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────

export const SCORING_CONFIG = {
  weights: {
    /** Chaque point de MMR diff coûte ce poids */
    mmrPerPoint:        1.0,
    /** Pénalité fixe si régions différentes (et non-global) */
    differentRegion:    45,
    /** Pénalité si global-vs-région spécifique (moindre) */
    globalRegion:        8,
    /** Pénalité si match trop récent (< withinHours) */
    recentRematch:      180,
  },
  queue: {
    /**
     * Compensation maximale accordée par le temps d'attente.
     * Correspond à ~200 points de MMR diff compensés après 10min.
     * Linéaire — pas de paliers — évite les effets de seuil.
     */
    maxCompensation:    200,
    /** Temps (minutes) pour atteindre la compensation maximale */
    fullCompensationAt:  10,
  },
  /** Seuil de base — une paire avec score > seuil est refusée */
  baseAcceptableScore: 300,
  /**
   * Le seuil s'élargit de ce montant par minute d'attente.
   * Après 5min : seuil = 300 + 5×40 = 500.
   * Évite une queue qui n'aboutit jamais.
   */
  acceptableScorePerWaitMinute: 40,
} as const;

// ─────────────────────────────────────────────
// HELPERS INTERNES
// ─────────────────────────────────────────────

function waitMinutes(joinedAt: string): number {
  return Math.max(0, (Date.now() - new Date(joinedAt).getTime()) / 60_000);
}

/**
 * Compensation linéaire basée sur le temps d'attente.
 * Pas de paliers — croissance continue jusqu'à maxCompensation.
 */
function queueCompensationFor(candidate: ScoredCandidate): number {
  const { maxCompensation, fullCompensationAt } = SCORING_CONFIG.queue;
  const wait = waitMinutes(candidate.joinedAt);
  return Math.min(maxCompensation, (wait / fullCompensationAt) * maxCompensation);
}

function regionPenalty(a: ScoredCandidate, b: ScoredCandidate): number {
  const ra = (a.region ?? "global").toLowerCase().trim();
  const rb = (b.region ?? "global").toLowerCase().trim();

  if (ra === rb) return 0;
  if (ra === "global" || rb === "global") return SCORING_CONFIG.weights.globalRegion;
  return SCORING_CONFIG.weights.differentRegion;
}

/**
 * Seuil d'acceptabilité dynamique — s'élargit avec le temps d'attente
 * du joueur qui attend le plus longtemps dans la paire.
 * Garantit qu'une queue ne reste pas bloquée indéfiniment.
 */
function dynamicAcceptableScore(a: ScoredCandidate, b: ScoredCandidate): number {
  const maxWait = Math.max(waitMinutes(a.joinedAt), waitMinutes(b.joinedAt));
  return (
    SCORING_CONFIG.baseAcceptableScore +
    maxWait * SCORING_CONFIG.acceptableScorePerWaitMinute
  );
}

// ─────────────────────────────────────────────
// API PUBLIQUE
// ─────────────────────────────────────────────

/**
 * Calcule le score d'une paire candidate.
 *
 * Score bas = meilleure paire.
 * Score TOUJOURS >= 0 (floor via Math.max).
 *
 * @param recentRematch — résultat de hadRecentMatch() pré-calculé
 *   (évite N requêtes DB dans la boucle — passer le résultat en param)
 */
export function computePairScore(
  a: ScoredCandidate,
  b: ScoredCandidate,
  recentRematch: boolean,
): PairScore {
  const mmrDiff         = Math.abs(a.mmr - b.mmr);
  const compA           = queueCompensationFor(a);
  const compB           = queueCompensationFor(b);
  // On prend le max des deux compensations — la paire bénéficie
  // du joueur qui a le plus attendu, pas de la somme (évite sur-compensation)
  const queueCompensation = Math.min(
    SCORING_CONFIG.queue.maxCompensation,
    Math.max(compA, compB),
  );
  const rPenalty        = regionPenalty(a, b);
  const rematchPenalty  = recentRematch ? SCORING_CONFIG.weights.recentRematch : 0;

  const rawScore = mmrDiff * SCORING_CONFIG.weights.mmrPerPoint
    - queueCompensation
    + rPenalty
    + rematchPenalty;

  // Floor à 0 — le score ne peut pas être négatif,
  // ce qui invaliderait la comparaison "plus bas = meilleur"
  const score = Math.max(0, rawScore);

  return {
    score,
    mmrDiff,
    queueCompensation,
    regionPenalty: rPenalty,
    rematchPenalty,
    acceptable: score <= dynamicAcceptableScore(a, b),
  };
}

/**
 * Même club → toujours bloqué, quelle que soit la qualité du score.
 * À vérifier AVANT computePairScore pour court-circuiter tôt.
 */
export function isSameClub(a: ScoredCandidate, b: ScoredCandidate): boolean {
  return a.clubId === b.clubId;
}

/**
 * Sélectionne le meilleur candidat parmi une liste pré-filtrée.
 * Retourne null si aucun candidat n'est acceptable.
 *
 * @param rematchMap — Map<candidateId, boolean> pré-calculée
 *   (hadRecentMatch appelé en batch avant la boucle, pas dans la boucle)
 */
export function selectBestCandidate(
  seeker: ScoredCandidate,
  candidates: ScoredCandidate[],
  rematchMap: Map<string, boolean>,
): { candidate: ScoredCandidate; score: PairScore } | null {
  let best: { candidate: ScoredCandidate; score: PairScore } | null = null;

  for (const candidate of candidates) {
    if (isSameClub(seeker, candidate)) continue;

    const recentRematch = rematchMap.get(candidate.playerId) ?? false;
    const score         = computePairScore(seeker, candidate, recentRematch);

    if (!score.acceptable) continue;

    if (!best || score.score < best.score.score) {
      best = { candidate, score };
    }
  }

  return best;
}
