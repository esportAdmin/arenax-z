/**
 * winProbability.ts
 * ─────────────────────────────────────────────────────────────────────
 * Calcule la probabilité de victoire de chaque joueur depuis leur MMR.
 * Formule ELO standard (expected score).
 *
 * Utilisé par :
 *   - automatic.ts : calculé au pairing, persisté dans club_wars
 *   - MatchHistory.tsx : affiche "Win chance · 52%" + flavor text
 * ─────────────────────────────────────────────────────────────────────
 */

export interface WinProbabilityInput {
  attackerMmr: number;
  defenderMmr: number;
}

export interface WinProbabilityResult {
  /** Probabilité de victoire attaquant 0–100 */
  attacker: number;
  /** Probabilité de victoire défenseur 0–100 */
  defender: number;
  /** Label humain de l'équilibre */
  label: "Balanced" | "Slight Edge" | "Favored" | "Heavy Favorite";
  /** Qui est favori */
  favorite: "attacker" | "defender" | "even";
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

/**
 * ELO expected score : probabilité que A batte B.
 * Paramètre K = 400 (standard ELO — cohérent avec computeElo dans mmr.ts).
 */
function expectedScore(mmrA: number, mmrB: number): number {
  return 1 / (1 + Math.pow(10, (mmrB - mmrA) / 400));
}

export function computeWinProbability(
  input: WinProbabilityInput,
): WinProbabilityResult {
  const rawAttacker = expectedScore(input.attackerMmr, input.defenderMmr);
  const attacker    = clamp(Math.round(rawAttacker * 100), 0, 100);
  const defender    = 100 - attacker;
  const edge        = Math.abs(attacker - defender);

  const label: WinProbabilityResult["label"] =
    edge <= 10 ? "Balanced"        :
    edge <= 20 ? "Slight Edge"     :
    edge <= 35 ? "Favored"         :
    "Heavy Favorite";

  const favorite: WinProbabilityResult["favorite"] =
    attacker === defender ? "even" :
    attacker > defender   ? "attacker" :
    "defender";

  return { attacker, defender, label, favorite };
}