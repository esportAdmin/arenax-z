"use client";

import { CalendarDays } from "lucide-react";
import { useSeason } from "@/hooks/useSeason";
import { useSeasonLeaderboard } from "@/hooks/useSeasonLeaderboard";

export default function SeasonLeaderboard() {
  const { season } = useSeason();
  const { data, loading, error } = useSeasonLeaderboard();

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/70">
        Loading season leaderboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <div className="mb-4 flex items-center gap-2 text-white">
        <CalendarDays className="h-5 w-5 text-cyan-300" />
        <div>
          <h3 className="text-xl font-bold">Season Leaderboard</h3>
          <p className="text-sm text-white/60">
            {season?.name ?? "No active season"}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((club) => (
          <div
            key={club.club_id}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 text-center font-bold text-cyan-300">
                #{club.rank}
              </div>

              {club.logo_url ? (
                <img
                  src={club.logo_url}
                  alt={club.club_name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs text-white/60">
                  ?
                </div>
              )}

              <div>
                <div className="font-semibold text-white">{club.club_name}</div>
                <div className="text-xs text-white/50">
                  {club.war_wins}W / {club.war_losses}L · ELO {club.elo_rating}
                </div>
              </div>
            </div>

            <div className="font-bold text-cyan-300">
              {club.total_xp.toLocaleString()} XP
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
