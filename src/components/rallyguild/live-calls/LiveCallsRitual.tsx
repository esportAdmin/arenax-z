"use client";

import { Radio, TimerReset, Users, Zap } from "lucide-react";

import { NeonButton } from "@/components/rallyguild/NeonButton";
import { TrustStrip } from "@/components/rallyguild/TrustStrip";

import { LiveCallMissionCard } from "./LiveCallMissionCard";
import { missions, ritualStats } from "./data";
import { MomentumSidebar } from "./MomentumSidebar";
import { RitualPulseCard } from "./RitualPulseCard";

/**
 * Orchestrates the live-calls ritual command board.
 *
 * Example:
 * ```tsx
 * <LiveCallsRitual />
 * ```
 */
export function LiveCallsRitual() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#040814] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(34,211,238,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.35)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="absolute left-[-10rem] top-16 h-[34rem] w-[34rem] rounded-full bg-cyan-400/12 blur-[150px]" />
        <div className="absolute right-[12%] top-[18%] h-[28rem] w-[28rem] rounded-full bg-violet-500/12 blur-[140px]" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-[radial-gradient(circle_at_50%_100%,rgba(249,115,22,0.13),transparent_55%)]" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-14 pt-28 sm:px-5 md:px-8">
        <section className="grid gap-6 lg:grid-cols-[1fr_0.82fr] lg:items-start">
          <div className="relative overflow-hidden rounded-[2.2rem] border border-cyan-300/20 bg-slate-950/74 p-6 shadow-[0_0_70px_rgba(34,211,238,0.1)] md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_100%_55%,rgba(249,115,22,0.14),transparent_32%)]" />
            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/24 bg-cyan-300/10 px-4 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.22em] text-cyan-100">
                <Radio className="h-3.5 w-3.5" />
                Live ritual online
              </div>
              <h1 className="font-display text-4xl font-black uppercase leading-none text-white md:text-6xl">
                Turn today's live moments into a{" "}
                <span className="text-cyan-300">return ritual.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                Launch community calls, create visible momentum, and give
                members a reason to come back before the next reset.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <NeonButton tone="cyan">Start live call</NeonButton>
                <NeonButton tone="blue">Schedule ritual</NeonButton>
                <NeonButton tone="orange">View command board</NeonButton>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                {ritualStats.map(([label, value], index) => (
                  <Stat
                    key={label}
                    icon={[Radio, Zap, Users, TimerReset][index]}
                    label={label}
                    value={value}
                  />
                ))}
              </div>
            </div>
          </div>

          <RitualPulseCard />
        </section>

        <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_0.42fr]">
          <div>
            <div className="mb-4 font-display text-2xl font-black uppercase text-white">
              Command board
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {missions.map((mission) => (
                <LiveCallMissionCard key={mission.title} mission={mission} />
              ))}
            </div>
          </div>

          <MomentumSidebar />
        </section>

        <div className="mt-8">
          <TrustStrip labels={["Discord/Twitch ready", "Daily ritual", "Retention focused"]} />
        </div>
      </main>
    </div>
  );
}

/**
 * Renders a live-call hero stat chip.
 *
 * Example:
 * ```tsx
 * <Stat icon={Radio} label="Live now" value="3" />
 * ```
 */
function Stat({ icon: Icon, label, value }: { icon: typeof Radio; label: string; value: string }) {
  return (
    <div className="rounded-[1.15rem] border border-cyan-300/18 bg-white/[0.055] p-3">
      <Icon className="h-4 w-4 text-cyan-200" />
      <div className="mt-2 font-display text-2xl font-black text-white">{value}</div>
      <div className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">{label}</div>
    </div>
  );
}
