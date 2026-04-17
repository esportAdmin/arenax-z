import { Mic, Radio, TimerReset } from "lucide-react";

import { NeonButton } from "@/components/rallyguild/NeonButton";

/**
 * Renders the featured ritual card with waveform and return timer.
 *
 * Example:
 * ```tsx
 * <RitualPulseCard />
 * ```
 */
export function RitualPulseCard() {
  return (
    <aside className="relative overflow-hidden rounded-[2rem] border border-cyan-300/22 bg-slate-950/78 p-5 shadow-[0_0_54px_rgba(34,211,238,0.1)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_30%,rgba(34,211,238,0.16),transparent_34%),linear-gradient(145deg,rgba(34,211,238,0.08),transparent_38%,rgba(249,115,22,0.09))]" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-cyan-100/72">
              Today's ritual card
            </div>
            <h2 className="mt-3 font-display text-3xl font-black uppercase leading-none text-white">
              Daily Live Call
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-300">
              <span>3:00 PM EST</span>
              <span className="rounded-full bg-emerald-400/14 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-emerald-200">
                Active
              </span>
            </div>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/24 bg-cyan-300/10 text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.18)]">
            <Mic className="h-7 w-7" />
          </div>
        </div>

        <div className="mt-6 rounded-[1.35rem] border border-white/10 bg-black/24 p-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-100">
            <Radio className="h-4 w-4" />
            Voice pulse
          </div>
          <div className="mt-5 flex h-16 items-center gap-1 overflow-hidden">
            {Array.from({ length: 34 }).map((_, index) => (
              <span
                key={index}
                className="w-1.5 rounded-full bg-gradient-to-t from-cyan-400/25 via-cyan-200 to-blue-400/70 shadow-[0_0_10px_rgba(34,211,238,0.45)]"
                style={{ height: `${18 + ((index * 17) % 44)}px` }}
              />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-display text-2xl font-black text-cyan-100">
              <TimerReset className="h-5 w-5 text-orange-300" />
              34:15
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              until momentum reset
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <NeonButton tone="cyan">Join live call</NeonButton>
          <NeonButton tone="ghost">Create first call</NeonButton>
        </div>
      </div>
    </aside>
  );
}
