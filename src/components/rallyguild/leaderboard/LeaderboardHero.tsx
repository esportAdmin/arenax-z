import { Trophy } from "lucide-react";

import { leaderboardStats } from "./data";

/**
 * Renders the gold prestige leaderboard hero.
 *
 * Example:
 * ```tsx
 * <LeaderboardHero />
 * ```
 */
export function LeaderboardHero() {
  return (
    <section className="relative overflow-hidden rounded-[2.2rem] border border-amber-300/18 bg-slate-950/74 p-6 shadow-[0_0_70px_rgba(251,191,36,0.08)] md:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(250,204,21,0.18),transparent_28%),radial-gradient(circle_at_82%_26%,rgba(251,146,60,0.16),transparent_26%)]" />
      <div className="relative grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/24 bg-amber-300/10 px-4 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.2em] text-amber-100">
            <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_14px_rgba(250,204,21,0.8)]" />
            Global rankings updated live
          </div>
          <h1 className="font-display text-5xl font-black uppercase leading-none text-amber-300 md:text-7xl">
            Leaderboard
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
            Rise through the ranks. Prove your dominance. Claim your place
            among the elite communities of ArenaX.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {leaderboardStats.map(([label, value]) => (
            <div key={label} className="rounded-[1.25rem] border border-amber-300/18 bg-white/[0.055] p-4">
              <Trophy className="h-5 w-5 text-amber-300" />
              <div className="mt-2 font-display text-2xl font-black text-white">
                {value}
              </div>
              <div className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
