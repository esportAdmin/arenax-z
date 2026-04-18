"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Crosshair,
  Flame,
  Globe2,
  LockKeyhole,
  MapPinned,
  Radio,
  Shield,
  Swords,
  TimerReset,
} from "lucide-react";

import { CountdownPill } from "@/components/engagement/CountdownPill";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { RealGlobalCommandMap } from "@/components/map/RealGlobalCommandMap";
import { TerritoryDetailsPanel } from "@/components/map/TerritoryDetailsPanel";
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

const US_FIRST_TERRITORY_HINTS = [
  "us east",
  "us west",
  "west coast",
  "east coast",
  "texas",
  "midwest",
  "northeast",
  "florida",
  "canada",
  "mexico",
  "brazil",
  "latam",
];

/**
 * Keeps the war map default aligned with the US-first launch market.
 *
 * Example:
 * ```ts
 * getPreferredStarterTerritory([{ name: "US East" } as Territory])
 * ```
 */
function getPreferredStarterTerritory(territories: Territory[]) {
  return (
    territories.find((territory) => {
      const normalized = territory.name.toLowerCase().trim();
      return US_FIRST_TERRITORY_HINTS.some((hint) => normalized.includes(hint));
    }) ??
    territories.find((territory) => territory.region?.toLowerCase().includes("america")) ??
    territories[0] ??
    null
  );
}

function Shell({ children, showChrome }: ShellProps) {
  if (!showChrome) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <Navbar />
      <div className="pt-16 lg:pt-20">{children}</div>
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

  const [selectedTerritoryId, setSelectedTerritoryId] = useState<string | null>(null);

  useEffect(() => {
    const preferredTerritory = getPreferredStarterTerritory(territories);

    if (territories.length === 0) {
      if (selectedTerritoryId !== null) {
        setSelectedTerritoryId(null);
      }
      return;
    }

    if (!selectedTerritoryId) {
      setSelectedTerritoryId(preferredTerritory?.id ?? null);
      return;
    }

    if (!territories.some((territory) => territory.id === selectedTerritoryId)) {
      setSelectedTerritoryId(preferredTerritory?.id ?? null);
    }
  }, [territories, selectedTerritoryId]);

  const selectedTerritory = useMemo(
    () =>
      territories.find((territory) => territory.id === selectedTerritoryId) ??
      getPreferredStarterTerritory(territories) ??
      null,
    [selectedTerritoryId, territories],
  );

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
        description: "Join a club before opening a pressure window.",
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
          title: "Pressure window failed",
          description: payload?.error ?? "The war room could not start this pressure window.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Pressure window opened",
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
      label: "Smart Layout",
      value: metrics.autoLayout,
      icon: MapPinned,
      tone: "from-emerald-400/30 to-teal-500/5",
    },
  ];

  return (
    <Shell showChrome={showChrome}>
      <div className="relative overflow-x-hidden bg-[#030915]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10%] top-[-12%] h-96 w-96 rounded-full bg-cyan-400/12 blur-3xl" />
          <div className="absolute right-[-6%] top-[12%] h-[28rem] w-[28rem] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-[-15%] left-[18%] h-96 w-96 rounded-full bg-orange-500/12 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.045)_1px,transparent_1px)] bg-[size:42px_42px]" />
        </div>

        <main className="relative mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative mb-5 overflow-hidden rounded-[1.6rem] border border-cyan-300/18 bg-[linear-gradient(135deg,rgba(8,23,42,0.92),rgba(5,10,24,0.86)_54%,rgba(49,24,12,0.72))] p-4 shadow-[0_0_70px_rgba(34,211,238,0.1)] backdrop-blur-xl lg:p-5"
          >
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />
            <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-orange-400/12 blur-3xl" />
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/24 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-cyan-200">
                  <Radio className="h-3.5 w-3.5" />
                  War room online
                </div>
                <h1 className="font-display text-3xl font-black leading-[0.98] tracking-tight text-white sm:text-5xl">
                  {title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-[0.95rem]">
                  {subtitle}
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map(({ icon: Icon, label, value, tone }) => (
                  <div
                    key={label}
                    className={`min-w-[132px] rounded-[1.15rem] border border-white/10 bg-gradient-to-br ${tone} p-3 shadow-[0_15px_40px_rgba(2,12,23,0.25),inset_0_1px_0_rgba(255,255,255,0.06)]`}
                  >
                    <div className="flex items-center justify-between text-slate-200">
                      <span className="text-xs uppercase tracking-[0.22em] text-slate-300">
                        {label}
                      </span>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="mt-2 text-2xl font-bold text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,340px)] 2xl:grid-cols-[minmax(0,1fr)_360px]">
            <motion.section
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
              className="relative min-w-0 overflow-hidden rounded-[1.9rem] border border-cyan-300/24 bg-[linear-gradient(145deg,rgba(6,18,32,0.94),rgba(2,6,23,0.9)_48%,rgba(29,17,11,0.82))] shadow-[0_0_100px_rgba(34,211,238,0.14),inset_0_0_70px_rgba(34,211,238,0.05)]"
            >
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/80 to-orange-200/80" />
                <div className="absolute inset-x-16 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-200/70 to-cyan-200/70" />
                <div className="absolute -left-16 top-1/2 h-72 w-24 -translate-y-1/2 rounded-r-[2rem] border border-cyan-300/10 bg-cyan-300/5" />
                <div className="absolute -right-16 top-1/2 h-72 w-24 -translate-y-1/2 rounded-l-[2rem] border border-orange-300/10 bg-orange-300/5" />
              </div>
              <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200/80">
                    Territory control map
                  </div>
                  <div className="mt-1 text-lg font-black text-white">
                    Central board, active pressure, and rally windows
                  </div>
                </div>
                <div className="inline-flex min-h-9 items-center gap-2 rounded-full border border-cyan-300/16 bg-cyan-300/8 px-3 py-1 text-xs font-bold text-cyan-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]" />
                  {metrics.autoLayout > 0
                    ? `${metrics.autoLayout} territories currently using smart placement`
                    : "All territories positioned from live map coordinates"}
                </div>
              </div>

              <div className="p-3 sm:p-4">
                <div className="relative overflow-hidden rounded-[1.55rem] border border-cyan-300/24 bg-[#030916] p-2 shadow-[0_0_62px_rgba(34,211,238,0.13),0_0_46px_rgba(249,115,22,0.07),inset_0_1px_0_rgba(255,255,255,0.07)]">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_48%,rgba(34,211,238,0.1),transparent_28%),radial-gradient(circle_at_78%_55%,rgba(249,115,22,0.12),transparent_22%)]" />
                  {loading ? (
                    <div className="relative flex h-[430px] items-center justify-center text-slate-300 sm:h-[520px] xl:h-[56vh] xl:max-h-[610px] 2xl:max-h-[650px]">
                      Loading global theater...
                    </div>
                  ) : (
                    <div className="relative h-[430px] overflow-hidden rounded-[1.35rem] sm:h-[520px] xl:h-[56vh] xl:max-h-[610px] 2xl:max-h-[650px]">
                      <RealGlobalCommandMap
                        territories={territories}
                        onSelect={(territory) => setSelectedTerritoryId(territory.id)}
                        selectedTerritoryId={selectedTerritoryId}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid gap-3 border-t border-white/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-400 sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                  Controlled zones
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-300 shadow-[0_0_12px_rgba(251,146,60,0.8)]" />
                  Pressure rising
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.8)]" />
                  Active rivalry
                </div>
              </div>
            </motion.section>

            <motion.aside
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.14 }}
              className="min-w-0 space-y-4"
            >
              <TerritoryDetailsPanel
                territory={selectedTerritory}
                clubId={clubId ?? undefined}
                canAttack
                onInvade={handleInvade}
              />

              <div className="relative overflow-hidden rounded-[1.55rem] border border-white/10 bg-white/[0.045] p-4 shadow-[0_15px_50px_rgba(2,12,23,0.24),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-orange-400/10 blur-3xl" />
                <div className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200/80">
                  Command center
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
                  <div className="rounded-2xl border border-cyan-300/18 bg-cyan-300/8 p-3 text-sm leading-6 text-slate-300">
                    The map is the daily return trigger. It should make admins
                    see where attention is heating up and what to rally next.
                  </div>
                  <div className="grid gap-2">
                    {[
                      { icon: Flame, label: "Hot fronts", tone: "text-rose-300" },
                      { icon: LockKeyhole, label: "Prestige teases", tone: "text-slate-200" },
                      { icon: Crosshair, label: "Clear next action", tone: "text-orange-300" },
                    ].map(({ icon: Icon, label, tone }) => (
                      <div
                        key={label}
                        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm font-bold text-white"
                      >
                        <Icon className={`h-4 w-4 ${tone}`} />
                        {label}
                      </div>
                    ))}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    <button
                      type="button"
                      onClick={() =>
                        toast({
                          title: "Front selected",
                          description: selectedTerritory
                            ? `${selectedTerritory.name} is ready for the next rally call.`
                            : "Select a territory to focus the rally call.",
                        })
                      }
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-cyan-300/28 bg-cyan-300/10 px-4 text-center text-xs font-black uppercase tracking-[0.12em] text-cyan-100 transition-colors hover:bg-cyan-300/16"
                    >
                      <Swords className="h-4 w-4" />
                      Rally active front
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        toast({
                          title: "Next pulse queued",
                          description: "Review the map again before reset to protect the return loop.",
                        })
                      }
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-orange-300/30 bg-orange-400/10 px-4 text-center text-xs font-black uppercase tracking-[0.12em] text-orange-100 transition-colors hover:bg-orange-300/16"
                    >
                      <TimerReset className="h-4 w-4" />
                      Review next pulse
                    </button>
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
