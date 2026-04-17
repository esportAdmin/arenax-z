import { Crown, Flame, Shield, Sparkles, Swords, Tornado, Zap } from "lucide-react";

export type ClubStatus = "Recruiting" | "Full" | "Invite Only";
export type ClubRegion = "Global" | "Europe" | "Americas" | "Asia" | "Oceania";
export type ClubTone = "cyan" | "red" | "violet" | "gold" | "blue" | "slate";

export interface DirectoryClub {
  icon: typeof Shield;
  id: number;
  members: string;
  name: string;
  rank: number;
  readRate: string;
  region: ClubRegion;
  slogan: string;
  status: ClubStatus;
  territories: string;
  tone: ClubTone;
}

export const clubs: DirectoryClub[] = [
  {
    icon: Shield,
    id: 1,
    members: "2,847",
    name: "Shadow Legion",
    rank: 1,
    readRate: "94%",
    region: "Global",
    slogan: "Dominate with strategic force.",
    status: "Recruiting",
    territories: "156",
    tone: "cyan",
  },
  {
    icon: Flame,
    id: 2,
    members: "2,654",
    name: "Phoenix Rising",
    rank: 2,
    readRate: "91%",
    region: "Europe",
    slogan: "Reborn from the ashes, stronger.",
    status: "Full",
    territories: "142",
    tone: "red",
  },
  {
    icon: Zap,
    id: 3,
    members: "2,501",
    name: "Titan Force",
    rank: 3,
    readRate: "89%",
    region: "Americas",
    slogan: "Unleash the power of legends.",
    status: "Recruiting",
    territories: "138",
    tone: "violet",
  },
  {
    icon: Swords,
    id: 4,
    members: "2,389",
    name: "Vanguard Elite",
    rank: 4,
    readRate: "87%",
    region: "Asia",
    slogan: "Lead the charge and earn honor.",
    status: "Recruiting",
    territories: "129",
    tone: "gold",
  },
  {
    icon: Crown,
    id: 5,
    members: "2,276",
    name: "Crimson Empire",
    rank: 5,
    readRate: "88%",
    region: "Global",
    slogan: "Reign through conquest.",
    status: "Invite Only",
    territories: "124",
    tone: "red",
  },
  {
    icon: Tornado,
    id: 6,
    members: "2,198",
    name: "Storm Breakers",
    rank: 6,
    readRate: "84%",
    region: "Oceania",
    slogan: "Harness the fury of the storm.",
    status: "Recruiting",
    territories: "118",
    tone: "blue",
  },
  {
    icon: Sparkles,
    id: 7,
    members: "2,087",
    name: "Iron Wolves",
    rank: 7,
    readRate: "82%",
    region: "Europe",
    slogan: "Strength in numbers, loyalty forever.",
    status: "Recruiting",
    territories: "112",
    tone: "slate",
  },
  {
    icon: Sparkles,
    id: 8,
    members: "1,965",
    name: "Celestial Guard",
    rank: 8,
    readRate: "81%",
    region: "Asia",
    slogan: "Protecting the realm from above.",
    status: "Full",
    territories: "106",
    tone: "cyan",
  },
];

export const regionFilters = ["Global", "All", "Americas", "Europe", "Asia", "Oceania"] as const;
export const statusFilters = ["Recruiting", "All", "Full", "Invite Only"] as const;
