import { Flame, Lock, ShieldCheck, Users } from "lucide-react";

import { NeonButton } from "@/components/rallyguild/NeonButton";

import { pulseMembers, recentCalls } from "./data";

/**
 * Renders the retention sidebar for live calls and return-loop rewards.
 *
 * Example:
 * ```tsx
 * <MomentumSidebar />
 * ```
 */
export function MomentumSidebar() {
  return (
    <aside className="space-y-4">
      <section className="rounded-[1.7rem] border border-cyan-300/18 bg-slate-950/72 p-4">
        <div className="flex items-center gap-2 text-[0.68rem] font-black uppercase tracking-[0.22em] text-cyan-100/72">
          <Users className="h-4 w-4" />
          Momentum sidebar
        </div>
        <h2 className="mt-3 font-display text-2xl font-black uppercase text-white">
          Community pulse
        </h2>
        <div className="mt-4 grid gap-2">
          {pulseMembers.map(([name, action, state]) => (
            <div
              key={name}
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3"
            >
              <div>
                <div className="text-sm font-black text-white">{name}</div>
                <div className="text-xs uppercase tracking-[0.12em] text-slate-500">
                  {action}
                </div>
              </div>
              <span className="rounded-full bg-cyan-300/10 px-2.5 py-1 text-[0.62rem] font-black uppercase tracking-[0.12em] text-cyan-100">
                {state}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.7rem] border border-orange-300/24 bg-orange-500/8 p-4 shadow-[0_0_34px_rgba(249,115,22,0.08)]">
        <div className="flex items-center gap-2 text-[0.68rem] font-black uppercase tracking-[0.22em] text-orange-100/78">
          <Flame className="h-4 w-4" />
          Return loop panel
        </div>
        <h2 className="mt-3 font-display text-2xl font-black uppercase text-white">
          5 day streak
        </h2>
        <div className="mt-3 h-2 rounded-full bg-white/10">
          <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-orange-300 to-cyan-300 shadow-[0_0_16px_rgba(249,115,22,0.3)]" />
        </div>
        <div className="mt-4 rounded-2xl border border-orange-300/20 bg-black/22 p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-orange-100">
              Next reward
            </span>
            <Lock className="h-4 w-4 text-orange-200" />
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-300">
            Unlock Club Pulse layer after one more ritual.
          </p>
          <NeonButton className="mt-4 w-full" tone="orange">
            Come back tomorrow
          </NeonButton>
        </div>
      </section>

      <section className="rounded-[1.7rem] border border-white/10 bg-slate-950/72 p-4">
        <div className="flex items-center gap-2 text-[0.68rem] font-black uppercase tracking-[0.22em] text-cyan-100/72">
          <ShieldCheck className="h-4 w-4" />
          Recent live calls
        </div>
        <div className="mt-4 space-y-2">
          {recentCalls.map(([date, label, value]) => (
            <div
              key={`${date}-${label}`}
              className="rounded-2xl border border-white/10 bg-white/[0.045] p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-bold text-white">{label}</span>
                <span className="text-xs font-black text-cyan-200">{value}</span>
              </div>
              <div className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">
                {date}
              </div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
