import { Lock, Radio, Signal, TimerReset } from "lucide-react";

import { NeonButton } from "@/components/rallyguild/NeonButton";
import { cn } from "@/lib/utils";

import type { LiveCallMission } from "./data";

const accentClass: Record<LiveCallMission["accent"], string> = {
  blue: "border-blue-300/34 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.12)]",
  cyan: "border-cyan-300/46 bg-cyan-300/12 shadow-[0_0_36px_rgba(34,211,238,0.2)]",
  locked: "border-white/14 bg-white/[0.035] opacity-80",
  orange: "border-orange-300/32 bg-orange-500/10 shadow-[0_0_30px_rgba(249,115,22,0.12)]",
};

const meterClass: Record<LiveCallMission["accent"], string> = {
  blue: "from-blue-300 via-cyan-300 to-blue-500",
  cyan: "from-cyan-200 via-cyan-300 to-teal-300",
  locked: "from-slate-500 via-slate-400 to-slate-600",
  orange: "from-orange-300 via-amber-300 to-cyan-300",
};

/**
 * Renders one live-call command board mission card.
 *
 * Example:
 * ```tsx
 * <LiveCallMissionCard mission={mission} />
 * ```
 */
export function LiveCallMissionCard({ mission }: { mission: LiveCallMission }) {
  const active = mission.status === "Live";
  const locked = mission.status === "Locked";
  const buttonTone = active ? "cyan" : locked ? "ghost" : mission.accent === "orange" ? "orange" : "blue";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[1.55rem] border p-4 transition-transform duration-300 hover:-translate-y-1",
        accentClass[mission.accent],
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(34,211,238,0.13),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_28%,rgba(255,255,255,0.035))]" />
      <div className="absolute -right-12 -top-16 h-36 w-36 rounded-full bg-cyan-300/12 blur-3xl" />
      <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent" />
      <div className="relative">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <div className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-slate-500">
              {mission.community}
            </div>
            <h2 className="mt-1 font-display text-xl font-black uppercase text-white">
              {mission.title}
            </h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-cyan-100/58">
              {mission.subtitle}
            </p>
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[0.62rem] font-black uppercase tracking-[0.12em]",
              active
                ? "bg-cyan-300 text-slate-950"
                : locked
                  ? "bg-slate-800 text-slate-300"
                  : "bg-white/10 text-slate-200",
            )}
          >
            {locked ? <Lock className="h-3 w-3" /> : null}
            {mission.status}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Metric icon={Radio} label="Visual State" value={mission.status} />
          <Metric icon={Signal} label="Signal" value={mission.signal} />
          <Metric icon={TimerReset} label="Lock" value={mission.lockTime} />
        </div>

        <div className="mt-4">
          <div className="mb-2 flex justify-between text-xs font-bold text-slate-400">
            <span>Attention gauge</span>
            <span className="text-cyan-100">{mission.attention}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className={cn(
                "h-full rounded-full bg-gradient-to-r shadow-[0_0_12px_rgba(34,211,238,0.45)]",
                meterClass[mission.accent],
              )}
              style={{ width: mission.attention }}
            />
          </div>
        </div>

        <NeonButton className="mt-4 w-full" tone={buttonTone}>
          {mission.actionLabel}
        </NeonButton>
      </div>
    </article>
  );
}

/**
 * Renders a compact mission-card metric.
 *
 * Example:
 * ```tsx
 * <Metric icon={Radio} label="State" value="Live" />
 * ```
 */
function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Radio;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/22 p-2 text-center">
      <Icon className="mx-auto h-4 w-4 text-cyan-200" />
      <div className="mt-1 truncate text-xs font-black text-white">{value}</div>
      <div className="mt-1 text-[0.56rem] uppercase tracking-[0.08em] text-slate-500">
        {label}
      </div>
    </div>
  );
}
