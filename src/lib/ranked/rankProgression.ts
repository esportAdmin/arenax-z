/**
 * rankProgression.ts
 * ─────────────────────────────────────────────────────────────────────
 * Logique de progression compétitive — Phases 8, 9, 10.
 * Isolée de rankSystem.ts (dérivation MMR → rang) et de resolveWarMmr.ts
 * pour rester testable et évolutive indépendamment.
 *
 * Principe fondamental :
 *   Le MMR est la VÉRITÉ mathématique. Il ne change jamais ici.
 *   La progression enrichie (promotion/protection/placement) est une
 *   couche PRODUIT qui tempère la lecture du rang sans modifier le MMR.
 *
 * Architecture :
 *   computeProgressionUpdate()  → calcule l'état à écrire en DB
 *   applyProgressionUpdate()    → écrit en DB (non-bloquant)
 *   computeDecay()              → calcule le decay Diamond inactif
 *   applyDecayBatch()           → route cron decay
 * ─────────────────────────────────────────────────────────────────────
 */

import { createServiceRoleClient } from "@/integrations/supabase/service-role";
import {
  getRankFromMmr,
  detectRankTransition,
  type RankTier,
  type RankState,
} from "@/lib/ranked/rankSystem";

// ─────────────────────────────────────────────
// CONFIGURATION PRODUIT
// ─────────────────────────────────────────────

export const PROGRESSION_CONFIG = {
  /** Nombre de matchs de placement par saison */
  PLACEMENT_MATCHES_REQUIRED: 5,

  /** Durée de protection anti-demotion après une promotion (en heures) */
  DEMOTION_PROTECTION_HOURS: 72, // 3 jours

  /**
   * Decay Diamond — seulement si inactif depuis X jours.
   * MMR perdu par application de decay.
   */
  decay: {
    /** Tier minimum pour être soumis au decay */
    minTier:            "diamond" as RankTier,
    /** Jours d'inactivité avant le premier decay */
    inactivityDaysStart: 7,
    /** MMR retiré à chaque application */
    mmrPerApplication:  15,
    /** Plancher : ne jamais descendre sous ce MMR en Diamond via decay seul */
    mmrFloor:           2000,
  },
} as const;

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

/** Row telle que lue depuis season_player_ranked_stats */
export interface SeasonProgressionRow {
  player_id: string;
  season_id: string;
  mmr: number;
  rank_tier: string | null;
  rank_division: number | null;
  rank_points: number | null;
  placement_matches_played: number;
  placement_complete: boolean;
  placement_seed_mmr: number | null;
  demotion_protected_until: string | null;
  last_rank_change_at: string | null;
  last_ranked_match_at: string | null;
  decay_applied_at: string | null;
}

/** Ce qu'on va écrire dans season_player_ranked_stats */
export interface ProgressionUpdate {
  rank_tier: string;
  rank_division: number;
  rank_points: number;
  placement_matches_played: number;
  placement_complete: boolean;
  demotion_protected_until: string | null;
  last_rank_change_at: string | null;
  last_ranked_match_at: string;
  /** true si le joueur vient de franchir un nouveau tier */
  _isPromotion: boolean;
  _isDemotion: boolean;
  _isPlacementComplete: boolean;
  _placementMatchesLeft: number;
}

// ─────────────────────────────────────────────
// LOGIQUE PLACEMENT (Phase 9)
// ─────────────────────────────────────────────

/**
 * Vérifie si le joueur est encore en phase de placement.
 * Les placements utilisent le K-factor agressif naturellement
 * (computeElo retourne K=40 pour < 30 parties) — pas de code supplémentaire.
 */
export function isInPlacement(row: SeasonProgressionRow): boolean {
  return !row.placement_complete &&
    row.placement_matches_played < PROGRESSION_CONFIG.PLACEMENT_MATCHES_REQUIRED;
}

/**
 * Calcule le rang de placement initial depuis le MMR historique.
 * On démarre 1 division en dessous du rang "normal" pour encourager la progression.
 */
export function computePlacementSeedRank(historicalMmr: number): RankState {
  const penaltyMmr = Math.max(0, historicalMmr - 50); // -50 MMR symbolique
  return getRankFromMmr(penaltyMmr);
}

// ─────────────────────────────────────────────
// LOGIQUE PROTECTION (Phase 8 + 10)
// ─────────────────────────────────────────────

/**
 * true si la protection anti-demotion est active à cet instant.
 */
export function isDemotionProtected(row: SeasonProgressionRow, now = Date.now()): boolean {
  if (!row.demotion_protected_until) return false;
  return new Date(row.demotion_protected_until).getTime() > now;
}

/**
 * ISO string de fin de protection anti-demotion depuis maintenant.
 */
function demotionProtectionUntil(): string {
  return new Date(
    Date.now() + PROGRESSION_CONFIG.DEMOTION_PROTECTION_HOURS * 3_600_000,
  ).toISOString();
}

// ─────────────────────────────────────────────
// CALCUL PRINCIPAL (Phase 8 + 9)
// ─────────────────────────────────────────────

/**
 * Calcule la mise à jour de progression après un match.
 *
 * @param row     État actuel du joueur dans season_player_ranked_stats
 * @param newMmr  Nouveau MMR après le match (déjà calculé par computeElo)
 * @param won     true si victoire
 * @param now     Timestamp du tick (déterministe — passé depuis resolveWarMmr)
 */
export function computeProgressionUpdate(
  row: SeasonProgressionRow,
  newMmr: number,
  won: boolean,
  now = Date.now(),
): ProgressionUpdate {
  const nowIso = new Date(now).toISOString();

  // ── Phase 9 : suivi des placements ───────────────────────────────────
  const placementMatchesPlayed = row.placement_matches_played + 1;
  const placementComplete =
    row.placement_complete ||
    placementMatchesPlayed >= PROGRESSION_CONFIG.PLACEMENT_MATCHES_REQUIRED;
  const placementMatchesLeft = Math.max(
    0,
    PROGRESSION_CONFIG.PLACEMENT_MATCHES_REQUIRED - placementMatchesPlayed,
  );
  const isPlacementComplete = !row.placement_complete && placementComplete;

  // ── Rang dérivé du nouveau MMR ────────────────────────────────────────
  const newRank  = getRankFromMmr(newMmr);
  const oldRank  = getRankFromMmr(row.mmr);
  const trans    = detectRankTransition(row.mmr, newMmr);

  // ── Phase 8 : protection anti-demotion ───────────────────────────────
  let demotionProtectedUntil: string | null = row.demotion_protected_until ?? null;
  let lastRankChangeAt: string | null       = row.last_rank_change_at ?? null;

  if (trans.isPromotion) {
    // Promotion → activer protection + horodater le changement
    demotionProtectedUntil = demotionProtectionUntil();
    lastRankChangeAt       = nowIso;
  } else if (trans.isDemotion) {
    if (isDemotionProtected(row, now)) {
      // Protection active → bloquer la démotion.
      // On retourne le tier/division AVANT la démotion (même MMR bas).
      // Le joueur voit ses LP clampés à 0 mais ne descend pas.
      return {
        rank_tier:               oldRank.tier,
        rank_division:           oldRank.division,
        rank_points:             0, // clamp LP à 0 — signal visuel "en danger"
        placement_matches_played: placementMatchesPlayed,
        placement_complete:       placementComplete,
        demotion_protected_until: demotionProtectedUntil,
        last_rank_change_at:      lastRankChangeAt,
        last_ranked_match_at:     nowIso,
        _isPromotion:             false,
        _isDemotion:              false, // bloquée — pas de dérank réel
        _isPlacementComplete:     isPlacementComplete,
        _placementMatchesLeft:    placementMatchesLeft,
      };
    }
    // Démotion non protégée → se produit + effacer la protection expirée
    demotionProtectedUntil = null;
    lastRankChangeAt       = nowIso;
  } else if (trans.isDivisionUp || trans.isDivisionDown) {
    lastRankChangeAt = nowIso;
  }

  return {
    rank_tier:               newRank.tier,
    rank_division:           newRank.division,
    rank_points:             newRank.points,
    placement_matches_played: placementMatchesPlayed,
    placement_complete:       placementComplete,
    demotion_protected_until: demotionProtectedUntil,
    last_rank_change_at:      lastRankChangeAt,
    last_ranked_match_at:     nowIso,
    _isPromotion:             trans.isPromotion,
    _isDemotion:              trans.isDemotion && !isDemotionProtected(row, now),
    _isPlacementComplete:     isPlacementComplete,
    _placementMatchesLeft:    placementMatchesLeft,
  };
}

// ─────────────────────────────────────────────
// ÉCRITURE EN DB (non-bloquant)
// ─────────────────────────────────────────────

/**
 * Applique une ProgressionUpdate dans season_player_ranked_stats.
 * Non-bloquant : si l'update échoue, le MMR reste correct.
 * Les champs privés (_isPromotion, etc.) ne sont pas écrits en DB.
 */
export async function applyProgressionUpdate(
  supabase: ReturnType<typeof createServiceRoleClient>,
  playerId: string,
  seasonId: string,
  update: ProgressionUpdate,
): Promise<void> {
  const { error } = await supabase
    .from("season_player_ranked_stats")
    .update({
      rank_tier:               update.rank_tier,
      rank_division:           update.rank_division,
      rank_points:             update.rank_points,
      placement_matches_played: update.placement_matches_played,
      placement_complete:       update.placement_complete,
      demotion_protected_until: update.demotion_protected_until,
      last_rank_change_at:      update.last_rank_change_at,
      last_ranked_match_at:     update.last_ranked_match_at,
    })
    .eq("player_id", playerId)
    .eq("season_id", seasonId);

  if (error) {
    console.warn(
      `[rankProgression] update failed player=${playerId.slice(0, 8)} (non-blocking):`,
      error.message,
    );
  }
}

// ─────────────────────────────────────────────
// DECAY DIAMOND (Phase 10)
// ─────────────────────────────────────────────

interface DecayTarget {
  player_id: string;
  season_id: string;
  mmr: number;
  last_ranked_match_at: string | null;
  decay_applied_at: string | null;
}

/**
 * Calcule si un joueur Diamond est éligible au decay et retourne le nouveau MMR.
 * Retourne null si pas éligible.
 *
 * Fix B — rate limit : un seul decay par tranche de 24h maximum.
 * decay_applied_at est lu depuis la DB et vérifié avant d'appliquer.
 */
export function computeDecay(
  target: DecayTarget,
  now = Date.now(),
): number | null {
  if (!target.last_ranked_match_at) return null;

  const { decay } = PROGRESSION_CONFIG;

  // ── Rate limit 24h — évite d'appliquer plusieurs fois dans la même journée
  if (target.decay_applied_at) {
    const lastDecay = new Date(target.decay_applied_at).getTime();
    const hoursSinceDecay = (now - lastDecay) / 3_600_000;
    if (hoursSinceDecay < 24) return null;
  }

  const lastMatch   = new Date(target.last_ranked_match_at).getTime();
  const inactiveDays = (now - lastMatch) / 86_400_000;

  if (inactiveDays < decay.inactivityDaysStart) return null;
  if (target.mmr <= decay.mmrFloor) return null;

  return Math.max(decay.mmrFloor, target.mmr - decay.mmrPerApplication);
}

/**
 * Applique le decay sur tous les joueurs Diamond inactifs de la saison.
 * Appelé par app/api/cron/rank-decay/route.ts.
 * Retourne le nombre de joueurs affectés.
 */
export async function applyDecayBatch(seasonId: string, now = Date.now()): Promise<number> {
  const supabase = createServiceRoleClient();
  let affected   = 0;

  const { decay } = PROGRESSION_CONFIG;
  const inactivityCutoff = new Date(now - decay.inactivityDaysStart * 86_400_000).toISOString();

  // Fix B+C — inclure decay_applied_at dans le SELECT pour le rate limit
  const { data: targets, error: fetchError } = await supabase
    .from("season_player_ranked_stats")
    .select("player_id, season_id, mmr, last_ranked_match_at, decay_applied_at")
    .eq("season_id", seasonId)
    .eq("rank_tier", decay.minTier)
    .gt("mmr", decay.mmrFloor)
    .or(`last_ranked_match_at.lt.${inactivityCutoff},last_ranked_match_at.is.null`);

  if (fetchError) {
    console.error("[rankDecay] fetch targets failed:", fetchError.message);
    return 0;
  }

  const nowIso = new Date(now).toISOString();

  // Fix C — batch parallèle au lieu de boucle séquentielle
  const decayResults = await Promise.all(
    ((targets ?? []) as DecayTarget[]).map(async (target) => {
      const newMmr = computeDecay(target, now);
      if (newMmr === null) return false;

      const newRank = getRankFromMmr(newMmr);

      // Fix C — mise à jour saison + global en parallèle dans le même tick
      const [seasonErr, globalErr] = await Promise.all([
        supabase
          .from("season_player_ranked_stats")
          .update({
            mmr:              newMmr,
            rank_tier:        newRank.tier,
            rank_division:    newRank.division,
            rank_points:      newRank.points,
            decay_applied_at: nowIso,
          })
          .eq("player_id", target.player_id)
          .eq("season_id", target.season_id)
          .then(({ error }) => error),

        // Sync global — même valeurs, transaction séparée acceptable
        // (le season record est la source de vérité pour le decay)
        supabase
          .from("player_ranked_stats")
          .update({
            mmr:           newMmr,
            rank_tier:     newRank.tier,
            rank_division: newRank.division,
            rank_points:   newRank.points,
          })
          .eq("player_id", target.player_id)
          .then(({ error }) => error),
      ]);

      if (seasonErr) {
        console.warn(`[rankDecay] season update failed ${target.player_id.slice(0, 8)}:`, seasonErr.message);
        return false;
      }
      if (globalErr) {
        console.warn(`[rankDecay] global update failed ${target.player_id.slice(0, 8)}:`, globalErr.message);
        // Non-bloquant sur le global — le season record est déjà correct
      }

      console.log(
        `[rankDecay] 📉 ${target.player_id.slice(0, 8)}` +
        ` mmr=${target.mmr}→${newMmr} (${newMmr - target.mmr})`,
      );
      return true;
    }),
  );

  affected = decayResults.filter(Boolean).length;
  return affected;
}
