/**
 * rankSystem.ts
 * ─────────────────────────────────────────────────────────────────────
 * Couche produit du rang compétitif — Phase 7.
 * Isolé de mmr.ts pour rester testable et évolutif indépendamment.
 *
 * Principe :
 *   Le MMR est la vérité mathématique.
 *   Le rang (tier + division + points) est TOUJOURS dérivé du MMR.
 *   → Pas de désynchronisation possible entre MMR et rang affiché.
 *
 * Structure :
 *   5 tiers : Bronze, Silver, Gold, Platinum, Diamond
 *   4 divisions par tier (IV le plus bas, I le plus haut)
 *   Points LP 0–100 dans la division (100 = seuil de promotion)
 *
 * Exception Diamond :
 *   Division unique (I), points = MMR - 2000 (non capé à 100).
 *   Permet un classement granulaire en haut du ladder.
 * ─────────────────────────────────────────────────────────────────────
 */

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type RankTier = "bronze" | "silver" | "gold" | "platinum" | "diamond";

export interface RankState {
  tier:     RankTier;
  /** Division IV (4) = plus bas, I (1) = plus haut dans le tier */
  division: 1 | 2 | 3 | 4;
  /** Points de ligue dans la division : 0–100 (ou MMR-2000 en Diamond) */
  points:   number;
  /** Rang affiché complet, ex: "Gold II · 64 LP" */
  label:    string;
}

export interface RankTransition {
  before: RankState;
  after:  RankState;
  /** true si passage à un tier supérieur */
  isPromotion: boolean;
  /** true si passage à un tier inférieur */
  isDemotion:  boolean;
  /** true si passage à une division supérieure dans le même tier */
  isDivisionUp:   boolean;
  /** true si passage à une division inférieure dans le même tier */
  isDivisionDown: boolean;
}

// ─────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────

interface TierConfig {
  tier:    RankTier;
  /** MMR minimum pour entrer dans ce tier */
  min:     number;
  /** MMR maximum (inclus) */
  max:     number;
  /** Couleur CSS pour l'UI */
  color:   string;
  glow:    string;
  badge:   string;
}

export const TIER_CONFIG: Record<RankTier, TierConfig> = {
  bronze: {
    tier:  "bronze",
    min:   0,
    max:   1099,
    color: "text-amber-500",
    glow:  "shadow-amber-500/20",
    badge: "bg-amber-500/15 border-amber-500/30",
  },
  silver: {
    tier:  "silver",
    min:   1100,
    max:   1299,
    color: "text-slate-300",
    glow:  "shadow-slate-300/20",
    badge: "bg-slate-300/10 border-slate-300/20",
  },
  gold: {
    tier:  "gold",
    min:   1300,
    max:   1599,
    color: "text-yellow-400",
    glow:  "shadow-yellow-400/20",
    badge: "bg-yellow-400/15 border-yellow-400/30",
  },
  platinum: {
    tier:  "platinum",
    min:   1600,
    max:   1999,
    color: "text-cyan-300",
    glow:  "shadow-cyan-300/20",
    badge: "bg-cyan-300/15 border-cyan-300/30",
  },
  diamond: {
    tier:  "diamond",
    min:   2000,
    max:   999_999,
    color: "text-violet-300",
    glow:  "shadow-violet-300/20",
    badge: "bg-violet-300/15 border-violet-300/30",
  },
};

const TIER_ORDER: RankTier[] = ["bronze", "silver", "gold", "platinum", "diamond"];

// ─────────────────────────────────────────────
// HELPERS INTERNES
// ─────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getTierConfig(mmr: number): TierConfig {
  // Cherche du plus haut au plus bas pour que les MMR > 9999 tombent en Diamond
  for (let i = TIER_ORDER.length - 1; i >= 0; i--) {
    const cfg = TIER_CONFIG[TIER_ORDER[i]];
    if (mmr >= cfg.min) return cfg;
  }
  return TIER_CONFIG.bronze;
}

// ─────────────────────────────────────────────
// API PUBLIQUE
// ─────────────────────────────────────────────

/**
 * Formate un numéro de division en chiffre romain.
 */
export function formatDivision(division: number): "I" | "II" | "III" | "IV" | string {
  switch (division) {
    case 1: return "I";
    case 2: return "II";
    case 3: return "III";
    case 4: return "IV";
    default: return String(division);
  }
}

/**
 * Calcule le rang complet depuis un MMR brut.
 *
 * Division mapping (IV = bas, I = haut) :
 *   bucket 0 (0–24% du tier) → Division IV
 *   bucket 1 (25–49%)        → Division III
 *   bucket 2 (50–74%)        → Division II
 *   bucket 3 (75–100%)       → Division I
 *
 * Points LP = progression dans la division (0–100).
 * En Diamond : division = I, points = MMR - 2000 (non capé, pour le ladder).
 */
export function getRankFromMmr(mmr: number): RankState {
  const safeMmr = Math.max(0, Math.round(mmr));
  const cfg     = getTierConfig(safeMmr);

  // ── Diamond — division unique, points non capés ───────────────────
  if (cfg.tier === "diamond") {
    const points = Math.max(0, safeMmr - cfg.min);
    return {
      tier:     "diamond",
      division: 1,
      points,
      label:    `Diamond I · ${points} LP`,
    };
  }

  // ── Tiers standard — 4 divisions de taille égale ─────────────────
  const tierSpan    = cfg.max - cfg.min + 1;
  const divSpan     = Math.floor(tierSpan / 4);
  const relative    = clamp(safeMmr - cfg.min, 0, tierSpan - 1);

  // bucket 0 = bas du tier (Division IV), bucket 3 = haut (Division I)
  const bucket      = Math.min(3, Math.floor(relative / divSpan));
  const division    = (4 - bucket) as 1 | 2 | 3 | 4;

  // Points de progression dans la division (0–100)
  const bucketStart    = bucket * divSpan;
  const bucketProgress = relative - bucketStart;
  const points         = clamp(
    Math.round((bucketProgress / Math.max(1, divSpan - 1)) * 100),
    0,
    100,
  );

  const tierLabel = cfg.tier.charAt(0).toUpperCase() + cfg.tier.slice(1);
  return {
    tier: cfg.tier,
    division,
    points,
    label: `${tierLabel} ${formatDivision(division)} · ${points} LP`,
  };
}

/**
 * Détecte les transitions de rang entre deux MMR.
 * Utilisé par resolveWarMmr.ts pour logguer les promotions/démotions,
 * et par PlayerRankCard pour afficher un badge visuel.
 */
export function detectRankTransition(
  oldMmr: number,
  newMmr: number,
): RankTransition {
  const before = getRankFromMmr(oldMmr);
  const after  = getRankFromMmr(newMmr);

  const beforeTierIdx = TIER_ORDER.indexOf(before.tier);
  const afterTierIdx  = TIER_ORDER.indexOf(after.tier);

  return {
    before,
    after,
    isPromotion:   afterTierIdx > beforeTierIdx,
    isDemotion:    afterTierIdx < beforeTierIdx,
    isDivisionUp:  afterTierIdx === beforeTierIdx && after.division < before.division,
    isDivisionDown: afterTierIdx === beforeTierIdx && after.division > before.division,
  };
}

/**
 * MMR minimum pour atteindre le tier suivant.
 * Utile pour afficher "X LP pour monter en Platinum".
 * Retourne null si déjà Diamond.
 */
export function mmrToNextTier(mmr: number): number | null {
  const cfg = getTierConfig(mmr);
  if (cfg.tier === "diamond") return null;
  const currentTierIdx = TIER_ORDER.indexOf(cfg.tier);
  const nextTier       = TIER_ORDER[currentTierIdx + 1];
  return TIER_CONFIG[nextTier].min - mmr;
}

/**
 * Retourne la config visuelle du tier (couleurs, badge CSS).
 * Utilisé par PlayerRankCard et PlayerLeaderboardTable.
 */
export function getTierDisplay(tier: RankTier): TierConfig {
  return TIER_CONFIG[tier] ?? TIER_CONFIG.bronze;
}
