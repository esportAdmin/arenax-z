export type Club = {
  id: string;
  name: string;
};

export type LeaderboardPlayer = {
  username: string;
  xp: number;
};

export type Match = {
  id: string;
  team_a: string;
  team_b: string;
};

export type DashboardData = {
  club: Club | null;
  leaderboard: LeaderboardPlayer[];
  matches: Match[];
};
