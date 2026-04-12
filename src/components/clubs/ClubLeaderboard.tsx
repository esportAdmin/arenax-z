"use client";

import { ArrowUpRight, Crown, Flame, Medal, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";

const topContributors = [
  { rank: 1, name: "Viper_X", points: 28500, trend: "+14%", badge: "VP" },
  { rank: 2, name: "Phoenix_Ace", points: 26800, trend: "+11%", badge: "PA" },
  { rank: 3, name: "Storm_Rider", points: 24200, trend: "+6%", badge: "SR" },
  { rank: 4, name: "Shadow_Wolf", points: 22900, trend: "+4%", badge: "SW" },
  { rank: 5, name: "Cyber_Knight", points: 21500, trend: "+3%", badge: "CK" },
];

export default function ClubLeaderboard() {
  return (
    <div className="space-y-4">
      <div className="surface-panel p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Club prestige ladder
            </div>
            <h2 className="mt-2 text-2xl font-display font-bold text-white">
              Top contributors tonight
            </h2>
          </div>
          <div className="rounded-2xl border border-amber-400/18 bg-amber-400/10 p-2.5">
            <Crown className="h-5 w-5 text-amber-300" />
          </div>
        </div>

        <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-slate-950/55 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Club MVP
              </div>
              <div className="mt-2 text-xl font-display font-bold text-white">
                Viper_X
              </div>
            </div>
            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
              Hot streak
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                Contribution
              </div>
              <div className="mt-2 text-2xl font-display font-bold text-white">
                28.5K
              </div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                Pressure swing
              </div>
              <div className="mt-2 flex items-center gap-2 text-2xl font-display font-bold text-rose-300">
                <Flame className="h-5 w-5" />
                +14%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="surface-panel p-4">
        <div className="space-y-3">
          {topContributors.map((contributor) => (
            <div
              key={contributor.rank}
              className="flex items-center justify-between gap-3 rounded-[1.2rem] border border-white/8 bg-slate-950/55 px-4 py-3.5 transition-colors hover:border-white/16"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-display font-bold text-white">
                  {contributor.badge}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {contributor.name}
                    </span>
                    {contributor.rank <= 3 ? (
                      <Medal className="h-4 w-4 text-amber-300" />
                    ) : null}
                  </div>
                  <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
                    Rank #{contributor.rank}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-display text-xl font-bold text-primary">
                  {contributor.points.toLocaleString("en-US")}
                </div>
                <div className="flex items-center justify-end gap-1 text-xs uppercase tracking-[0.14em] text-emerald-300">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {contributor.trend}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" className="mt-4 w-full justify-between">
          View full club ladder
          <Shield className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
