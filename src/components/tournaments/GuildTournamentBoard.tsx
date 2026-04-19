"use client";

import { Swords } from "lucide-react";
import { useGuildTournaments } from "@/hooks/useGuildTournaments";

export default function GuildTournamentBoard() {
  const { entries, loading } = useGuildTournaments();

  if (loading) {
    return (
      <div className="dashboard-card text-white/70">
        Loading tournaments...
      </div>
    );
  }

  const groups = entries.reduce<Record<string, typeof entries>>(
    (acc, entry) => {
      if (!acc[entry.tournament_id]) {
        acc[entry.tournament_id] = [];
      }
      acc[entry.tournament_id].push(entry);
      return acc;
    },
    {},
  );

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([tournamentId, rows]) => (
        <div
          key={tournamentId}
            className="dashboard-card border-orange-300/20"
        >
          <div className="mb-5 flex items-center justify-between gap-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-300/25 bg-orange-500/10">
                <Swords className="h-5 w-5 text-orange-300" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-200">
                  Tournament room
                </div>
                <h3 className="font-display text-2xl font-black">
                  {rows[0].tournament_name}
                </h3>
              </div>
            </div>
            <span className="hidden rounded-full border border-orange-300/20 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-100 sm:inline-flex">
              {rows.length} clubs
            </span>
          </div>

          <div className="space-y-3">
            {rows.map((entry) => (
              <div
                key={`${entry.tournament_id}-${entry.club_id}`}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 px-4 py-3 transition hover:border-orange-300/30 hover:bg-white/[0.055]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 text-center font-bold text-cyan-300">
                    #{entry.rank}
                  </div>

                  {entry.logo_url ? (
                    <img
                      src={entry.logo_url}
                      alt={entry.club_name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs text-white/60">
                      ?
                    </div>
                  )}

                  <div>
                    <div className="font-semibold text-white">
                      {entry.club_name}
                    </div>
                    <div className="text-xs text-white/50">
                      {entry.wins}W / {entry.losses}L
                    </div>
                  </div>
                </div>

                <div className="font-bold text-red-300">{entry.points} pts</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
