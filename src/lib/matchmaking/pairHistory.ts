/**
 * pairHistory.ts
 * ─────────────────────────────────────────────────────────────────────
 * Lecture et écriture de l'historique des paires de matchmaking.
 * Utilisé pour la pénalité de rematch dans le scorer.
 *
 * Améliorations vs doc Phase 6 :
 *   - Client Supabase créé une seule fois (module-level singleton)
 *   - hadRecentMatchBatch() : N joueurs en 1 requête au lieu de N requêtes
 *   - FK sur auth.users(id) cohérent avec player_mmr_history
 *   - normalizePair() garantit (A < B) → pas de doublon (A,B) vs (B,A)
 * ─────────────────────────────────────────────────────────────────────
 */

import { createServiceRoleClient } from "@/integrations/supabase/service-role";

// ─────────────────────────────────────────────
// CLIENT SINGLETON
// ─────────────────────────────────────────────

// Créé une seule fois au chargement du module — pas à chaque appel.
// Safe : le service role client est stateless et thread-safe.
const supabase = createServiceRoleClient();

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/**
 * Normalise la paire pour éviter les doublons (A,B) vs (B,A).
 * La contrainte DB CHECK (player_a_id <> player_b_id) est aussi en place.
 */
function normalizePair(
  a: string,
  b: string,
): { playerA: string; playerB: string } {
  return a < b ? { playerA: a, playerB: b } : { playerA: b, playerB: a };
}

// ─────────────────────────────────────────────
// ÉCRITURE
// ─────────────────────────────────────────────

/**
 * Enregistre une paire après création réussie d'une war.
 * Non-bloquant : si l'insert échoue, on logge sans propager.
 */
export async function recordPairHistory(
  playerOneId: string,
  playerTwoId: string,
  warId: string,
): Promise<void> {
  const { playerA, playerB } = normalizePair(playerOneId, playerTwoId);

  const { error } = await supabase.from("matchmaking_pair_history").insert({
    player_a_id: playerA,
    player_b_id: playerB,
    war_id:      warId,
  });

  if (error) {
    console.warn("[pairHistory] insert failed (non-blocking):", error.message);
  }
}

// ─────────────────────────────────────────────
// LECTURE
// ─────────────────────────────────────────────

/**
 * Vérifie si deux joueurs se sont affrontés récemment.
 * Utiliser hadRecentMatchBatch() si plusieurs candidats — évite N requêtes.
 */
export async function hadRecentMatch(
  playerOneId: string,
  playerTwoId: string,
  withinHours = 6,
): Promise<boolean> {
  const { playerA, playerB } = normalizePair(playerOneId, playerTwoId);
  const cutoff = new Date(Date.now() - withinHours * 3_600_000).toISOString();

  const { data, error } = await supabase
    .from("matchmaking_pair_history")
    .select("id")
    .eq("player_a_id", playerA)
    .eq("player_b_id", playerB)
    .gte("created_at", cutoff)
    .limit(1);

  if (error) {
    console.warn("[pairHistory] lookup failed (safe fallback = false):", error.message);
    return false; // En cas d'erreur : pas de pénalité → ne bloque pas le matching
  }

  return (data ?? []).length > 0;
}

/**
 * Fix perf — batch lookup pour N candidats en 1 requête.
 * Retourne une Map<candidateId, boolean>.
 *
 * Usage dans automatic.ts :
 *   const rematchMap = await hadRecentMatchBatch(seeker.playerId, candidateIds, 6);
 *   // puis dans la boucle : rematchMap.get(candidate.playerId) ?? false
 *
 * Algorithme :
 *   On lit toutes les paires récentes impliquant le seeker.
 *   Une seule requête OR filtrée par (player_a = seeker OR player_b = seeker).
 *   On reconstruit la Map localement.
 */
export async function hadRecentMatchBatch(
  seekerId: string,
  candidateIds: string[],
  withinHours = 6,
): Promise<Map<string, boolean>> {
  if (candidateIds.length === 0) return new Map();

  const cutoff = new Date(Date.now() - withinHours * 3_600_000).toISOString();

  // Lire toutes les paires récentes où le seeker est impliqué
  const { data, error } = await supabase
    .from("matchmaking_pair_history")
    .select("player_a_id, player_b_id")
    .gte("created_at", cutoff)
    .or(`player_a_id.eq.${seekerId},player_b_id.eq.${seekerId}`);

  if (error) {
    console.warn("[pairHistory] batch lookup failed (safe fallback):", error.message);
    // Fallback sûr : personne n'a de pénalité de rematch
    return new Map(candidateIds.map((id) => [id, false]));
  }

  // Construire un Set des adversaires récents du seeker
  const recentOpponents = new Set<string>();
  for (const row of data ?? []) {
    const opponent =
      row.player_a_id === seekerId ? row.player_b_id : row.player_a_id;
    recentOpponents.add(opponent);
  }

  return new Map(
    candidateIds.map((id) => [id, recentOpponents.has(id)]),
  );
}
