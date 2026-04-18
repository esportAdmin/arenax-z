import { Shield } from "lucide-react";

import { NeonButton } from "@/components/rallyguild/NeonButton";
import { PressureBar } from "@/components/rallyguild/PressureBar";
import type { LiveWar } from "@/hooks/useLiveWars";

interface ActiveWarCardProps {
  onOpenMap: () => void;
  onRally: () => void;
  pressure: number;
  war: LiveWar;
}

/**
 * Renders the active rivalry card shown beside the territory map.
 *
 * Example:
 * ```tsx
 * <ActiveWarCard war={war} pressure={78} onOpenMap={open} onRally={rally} />
 * ```
 */
export function ActiveWarCard({
  onOpenMap,
  onRally,
  pressure,
  war,
}: ActiveWarCardProps) {
  const attacker = war.club_name || "Team Alpha";

  return (
    <article className="relative overflow-hidden rounded-[2.15rem] border border-orange-300/36 bg-slate-950/82 p-4 shadow-[0_0_54px_rgba(249,115,22,0.16),inset_0_0_34px_rgba(34,211,238,0.06)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.2),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.24),transparent_34%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(34,211,238,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.16)_1px,transparent_1px)] [background-size:26px_26px]" />
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-orange-200/80 to-transparent" />

      <div className="relative space-y-4">
        <div className="rounded-[1.55rem] border border-white/10 bg-black/24 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-orange-200/75">
                Active rivalry
              </div>
              <h2 className="mt-2 break-words font-display text-2xl font-black uppercase leading-tight text-white 2xl:text-3xl">
                Shadow Strike
              </h2>
            </div>
            <span className="rounded-full border border-orange-300/35 bg-orange-500/14 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.16em] text-orange-100">
              Critical
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {attacker} is pushing pressure into {war.territory_name}. Rally the
            room before the reset window closes.
          </p>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch gap-2 rounded-[1.45rem] border border-white/10 bg-black/30 p-3 text-center">
          <div className="rounded-2xl border border-cyan-300/18 bg-cyan-300/8 p-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/28 bg-cyan-300/12">
              <Shield className="h-7 w-7 text-cyan-200" />
            </div>
            <div className="mt-3 text-[0.64rem] font-black uppercase tracking-[0.16em] text-slate-500">
              Attacker
            </div>
            <div className="mt-1 truncate text-sm font-black text-cyan-100">{attacker}</div>
          </div>
          <div className="flex items-center justify-center px-1 font-display text-2xl font-black text-orange-200 drop-shadow-[0_0_14px_rgba(251,146,60,0.5)] 2xl:text-3xl">
            VS
          </div>
          <div className="rounded-2xl border border-orange-300/18 bg-orange-500/10 p-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-300/28 bg-orange-500/14">
              <Shield className="h-7 w-7 text-orange-200" />
            </div>
            <div className="mt-3 text-[0.64rem] font-black uppercase tracking-[0.16em] text-slate-500">
              Defender
            </div>
            <div className="mt-1 truncate text-sm font-black text-orange-100">
              Club Omega
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[1.45rem] border border-cyan-300/18 bg-[#061423]/88 p-3">
          <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(34,211,238,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.18)_1px,transparent_1px)] [background-size:24px_24px]" />
          <svg viewBox="0 0 320 128" className="relative h-28 w-full">
            <path d="M26 62 L82 26 L150 38 L176 78 L116 104 L48 94 Z" fill="rgba(34,211,238,0.22)" stroke="#22d3ee" strokeWidth="3" />
            <path d="M132 70 L184 36 L260 52 L294 94 L230 116 L170 104 Z" fill="rgba(249,115,22,0.24)" stroke="#fb923c" strokeWidth="3" />
            <path d="M96 84 C132 70 176 70 220 90" stroke="#fb923c" strokeDasharray="7 6" strokeWidth="2" fill="none" />
            <circle cx="112" cy="64" r="7" fill="#22d3ee" />
            <circle cx="218" cy="82" r="8" fill="#fb923c" />
            <text x="46" y="76" fill="#a5f3fc" fontSize="13" fontWeight="900">NORTH</text>
            <text x="184" y="78" fill="#fed7aa" fontSize="13" fontWeight="900">CENTRAL</text>
          </svg>
          <div className="relative -mt-1">
            <PressureBar
              label={`Contested territory: ${war.territory_name}`}
              tone="orange"
              value={pressure}
            />
          </div>
        </div>

        <div className="grid gap-3 2xl:grid-cols-[1fr_1.2fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
            <div className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-slate-500">
              Time remaining
            </div>
            <div className="mt-1 font-display text-3xl font-black text-white">
              03:45:12
            </div>
          </div>
          <div className="rounded-2xl border border-orange-300/18 bg-orange-500/10 p-4">
            <div className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-orange-100/70">
              Next action
            </div>
            <div className="mt-1 text-sm font-bold leading-6 text-white">
              Rally members before pressure converts into a lost zone.
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <NeonButton onClick={onRally} tone="cyan">
            Rally members
          </NeonButton>
          <NeonButton onClick={onOpenMap} tone="orange">
            Open command room
          </NeonButton>
        </div>
      </div>
    </article>
  );
}
