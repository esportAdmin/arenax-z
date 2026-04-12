"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Globe2,
  LockKeyhole,
  MapPinned,
  Shield,
  Sparkles,
  TimerReset,
} from "lucide-react";

import { CountdownPill } from "@/components/engagement/CountdownPill";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { TerritoryDetailsPanel } from "@/components/map/TerritoryDetailsPanel";
import WorldMapSvg from "@/components/map/WorldMapSvg";
import { useActiveWars } from "@/hooks/useActiveWars";
import { Territory, useGlobalWarMap } from "@/hooks/useGlobalWarMap";
import { useMyClub } from "@/hooks/useMyClub";
import { useToast } from "@/hooks/use-toast";
import { getHoursFromNow, getNextUtcMidnight } from "@/lib/countdown";

type Props = {
  title: string;
  subtitle: string;
  showChrome?: boolean;
};

type ShellProps = {
  children: ReactNode;
  showChrome: boolean;
};

function Shell({ children, showChrome }: ShellProps) {
  if (!showChrome) {
    return <div className="min-h-screen bg-slate-950 text-white">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <div className="pt-20">{children}</div>
      <Footer />
    </div>
  );
}

export default function GlobalAnimatedWarMap({
  title,
  subtitle,
  showChrome = true,
}: Props) {
  const { territories, loading } = useGlobalWarMap();
  const activeWars = useActiveWars();
  const clubId = useMyClub();
  const { toast } = useToast();

  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);

  useEffect(() => {
    if (territories.length === 0) {
      if (selectedTerritory !== null) {
        setSelectedTerritory(null);
      }
      return;
    }

    if (!selectedTerritory) {
      setSelectedTerritory(territories[0]);
      return;
    }

    const nextSelected = territories.find(
      (territory) => territory.id === selectedTerritory.id,
    );

    if (!nextSelected) {
      setSelectedTerritory(territories[0]);
      return;
    }

    if (nextSelected !== selectedTerritory) {
      setSelectedTerritory(nextSelected);
    }
  }, [territories, selectedTerritory]);

  const metrics = useMemo(() => {
    const controlled = territories.filter((territory) => territory.controlling_club_id).length;
    const mapped = territories.filter(
      (territory) => territory.map_x !== null && territory.map_y !== null,
    ).length;

    return {
      territories: territories.length,
      contested: activeWars.length,
      controlled,
      autoLayout: Math.max(0, territories.length - mapped),
    };
  }, [activeWars.length, territories]);

  async function handleInvade(territory: Territory) {
    if (!clubId) {
      toast({
        title: "Club required",
        description: "Join a club before launching an invasion.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/territories/invade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clubId,
          territoryId: territory.id,
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        toast({
          title: "Invasion failed",
          description: payload?.error ?? "The war room could not start this attack.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Invasion launched",
        description: `Battle lines are moving toward ${territory.name}.`,
      });
    } catch {
      toast({
        title: "Network error",
        description: "The command uplink failed. Please try again.",
        variant: "destructive",
      });
    }
  }

  const stats = [
    {
      label: "Territories",
      value: metrics.territories,
      icon: Globe2,
      tone: "from-cyan-400/30 to-sky-500/5",
    },
    {
      label: "Hot Zones",
      value: metrics.contested,
      icon: Flame,
      tone: "from-rose-400/30 to-orange-500/5",
    },
    {
      label: "Controlled",
      value: metrics.controlled,
      icon: Shield,
      tone: "from-blue-400/30 to-indigo-500/5",
    },
    {
      label: "Auto-Placed",
      value: metrics.autoLayout,
      icon: MapPinned,
      tone: "from-emerald-400/30 to-teal-500/5",
    },
  ];

  return (
    <Shell showChrome={showChrome}>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10%] top-[-12%] h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute right-[-6%] top-[12%] h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-[-15%] left-[18%] h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
        </div>

        <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mb-8 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_0_60px_rgba(34,211,238,0.08)] backdrop-blur-xl lg:p-8"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  Global animated command layer
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                  {title}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  {subtitle}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map(({ icon: Icon, label, value, tone }) => (
                  <div
                    key={label}
                    className={`min-w-[150px] rounded-2xl border border-white/10 bg-gradient-to-br ${tone} p-4 shadow-[0_15px_40px_rgba(2,12,23,0.25)]`}
                  >
                    <div className="flex items-center justify-between text-slate-200">
                      <span className="text-xs uppercase tracking-[0.22em] text-slate-300">
                        {label}
                      </span>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="mt-4 text-3xl font-bold text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,2.2fr)_360px]">
            <motion.section
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
              className="overflow-hidden rounded-[30px] border border-cyan-300/15 bg-slate-950/85 shadow-[0_0_80px_rgba(34,211,238,0.08)]"
            >
              <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
                    Live world control
                  </div>
                  <div className="mt-1 text-lg font-semibold text-white">
                    Animated frontlines across the global board
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]" />
                  {metrics.autoLayout > 0
                    ? `${metrics.autoLayout} territories currently using smart placement`
                    : "All territories positioned from live map coordinates"}
                </div>
              </div>

              <div className="p-3 sm:p-4">
                <div className="rounded-[24px] border border-white/10 bg-[#040b17] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  {loading ? (
                    <div className="flex h-[520px] items-center justify-center text-slate-300">
                      Loading global theater...
                    </div>
                  ) : (
                    <div className="h-[520px]">
                      <WorldMapSvg
                        territories={territories}
                        onSelect={setSelectedTerritory}
                        selectedTerritoryId={selectedTerritory?.id ?? null}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.section>

            <motion.aside
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.14 }}
              className="space-y-6"
            >
              <TerritoryDetailsPanel
                territory={selectedTerritory}
                clubId={clubId ?? undefined}
                canAttack
                onInvade={handleInvade}
              />

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_15px_50px_rgba(2,12,23,0.24)] backdrop-blur-xl">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
                  Command notes
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <CountdownPill
                    label="Daily reset"
                    target={getNextUtcMidnight()}
                    tone="cyan"
                  />
                  <CountdownPill
                    label="Map pulse"
                    target={getHoursFromNow(4)}
                    tone="amber"
                  />
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-300">
                    The map should do more than display control. It should make
                    the next return feel urgent, social, and worth monitoring.
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Flame className="h-4 w-4 text-rose-300" />
                      Contested fronts should look emotionally hot
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Red pulses, time windows, and ownership pressure give
                      players a reason to peek at the map again before reset.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <LockKeyhole className="h-4 w-4 text-slate-200" />
                      Locked territory finishes should tease premium status
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      The world feels stickier when captured ground hints at
                      visible upgrades, not just hidden value.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <TimerReset className="h-4 w-4 text-amber-300" />
                      Unified map behavior matters
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Public map, club map, and war map should all reinforce the
                      same world-state ritual instead of feeling like separate tools.
                    </p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </main>
      </div>
    </Shell>
  );
}
