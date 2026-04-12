/**
 * battleLogsAdapter.ts
 * ─────────────────────────────────────────────────────────────────────
 * Lit battle_logs + battle_abilities et produit un BattleInsights
 * consommable par MatchBreakdownPanel et postGameBreakdown.
 *
 * Structure réelle de la DB (auditée depuis ranked_mmr.sql) :
 *
 *   battle_logs (territory_id, server_ts, units_snapshot jsonb, event_id)
 *     → snapshots complets de l'état des unités à chaque tick
 *     → indexé sur (territory_id, server_ts ASC)
 *     → PAS de colonne "type" ni "player_id" directement
 *
 *   battle_abilities (territory_id, type, replay_tag, attacker_id,
 *                     defender_id, ability, damage, created_at)
 *     → events d'abilities résolues : ultimates, spells, impacts
 *     → replay_tag indique le type d'event (ace, clutch, teamwipe…)
 *     → indexé sur (territory_id, impact_at) WHERE processed = false
 *
 * Stratégie :
 *   - On lit battle_abilities (léger, colonnes scalaires) pour les highlights
 *   - On lit battle_logs uniquement pour compter les ticks actifs par side
 *   - On évite de parse units_snapshot jsonb en masse (coûteux)
 *
 * Fix vs doc :
 *   - Filtre par territory_id (correct — c'est l'index existant)
 *   - Pas de select("*") — colonnes explicites uniquement
 *   - Types stricts — pas de Record<string, any>
 *   - highlights générés depuis battle_abilities.replay_tag (réel)
 *   - MVP basé sur damage agrégé depuis battle_abilities (pas de kills fake)
 * ─────────────────────────────────────────────────────────────────────
 */

import { createServiceRoleClient } from "@/integrations/supabase/service-role";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

/** Row depuis battle_abilities */
interface AbilityRow {
  attacker_id:  string | null;
  defender_id:  string | null;
  ability:      string | null;
  type:         string | null;
  replay_tag:   string | null;
  damage:       number | null;
  created_at:   string;
}

export interface BattleHighlight {
  /** Timestamp ISO du moment clé */
  timestamp: string;
  /** Durée relative depuis le début du match : "02:14" */
  matchTime: string;
  /** Label affiché : "ACE 🔥", "Clutch ⚡", etc. */
  label: string;
  /** Type brut depuis replay_tag */
  tag: string;
}

export interface BattleSideStats {
  /** ID du club (attacker_id ou defender_id dans battle_abilities) */
  clubId: string;
  /** Nombre d'abilities résolues */
  abilitiesUsed: number;
  /** Nombre de kills (type = "kill" dans battle_abilities) */
  kills: number;
  /** Damage total infligé */
  totalDamage: number;
  /** Score de performance composite */
  performanceScore: number;
}

export interface BattleInsights {
  /**
   * Club avec le meilleur score de performance.
   * En V1 : granularité club (pas player — attacker_id est un club_id).
   * Extension future : croiser avec club_wars.attacker_player_id → mvpPlayerId.
   */
  mvpClubId:    string | null;
  mvpScore:     number;
  /** Top highlights issus de replay_tag (max 8), triés chronologiquement */
  highlights:   BattleHighlight[];
  /** Stats par side */
  stats:        BattleSideStats[];
  /** Nombre total de ticks de combat (proxy de durée) */
  tickCount:    number;
  /** Timestamp ISO de début du match — sert à calculer matchTime */
  warStartedAt: string | null;
  /** true si les données sont suffisantes pour être affichées */
  hasData:      boolean;
}

// ─────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────

/**
 * Tags replay connus — filtrés et labelisés pour l'UI.
 * On ignore les tags de faible valeur narrative (damage_tick, etc.)
 */
const HIGHLIGHT_TAG_MAP: Record<string, string> = {
  ace:         "ACE 🔥",
  clutch:      "Clutch ⚡",
  teamwipe:    "Team Wipe 💥",
  multi_kill:  "Multi Kill",
  ultimate:    "Ultimate",
  kill:        "Kill",
  double_kill: "Double Kill",
  triple_kill: "Triple Kill",
};

/** Types d'events comptés comme kills */
const KILL_TYPES = new Set(["kill", "double_kill", "triple_kill", "multi_kill", "ace", "teamwipe"]);

/** Poids damage dans le score de performance */
const DAMAGE_WEIGHT    = 0.01;
/** Poids par ability utilisée */
const ABILITY_WEIGHT   = 2;
/** Poids par kill */
const KILL_WEIGHT      = 5;

/** Nombre max de highlights retournés */
const MAX_HIGHLIGHTS   = 8;

/**
 * Fix 4 — Limite dynamique basée sur la durée estimée du match.
 * Un match court (~2min) génère ~120 abilities max.
 * Un match long (~10min) peut en générer ~600.
 * On clampe à 500 pour éviter les queries trop lourdes.
 */
function computeAbilitiesLimit(tickCount: number): number {
  // ~1 ability per 2 ticks en moyenne — estimation conservative
  return Math.min(500, Math.max(100, tickCount * 2));
}

/** Nombre max de rows logs lues pour le count */
const LOGS_LIMIT = 500;

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function labelFromTag(tag: string | null): string | null {
  if (!tag) return null;
  return HIGHLIGHT_TAG_MAP[tag.toLowerCase()] ?? null;
}

// ─────────────────────────────────────────────
// ADAPTER
// ─────────────────────────────────────────────

/**
 * Retourne les insights de combat pour une war donnée.
 *
 * @param territoryId   — ID du territoire (clé d'index de battle_logs)
 * @param warStartedAt  — ISO string du début de la war (pour matchTime relatif)
 *
 * Fallback safe : retourne hasData=false si la table est vide ou en erreur.
 * Le MatchBreakdownPanel n'affiche le slot que si hasData=true.
 */
export async function getBattleInsights(
  territoryId: string,
  warStartedAt: string | null = null,
): Promise<BattleInsights> {
  const EMPTY: BattleInsights = {
    mvpClubId:    null,
    mvpScore:     0,
    highlights:   [],
    stats:        [],
    tickCount:    0,
    warStartedAt: warStartedAt,
    hasData:      false,
  };

  if (!territoryId) return EMPTY;

  const supabase = createServiceRoleClient();

  // ── 1. Tick count en premier — détermine ABILITIES_LIMIT dynamique ─
  const { count: tickCount } = await supabase
    .from("battle_logs")
    .select("id", { count: "exact", head: true })
    .eq("territory_id", territoryId)
    .limit(LOGS_LIMIT);

  const abilitiesLimit = computeAbilitiesLimit(tickCount ?? 0);

  // ── 2. Battle abilities — events clés (léger, scalaire) ───────────
  const { data: abilities, error: abilitiesError } = await supabase
    .from("battle_abilities")
    .select("attacker_id, defender_id, ability, type, replay_tag, damage, created_at")
    .eq("territory_id", territoryId)
    .order("created_at", { ascending: true })
    .limit(abilitiesLimit);

  if (abilitiesError) {
    console.warn("[battleLogsAdapter] abilities error (safe fallback):", abilitiesError.message);
    return EMPTY;
  }

  const rows = (abilities ?? []) as AbilityRow[];
  if (rows.length === 0) return { ...EMPTY, tickCount: tickCount ?? 0 };

  // ── 3. Agréger les stats par side — kills + damage + abilities ────
  const statsMap = new Map<string, { abilitiesUsed: number; kills: number; totalDamage: number }>();

  for (const row of rows) {
    const clubId = row.attacker_id ?? row.defender_id;
    if (!clubId) continue;

    const existing = statsMap.get(clubId) ?? { abilitiesUsed: 0, kills: 0, totalDamage: 0 };
    const isKill   = KILL_TYPES.has((row.replay_tag ?? row.type ?? "").toLowerCase());

    statsMap.set(clubId, {
      abilitiesUsed: existing.abilitiesUsed + 1,
      kills:         existing.kills + (isKill ? 1 : 0),
      totalDamage:   existing.totalDamage + (row.damage ?? 0),
    });
  }

  const stats: BattleSideStats[] = Array.from(statsMap.entries()).map(([clubId, s]) => {
    const performanceScore = Math.round(
      s.totalDamage * DAMAGE_WEIGHT +
      s.abilitiesUsed * ABILITY_WEIGHT +
      s.kills * KILL_WEIGHT,
    );
    return { clubId, ...s, performanceScore };
  });

  // ── 4. MVP — meilleur score de performance ────────────────────────
  let mvpClubId: string | null = null;
  let mvpScore   = 0;

  for (const s of stats) {
    if (s.performanceScore > mvpScore) {
      mvpScore  = s.performanceScore;
      mvpClubId = s.clubId;
    }
  }

  // ── 5. Highlights — depuis replay_tag, avec matchTime relatif ─────
  const highlights: BattleHighlight[] = [];

  for (const row of rows) {
    if (highlights.length >= MAX_HIGHLIGHTS) break;

    const label = labelFromTag(row.replay_tag);
    if (!label) continue;

    highlights.push({
      timestamp: row.created_at,
      matchTime: formatMatchTime(row.created_at, warStartedAt ?? row.created_at),
      label,
      tag: row.replay_tag ?? "",
    });
  }

  return {
    mvpClubId,
    mvpScore,
    highlights,
    stats,
    tickCount:    tickCount ?? 0,
    warStartedAt: warStartedAt,
    hasData:      stats.length > 0 || highlights.length > 0,
  };
}

// ─────────────────────────────────────────────
// HELPERS UI (côté serveur uniquement)
// ─────────────────────────────────────────────

/**
 * Formate un timestamp ISO en durée de match lisible (mm:ss).
 * Relatif au premier tick — à appeler avec le created_at de la war.
 */
export function formatMatchTime(
  eventIso: string,
  warStartIso: string,
): string {
  try {
    const delta = new Date(eventIso).getTime() - new Date(warStartIso).getTime();
    const secs  = Math.max(0, Math.floor(delta / 1000));
    const m     = Math.floor(secs / 60).toString().padStart(2, "0");
    const s     = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  } catch {
    return "--:--";
  }
}
