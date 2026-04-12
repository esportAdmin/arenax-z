// ============================================================
// MMR / ELO ENGINE
// ============================================================
//
// Implémentation ELO standard avec K-factor variable :
// - Nouveau joueur  (< 30 games) : K = 40  → progression rapide
// - Joueur standard (< 100 games): K = 32  → standard
// - Vétéran         (≥ 100 games): K = 16  → stabilité en haut
//
// MMR floor à 100 (jamais négatif).
// MMR de départ : 1000 (médiane ELO standard).
//
// Path : @/lib/ranked/mmr

// ============================================================
// TYPES
// ============================================================

export interface EloInput {
  mmrA: number;
  mmrB: number;
  /** 1 = A gagne, 0 = B gagne, 0.5 = draw (pas utilisé pour l'instant) */
  scoreA: 0 | 1 | 0.5;
  /** Nombre de games totaux de A (pour K-factor variable) */
  gamesA?: number;
  /** Nombre de games totaux de B */
  gamesB?: number;
}

export interface EloResult {
  newMmrA: number;
  newMmrB: number;
  deltaA: number;
  deltaB: number;
}

export type RankTier = "bronze" | "silver" | "gold" | "platinum" | "diamond";

// ============================================================
// CONSTANTES
// ============================================================

const MMR_FLOOR = 100; // MMR minimum absolu
const MMR_DEFAULT = 1000; // MMR de départ d'un nouveau joueur

// ============================================================
// HELPERS
// ============================================================

/**
 * K-factor variable selon l'expérience du joueur.
 *
 * - < 30 games  : 40  (calibration rapide)
 * - < 100 games : 32  (standard FIDE)
 * - ≥ 100 games : 16  (stabilité vétéran)
 */
function getKFactor(totalGames = 0): number {
  if (totalGames < 30) return 40;
  if (totalGames < 100) return 32;
  return 16;
}

/**
 * Probabilité de victoire de A contre B selon la formule ELO.
 * Résultat entre 0 et 1.
 */
function expectedScore(mmrA: number, mmrB: number): number {
  return 1 / (1 + Math.pow(10, (mmrB - mmrA) / 400));
}

// ============================================================
// PUBLIC API
// ============================================================

/**
 * Calcule les nouveaux MMR après un match.
 *
 * @returns { newMmrA, newMmrB, deltaA, deltaB }
 *
 * Corrections vs doc original :
 * - Fix A : clamp à MMR_FLOOR (100) — jamais négatif
 * - Fix I : K-factor variable selon le nombre de games
 */
export function computeElo({
  mmrA,
  mmrB,
  scoreA,
  gamesA = 0,
  gamesB = 0,
}: EloInput): EloResult {
  const kA = getKFactor(gamesA);
  const kB = getKFactor(gamesB);

  const expectedA = expectedScore(mmrA, mmrB);
  const expectedB = 1 - expectedA;
  const scoreB = 1 - scoreA;

  const rawNewA = mmrA + kA * (scoreA - expectedA);
  const rawNewB = mmrB + kB * (scoreB - expectedB);

  const newMmrA = Math.max(MMR_FLOOR, Math.round(rawNewA));
  const newMmrB = Math.max(MMR_FLOOR, Math.round(rawNewB));

  return {
    newMmrA,
    newMmrB,
    deltaA: newMmrA - mmrA,
    deltaB: newMmrB - mmrB,
  };
}

/**
 * Retourne le tier de rang pour un MMR donné.
 *
 * Tiers (alignés avec la migration SQL) :
 * - bronze   : < 1100
 * - silver   : 1100–1299
 * - gold     : 1300–1599
 * - platinum : 1600–1999
 * - diamond  : ≥ 2000
 */
export function getRankTier(mmr: number): RankTier {
  if (mmr >= 2000) return "diamond";
  if (mmr >= 1600) return "platinum";
  if (mmr >= 1300) return "gold";
  if (mmr >= 1100) return "silver";
  return "bronze";
}

/**
 * MMR de départ pour un nouveau joueur.
 * Exporté pour être utilisé dans les upserts sans valeur magique.
 */
export const DEFAULT_MMR = MMR_DEFAULT;
