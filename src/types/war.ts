export interface Territory {
  id: string;
  name: string;
  paths: string;
  position: { x: number; y: number };
  color: string;
  glowColor: string;
  borderColor: string;
  state: "idle" | "critical" | "high" | "conquered";
  club?: Club;
}

export interface Club {
  id: string;
  name: string;
  shortName: string;
  color: string;
  logo: string;
}

export interface War {
  id: string;
  territoryId: string;
  territoryName: string;
  attacker: Club;
  defender: Club;
  progress: number;
  priority: "critical" | "high" | "medium";
  timeRemaining: string;
}

export interface PlayerStats {
  username: string;
  avatar: string;
  clubName: string;
  clubLogo: string;
  clubColor: string;
  gold: number;
  level: number;
  xp: number;
  xpMax: number;
  notifications: number;
}

export interface ClubStats {
  territoriesControlled: number;
  totalTerritories: number;
  rank: number;
  weeklyChange: number;
}

export interface BattleEvent {
  id: string;
  type: "attack" | "defend" | "conquest";
  clubName: string;
  clubColor: string;
  territoryName: string;
  icon: string;
}
