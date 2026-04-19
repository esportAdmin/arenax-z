import type { RankingPlayer } from "./data";

const toneClass = {
  bronze: "border-orange-300/38 bg-orange-500/12",
  cyan: "border-cyan-300/30 bg-cyan-300/10",
  gold: "border-yellow-300/50 bg-yellow-300/14",
  red: "border-rose-300/30 bg-rose-400/10",
  silver: "border-slate-200/45 bg-slate-200/12",
};

/**
 * Renders the top-three championship podium.
 *
 * Example:
 * ```tsx
 * <PodiumSection players={players.slice(0, 3)} />
 * ```
 */
export function PodiumSection({ players }: { players: RankingPlayer[] }) {
  const ordered = [players[1], players[0], players[2]].filter(Boolean);

  return (
    <section className="rounded-[2rem] border border-amber-300/18 bg-slate-950/72 p-5">
      <div className="mb-5 text-center">
        <div className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-amber-100/72">
          Top 3 champions
        </div>
        <div className="mt-1 font-display text-2xl font-black uppercase text-white">
          The elite of the arena
        </div>
      </div>
      <div className="grid items-end gap-4 md:grid-cols-3">
        {ordered.map((player) => {
          const Icon = player.icon;
          const isWinner = player.rank === 1;
          return (
            <article
              className={`rounded-[1.55rem] border p-5 text-center ${toneClass[player.tone]} ${isWinner ? "md:min-h-[310px]" : "md:min-h-[260px]"}`}
              key={player.id}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-black/24">
                <Icon className="h-9 w-9 text-amber-200" />
              </div>
              <div className="mt-4 font-display text-3xl font-black text-white">
                #{player.rank}
              </div>
              <div className="mt-2 text-xl font-black text-white">{player.name}</div>
              <div className="text-sm text-slate-400">{player.club}</div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl bg-black/24 p-2">
                  <div className="font-black text-amber-100">{player.power}</div>
                  <div className="text-[0.62rem] uppercase text-slate-500">Power</div>
                </div>
                <div className="rounded-xl bg-black/24 p-2">
                  <div className="font-black text-cyan-100">{player.winRate}</div>
                  <div className="text-[0.62rem] uppercase text-slate-500">Rate</div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
