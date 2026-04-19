import { Crown, Flame, Shield, Star, Zap } from "lucide-react";

export interface RankingPlayer {
  club: string;
  icon: typeof Shield;
  id: number;
  level: number;
  name: string;
  power: string;
  rank: number;
  status: "Online" | "In Game" | "Offline";
  streak: number;
  territories: number;
  tone: "gold" | "silver" | "bronze" | "cyan" | "red";
  winRate: string;
}

export const players: RankingPlayer[] = [
  {
    club: "Shadow Legion",
    icon: Crown,
    id: 1,
    level: 99,
    name: "ShadowKing",
    power: "125,800",
    rank: 1,
    status: "Online",
    streak: 47,
    territories: 156,
    tone: "gold",
    winRate: "94.9%",
  },
  {
    club: "Phoenix Rising",
    icon: Flame,
    id: 2,
    level: 98,
    name: "PhoenixLord",
    power: "123,500",
    rank: 2,
    status: "Online",
    streak: 38,
    territories: 142,
    tone: "silver",
    winRate: "93.1%",
  },
  {
    club: "Titan Force",
    icon: Zap,
    id: 3,
    level: 97,
    name: "TitanSlayer",
    power: "121,200",
    rank: 3,
    status: "In Game",
    streak: 32,
    territories: 138,
    tone: "bronze",
    winRate: "91.8%",
  },
  {
    club: "Vanguard Elite",
    icon: Shield,
    id: 4,
    level: 96,
    name: "VanguardAce",
    power: "118,900",
    rank: 4,
    status: "Online",
    streak: 28,
    territories: 129,
    tone: "cyan",
    winRate: "89.9%",
  },
  {
    club: "Crimson Empire",
    icon: Star,
    id: 5,
    level: 95,
    name: "CrimsonKing",
    power: "116,500",
    rank: 5,
    status: "Offline",
    streak: 0,
    territories: 124,
    tone: "red",
    winRate: "88.4%",
  },
];

export const leaderboardStats = [
  ["Total Players", "450,000+"],
  ["Active Today", "125,847"],
  ["Total Matches", "8.9M+"],
  ["Reward Pool", "$12.5M"],
] as const;
