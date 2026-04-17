import { Radio, Swords, Trophy, Zap } from "lucide-react";

import { NeonButton } from "@/components/rallyguild/NeonButton";

import { StatTile } from "./WarStatTile";

interface WarHeroProps {
  frontsCount: number;
  onOpenClubs: () => void;
  onOpenLiveCalls: () => void;
  onOpenWarMap: () => void;
  totalXp: number;
}

/**
 * Renders the war-room hero and primary tactical actions.
 *
 * Example:
 * ```tsx
 * <WarHero frontsCount={4} totalXp={5000} onOpenClubs={fn} onOpenLiveCalls={fn} onOpenWarMap={fn} />
 * ```
 */
export function WarHero({
  frontsCount,
  onOpenClubs,
  onOpenLiveCalls,
  onOpenWarMap,
  totalXp,
}: WarHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-950/72 p-6 shadow-[0_0_70px_rgba(34,211,238,0.08)] md:p-8">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#040e1c] via-[#071828] to-[#06111f]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(34,211,238,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.4)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="absolute right-0 top-0 h-[28rem] w-[38rem] translate-x-1/4 -translate-y-1/4 rounded-full bg-orange-500/20 blur-[120px]" />
        <div className="absolute right-10 top-8 h-[20rem] w-[28rem] rounded-full bg-cyan-400/10 blur-[90px]" />
      </div>

      <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="lg:max-w-[52rem]">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-[0.72rem] font-black uppercase tracking-[0.2em] text-cyan-100">
            <Radio className="h-3.5 w-3.5" />
            War room online
          </div>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-black uppercase leading-none text-white md:text-6xl">
            Turn rivalry into a daily comeback loop
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            Create territory pressure, rally members, and make every community
            action visible before the next reset.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <NeonButton onClick={onOpenLiveCalls} tone="cyan">
              Start first war
            </NeonButton>
            <NeonButton onClick={onOpenWarMap} tone="orange">
              Open war map
            </NeonButton>
            <NeonButton onClick={onOpenClubs} tone="blue">
              Rally members
            </NeonButton>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:w-[430px]">
          <StatTile icon={Swords} label="Fronts" value={frontsCount} tone="orange" />
          <StatTile icon={Trophy} label="Total XP" value={totalXp.toLocaleString("en-US")} tone="cyan" />
          <StatTile icon={Zap} label="Readiness" value="92%" tone="emerald" />
        </div>
      </div>
    </section>
  );
}
