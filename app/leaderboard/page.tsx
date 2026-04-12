"use client";

import { useState } from "react";
import { LockKeyhole, TimerReset, Trophy } from "lucide-react";

import Navigation from "@/components/landing/Navigation";
import { CountdownPill } from "@/components/engagement/CountdownPill";
import { ReturnNudgeCard } from "@/components/engagement/ReturnNudgeCard";
import LeaderboardFilters from "@/components/leaderboard/LeaderboardFilters";
import LeaderboardHeader from "@/components/leaderboard/LeaderboardHeader";
import LeaderboardStats from "@/components/leaderboard/LeaderboardStats";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import TopThreePodium from "@/components/leaderboard/TopThreePodium";
import { RankedLeaderboardSection } from "@/components/ranked/RankedLeaderboardSection";
import { getHoursFromNow, getNextWeeklyReset } from "@/lib/countdown";

const PLAYERS_DATA = [
  {
    rank: 1,
    username: "SHADOWKING",
    avatar: "SK",
    level: 99,
    power: 125800,
    wins: 2847,
    losses: 153,
    winRate: 94.9,
    kills: 45280,
    territories: 156,
    club: "SHADOW LEGION",
    region: "Global",
    status: "online",
    streak: 47,
  },
  {
    rank: 2,
    username: "PHOENIXLORD",
    avatar: "PL",
    level: 98,
    power: 123500,
    wins: 2654,
    losses: 198,
    winRate: 93.1,
    kills: 42750,
    territories: 142,
    club: "PHOENIX RISING",
    region: "Europe",
    status: "online",
    streak: 38,
  },
  {
    rank: 3,
    username: "TITANSLAYER",
    avatar: "TS",
    level: 97,
    power: 121200,
    wins: 2501,
    losses: 224,
    winRate: 91.8,
    kills: 40890,
    territories: 138,
    club: "TITAN FORCE",
    region: "Americas",
    status: "in-game",
    streak: 32,
  },
  {
    rank: 4,
    username: "VANGUARDACE",
    avatar: "VA",
    level: 96,
    power: 118900,
    wins: 2389,
    losses: 267,
    winRate: 89.9,
    kills: 38750,
    territories: 129,
    club: "VANGUARD ELITE",
    region: "Asia",
    status: "online",
    streak: 28,
  },
  {
    rank: 5,
    username: "CRIMSONKING",
    avatar: "CK",
    level: 95,
    power: 116500,
    wins: 2276,
    losses: 298,
    winRate: 88.4,
    kills: 36940,
    territories: 124,
    club: "CRIMSON EMPIRE",
    region: "Global",
    status: "offline",
    streak: 0,
  },
  {
    rank: 6,
    username: "STORMRIDER",
    avatar: "SR",
    level: 94,
    power: 114200,
    wins: 2198,
    losses: 325,
    winRate: 87.1,
    kills: 35280,
    territories: 118,
    club: "STORM BREAKERS",
    region: "Oceania",
    status: "online",
    streak: 15,
  },
  {
    rank: 7,
    username: "IRONWOLF",
    avatar: "IW",
    level: 93,
    power: 111800,
    wins: 2087,
    losses: 356,
    winRate: 85.4,
    kills: 33750,
    territories: 112,
    club: "IRON WOLVES",
    region: "Europe",
    status: "in-game",
    streak: 22,
  },
  {
    rank: 8,
    username: "CELESTIALSTAR",
    avatar: "CS",
    level: 92,
    power: 109500,
    wins: 1965,
    losses: 389,
    winRate: 83.5,
    kills: 32140,
    territories: 106,
    club: "CELESTIAL GUARD",
    region: "Asia",
    status: "online",
    streak: 18,
  },
  {
    rank: 9,
    username: "NIGHTHUNTER",
    avatar: "NH",
    level: 91,
    power: 107200,
    wins: 1876,
    losses: 412,
    winRate: 82.0,
    kills: 30890,
    territories: 98,
    club: "NIGHT RAIDERS",
    region: "Americas",
    status: "offline",
    streak: 0,
  },
  {
    rank: 10,
    username: "DRAGONFIRE",
    avatar: "DF",
    level: 90,
    power: 104900,
    wins: 1798,
    losses: 445,
    winRate: 80.2,
    kills: 29560,
    territories: 92,
    club: "DRAGON CLAN",
    region: "Asia",
    status: "online",
    streak: 12,
  },
  {
    rank: 11,
    username: "FROSTBITE",
    avatar: "FB",
    level: 89,
    power: 102600,
    wins: 1723,
    losses: 478,
    winRate: 78.3,
    kills: 28340,
    territories: 87,
    club: "FROST LEGION",
    region: "Arctic",
    status: "in-game",
    streak: 9,
  },
  {
    rank: 12,
    username: "THUNDERGOD",
    avatar: "TG",
    level: 88,
    power: 100300,
    wins: 1654,
    losses: 512,
    winRate: 76.4,
    kills: 27120,
    territories: 81,
    club: "THUNDER STRIKE",
    region: "Global",
    status: "online",
    streak: 7,
  },
];

export default function LeaderboardPage() {
  const [selectedCategory, setSelectedCategory] = useState("power");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("all-time");
  const [visibleRows, setVisibleRows] = useState(5);

  const nextLadderRefresh = getHoursFromNow(6);
  const nextSeasonReward = getNextWeeklyReset(1, 18);

  const filteredPlayers = PLAYERS_DATA.filter((player) => {
    const matchesRegion =
      selectedRegion === "all" ||
      player.region.toLowerCase() === selectedRegion.toLowerCase() ||
      player.region === "Global";
    return matchesRegion;
  });

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    switch (selectedCategory) {
      case "power":
        return b.power - a.power;
      case "wins":
        return b.wins - a.wins;
      case "winrate":
        return b.winRate - a.winRate;
      case "kills":
        return b.kills - a.kills;
      default:
        return a.rank - b.rank;
    }
  });

  const rankedPlayers = sortedPlayers.map((player, index) => ({
    ...player,
    displayRank: index + 1,
  }));
  const topThree = rankedPlayers.slice(0, 3);
  const restOfPlayers = rankedPlayers.slice(3);
  const visiblePlayers = restOfPlayers.slice(0, visibleRows);
  const hasMorePlayers = visibleRows < restOfPlayers.length;

  const handleLoadMorePlayers = () => {
    setVisibleRows((current) => Math.min(current + 4, restOfPlayers.length));
  };

  return (
    <div className="min-h-screen text-white">
      <Navigation />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[18%] top-[4%] h-[520px] w-[520px] rounded-full bg-amber-400/10 blur-[150px]" />
        <div className="absolute right-[14%] top-[18%] h-[520px] w-[520px] rounded-full bg-yellow-500/8 blur-[170px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-[94px] sm:px-5 md:px-8">
        <LeaderboardHeader />

        <div className="mb-8 flex flex-wrap gap-2">
          <CountdownPill
            label="Ladder refresh"
            target={nextLadderRefresh}
            tone="amber"
          />
          <CountdownPill
            label="Season reward"
            target={nextSeasonReward}
            tone="cyan"
          />
        </div>

        <LeaderboardStats />
        <LeaderboardFilters
          selectedCategory={selectedCategory}
          setSelectedCategory={(category) => {
            setSelectedCategory(category);
            setVisibleRows(5);
          }}
          selectedRegion={selectedRegion}
          setSelectedRegion={(region) => {
            setSelectedRegion(region);
            setVisibleRows(5);
          }}
          selectedTimeframe={selectedTimeframe}
          setSelectedTimeframe={(timeframe) => {
            setSelectedTimeframe(timeframe);
            setVisibleRows(5);
          }}
        />
        <TopThreePodium topThree={topThree} />

        <section className="mb-10 grid gap-4 md:grid-cols-3">
          <ReturnNudgeCard
            icon={Trophy}
            label="Prestige loop"
            title="Players revisit when the top seat looks vulnerable"
            text="Keep the ladder emotionally hot. Visible movement beats static rank every time."
            tone="amber"
            lockedText="Season champion frame unlocks at top 25"
          />
          <ReturnNudgeCard
            icon={TimerReset}
            label="Refresh cycle"
            title="A reset timer turns curiosity into habit"
            text="When the next update feels close, mobile users are more likely to reopen before the cycle closes."
            tone="cyan"
            lockedText="Daily ranked bonus unlocks after your next verified climb"
          />
          <ReturnNudgeCard
            icon={LockKeyhole}
            label="Aspirational status"
            title="Locked cosmetics make rank feel worth defending"
            text="The ladder should promise more than numbers. It should hint at the premium identity waiting above."
            tone="rose"
            lockedText="Signature podium aura unlocks in the next tier"
          />
        </section>

        <LeaderboardTable
          players={visiblePlayers}
          startRank={4}
          totalPlayers={restOfPlayers.length}
          visibleCount={visiblePlayers.length}
          hasMore={hasMorePlayers}
          onLoadMore={handleLoadMorePlayers}
        />

        <div className="mt-10">
          <RankedLeaderboardSection />
        </div>
      </div>
    </div>
  );
}
