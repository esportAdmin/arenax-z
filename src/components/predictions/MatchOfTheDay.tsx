import { motion } from "framer-motion";
import { Calendar, Flame, LockKeyhole, Trophy, Users } from "lucide-react";

import { CountdownPill } from "@/components/engagement/CountdownPill";
import { GameIcon } from "@/components/ui/game-logo";
import { TeamLogo } from "@/components/ui/team-logo";
import type { Match } from "@/hooks/useMatches";
import { getHoursFromNow } from "@/lib/countdown";

interface MatchOfTheDayProps {
  match: Match;
}

export function MatchOfTheDay({ match }: MatchOfTheDayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="section-shell relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,245,255,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(217,70,239,0.12),transparent_32%)]" />

      <div className="relative space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="eyebrow-badge">
              <Trophy className="h-4 w-4 text-amber-300" />
              Match of the day
            </div>
            <h2 className="mt-3 text-2xl font-display font-bold text-white">
              The one board users should not miss
            </h2>
          </div>
          <CountdownPill label="Lock" target={getHoursFromNow(2)} tone="rose" />
        </div>

        <div className="grid gap-5 text-center">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div>
              <TeamLogo
                name={match.teamA.name}
                logo={match.teamA.logo}
                size={88}
                className="mx-auto bg-white/10 ring-2 ring-cyan-500/20"
              />
              <h3 className="mt-3 text-lg font-black text-white">
                {match.teamA.name}
              </h3>
              <div className="mt-1 text-sm font-bold text-cyan-300">
                {match.teamA.signalScore} signal
              </div>
            </div>

            <div>
              <div className="text-3xl font-black text-white">VS</div>
              <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs text-amber-200">
                <Flame className="h-3 w-3" />
                Most watched
              </div>
            </div>

            <div>
              <TeamLogo
                name={match.teamB.name}
                logo={match.teamB.logo}
                size={88}
                className="mx-auto bg-white/10 ring-2 ring-fuchsia-500/20"
              />
              <h3 className="mt-3 text-lg font-black text-white">
                {match.teamB.name}
              </h3>
              <div className="mt-1 text-sm font-bold text-fuchsia-300">
                {match.teamB.signalScore} signal
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="surface-panel p-3">
              <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
                Schedule
              </div>
              <div className="mt-2 text-sm font-semibold text-white">
                {match.date} {match.time}
              </div>
            </div>

            <div className="surface-panel p-3">
              <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                <Users className="h-3.5 w-3.5" />
                Community pulse
              </div>
              <div className="mt-2 text-sm font-semibold text-white">
                {match.totalLocked.toLocaleString("en-US")} locked
              </div>
            </div>

            <div className="surface-panel p-3">
              <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                <GameIcon game={match.game} size={14} className="opacity-90" />
                Game
              </div>
              <div className="mt-2 text-sm font-semibold text-white">
                {match.game}
              </div>
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <LockKeyhole className="h-4 w-4 text-slate-200" />
              Premium featured slip unlocks after your next live-win streak
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
