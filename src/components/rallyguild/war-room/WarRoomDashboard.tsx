"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import Navigation from "@/components/landing/Navigation";
import { TerritoryControlMap } from "@/components/rallyguild/TerritoryControlMap";
import { TrustStrip } from "@/components/rallyguild/TrustStrip";
import { useLiveWars } from "@/hooks/useLiveWars";

import { ActiveWarCard } from "./ActiveWarCard";
import { fallbackFronts } from "./data";
import { pressureFor } from "./utils";
import { WarCommandCenter } from "./WarCommandCenter";
import { WarFeed } from "./WarFeed";
import { WarHero } from "./WarHero";
import { WarObjectives } from "./WarObjectives";

/**
 * Orchestrates the RallyGuild War Room screen from live war data.
 *
 * Example:
 * ```tsx
 * <WarRoomDashboard />
 * ```
 */
export function WarRoomDashboard() {
  const router = useRouter();
  const { wars, loading } = useLiveWars();

  const displayedFronts = useMemo(() => {
    const active = wars.filter((war) => war.war_id || war.status || war.total_xp > 0);
    return active.length > 0 ? active.slice(0, 8) : fallbackFronts;
  }, [wars]);

  const activeWar = displayedFronts[0] || fallbackFronts[0];
  const activePressure = pressureFor(activeWar, 0);
  const totalXp = displayedFronts.reduce((sum, war) => sum + (war.total_xp ?? 0), 0);

  return (
    <div className="min-h-screen overflow-hidden bg-[#030812] text-white">
      <Navigation />
      <main className="relative pb-14 pt-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_82%_34%,rgba(249,115,22,0.16),transparent_28%),linear-gradient(180deg,rgba(8,18,34,0.72),rgba(2,6,23,0.96))]" />
          <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(34,211,238,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.35)_1px,transparent_1px)] [background-size:44px_44px]" />
          <div className="absolute inset-0 opacity-[0.1] [background-image:linear-gradient(120deg,transparent_0_47%,rgba(34,211,238,0.7)_49%,transparent_51%_100%)] [background-size:160px_160px]" />
          <div className="absolute left-[-12rem] top-20 h-[36rem] w-[36rem] rounded-full bg-cyan-400/12 blur-[150px]" />
          <div className="absolute right-[-10rem] top-36 h-[34rem] w-[34rem] rounded-full bg-orange-500/14 blur-[160px]" />
          <div className="absolute bottom-[-12rem] left-1/2 h-[24rem] w-[54rem] -translate-x-1/2 rounded-full bg-cyan-950/80 blur-[120px]" />
        </div>

        <div className="container-arena relative z-10 space-y-6">
          <section className="relative overflow-hidden rounded-[2.4rem] border border-cyan-300/24 bg-[linear-gradient(145deg,rgba(8,19,34,0.92),rgba(2,6,23,0.88)_48%,rgba(13,20,32,0.94))] p-3 shadow-[0_0_90px_rgba(34,211,238,0.14),inset_0_0_70px_rgba(34,211,238,0.05)]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-10 right-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/80 to-transparent" />
              <div className="absolute bottom-0 left-14 right-14 h-px bg-gradient-to-r from-transparent via-orange-200/70 to-transparent" />
              <div className="absolute left-0 top-24 h-72 w-px bg-gradient-to-b from-transparent via-cyan-200/60 to-transparent" />
              <div className="absolute right-0 top-36 h-72 w-px bg-gradient-to-b from-transparent via-orange-200/60 to-transparent" />
              <div className="absolute -left-24 top-1/2 h-72 w-44 -translate-y-1/2 rounded-full border border-cyan-300/10 bg-cyan-300/5 blur-sm" />
              <div className="absolute -right-24 top-1/2 h-72 w-44 -translate-y-1/2 rounded-full border border-orange-300/10 bg-orange-300/5 blur-sm" />
            </div>

            <div className="relative space-y-5 rounded-[2.05rem] border border-white/10 bg-black/18 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] md:p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-[0.66rem] font-black uppercase tracking-[0.18em] text-slate-400">
                <span className="text-cyan-200">RallyGuild tactical console</span>
                <span className="rounded-full border border-emerald-300/22 bg-emerald-400/10 px-3 py-1 text-emerald-200">
                  War room online
                </span>
              </div>

              <WarHero
                frontsCount={displayedFronts.length}
                onOpenClubs={() => router.push("/clubs")}
                onOpenLiveCalls={() => router.push("/live-calls")}
                onOpenWarMap={() => router.push("/war-map")}
                totalXp={totalXp}
              />

              {loading ? (
                <section className="rounded-[2rem] border border-cyan-300/18 bg-slate-950/70 p-8 text-center text-slate-300">
                  Syncing territory pressure...
                </section>
              ) : null}

              <section className="grid items-start gap-5 xl:grid-cols-[minmax(18rem,0.82fr)_minmax(36rem,1.68fr)_minmax(18rem,0.82fr)]">
                <ActiveWarCard
                  war={activeWar}
                  pressure={activePressure}
                  onOpenMap={() => router.push("/war-map")}
                  onRally={() => router.push("/clubs")}
                />
                <TerritoryControlMap />
                <WarCommandCenter />
              </section>

              <section className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
                <WarFeed />
                <WarObjectives onRoute={(href) => router.push(href)} />
              </section>
            </div>
          </section>

          <TrustStrip />
        </div>
      </main>
    </div>
  );
}
