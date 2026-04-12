"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, LockKeyhole, TrendingUp } from "lucide-react";

import { CountdownPill } from "@/components/engagement/CountdownPill";
import { GameBadge } from "@/components/ui/game-logo";
import { TeamLogo } from "@/components/ui/team-logo";
import type { Match } from "@/hooks/useMatches";
import { getHoursFromNow } from "@/lib/countdown";

interface SignalSidebarProps {
  matches: Match[];
}

export function SignalSidebar({ matches }: SignalSidebarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="section-shell space-y-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="eyebrow-badge">
            <TrendingUp className="h-4 w-4 text-emerald-300" />
            Live signal pulse
          </div>
          <h3 className="mt-3 text-2xl font-display font-bold text-white">
            Signal board worth checking before lock
          </h3>
        </div>
        <CountdownPill label="Refresh" target={getHoursFromNow(1)} tone="cyan" />
      </div>

      <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-300">
        This module should feel like an executive glance at where the room is
        moving, not a raw list of numbers.
      </div>

      <div className="space-y-3">
        {matches.slice(0, 5).map((match, index) => (
          <div
            key={match.id}
            className={`surface-panel p-4 ${index === 0 ? "border-cyan-400/18 bg-cyan-400/8" : ""}`}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <TeamLogo
                  name={match.teamA.name}
                  logo={match.teamA.logo}
                  size={42}
                  className="bg-white/10"
                />
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-white">
                    {match.teamA.name}
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                    vs {match.teamB.name}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                  Momentum
                </div>
                <div className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-emerald-300">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  Live signal
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-2xl border border-cyan-500/18 bg-cyan-500/10 p-3 text-center">
                <div className="text-lg font-display font-bold text-cyan-300">
                  {match.teamA.signalScore}
                </div>
                <div className="truncate text-[11px] uppercase tracking-[0.14em] text-slate-400">
                  {match.teamA.name} signal
                </div>
              </div>
              <div className="rounded-2xl border border-fuchsia-500/18 bg-fuchsia-500/10 p-3 text-center">
                <div className="text-lg font-display font-bold text-fuchsia-300">
                  {match.teamB.signalScore}
                </div>
                <div className="truncate text-[11px] uppercase tracking-[0.14em] text-slate-400">
                  {match.teamB.name} signal
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <GameBadge game={match.game} />
              <span className="text-xs text-slate-400">{match.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <LockKeyhole className="h-4 w-4 text-slate-200" />
          Insider signal board unlocks after the next accuracy tier
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Premium engagement layers should always hint at a stronger layer
          just above the player&apos;s current reach.
        </p>
      </div>
    </motion.div>
  );
}
