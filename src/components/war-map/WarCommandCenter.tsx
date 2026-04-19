"use client";

import { motion } from "framer-motion";
import { Flame, Shield, Swords, TimerReset } from "lucide-react";

import { CountdownPill } from "@/components/engagement/CountdownPill";
import { Button } from "@/components/ui/button";
import { War } from "@/types/war";
import { getHoursFromNow } from "@/lib/countdown";

interface WarCommandCenterProps {
  wars: War[];
  onAttack: (warId: string) => void;
  onReinforce: (warId: string) => void;
}

export default function WarCommandCenter({
  wars,
  onAttack,
  onReinforce,
}: WarCommandCenterProps) {
  return (
    <motion.aside
      initial={{ x: 22, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed right-0 top-[72px] z-40 h-[calc(100vh-72px)] w-[min(100vw,22rem)] overflow-y-auto border-l border-white/10 bg-slate-950/96 backdrop-blur-2xl"
    >
      <div className="border-b border-white/10 px-4 py-4">
        <div className="eyebrow-badge">War command center</div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-xl font-display font-bold text-white">
              Active fronts
            </div>
            <div className="text-sm text-slate-400">
              {wars.length} live war{wars.length === 1 ? "" : "s"} under pressure
            </div>
          </div>
          <CountdownPill label="Refresh" target={getHoursFromNow(1)} tone="amber" />
        </div>
      </div>

      <div className="space-y-3 p-4">
        {wars.map((war) => {
          const isCritical = war.priority === "critical";
          return (
            <div
              key={war.id}
              className={`surface-panel p-4 ${isCritical ? "border-rose-400/20 bg-rose-400/8" : war.priority === "high" ? "border-amber-400/20 bg-amber-400/8" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-display font-bold text-white">
                    {war.territoryName}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    {war.priority} priority
                  </div>
                </div>
                <CountdownPill
                  label="Lock"
                  target={getHoursFromNow(isCritical ? 2 : 5)}
                  tone={isCritical ? "rose" : "amber"}
                  className="shrink-0"
                />
              </div>

              <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="text-center">
                  <div
                    className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-display font-black text-white"
                    style={{ backgroundColor: war.attacker.color }}
                  >
                    {war.attacker.logo}
                  </div>
                  <div className="mt-2 text-[11px] uppercase tracking-[0.14em] text-slate-300">
                    {war.attacker.shortName}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                    {war.timeRemaining}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">vs</div>
                </div>

                <div className="text-center">
                  <div
                    className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-display font-black text-white"
                    style={{ backgroundColor: war.defender.color }}
                  >
                    {war.defender.logo}
                  </div>
                  <div className="mt-2 text-[11px] uppercase tracking-[0.14em] text-slate-300">
                    {war.defender.shortName}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-400">
                  <span>Momentum</span>
                  <span className="text-white">{war.progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-gradient-to-r"
                    style={{
                      width: `${war.progress}%`,
                      backgroundImage: `linear-gradient(90deg, ${war.attacker.color}, ${war.defender.color})`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                {isCritical ? (
                  <>
                    <Flame className="h-3.5 w-3.5 text-rose-300" />
                    Critical battle pressure
                  </>
                ) : (
                  <>
                    <TimerReset className="h-3.5 w-3.5 text-amber-300" />
                    Window still open
                  </>
                )}
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Button className="justify-between" onClick={() => onAttack(war.id)}>
                  Attack
                  <Swords className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="justify-between"
                  onClick={() => onReinforce(war.id)}
                >
                  Reinforce
                  <Shield className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.aside>
  );
}
