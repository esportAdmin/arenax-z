import { Circle } from "lucide-react";

import type { RankingPlayer } from "./data";

/**
 * Renders the dense premium leaderboard table.
 *
 * Example:
 * ```tsx
 * <RankingTable players={players} />
 * ```
 */
export function RankingTable({ players }: { players: RankingPlayer[] }) {
  return (
    <section className="rounded-[2rem] border border-amber-300/18 bg-slate-950/74 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-amber-100/72">
            Full rankings
          </div>
          <div className="mt-1 font-display text-2xl font-black uppercase text-white">
            Leaderboard table
          </div>
        </div>
        <button
          className="rounded-xl bg-amber-300 px-5 py-3 font-display text-xs font-black uppercase tracking-[0.14em] text-slate-950"
          type="button"
        >
          Load more players
        </button>
      </div>

      <div className="overflow-hidden rounded-[1.25rem] border border-white/10">
        <div className="grid grid-cols-[64px_1.2fr_0.7fr_0.7fr_0.7fr_0.8fr] bg-white/[0.06] px-4 py-3 text-[0.68rem] font-black uppercase tracking-[0.14em] text-slate-400">
          <span>Rank</span>
          <span>Player</span>
          <span>Level</span>
          <span>Power</span>
          <span>Win Rate</span>
          <span>Status</span>
        </div>
        {players.map((player) => (
          <div
            className="grid grid-cols-[64px_1.2fr_0.7fr_0.7fr_0.7fr_0.8fr] items-center border-t border-white/8 px-4 py-3 text-sm"
            key={player.id}
          >
            <span className="font-display font-black text-amber-200">
              #{player.rank}
            </span>
            <span>
              <span className="font-black text-white">{player.name}</span>
              <span className="ml-2 text-xs text-slate-500">{player.club}</span>
            </span>
            <span className="text-cyan-200">Level {player.level}</span>
            <span className="font-black text-amber-100">{player.power}</span>
            <span className="text-emerald-200">{player.winRate}</span>
            <span className="flex items-center gap-2">
              <Circle
                className={`h-2.5 w-2.5 fill-current ${
                  player.status === "Online"
                    ? "text-emerald-300"
                    : player.status === "In Game"
                      ? "text-amber-300"
                      : "text-slate-500"
                }`}
              />
              {player.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
