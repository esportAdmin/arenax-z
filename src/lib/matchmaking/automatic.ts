import { createServiceRoleClient } from "@/integrations/supabase/service-role";
import {
  type ScoredCandidate,
  computePairScore,
} from "@/lib/matchmaking/matchmakingScorer";
import {
  recordPairHistory,
} from "@/lib/matchmaking/pairHistory";
import { computeMatchQuality, isSameRegion } from "@/lib/matchmaking/matchQuality";
import { computeWinProbability } from "@/lib/matchmaking/winProbability";

type QueueStatus = "searching" | "matched" | "cancelled";

interface QueueEntry {
  id: string;
  player_id: string;
  mode: string;
  region: string | null;
  mmr: number;
  search_mmr_min: number;
  search_mmr_max: number;
  joined_at: string;
  last_expansion_at: string;
  status: QueueStatus;
}

interface ClubMembershipRow {
  club_id: string;
}

interface TerritoryRow {
  id: string;
  controlling_club_id: string | null;
  strategic_value: number | null;
}

interface WarStartResult {
  success?: boolean;
  war_id?: string;
  error?: string;
}

interface Candidate {
  queueId: string;
  playerId: string;
  clubId: string;
  mode: string;
  region: string | null;
  mmr: number;
  searchMin: number;
  searchMax: number;
  joinedAt: string;
  lastExpansionAt: string;
}

export interface MatchmakingCreatedMatch {
  warId: string;
  territoryId: string;
  seasonId: string;
  attackerPlayerId: string;
  defenderPlayerId: string;
  attackerClubId: string;
  defenderClubId: string;
  mmrDeltaAbs: number;
  /** Score de qualité du match 0–100 — calculé au moment du pairing */
  matchQuality: number;
  matchQualityLabel: string;
  /** Probabilité de victoire de l'attaquant (0–100) */
  winProbabilityAttacker: number;
  /** Probabilité de victoire du défenseur (0–100) */
  winProbabilityDefender: number;
}

export interface MatchmakingRunSummary {
  scanned: number;
  eligible: number;
  created: number;
  createdMatches: MatchmakingCreatedMatch[];
  skipped: Array<{
    playerId?: string;
    reason: string;
  }>;
}

const SEARCH_EXPANSION_STEP = 25;
const SEARCH_EXPANSION_MAX_DELTA = 400;
const SEARCH_EXPANSION_INTERVAL_MS = 15_000;

function nowMs() {
  return Date.now();
}

function toIso(value: string | null | undefined) {
  return value ?? new Date().toISOString();
}

function regionsCompatible(a: string | null, b: string | null) {
  const ra = (a ?? "global").trim().toLowerCase();
  const rb = (b ?? "global").trim().toLowerCase();

  return ra === "global" || rb === "global" || ra === rb;
}

function mmrCompatible(a: Candidate, b: Candidate) {
  return (
    b.mmr >= a.searchMin &&
    b.mmr <= a.searchMax &&
    a.mmr >= b.searchMin &&
    a.mmr <= b.searchMax
  );
}

// ─────────────────────────────────────────────
// SEASON CACHE — évite une DB round-trip par cycle de matchmaking
// ─────────────────────────────────────────────
let _cachedSeasonId: string | null = null;
let _seasonCachedAt = 0;
const SEASON_CACHE_TTL_MS = 30_000;

async function getActiveSeasonId() {
  const now = Date.now();

  if (_seasonCachedAt > 0 && now - _seasonCachedAt < SEASON_CACHE_TTL_MS) {
    return _cachedSeasonId as string;
  }

  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("seasons")
    .select("id")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load active season: ${error.message}`);
  }

  if (!data?.id) {
    throw new Error("No active season found");
  }

  _cachedSeasonId = data.id as string;
  _seasonCachedAt = now;
  return _cachedSeasonId;
}

async function expandSearchWindows(rows: QueueEntry[]) {
  const supabase = createServiceRoleClient();
  const currentTime = nowMs();

  for (const row of rows) {
    const lastExpansion = new Date(toIso(row.last_expansion_at)).getTime();

    if (!Number.isFinite(lastExpansion)) {
      continue;
    }

    if (currentTime - lastExpansion < SEARCH_EXPANSION_INTERVAL_MS) {
      continue;
    }

    const currentDeltaDown = Math.max(0, row.mmr - row.search_mmr_min);
    const currentDeltaUp = Math.max(0, row.search_mmr_max - row.mmr);

    const nextDeltaDown = Math.min(
      SEARCH_EXPANSION_MAX_DELTA,
      currentDeltaDown + SEARCH_EXPANSION_STEP,
    );

    const nextDeltaUp = Math.min(
      SEARCH_EXPANSION_MAX_DELTA,
      currentDeltaUp + SEARCH_EXPANSION_STEP,
    );

    await supabase
      .from("matchmaking_queue")
      .update({
        search_mmr_min: row.mmr - nextDeltaDown,
        search_mmr_max: row.mmr + nextDeltaUp,
        last_expansion_at: new Date().toISOString(),
      })
      .eq("id", row.id)
      .eq("status", "searching");
  }
}

async function getSearchingQueue(limit: number) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("matchmaking_queue")
    .select(
      "id, player_id, mode, region, mmr, search_mmr_min, search_mmr_max, joined_at, last_expansion_at, status",
    )
    .eq("status", "searching")
    .order("joined_at", { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`Unable to read matchmaking_queue: ${error.message}`);
  }

  return ((data ?? []) as QueueEntry[]).filter(
    (row) => row.status === "searching",
  );
}

async function getPrimaryClubId(playerId: string) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("club_members")
    .select("club_id")
    .eq("user_id", playerId)
    .order("joined_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Unable to load club membership for ${playerId}: ${error.message}`,
    );
  }

  return (data as ClubMembershipRow | null)?.club_id ?? null;
}

async function hydrateCandidates(
  queueRows: QueueEntry[],
  summary: MatchmakingRunSummary,
) {
  const candidates: Candidate[] = [];

  for (const row of queueRows) {
    const clubId = await getPrimaryClubId(row.player_id);

    if (!clubId) {
      summary.skipped.push({
        playerId: row.player_id,
        reason: "player_has_no_club_membership",
      });
      continue;
    }

    candidates.push({
      queueId: row.id,
      playerId: row.player_id,
      clubId,
      mode: row.mode,
      region: row.region,
      mmr: row.mmr,
      searchMin: row.search_mmr_min,
      searchMax: row.search_mmr_max,
      joinedAt: row.joined_at,
      lastExpansionAt: row.last_expansion_at,
    });
  }

  return candidates;
}

/**
 * Fix A — Batch active war check.
 * Une seule requête pour tous les clubs — remplace N appels clubHasActiveWar()
 * dans la boucle O(n²).
 * Retourne un Set des clubIds actuellement en guerre.
 */
async function batchClubsWithActiveWar(clubIds: string[]): Promise<Set<string>> {
  if (clubIds.length === 0) return new Set();

  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("club_wars")
    .select("challenger_id, defender_id")
    .eq("status", "active")
    .or(
      clubIds.map((id) => `challenger_id.eq.${id},defender_id.eq.${id}`).join(","),
    );

  if (error) {
    // Fallback sûr : on suppose que personne n'est en guerre
    // → préférable à bloquer tout le cycle
    console.warn("[matchmaking] batchClubsWithActiveWar failed (safe fallback):", error.message);
    return new Set();
  }

  const activeClubs = new Set<string>();
  for (const row of data ?? []) {
    if (row.challenger_id) activeClubs.add(row.challenger_id);
    if (row.defender_id)   activeClubs.add(row.defender_id);
  }
  return activeClubs;
}

/**
 * Fix C — Batch global rematch lookup.
 * Lit TOUTES les paires récentes de la queue en 1 requête.
 * Retourne Map<"playerA:playerB", true> avec la paire normalisée.
 * La clé est toujours min(a,b) + ":" + max(a,b) — cohérent avec normalizePair().
 *
 * Usage : recentPairsGlobal.has(pairKey(a.playerId, b.playerId))
 */
function pairKey(a: string, b: string): string {
  return a < b ? `${a}:${b}` : `${b}:${a}`;
}

async function batchRecentPairsGlobal(
  playerIds: string[],
  withinHours = 6,
): Promise<Set<string>> {
  if (playerIds.length === 0) return new Set();

  const supabase    = createServiceRoleClient();
  const cutoff      = new Date(Date.now() - withinHours * 3_600_000).toISOString();

  const { data, error } = await supabase
    .from("matchmaking_pair_history")
    .select("player_a_id, player_b_id")
    .gte("created_at", cutoff)
    .or(
      playerIds.map((id) => `player_a_id.eq.${id},player_b_id.eq.${id}`).join(","),
    );

  if (error) {
    console.warn("[matchmaking] batchRecentPairsGlobal failed (safe fallback):", error.message);
    return new Set();
  }

  const pairs = new Set<string>();
  for (const row of data ?? []) {
    pairs.add(pairKey(row.player_a_id, row.player_b_id));
  }
  return pairs;
}

async function canAttack(attackerClubId: string, defenderClubId: string) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase.rpc("can_attack", {
    p_attacker_club_id: attackerClubId,
    p_defender_club_id: defenderClubId,
  });

  if (error) {
    throw new Error(
      `Unable to validate attack path ${attackerClubId} -> ${defenderClubId}: ${error.message}`,
    );
  }

  return data === true;
}

async function pickTerritoryForPair(
  attackerClubId: string,
  defenderClubId: string,
) {
  const supabase = createServiceRoleClient();

  const { data: attackable, error: attackableError } = await supabase.rpc(
    "get_attackable_territories",
    {
      p_club: attackerClubId,
    },
  );

  if (attackableError) {
    throw new Error(
      `Unable to get attackable territories for ${attackerClubId}: ${attackableError.message}`,
    );
  }

  const territoryIds = ((attackable ?? []) as Array<{ territory_id: string }>)
    .map((row) => row.territory_id)
    .filter(Boolean);

  if (territoryIds.length === 0) {
    return null;
  }

  const { data: territories, error } = await supabase
    .from("club_territories")
    .select("id, controlling_club_id, strategic_value")
    .in("id", territoryIds)
    .eq("controlling_club_id", defenderClubId)
    .order("strategic_value", { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(`Unable to pick territory: ${error.message}`);
  }

  const territory = ((territories ?? []) as TerritoryRow[])[0];

  return territory?.id ?? null;
}

async function reserveQueuePair(a: Candidate, b: Candidate) {
  const supabase = createServiceRoleClient();

  const { data: reservedA, error: reserveAError } = await supabase
    .from("matchmaking_queue")
    .update({ status: "matched" })
    .eq("id", a.queueId)
    .eq("status", "searching")
    .select("id")
    .maybeSingle();

  if (reserveAError) {
    throw new Error(
      `Unable to reserve queue entry ${a.queueId}: ${reserveAError.message}`,
    );
  }

  if (!reservedA) {
    return false;
  }

  const { data: reservedB, error: reserveBError } = await supabase
    .from("matchmaking_queue")
    .update({ status: "matched" })
    .eq("id", b.queueId)
    .eq("status", "searching")
    .select("id")
    .maybeSingle();

  if (reserveBError) {
    await supabase
      .from("matchmaking_queue")
      .update({ status: "searching" })
      .eq("id", a.queueId);

    throw new Error(
      `Unable to reserve queue entry ${b.queueId}: ${reserveBError.message}`,
    );
  }

  if (!reservedB) {
    await supabase
      .from("matchmaking_queue")
      .update({ status: "searching" })
      .eq("id", a.queueId);

    return false;
  }

  return true;
}

async function releaseQueuePair(a: Candidate, b: Candidate) {
  const supabase = createServiceRoleClient();

  await supabase
    .from("matchmaking_queue")
    .update({ status: "searching" })
    .in("id", [a.queueId, b.queueId]);
}

async function startWarForPair(
  attacker: Candidate,
  defender: Candidate,
  territoryId: string,
  seasonId: string,
) {
  const supabase = createServiceRoleClient();

  await supabase.rpc("ensure_season_player_stats", {
    p_player_id: attacker.playerId,
    p_season_id: seasonId,
  });

  await supabase.rpc("ensure_season_player_stats", {
    p_player_id: defender.playerId,
    p_season_id: seasonId,
  });

  const { data, error } = await supabase.rpc("start_territory_war", {
    p_attacker_club: attacker.clubId,
    p_territory: territoryId,
  });

  if (error) {
    throw new Error(`Unable to start territory war: ${error.message}`);
  }

  const result = (data ?? {}) as WarStartResult;

  if (!result.success || !result.war_id) {
    throw new Error(result.error ?? "start_territory_war returned no war_id");
  }

  return result.war_id;
}

// ─────────────────────────────────────────────
// PERSISTENCE RANKED WAR METADATA
// ─────────────────────────────────────────────

interface MatchMetadata {
  matchQuality:              number;
  matchQualityLabel:         string;
  winProbabilityAttacker:    number;
  winProbabilityDefender:    number;
  mmrDiff:                   number;
  queueWaitAttackerSeconds:  number;
  queueWaitDefenderSeconds:  number;
  sameRegion:                boolean;
  recentRematch:             boolean;
}

/**
 * Persiste les métadonnées ranked dans club_wars après création de la war.
 * Non-bloquant : si l'écriture échoue, la war RTS continue normalement.
 * Séparé de startWarForPair pour garder la création de war pure et testable.
 */
async function persistRankedWarMetadata(
  warId: string,
  attacker: Candidate,
  defender: Candidate,
  meta: MatchMetadata,
): Promise<void> {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from("club_wars")
    .update({
      attacker_player_id:           attacker.playerId,
      defender_player_id:           defender.playerId,
      match_quality_score:          meta.matchQuality,
      match_quality_label:          meta.matchQualityLabel,
      win_probability_attacker:     meta.winProbabilityAttacker,
      win_probability_defender:     meta.winProbabilityDefender,
      mmr_diff_at_match:            meta.mmrDiff,
      queue_wait_attacker_seconds:  meta.queueWaitAttackerSeconds,
      queue_wait_defender_seconds:  meta.queueWaitDefenderSeconds,
      same_region:                  meta.sameRegion,
      recent_rematch:               meta.recentRematch,
    })
    .eq("id", warId);

  if (error) {
    console.warn("[matchmaking] persistRankedWarMetadata failed (non-blocking):", error.message);
  }
}

async function triggerBattleLoopOnce() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    return;
  }

  try {
    await fetch(`${appUrl}/api/cron/battle-loop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
  } catch {
    // Best effort only: the existing worker/cron can still pick up the war.
  }
}

async function findOrientationAndTerritory(
  a: Candidate,
  b: Candidate,
  // Fix B — cache local passé depuis la boucle externe pour éviter
  // les appels RPC répétés sur les mêmes paires (club_A, club_B).
  territoryCache: Map<string, string | null>,
) {
  const keyAB = `${a.clubId}→${b.clubId}`;
  const keyBA = `${b.clubId}→${a.clubId}`;

  // Tenter A attaque B
  if (!territoryCache.has(keyAB)) {
    if (await canAttack(a.clubId, b.clubId)) {
      const tid = await pickTerritoryForPair(a.clubId, b.clubId);
      territoryCache.set(keyAB, tid);
    } else {
      territoryCache.set(keyAB, null);
    }
  }

  const territoryAB = territoryCache.get(keyAB) ?? null;
  if (territoryAB) {
    return { attacker: a, defender: b, territoryId: territoryAB };
  }

  // Tenter B attaque A
  if (!territoryCache.has(keyBA)) {
    if (await canAttack(b.clubId, a.clubId)) {
      const tid = await pickTerritoryForPair(b.clubId, a.clubId);
      territoryCache.set(keyBA, tid);
    } else {
      territoryCache.set(keyBA, null);
    }
  }

  const territoryBA = territoryCache.get(keyBA) ?? null;
  if (territoryBA) {
    return { attacker: b, defender: a, territoryId: territoryBA };
  }

  return null;
}

function compatiblePair(a: Candidate, b: Candidate) {
  if (a.playerId === b.playerId) return false;
  if (a.clubId === b.clubId) return false;
  if (a.mode !== b.mode) return false;
  if (!regionsCompatible(a.region, b.region)) return false;
  if (!mmrCompatible(a, b)) return false;
  return true;
}

export async function runAutomaticMatchmaking(params?: {
  limit?: number;
  triggerBattleLoop?: boolean;
}) {
  const limit = Math.max(2, Math.min(200, Number(params?.limit ?? 50)));
  const seasonId = await getActiveSeasonId();

  const summary: MatchmakingRunSummary = {
    scanned: 0,
    eligible: 0,
    created: 0,
    createdMatches: [],
    skipped: [],
  };

  const queueRows = await getSearchingQueue(limit);
  summary.scanned = queueRows.length;

  if (queueRows.length < 2) {
    return summary;
  }

  await expandSearchWindows(queueRows);

  const refreshedRows = await getSearchingQueue(limit);
  const candidates = await hydrateCandidates(refreshedRows, summary);
  summary.eligible = candidates.length;

  const consumed = new Set<string>();

  // ── Fix A — Pré-fetch batch : clubs avec war active ─────────────────
  // 1 requête pour tous les clubs au lieu de N appels dans la boucle.
  const allClubIds  = candidates.map((c) => c.clubId);
  const activeWarClubs = await batchClubsWithActiveWar(allClubIds);

  // ── Fix B — Cache territoire partagé sur tout le cycle ───────────────
  // findOrientationAndTerritory est coûteux (2 RPC par paire).
  // Le cache évite de re-appeler pour la même paire (A→B ou B→A)
  // si elle est évaluée depuis deux seekers différents.
  const territoryCache = new Map<string, string | null>();

  // ── Fix C — Batch global rematch : 1 requête pour toute la queue ─────
  // Remplace hadRecentMatchBatch(seeker, candidates) appelé N fois.
  const allPlayerIds    = candidates.map((c) => c.playerId);
  const recentPairsGlobal = await batchRecentPairsGlobal(allPlayerIds, 6);

  // ── Fix E — Hard cap temps d'attente ─────────────────────────────────
  // Au-delà de FORCE_MATCH_WAIT_MS, on force le match même si le scorer
  // juge la paire non-acceptable (seuil dynamique ignoré).
  // Évite qu'un joueur reste bloqué indéfiniment dans une queue creuse.
  const FORCE_MATCH_WAIT_MS = 10 * 60_000; // 10 minutes

  for (let i = 0; i < candidates.length; i += 1) {
    const a = candidates[i];
    if (consumed.has(a.queueId)) continue;

    // Fix A — lecture depuis le Set pré-fetché, pas d'await
    if (activeWarClubs.has(a.clubId)) {
      summary.skipped.push({
        playerId: a.playerId,
        reason: "club_already_has_active_war",
      });
      continue;
    }

    // Fix E — joueur en attente depuis plus de FORCE_MATCH_WAIT_MS ?
    const aWaitMs     = Date.now() - new Date(a.joinedAt).getTime();
    const forceMatch  = aWaitMs >= FORCE_MATCH_WAIT_MS;

    let best: {
      opponent: Candidate;
      territoryId: string;
      attacker: Candidate;
      defender: Candidate;
      mmrDiff: number;
      pairScore: number;
    } | null = null;

    for (let j = i + 1; j < candidates.length; j += 1) {
      const b = candidates[j];
      if (consumed.has(b.queueId)) continue;

      if (!compatiblePair(a, b)) continue;

      // Fix A — lecture depuis le Set pré-fetché, pas d'await
      if (activeWarClubs.has(b.clubId)) continue;

      // Fix B — cache territoire passé en paramètre
      const oriented = await findOrientationAndTerritory(a, b, territoryCache);
      if (!oriented) continue;

      // Fix C — lookup O(1) depuis le Set global
      const recentRematch = recentPairsGlobal.has(pairKey(a.playerId, b.playerId));

      const seekerScored: ScoredCandidate = {
        playerId: a.playerId,
        mmr:      a.mmr,
        joinedAt: a.joinedAt,
        region:   a.region ?? null,
        clubId:   a.clubId,
      };
      const candidateScored: ScoredCandidate = {
        playerId: b.playerId,
        mmr:      b.mmr,
        joinedAt: b.joinedAt,
        region:   b.region ?? null,
        clubId:   b.clubId,
      };

      const scored = computePairScore(seekerScored, candidateScored, recentRematch);

      // Fix E — si force-match, ignorer le seuil d'acceptabilité
      if (!forceMatch && !scored.acceptable) continue;

      if (!best || scored.score < best.pairScore) {
        best = {
          opponent:    b,
          territoryId: oriented.territoryId,
          attacker:    oriented.attacker,
          defender:    oriented.defender,
          mmrDiff:     scored.mmrDiff,
          pairScore:   scored.score,
        };
      }
    }

    if (!best) {
      continue;
    }

    const reserved = await reserveQueuePair(a, best.opponent);

    if (!reserved) {
      summary.skipped.push({
        playerId: a.playerId,
        reason: "queue_reservation_race_condition",
      });
      continue;
    }

    try {
      // ── Calculer quality + winProb AVANT startWarForPair ─────────────
      // Bug corrigé : quality était calculée après startWarForPair dans la
      // version précédente, rendant le paramètre passé à start toujours undefined.
      const waitAttacker = Math.max(
        0, Math.round((Date.now() - new Date(best.attacker.joinedAt).getTime()) / 1000),
      );
      const waitDefender = Math.max(
        0, Math.round((Date.now() - new Date(best.defender.joinedAt).getTime()) / 1000),
      );
      const isRematch = recentPairsGlobal.has(
        pairKey(best.attacker.playerId, best.defender.playerId),
      );
      const isSameRegionResult = isSameRegion(best.attacker.region, best.defender.region);

      const quality = computeMatchQuality({
        mmrA:              best.attacker.mmr,
        mmrB:              best.defender.mmr,
        queueWaitSecondsA: waitAttacker,
        queueWaitSecondsB: waitDefender,
        regionA:           best.attacker.region,
        regionB:           best.defender.region,
        isRematch,
      });

      const winProb = computeWinProbability({
        attackerMmr: best.attacker.mmr,
        defenderMmr: best.defender.mmr,
      });

      // ── Créer la war ─────────────────────────────────────────────────
      const warId = await startWarForPair(
        best.attacker,
        best.defender,
        best.territoryId,
        seasonId,
      );

      // ── Persister les métadonnées ranked (non-bloquant) ──────────────
      // Si ça échoue, la war RTS continue normalement.
      void persistRankedWarMetadata(warId, best.attacker, best.defender, {
        matchQuality:             quality.score,
        matchQualityLabel:        quality.label,
        winProbabilityAttacker:   winProb.attacker,
        winProbabilityDefender:   winProb.defender,
        mmrDiff:                  best.mmrDiff,
        queueWaitAttackerSeconds: waitAttacker,
        queueWaitDefenderSeconds: waitDefender,
        sameRegion:               isSameRegionResult,
        recentRematch:            isRematch,
      });

      consumed.add(a.queueId);
      consumed.add(best.opponent.queueId);

      // ── Anti-rematch (non-bloquant) ───────────────────────────────────
      void recordPairHistory(best.attacker.playerId, best.defender.playerId, warId);

      console.log(
        `[matchmaking] ✅ war=${warId.slice(0, 8)}` +
        ` A=${best.attacker.playerId.slice(0, 8)}(${best.attacker.mmr})` +
        ` D=${best.defender.playerId.slice(0, 8)}(${best.defender.mmr})` +
        ` mmrDiff=${best.mmrDiff}` +
        ` score=${best.pairScore.toFixed(0)}` +
        ` quality=${quality.score}%(${quality.label})` +
        ` winProb=${winProb.attacker}/${winProb.defender}(${winProb.label})` +
        (forceMatch ? " [FORCE_MATCH]" : ""),
      );

      summary.created += 1;
      summary.createdMatches.push({
        warId,
        territoryId:             best.territoryId,
        seasonId,
        attackerPlayerId:        best.attacker.playerId,
        defenderPlayerId:        best.defender.playerId,
        attackerClubId:          best.attacker.clubId,
        defenderClubId:          best.defender.clubId,
        mmrDeltaAbs:             best.mmrDiff,
        matchQuality:            quality.score,
        matchQualityLabel:       quality.label,
        winProbabilityAttacker:  winProb.attacker,
        winProbabilityDefender:  winProb.defender,
      });
    } catch (error) {
      await releaseQueuePair(a, best.opponent);

      summary.skipped.push({
        reason:
          error instanceof Error
            ? `war_start_failed:${error.message}`
            : "war_start_failed",
      });
    }
  }

  if (summary.created > 0 && params?.triggerBattleLoop !== false) {
    await triggerBattleLoopOnce();
  }

  return summary;
}
