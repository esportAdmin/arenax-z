"use client";

import { Swords } from "lucide-react";
import { useGuildTournaments } from "@/hooks/useGuildTournaments";

export default function GuildTournamentBoard() {
  const { entries, loading } = useGuildTournaments();

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/70">
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
          className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
        >
          <div className="mb-4 flex items-center gap-2 text-white">
            <Swords className="h-5 w-5 text-red-400" />
            <h3 className="text-xl font-bold">{rows[0].tournament_name}</h3>
          </div>

          <div className="space-y-3">
            {rows.map((entry) => (
              <div
                key={`${entry.tournament_id}-${entry.club_id}`}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-4 py-3"
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
