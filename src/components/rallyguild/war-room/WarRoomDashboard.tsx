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
    <div className="min-h-screen overflow-hidden bg-[#040b14] text-white">
      <Navigation />
      <main className="relative pb-14 pt-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(34,211,238,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.35)_1px,transparent_1px)] [background-size:44px_44px]" />
          <div className="absolute left-[-12rem] top-20 h-[36rem] w-[36rem] rounded-full bg-cyan-400/10 blur-[150px]" />
          <div className="absolute right-[-10rem] top-36 h-[34rem] w-[34rem] rounded-full bg-orange-500/12 blur-[160px]" />
        </div>

        <div className="container-arena relative z-10 space-y-6">
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

          <section className="grid gap-5 xl:grid-cols-[0.78fr_1.55fr_0.8fr]">
            <ActiveWarCard
              war={activeWar}
              pressure={activePressure}
              onOpenMap={() => router.push("/war-map")}
              onRally={() => router.push("/clubs")}
            />
            <TerritoryControlMap />
            <WarCommandCenter />
          </section>

          <section className="grid gap-5 xl:grid-cols-[0.74fr_1.26fr]">
            <WarFeed />
            <WarObjectives onRoute={(href) => router.push(href)} />
          </section>

          <TrustStrip />
        </div>
      </main>
    </div>
  );
}
