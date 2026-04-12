"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Shield, Swords, X } from "lucide-react";

import { CountdownPill } from "@/components/engagement/CountdownPill";
import { Button } from "@/components/ui/button";
import { War } from "@/types/war";
import { getHoursFromNow } from "@/lib/countdown";

interface CriticalBattleCardProps {
  war: War;
  onClose: () => void;
  onAttack: () => void;
  onReinforce: () => void;
}

export default function CriticalBattleCard({
  war,
  onClose,
  onAttack,
  onReinforce,
}: CriticalBattleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.96 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed left-1/2 top-20 z-50 w-[min(92vw,28rem)] -translate-x-1/2"
    >
      <div className="absolute -inset-2 rounded-[2rem] bg-rose-500/18 blur-2xl" />

      <div className="command-frame relative overflow-hidden border-rose-400/28 bg-slate-950/92 p-5">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="eyebrow-badge border-rose-400/20 bg-rose-400/10 text-rose-100">
          <AlertTriangle className="h-4 w-4 text-rose-300" />
          Critical battle
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-4xl font-display font-black text-white">
              {war.territoryName}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              This front should feel impossible to ignore. The player needs an
              immediate emotional read on what is being lost and why acting now
              matters.
            </p>
          </div>
          <CountdownPill label="Collapse" target={getHoursFromNow(2)} tone="rose" />
        </div>

        <div className="mt-5 rounded-[1.4rem] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100">
          Your club is losing control of {war.territoryName}. Reinforce now or
          risk a visible prestige swing.
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 text-center">
            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-display font-black text-white"
              style={{ backgroundColor: war.attacker.color }}
            >
              {war.attacker.logo}
            </div>
            <div className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">
              {war.attacker.shortName}
            </div>
          </div>

          <div className="text-center">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Control pressure
            </div>
            <div className="mt-2 text-3xl font-display font-black text-white">
              {war.progress}%
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 text-center">
            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-display font-black text-white"
              style={{ backgroundColor: war.defender.color }}
            >
              {war.defender.logo}
            </div>
            <div className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">
              {war.defender.shortName}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-400">
            <span>Frontline state</span>
            <span className="text-white">{war.timeRemaining}</span>
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

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Button className="justify-between" onClick={onAttack}>
            Attack now
            <Swords className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="justify-between" onClick={onReinforce}>
            Reinforce
            <Shield className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
