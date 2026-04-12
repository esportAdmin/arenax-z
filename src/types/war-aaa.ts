/**
 * War Map AAA — Types TypeScript
 * Schéma vérifié directement sur la DB Supabase (PRODUCTION).
 *
 * Table `clubs` colonnes réelles :
 *   id, name, slug, logo_url, owner_id, description,
 *   member_count, total_xp, total_wins, created_at, updated_at
 *   ❌ pas de tag, pas de color_hex
 */

// ─── ENTITÉS SUPABASE ─────────────────────────────────────────────────────────

/** Table `clubs` — colonnes réelles vérifiées */
export interface Club {
  id: string;
  name: string;
  slug: string;          // ex: "serveur-test-de-arena-x-834161"
  logo_url: string | null;
  created_at?: string;
}

/**
 * Table `club_wars`
 * end_date peut être NULL — ne jamais filtrer avec .gt()
 */
export interface ClubWar {
  id: string;
  challenger_id: string;
  defender_id: string;
  winner_id: string | null;
  status: "pending" | "active" | "completed" | "cancelled";
  start_date: string | null;
  end_date: string | null;
  territory_id: string | null;
  territory_name: string | null;
  season_id: string | null;
  challenger_xp: number;
  defender_xp: number;
  challenger_predictions: number;
  defender_predictions: number;
  challenger_wins: number;
  defender_wins: number;
  attacker_score: number;
  defender_score: number;
  xp_reward: number;
  coordinates: number[] | null;
  created_at: string;
  updated_at: string;
}

export type ActiveClubWar = ClubWar;

/**
 * Table `club_territories` — colonnes réelles vérifiées
 */
export interface ClubTerritory {
  id: string;
  name: string;
  slug: string;
  region: string | null;
  continent: string | null;
  controlling_club_id: string | null;
  is_capital: boolean;
  map_key: string | null;
  map_x: number | null;
  map_y: number | null;
  x: number | null;
  y: number | null;
  capture_progress: number;
  siege_progress: number;
  strategic_value: number;
  xp_bonus: number;
  arena_bonus: number;
  prestige_bonus: number;
  created_at: string;
  updated_at: string;
}

/**
 * Table `club_season_stats` — colonnes réelles vérifiées
 */
export interface ClubSeasonStats {
  id: string;
  club_id: string | null;
  season_id: string | null;
  elo_rating: number | null;
  season_score: number | null;
  tier: string | null;
  war_draws: number | null;
  war_losses: number | null;
  war_wins: number | null;
  war_xp: number | null;
  created_at: string | null;
  updated_at: string | null;
}

/** Table `arena_ledger` */
export interface ArenaLedger {
  id: number;
  user_id: string;
  amount: number;
  source: string;
  description: string;
  reference_id: string | null;
  created_at: string;
}

// ─── VIEW MODELS (front uniquement) ──────────────────────────────────────────

export type WarPriority = "critical" | "high" | "medium";
export type TerritoryState = "idle" | "critical" | "high" | "conquered";

export interface TerritoryColor {
  base: string;
  glow: string;
  border: string;
  light: string;
}

/** Sous-ensemble de Club pour l'affichage */
export interface ClubDisplay {
  id: string;
  name: string;
  shortName: string;
  color: string;   // généré côté front depuis slug (hash → palette)
  symbol: string;  // initiale du nom
}

export interface WarViewModel {
  id: string;
  territoryId: string;       // slug territoire ex: "paris"
  territoryUuid: string;     // uuid club_wars.territory_id
  territoryName: string;
  attacker: ClubDisplay;
  defender: ClubDisplay;
  progress: number;
  priority: WarPriority;
  seconds: number;
  raw: ClubWar;
}

export interface TerritoryDisplay {
  id: string;
  name: string;
  path: string;
  labelX: number;
  labelY: number;
  color: TerritoryColor;
  state: TerritoryState;
  controllingClubId: string | null;
}

export interface PlayerStats {
  name: string;
  clubId: string;
  gold: number;
  level: number;
  xpPercent: number;
  notifications: number;
}

export interface ClubStatsDisplay {
  clubId: string;
  /** Nombre de territoires contrôlés par ce club */
  territoriesControlled: number;
  totalTerritories: number;
  globalRank: number;
  weeklyChange: number;
  // Données additionnelles disponibles
  warWins: number;
  warLosses: number;
  warXp: number;
  eloRating: number;
  tier: string;
}

export interface BattleEvent {
  id: string | number;
  type: "attack" | "defend" | "conquest";
  icon: string;
  clubId: string;
  clubName: string;
  clubColor: string;
  targetName: string;
}
