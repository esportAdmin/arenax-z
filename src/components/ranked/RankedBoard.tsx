"use client";

import { Trophy } from "lucide-react";
import { useRankedBoard } from "@/hooks/useRankedBoard";

export default function RankedBoard() {
  const { data, loading } = useRankedBoard();

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/70">
        Loading ranked board...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <div className="mb-4 flex items-center gap-2 text-white">
        <Trophy className="h-5 w-5 text-yellow-400" />
        <h3 className="text-xl font-bold">Ranked Competitive Board</h3>
      </div>

      <div className="space-y-3">
        {data.map((row) => (
          <div
            key={row.club_id}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 text-center font-bold text-cyan-300">
                #{row.rank}
              </div>

              {row.logo_url ? (
                <img
                  src={row.logo_url}
                  alt={row.club_name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs text-white/60">
                  ?
                </div>
              )}

              <div>
                <div className="font-semibold text-white">{row.club_name}</div>
                <div className="text-xs text-white/50">
                  {row.war_wins}W / {row.war_losses}L
                </div>
              </div>
            </div>

            <div className="font-bold text-cyan-300">ELO {row.elo_rating}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
