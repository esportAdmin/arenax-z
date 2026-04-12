"use client";

import { Crown, Medal, Trophy } from "lucide-react";
import { useLeaderboard } from "@/hooks/useLeaderboard";

export default function Leaderboard() {
  const { data, loading, error } = useLeaderboard(10);

  if (loading) {
    return (
      <div className="section-shell">
        <div className="text-slate-300">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-shell border-red-500/20">
        <div className="text-red-300">{error}</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="section-shell">
        <div className="text-slate-300">No leaderboard data yet.</div>
      </div>
    );
  }

  const champion = data[0];
  const contenders = data.slice(1);

  return (
    <section className="section-shell">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="data-pill">Prestige ladder</div>
          <h3 className="mt-3 text-3xl font-display font-bold text-white">
            A leaderboard worth checking every day
          </h3>
          <p className="mt-2 max-w-2xl text-slate-300">
            Players come back for movement. One war, one streak, or one sharp
            live call can completely change the order.
          </p>
        </div>
        <div className="rounded-[1.4rem] border border-amber-400/18 bg-amber-400/8 px-4 py-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-200/80">
            Current leader
          </div>
          <div className="mt-1 flex items-center gap-2 text-white">
            <Crown className="h-4 w-4 text-amber-300" />
            <span className="font-semibold">
              {champion.username || "Anonymous"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="surface-panel overflow-hidden p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-2.5">
              <Trophy className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Champion spotlight
              </div>
              <div className="text-xl font-display font-bold text-white">
                {champion.username || "Anonymous"}
              </div>
            </div>
          </div>

            <div className="rounded-[1.4rem] border border-white/10 bg-slate-950/55 p-4 sm:p-5">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="text-5xl font-display font-black text-white">
                  #1
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  Holding the top seat right now
                </div>
              </div>
              <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">
                Live
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                  XP
                </div>
                <div className="mt-2 text-2xl font-display font-bold text-white">
                  {champion.total_xp.toLocaleString("en-US")}
                </div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                  Contributions
                </div>
                <div className="mt-2 text-2xl font-display font-bold text-white">
                  {champion.contributions.toLocaleString("en-US")}
                </div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                  Status
                </div>
                <div className="mt-2 text-2xl font-display font-bold text-primary">
                  Hot
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="surface-panel p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5">
              <Medal className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Full rankings
              </div>
              <div className="text-xl font-display font-bold text-white">
                Top contenders
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {contenders.map((player, index) => {
              const rank = index + 2;
              return (
                <div
                  key={player.user_id}
                  className="flex flex-col gap-3 rounded-[1.2rem] border border-white/8 bg-slate-950/55 px-4 py-3.5 transition-colors hover:border-white/14 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-display font-bold text-white">
                      #{rank}
                    </div>

                    <div>
                      <div className="font-semibold text-white">
                        {player.username || "Anonymous"}
                      </div>
                      <div className="text-sm text-slate-400">
                        {player.contributions} contribution
                        {player.contributions > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="font-display text-xl font-bold text-primary">
                      {player.total_xp.toLocaleString("en-US")}
                    </div>
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      XP
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
