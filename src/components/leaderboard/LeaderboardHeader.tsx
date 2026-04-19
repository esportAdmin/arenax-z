import { Sparkles, Trophy } from "lucide-react";

export default function LeaderboardHeader() {
  return (
    <div className="mb-10 md:mb-12">
      <div className="eyebrow-badge">
        <Sparkles className="h-4 w-4 text-warning" />
        Rankings update live
      </div>

      <h1 className="mt-5 text-4xl font-display font-black tracking-[0.04em] text-white sm:text-5xl md:text-7xl">
        <span className="gradient-text-accent text-glow-accent">Leaderboard</span>
      </h1>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <p className="max-w-3xl text-base leading-7 text-slate-300 md:text-lg md:leading-8">
          This is where ArenaX turns activity into status. Players return when
          the ladder moves, the top seat looks vulnerable, and every session can
          change how they are seen.
        </p>

        <div className="surface-panel flex items-center gap-4 p-4 sm:p-5">
          <div className="rounded-2xl border border-amber-400/18 bg-amber-400/10 p-3">
            <Trophy className="h-5 w-5 text-amber-300" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Ladder pressure
            </div>
            <div className="mt-1 text-white">
              Prestige works because movement is visible and public.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
