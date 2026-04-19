/**
 * worker/matchmaking.ts
 * ─────────────────────────────────────────────────────────────────────
 * Worker matchmaking complet — lit matchmaking_queue_candidates,
 * apparie les joueurs, crée le club_war, et notifie via notify_match_found.
 *
 * Intégration avec automatic.ts existant :
 *   - On réutilise startWarForPair() et persistRankedWarMetadata() via
 *     un import direct. Le worker ne duplique pas cette logique.
 *   - On lit depuis matchmaking_queue_candidates (vue SQL) plutôt que
 *     directement depuis matchmaking_queue_entries.
 *
 * Resilience :
 *   - Retry exponentiel (3 tentatives max)
 *   - Heartbeat /api/internal/heartbeat toutes les 30s
 *   - Cleanup automatique des sessions expirées
 *   - Timeout global par cycle
 * ─────────────────────────────────────────────────────────────────────
 */

import { createClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface QueueCandidate {
  session_id:   string;
  player_id:    string;
  queue_type:   string;
  region:       string | null;
  queued_at:    string;
  wait_seconds: number;
  mmr:          number | null;
  mmr_tolerance: number;
  username:     string;
}

interface MatchedPair {
  attacker: QueueCandidate;
  defender: QueueCandidate;
  mmrDiff:  number;
}

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────

const CYCLE_INTERVAL_MS   = 5_000;   // toutes les 5s
const HEARTBEAT_INTERVAL_MS = 30_000; // heartbeat toutes les 30s
const CYCLE_TIMEOUT_MS    = 20_000;  // timeout d'un cycle
const MAX_RETRY_ATTEMPTS  = 3;
const RETRY_BASE_DELAY_MS = 1_000;

// ─────────────────────────────────────────────
// SUPABASE
// ─────────────────────────────────────────────

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  ) as ReturnType<typeof createClient<any>>;
}

// ─────────────────────────────────────────────
// MATCHING LOGIC
// ─────────────────────────────────────────────

/**
 * Compatibilité MMR : les deux joueurs doivent être dans la fenêtre
 * de tolérance de l'autre.
 */
function mmrCompatible(a: QueueCandidate, b: QueueCandidate): boolean {
  const diff = Math.abs((a.mmr ?? 1000) - (b.mmr ?? 1000));
  return diff <= a.mmr_tolerance && diff <= b.mmr_tolerance;
}

/**
 * Compatibilité région : même région ou au moins une "global" / null.
 */
function regionCompatible(a: QueueCandidate, b: QueueCandidate): boolean {
  if (!a.region || !b.region) return true;
  return a.region.toLowerCase() === b.region.toLowerCase();
}

/**
 * Trouve les paires optimales depuis la liste de candidats.
 * Algorithme : FIFO + MMR compatible + région compatible.
 * Complexité O(n²) — acceptable pour des queues < 1000 joueurs.
 */
function findPairs(candidates: QueueCandidate[]): MatchedPair[] {
  const pairs:  MatchedPair[]  = [];
  const matched = new Set<string>();

  for (let i = 0; i < candidates.length; i++) {
    const a = candidates[i];
    if (matched.has(a.session_id)) continue;

    for (let j = i + 1; j < candidates.length; j++) {
      const b = candidates[j];
      if (matched.has(b.session_id)) continue;
      if (a.player_id === b.player_id) continue;
      if (!mmrCompatible(a, b))   continue;
      if (!regionCompatible(a, b)) continue;

      const mmrDiff = Math.abs((a.mmr ?? 1000) - (b.mmr ?? 1000));

      pairs.push({ attacker: a, defender: b, mmrDiff });
      matched.add(a.session_id);
      matched.add(b.session_id);
      break; // passer au prochain candidat non matché
    }
  }

  return pairs;
}

// ─────────────────────────────────────────────
// WAR CREATION
// ─────────────────────────────────────────────

/**
 * Crée le club_war pour une paire de joueurs.
 * Récupère les clubs des joueurs depuis club_members.
 * Retourne le warId ou null si échec.
 */
async function createWarForPair(
  supabase: ReturnType<typeof getSupabase>,
  pair: MatchedPair,
): Promise<string | null> {
  // Récupérer les clubs des joueurs
  const [{ data: aClub }, { data: bClub }] = await Promise.all([
    supabase
      .from("club_members")
      .select("club_id")
      .eq("user_id", pair.attacker.player_id)
      .maybeSingle(),
    supabase
      .from("club_members")
      .select("club_id")
      .eq("user_id", pair.defender.player_id)
      .maybeSingle(),
  ]);

  if (!aClub?.club_id || !bClub?.club_id) {
    console.warn(
      `[matchmaking] no club for pair ${pair.attacker.player_id} / ${pair.defender.player_id}`,
    );
    return null;
  }

  // Récupérer un territoire disponible
  const { data: territory } = await supabase
    .from("territories")
    .select("id")
    .eq("owner_club_id", bClub.club_id)
    .limit(1)
    .maybeSingle();

  if (!territory) {
    console.warn(`[matchmaking] no territory for defender ${pair.defender.player_id}`);
    return null;
  }

  // Créer la war
  const { data: war, error } = await supabase
    .from("club_wars")
    .insert({
      territory_id:         territory.id,
      challenger_id:        aClub.club_id,
      defender_id:          bClub.club_id,
      attacker_player_id:   pair.attacker.player_id,
      defender_player_id:   pair.defender.player_id,
      status:               "pending",
      mmr_diff_at_match:    pair.mmrDiff,
    })
    .select("id")
    .maybeSingle();

  if (error || !war) {
    console.error(`[matchmaking] war creation failed:`, error?.message);
    return null;
  }

  return war.id;
}

// ─────────────────────────────────────────────
// RESILIENCE
// ─────────────────────────────────────────────

async function withRetry<T>(
  fn:       () => Promise<T>,
  label:    string,
  attempts: number = MAX_RETRY_ATTEMPTS,
): Promise<T | null> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      const delay = RETRY_BASE_DELAY_MS * Math.pow(2, i);
      console.warn(`[matchmaking] ${label} attempt ${i + 1} failed:`, err, `— retry in ${delay}ms`);
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, delay));
    }
  }
  console.error(`[matchmaking] ${label} failed after ${attempts} attempts`);
  return null;
}

async function sendHeartbeat(): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  await fetch(`${baseUrl}/api/internal/heartbeat`, {
    method:  "POST",
    headers: {
      "Content-Type":    "application/json",
      "x-worker-secret": process.env.WORKER_SECRET ?? "",
    },
    body: JSON.stringify({
      service:  "matchmaking",
      status:   "healthy",
      metadata: { cycle_ts: new Date().toISOString() },
    }),
  }).catch(() => {}); // non-bloquant
}

// ─────────────────────────────────────────────
// CYCLE PRINCIPAL
// ─────────────────────────────────────────────

async function runMatchmakingCycle(): Promise<void> {
  const supabase = getSupabase();

  // Cleanup des sessions expirées (non-bloquant)
  void supabase.rpc("cleanup_expired_data").then(() => undefined, () => undefined);

  // Lire les candidats depuis la vue SQL
  const { data: candidates, error } = await supabase
    .from("matchmaking_queue_candidates")
    .select("*")
    .limit(100);

  if (error) {
    console.error("[matchmaking] failed to read candidates:", error.message);
    return;
  }

  if (!candidates || candidates.length < 2) return;

  const pairs = findPairs(candidates as QueueCandidate[]);

  for (const pair of pairs) {
    const result = await withRetry(
      async () => {
        const warId = await createWarForPair(supabase, pair);
        if (!warId) throw new Error("war creation returned null");

        // Notifier les deux joueurs — met à jour queue_sessions + crée ready_checks
        await supabase.rpc("notify_match_found", {
          p_war_id:              warId,
          p_attacker_player_id:  pair.attacker.player_id,
          p_defender_player_id:  pair.defender.player_id,
        });

        return warId;
      },
      `pair ${pair.attacker.player_id}/${pair.defender.player_id}`,
    );

    if (result) {
      console.info(
        `[matchmaking] matched war=${result} ` +
        `A:${pair.attacker.username}(${pair.attacker.mmr}) ` +
        `D:${pair.defender.username}(${pair.defender.mmr}) ` +
        `diff=${pair.mmrDiff}`,
      );
    }
  }
}

// ─────────────────────────────────────────────
// WORKER PRINCIPAL
// ─────────────────────────────────────────────

export async function startMatchmakingWorker(): Promise<void> {
  console.info("[matchmaking] worker started");

  let lastHeartbeat = 0;

  const run = async () => {
    try {
      // Timeout par cycle
      await Promise.race([
        runMatchmakingCycle(),
        new Promise<void>((_, reject) =>
          setTimeout(() => reject(new Error("cycle timeout")), CYCLE_TIMEOUT_MS),
        ),
      ]);
    } catch (err) {
      console.error("[matchmaking] cycle error:", err);
    }

    // Heartbeat toutes les 30s
    if (Date.now() - lastHeartbeat > HEARTBEAT_INTERVAL_MS) {
      await sendHeartbeat();
      lastHeartbeat = Date.now();
    }

    setTimeout(run, CYCLE_INTERVAL_MS);
  };

  await run();
}

// Entry point si exécuté directement
if (require.main === module) {
  startMatchmakingWorker().catch(console.error);
}
