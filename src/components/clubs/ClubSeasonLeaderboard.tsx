"use client";

import { useClubSeasons } from "@/hooks/useClubSeasons";
import { Trophy } from "lucide-react";

export function ClubSeasonLeaderboard() {
  const { season, rankings, loading } = useClubSeasons();

  if (loading) return <div>Loading season...</div>;

  if (!season) {
    return (
      <div className="text-center text-muted-foreground">No active season</div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4 font-bold">
        <Trophy className="w-5 h-5 text-yellow-400" />
        {season.name}
      </div>

      <div className="space-y-2">
        {rankings.map((r: any) => (
          <div
            key={r.id}
            className="flex justify-between items-center border-b pb-2"
          >
            <div className="flex gap-3 items-center">
              <span className="font-bold w-6">#{r.rank}</span>

              <span>{r.club.name}</span>
            </div>

            <div className="font-semibold">
              {r.total_xp.toLocaleString()} XP
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
