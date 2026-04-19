import { AlertTriangle, Clock3, Gift, Lock, TrendingUp } from "lucide-react";

import { NeonButton } from "@/components/rallyguild/NeonButton";

const contributors = [
  ["CyberBlade", "1,250 pts"],
  ["NeoStrategist", "1,100 pts"],
  ["Ghost_Unit", "980 pts"],
] as const;

const momentumPoints = [
  [14, 78],
  [54, 58],
  [94, 68],
  [134, 38],
  [174, 46],
  [214, 28],
  [254, 34],
] as const;

/**
 * Renders the right-side tactical command center for the war-room screen.
 *
 * Example:
 * ```tsx
 * <WarCommandCenter />
 * ```
 */
export function WarCommandCenter() {
  return (
    <aside className="relative overflow-hidden rounded-[2.05rem] border border-cyan-300/22 bg-slate-950/78 p-4 shadow-[0_0_54px_rgba(34,211,238,0.1),inset_0_0_34px_rgba(249,115,22,0.06)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_100%_40%,rgba(249,115,22,0.2),transparent_34%)]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(34,211,238,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.16)_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative space-y-4">
        <div className="rounded-[1.4rem] border border-white/10 bg-black/26 px-4 py-3">
          <div className="text-[0.66rem] font-black uppercase tracking-[0.24em] text-cyan-200/70">
            RallyGuild
          </div>
          <div className="font-display text-2xl font-black uppercase text-white">
            War Room
          </div>
        </div>

        <div className="rounded-[1.45rem] border border-orange-300/26 bg-orange-500/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-orange-200/80">
              <AlertTriangle className="h-4 w-4" />
              Critical battle
            </div>
            <span className="rounded-full border border-orange-300/30 bg-orange-500/16 px-2.5 py-1 text-[0.62rem] font-black uppercase tracking-[0.14em] text-orange-100">
              High
            </span>
          </div>
          <div className="mt-4 grid grid-cols-[1fr_auto] items-end gap-3">
            <div>
              <div className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-slate-500">
                Next pressure window
              </div>
              <div className="mt-1 font-display text-5xl font-black text-orange-200 drop-shadow-[0_0_16px_rgba(251,146,60,0.45)]">
                00:15:30
              </div>
            </div>
            <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-300/24 bg-black/28">
              <Clock3 className="h-7 w-7 text-orange-200" />
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-orange-300/20 bg-black/25 p-3 text-sm font-bold text-orange-100">
            Pressure increasing. Mobilize now.
          </div>
        </div>

        <div className="rounded-[1.45rem] border border-cyan-300/18 bg-white/[0.045] p-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            <TrendingUp className="h-4 w-4 text-cyan-300" />
            Top contributors
          </div>
          <div className="mt-4 space-y-3">
            {contributors.map(([name, score], index) => (
              <div key={name} className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-xs font-black text-cyan-100">
                    {index + 1}
                  </div>
                  <span className="truncate font-bold text-white">{name}</span>
                </div>
                <span className="shrink-0 text-sm font-black text-cyan-100">
                  {score}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.45rem] border border-cyan-300/18 bg-white/[0.045] p-4">
          <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Member momentum
          </div>
          <svg viewBox="0 0 270 96" className="mt-3 h-24 w-full">
            <path
              d={momentumPoints
                .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`)
                .join(" ")}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 78 L54 58 L94 68 L134 38 L174 46 L214 28 L254 34 L254 96 L14 96 Z"
              fill="rgba(34,211,238,0.12)"
            />
            {momentumPoints.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#a5f3fc" />
            ))}
          </svg>
          <div className="mt-2 rounded-xl border border-orange-300/18 bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-100">
            Return nudge: active members +15%
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-[1.45rem] border border-cyan-300/18 bg-white/[0.045] p-4">
            <div className="flex items-center gap-3">
              <Clock3 className="h-6 w-6 text-cyan-300" />
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  Next reset
                </div>
                <div className="mt-1 text-2xl font-black text-white">In 2h 45m</div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.45rem] border border-emerald-300/20 bg-emerald-400/10 p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Gift className="h-7 w-7 text-emerald-300" />
                <Lock className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-slate-950 text-orange-200" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-100/80">
                  Reward loop locked
                </div>
                <div className="mt-1 text-sm text-slate-300">
                  85% to unlock next prestige tier
                </div>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300" />
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <NeonButton tone="ghost">System controls</NeonButton>
          <NeonButton tone="orange">Deploy resources</NeonButton>
        </div>
      </div>
    </aside>
  );
}
