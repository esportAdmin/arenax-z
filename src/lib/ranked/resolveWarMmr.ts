/**
 * resolveWarMmr.ts
 * ─────────────────────────────────────────────────────────────────────
 * Helper déclenché par battle loop après resolve_territory_war().
 *
 * Architecture (fixes A/B/C/D appliqués) :
 *
 *  1. Claim atomique — UPDATE ... WHERE mmr_resolved = false RETURNING *
 *     + stocke mmr_claimed_at pour détecter les claims orphelins (Fix C)
 *     → Garantit qu'un seul worker traite la war, même en concurrence
 *
 *  2. resolveWinnerClubId() — détection défensive du nom de colonne (Fix D)
 *     → Cherche parmi 4 variantes, lisible et extensible
 *
 *  3. Lecture MMR en parallèle (Promise.all)
 *
 *  4. RPC unique update_match_mmr() → 1 transaction SQL (Fix A)
 *     → Attaquant + défenseur mis à jour atomiquement
 *     → Plus de double RPC séquentielle → plus d'état partiellement mis à jour
 *
 *  5. Rollback du claim documenté (Fix B)
 *     → Rollback si RPC échoue AVANT toute mise à jour
 *     → Pas de rollback asymétrique possible : la transaction SQL est tout-ou-rien
 *
 *  6. Stockage des deltas + mmr_resolved_at — non-bloquant
 *     → Si ce UPDATE échoue, les stats ranked sont déjà commitées (vérité)
 *     → Seul l'affichage UI du delta est absent (fallback "— MMR")
 *
 *  7. Insert player_mmr_history — non-bloquant (Phase 5 — Graph MMR)
 *     → 2 rows en un seul batch (attaquant + défenseur)
 *     → Réutilise le client supabase déjà ouvert (pas de nouvelle instance)
 *     → Si échoue → courbe graph incomplète mais MMR correct
 *
 * ⚠️  Prérequis DB — inclus dans ranked_mmr.sql :
 *   ALTER TABLE club_wars
 *     ADD COLUMN IF NOT EXISTS mmr_delta_attacker  int,
 *     ADD COLUMN IF NOT EXISTS mmr_delta_defender  int,
 *     ADD COLUMN IF NOT EXISTS mmr_claimed_at      timestamptz;
 *
 *   CREATE OR REPLACE FUNCTION update_match_mmr(...) — voir ranked_mmr.sql
 * ─────────────────────────────────────────────────────────────────────
 */

// Si createServiceRoleClient n'existe pas encore :
// src/integrations/supabase/service-role.ts :
//   import { createClient } from "@supabase/supabase-js";
//   export const createServiceRoleClient = () =>
//     createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
import { createServiceRoleClient } from "@/integrations/supabase/service-role";
import { computeElo } from "@/lib/ranked/mmr";
import { getRankFromMmr, detectRankTransition } from "@/lib/ranked/rankSystem";
import {
  computeProgressionUpdate,
  applyProgressionUpdate,
  isInPlacement,
  type SeasonProgressionRow,
} from "@/lib/ranked/rankProgression";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

/** Résultat ELO exposé — utile pour les logs et le monitoring */
export interface EloResult {
  attackerOld:   number;
  attackerNew:   number;
  attackerDelta: number;
  defenderOld:   number;
  defenderNew:   number;
  defenderDelta: number;
  attackerWon:   boolean;
}

export type MmrResolutionResult =
  | { status: "resolved"; warId: string; elo: EloResult }
  | { status: "skipped";  reason: "already_resolved" | "not_ranked" | "war_not_finished" }
  | { status: "error";    message: string };

// ─────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────

const DEFAULT_MMR = 1_000;

/**
 * Variantes possibles du nom de la colonne "gagnant" dans club_wars.
 * ⚠️  Si ta colonne a un autre nom, l'ajouter ici en premier.
 * Ordre = priorité de lookup.
 */
const WINNER_COLUMN_CANDIDATES = [
  "winner_club_id",
  "winning_club_id",
  "war_winner_id",
  "winner_id",
] as const;

type WinnerCandidate = (typeof WINNER_COLUMN_CANDIDATES)[number];

/**
 * Durée max d'un claim non-résolu avant auto-recovery (Fix C).
 * Un claim non résolu après ce délai sera considéré orphelin et
 * récupéré par une cron ou un prochain appel à recoverStaleClaims().
 */
const CLAIM_TIMEOUT_MS = 5 * 60 * 1_000; // 5 minutes

// ─────────────────────────────────────────────
// SEASON CACHE — Fix doc audit
// ─────────────────────────────────────────────

/**
 * Cache en mémoire de la saison active.
 * Évite une requête DB à chaque war résolue — la saison change rarement.
 * TTL = 30s : on relit après 30s pour capter un changement de saison.
 *
 * Thread-safety : JavaScript est mono-thread → pas de race condition possible
 * sur la lecture/écriture de ces deux variables.
 */
let _cachedSeasonId: string | null = null;
let _seasonCachedAt = 0;
const SEASON_CACHE_TTL_MS = 30_000;

async function getActiveSeasonId(
  supabase: ReturnType<typeof createServiceRoleClient>,
): Promise<string | null> {
  const now = Date.now();

  // Cache valide — retour immédiat sans DB round-trip
  if (_seasonCachedAt > 0 && now - _seasonCachedAt < SEASON_CACHE_TTL_MS) {
    return _cachedSeasonId;
  }

  const { data, error } = await supabase
    .from("seasons")
    .select("id")
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    // En cas d'erreur : retourner la valeur cachée si disponible,
    // null sinon — ne jamais bloquer la résolution MMR pour ça.
    console.warn("[getActiveSeasonId] DB error, using cached value:", error.message);
    return _cachedSeasonId;
  }

  _cachedSeasonId = data?.id ?? null;
  _seasonCachedAt = now;
  return _cachedSeasonId;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/**
 * Fix D — Extraction du winner_club_id depuis un objet retourné par Supabase.
 * Cherche parmi les candidats connus celui qui a une valeur non-null.
 * Retourne null si aucun candidat n'est présent ou renseigné.
 */
function resolveWinnerClubId(
  row: Record<string, unknown>,
): string | null {
  const matchingCol = WINNER_COLUMN_CANDIDATES.find(
    (col): col is WinnerCandidate =>
      col in row && row[col] != null && typeof row[col] === "string",
  );
  return matchingCol ? (row[matchingCol] as string) : null;
}

/**
 * Rollback helper — remet mmr_resolved à false et efface mmr_claimed_at.
 * Silencieux (logge sans propager) — le pire cas est un retry au prochain tick.
 */
async function rollbackClaim(
  supabase: ReturnType<typeof createServiceRoleClient>,
  warId: string,
  reason: string,
): Promise<void> {
  const { error } = await supabase
    .from("club_wars")
    .update({ mmr_resolved: false, mmr_claimed_at: null })
    .eq("id", warId);

  if (error) {
    console.error(`[resolveWarMmr] rollback failed for war=${warId} reason=${reason}:`, error.message);
  } else {
    console.debug(`[resolveWarMmr] claim rolled back war=${warId} reason=${reason}`);
  }
}

// ─────────────────────────────────────────────
// CORE
// ─────────────────────────────────────────────

export async function resolveWarMmr(warId: string): Promise<MmrResolutionResult> {
  const supabase = createServiceRoleClient();

  try {
    // ── 1. Claim atomique ──────────────────────────────────────────────────
    // UPDATE + RETURNING dans une seule opération :
    //   a) Seul le premier worker réussit (WHERE mmr_resolved = false)
    //   b) Lecture et lock sont atomiques — pas de "read → write window"
    //   c) mmr_claimed_at horodate le claim pour le timeout auto (Fix C)
    const { data: claimed, error: claimError } = await supabase
      .from("club_wars")
      .update({
        mmr_resolved:   true,
        mmr_claimed_at: new Date().toISOString(),
      })
      .eq("id", warId)
      .eq("mmr_resolved", false)
      .not("attacker_player_id", "is", null) // ranked uniquement
      .select(
        [
          "id",
          "challenger_id",
          "defender_id",
          "attacker_player_id",
          "defender_player_id",
          "win_probability_attacker",   // Phase 11 — MMR context-aware
          "win_probability_defender",
          // Toutes les variantes connues — Supabase retourne null sur les colonnes absentes
          ...WINNER_COLUMN_CANDIDATES,
        ].join(", "),
      )
      .maybeSingle();

    if (claimError) throw claimError;

    // 0 rows → war déjà résolue, non-ranked, ou id invalide
    if (!claimed) {
      return { status: "skipped", reason: "already_resolved" };
    }

    const row = claimed as unknown as Record<string, unknown>;

    // ── 2. Guards post-claim ───────────────────────────────────────────────
    // Vérifier que les joueurs sont renseignés (ranked war)
    if (!row.attacker_player_id || !row.defender_player_id) {
      await rollbackClaim(supabase, warId, "not_ranked");
      return { status: "skipped", reason: "not_ranked" };
    }

    // Fix D — Résoudre le winner via la fonction dédiée
    const winnerClubId = resolveWinnerClubId(row);

    if (!winnerClubId) {
      await rollbackClaim(supabase, warId, "war_not_finished");
      return { status: "skipped", reason: "war_not_finished" };
    }

    const attackerId  = row.attacker_player_id as string;
    const defenderId  = row.defender_player_id as string;
    const attackerWon = winnerClubId === (row.challenger_id as string);

    // ── 3. MMR actuels en parallèle ───────────────────────────────────────
    const [attackerRow, defenderRow] = await Promise.all([
      supabase
        .from("player_ranked_stats")
        .select("mmr, total_games")
        .eq("player_id", attackerId)
        .maybeSingle(),
      supabase
        .from("player_ranked_stats")
        .select("mmr, total_games")
        .eq("player_id", defenderId)
        .maybeSingle(),
    ]);

    const oldAttackerMmr = Number(attackerRow.data?.mmr         ?? DEFAULT_MMR);
    const oldDefenderMmr = Number(defenderRow.data?.mmr         ?? DEFAULT_MMR);
    const attackerGames  = Number(attackerRow.data?.total_games ?? 0);
    const defenderGames  = Number(defenderRow.data?.total_games ?? 0);

    // ── 4. Calcul ELO avec K-factor variable ──────────────────────────────
    // K = 40 (< 30 parties) | 32 (< 100) | 16 (vétéran)
    const { newMmrA, newMmrB } = computeElo({
      mmrA: oldAttackerMmr,
      mmrB: oldDefenderMmr,
      scoreA: attackerWon ? 1 : 0,
      gamesA: attackerGames,
      gamesB: defenderGames,
    });

    // ── 4b. Ajustement context-aware (win probability) ────────────────────
    // Si la win_probability a été stockée au moment du pairing,
    // on ajuste le delta MMR pour récompenser les upsets et amortir les
    // victoires attendues — sans modifier le MMR de base (formule ELO reste la vérité).
    //
    // Rationale : ELO calcule déjà un "expected score" interne, mais ne connaît
    // pas la probabilité réelle de ce pairing. On applique un multiplicateur sur
    // le DELTA seulement, jamais sur le MMR de base.
    //
    // Multiplicateur :
    //   upset (gagner en étant nettement défavorisé ≤ 35%) → ×1.25
    //   expected win fort (≥ 65%)                          → ×0.80
    //   normal (35–65%)                                    → ×1.00
    //
    // Floor : on ne descend jamais en dessous de ±1 MMR pour éviter les stalls.

    const winProbAttacker = row.win_probability_attacker != null
      ? Number(row.win_probability_attacker)
      : null;

    function applyContextMultiplier(delta: number, winProb: number | null, won: boolean): number {
      if (winProb == null || delta === 0) return delta;

      const favorProb  = won ? winProb : (100 - winProb);
      const multiplier =
        favorProb <= 35 ? 1.25 :   // upset — grosse surprise
        favorProb >= 65 ? 0.80 :   // expected — victoire facile
        1.00;                       // match équilibré

      const adjusted = Math.round(delta * multiplier);
      // Floor ±1 — jamais de stall à 0 MMR
      if (delta > 0) return Math.max(1, adjusted);
      if (delta < 0) return Math.min(-1, adjusted);
      return 0;
    }

    const rawAttackerDelta = newMmrA - oldAttackerMmr;
    const rawDefenderDelta = newMmrB - oldDefenderMmr;

    const attackerDelta = applyContextMultiplier(rawAttackerDelta, winProbAttacker, attackerWon);
    const defenderDelta = applyContextMultiplier(rawDefenderDelta,
      winProbAttacker != null ? 100 - winProbAttacker : null, !attackerWon);

    // MMR finaux ajustés
    const newAFinal = oldAttackerMmr + attackerDelta;
    const newBFinal = oldDefenderMmr + defenderDelta;

    // ── 5. Fix A — RPC unique atomique ────────────────────────────────────
    // update_match_mmr met à jour attaquant ET défenseur dans une seule
    // transaction SQL. Si elle échoue, AUCUN des deux n'est modifié.
    // → Supprime l'asymétrie de rollback (Fix B) : plus d'état partiel possible.
    const { error: rpcError } = await supabase.rpc("update_match_mmr", {
      p_war_id:         warId,
      p_attacker_id:    attackerId,
      p_defender_id:    defenderId,
      p_new_attacker_mmr: newAFinal,
      p_new_defender_mmr: newBFinal,
      p_attacker_won:   attackerWon,
    });

    if (rpcError) {
      // Rollback complet du claim — aucune stat n'a été modifiée (transaction)
      await rollbackClaim(supabase, warId, `rpc_failed: ${rpcError.message}`);
      throw rpcError;
    }

    // ── 6. Stocker les deltas + horodatage + MMR snapshots ───────────────
    // Non-bloquant : la transaction ranked est déjà commitée.
    // mmr_before/after permettent d'afficher "1480 → 1504" dans la Victory Screen.
    const { error: deltaError } = await supabase
      .from("club_wars")
      .update({
        mmr_delta_attacker:    attackerDelta,
        mmr_delta_defender:    defenderDelta,
        attacker_mmr_before:   oldAttackerMmr,
        attacker_mmr_after:    newAFinal,
        defender_mmr_before:   oldDefenderMmr,
        defender_mmr_after:    newBFinal,
        mmr_resolved_at:       new Date().toISOString(),
        mmr_claimed_at:        null, // effacer le claim timestamp après succès
      })
      .eq("id", warId);

    if (deltaError) {
      console.warn("[resolveWarMmr] delta store failed (non-blocking):", deltaError.message);
    }

    // ── 7. Historique MMR (player_mmr_history) ────────────────────────────
    // Non-bloquant : insert des 2 snapshots (attaquant + défenseur).
    // Si l'insert échoue → le MMR est correct, seule la courbe graph est incomplète.
    // Les 2 rows sont insérées en un seul appel batch.

    // Fix C — getActiveSeasonId() utilise le cache TTL 30s
    // → évite une DB round-trip à chaque war résolue
    const seasonId = await getActiveSeasonId(supabase);

    const { error: historyError } = await supabase
      .from("player_mmr_history")
      .insert([
        {
          player_id:  attackerId,
          season_id:  seasonId,
          war_id:     warId,
          mmr_before: oldAttackerMmr,
          mmr_after:  newAFinal,
          mmr_delta:  attackerDelta,
          result:     attackerWon ? "win" : "loss",
        },
        {
          player_id:  defenderId,
          season_id:  seasonId,
          war_id:     warId,
          mmr_before: oldDefenderMmr,
          mmr_after:  newBFinal,
          mmr_delta:  defenderDelta,
          result:     attackerWon ? "loss" : "win",
        },
      ]);

    if (historyError) {
      console.warn("[resolveWarMmr] mmr history insert failed (non-blocking):", historyError.message);
    }

    // ── 8. Progression rang saisonnier (Phases 8 + 9) ────────────────────
    // Non-bloquant. Lit l'état actuel pour calculer protection/placement,
    // puis applique la mise à jour. Batch parallèle attaquant + défenseur.
    if (seasonId) {
      const now = Date.now(); // timestamp déterministe partagé

      // Fix A — 1 requête batch pour les 2 joueurs au lieu de 2 SELECT séparés
      const { data: seasonRows } = await supabase
        .from("season_player_ranked_stats")
        .select(`
          player_id, season_id, mmr, rank_tier, rank_division, rank_points,
          placement_matches_played, placement_complete, placement_seed_mmr,
          demotion_protected_until, last_rank_change_at,
          last_ranked_match_at, decay_applied_at
        `)
        .eq("season_id", seasonId)
        .in("player_id", [attackerId, defenderId]);

      // Indexer les rows par player_id pour lookup O(1)
      const rowsByPlayer = new Map<string, SeasonProgressionRow>();
      for (const row of (seasonRows ?? []) as SeasonProgressionRow[]) {
        rowsByPlayer.set(row.player_id, row);
      }

      // Fallback si la row n'existe pas encore (nouveau joueur sur la saison)
      const defaultRow = (playerId: string): SeasonProgressionRow => ({
        player_id: playerId, season_id: seasonId, mmr: 1000,
        rank_tier: "bronze", rank_division: 4, rank_points: 0,
        placement_matches_played: 0, placement_complete: false,
        placement_seed_mmr: null, demotion_protected_until: null,
        last_rank_change_at: null, last_ranked_match_at: null,
        decay_applied_at: null,
      });

      const progressionA = computeProgressionUpdate(
        rowsByPlayer.get(attackerId) ?? defaultRow(attackerId), newAFinal, attackerWon, now,
      );
      const progressionB = computeProgressionUpdate(
        rowsByPlayer.get(defenderId) ?? defaultRow(defenderId), newBFinal, !attackerWon, now,
      );

      await Promise.all([
        applyProgressionUpdate(supabase, attackerId, seasonId, progressionA),
        applyProgressionUpdate(supabase, defenderId, seasonId, progressionB),
      ]);

      // Log transitions notables
      const logTransition = (pid: string, prog: typeof progressionA) => {
        if (prog._isPromotion) {
          console.log(`[MMR] 🏅 PROMOTION ${pid.slice(0, 8)} → ${prog.rank_tier} ${prog.rank_division}`);
        } else if (prog._isDemotion) {
          console.log(`[MMR] 📉 DEMOTION  ${pid.slice(0, 8)} → ${prog.rank_tier} ${prog.rank_division}`);
        } else if (prog._isPlacementComplete) {
          console.log(`[MMR] 🎯 PLACEMENT COMPLETE ${pid.slice(0, 8)} → ${prog.rank_tier} ${prog.rank_division}`);
        }
      };

      logTransition(attackerId, progressionA);
      logTransition(defenderId, progressionB);
    }

    const elo: EloResult = {
      attackerOld:   oldAttackerMmr,
      attackerNew:   newAFinal,
      attackerDelta,
      defenderOld:   oldDefenderMmr,
      defenderNew:   newBFinal,
      defenderDelta,
      attackerWon,
    };

    console.log(
      `[resolveWarMmr] ✅ war=${warId}` +
      ` A:${oldAttackerMmr}→${newAFinal}(${attackerDelta >= 0 ? "+" : ""}${attackerDelta})` +
      ` D:${oldDefenderMmr}→${newBFinal}(${defenderDelta >= 0 ? "+" : ""}${defenderDelta})`,
    );

    return { status: "resolved", warId, elo };

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[resolveWarMmr] ❌ failed:", message);
    return { status: "error", message };
  }
}

// ─────────────────────────────────────────────
// WRAPPER NON-BLOQUANT (battle loop)
// ─────────────────────────────────────────────

/**
 * Déclenché par loop/route.ts après resolve_territory_war().
 * Logge sans propager — si le MMR plante, la war reste résolue côté RTS.
 */
export async function triggerMmrResolution(warId: string): Promise<void> {
  const result = await resolveWarMmr(warId);

  switch (result.status) {
    case "resolved":
      console.log(
        `[MMR] ✅ war=${warId}` +
        ` A: ${result.elo.attackerOld}→${result.elo.attackerNew}` +
        ` (${result.elo.attackerDelta >= 0 ? "+" : ""}${result.elo.attackerDelta})` +
        ` D: ${result.elo.defenderOld}→${result.elo.defenderNew}` +
        ` (${result.elo.defenderDelta >= 0 ? "+" : ""}${result.elo.defenderDelta})`,
      );
      break;
    case "skipped":
      console.debug(`[MMR] ⏭  war=${warId} reason=${result.reason}`);
      break;
    case "error":
      console.error(`[MMR] ❌ war=${warId}:`, result.message);
      break;
  }
}

// ─────────────────────────────────────────────
// Fix C — AUTO-RECOVERY DES CLAIMS ORPHELINS
// ─────────────────────────────────────────────

/**
 * À appeler périodiquement (ex: dans battle loop, ou cron toutes les 5min).
 * Détecte les wars claimées mais jamais résolues (crash entre claim et RPC)
 * et remet mmr_resolved = false pour qu'elles soient retentées.
 *
 * Requiert la colonne mmr_claimed_at sur club_wars (incluse dans ranked_mmr.sql).
 */
export async function recoverStaleClaims(): Promise<number> {
  const supabase = createServiceRoleClient();
  const cutoff = new Date(Date.now() - CLAIM_TIMEOUT_MS).toISOString();

  const { data, error } = await supabase
    .from("club_wars")
    .update({ mmr_resolved: false, mmr_claimed_at: null })
    .eq("mmr_resolved", true)
    .eq("mmr_resolved_at", null)      // jamais complété (delta step jamais atteint)
    .lt("mmr_claimed_at", cutoff)     // claim trop ancien
    .not("attacker_player_id", "is", null)
    .select("id");

  if (error) {
    console.error("[recoverStaleClaims] failed:", error.message);
    return 0;
  }

  const count = data?.length ?? 0;
  if (count > 0) {
    console.warn(`[recoverStaleClaims] recovered ${count} stale claim(s)`);
  }
  return count;
}
