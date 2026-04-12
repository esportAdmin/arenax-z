"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { useRealtimeArena } from "@/hooks/useRealtimeArena";

import ClubCard from "./ClubCard";
import SeasonProgress from "./SeasonProgress";
import ContributionStats from "./ContributionStats";
import GlobalLeaderboard from "./GlobalLeaderboard";
import UpcomingMatches from "./UpcomingMatches";

import EuropeWarMap from "@/components/map/EuropeWarMap";

export default function ArenaDashboard() {
  const { data, loading } = useDashboard();

  useRealtimeArena(() => {
    window.location.reload();
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        Loading Arena dashboard...
      </div>
    );
  }

  const leaderboardPlayers =
    data?.leaderboard?.map((p: any) => ({
      ...p,
      score: p.score ?? p.xp ?? 0,
    })) ?? [];

  return (
    <div className="space-y-10">
      {/* WAR MAP */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Global War Map
        </h2>

        <div className="h-[600px]">
          <EuropeWarMap />
        </div>
      </div>

      {/* TOP GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="space-y-6">
          <ClubCard club={data?.club ?? null} />
          <SeasonProgress />
        </div>

        {/* RIGHT */}
        <div className="xl:col-span-2 space-y-6">
          <ContributionStats />
          <GlobalLeaderboard players={leaderboardPlayers} />
        </div>
      </div>

      {/* UPCOMING MATCHES */}
      <UpcomingMatches matches={data?.matches ?? []} />
    </div>
  );
}
