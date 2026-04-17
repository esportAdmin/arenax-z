"use client";

import { Trophy } from "lucide-react";
import { useRankedBoard } from "@/hooks/useRankedBoard";

export default function RankedBoard() {
  const { data, loading } = useRankedBoard();

  if (loading) {
    return (
      <div className="dashboard-card text-white/70">
        Loading ranked board...
      </div>
    );
  }

  return (
    <div className="dashboard-card border-amber-300/20">
      <div className="mb-5 flex items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/25 bg-amber-400/10">
            <Trophy className="h-5 w-5 text-amber-300" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200">
              Public ladder
            </div>
            <h3 className="font-display text-2xl font-black">
              Ranked Competitive Board
            </h3>
          </div>
        </div>
        <span className="hidden rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-200 sm:inline-flex">
          Live season
        </span>
      </div>

      <div className="space-y-3">
        {data.map((row) => (
          <div
            key={row.club_id}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:border-cyan-300/30 hover:bg-white/[0.055]"
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
