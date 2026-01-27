// src/components/predictions/MatchOfTheDay.tsx
import { motion } from "framer-motion";
import { Calendar, Trophy, Users } from "lucide-react";

import { TeamLogo } from "@/components/ui/team-logo";
import { GameIcon } from "@/components/ui/game-logo";
import type { Match } from "@/hooks/useMatches";

interface MatchOfTheDayProps {
  match: Match;
}

/**
 * MatchOfTheDay
 *
 * @example
 * <MatchOfTheDay match={m} />
 */
export function MatchOfTheDay({ match }: MatchOfTheDayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-sm"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-purple-500/20" />
      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative">
        <div className="mb-6 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">Match du Jour</h2>
        </div>

        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
          {/* Team A */}
          <div className="text-center">
            <motion.div whileHover={{ scale: 1.05 }} className="mx-auto mb-4">
              <TeamLogo
                name={match.teamA.name}
                logo={match.teamA.logo}
                size={96}
                className="mx-auto bg-white/10 ring-2 ring-cyan-500/30"
              />
            </motion.div>
            <h3 className="mb-2 text-xl font-bold text-white">
              {match.teamA.name}
            </h3>
            <div className="font-semibold text-cyan-400">
              {match.teamA.odds.toFixed(2)}
            </div>
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="mb-4 text-4xl font-bold text-white">VS</div>
            <div className="space-y-2 text-white/70">
              <div className="flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4" />
                {match.date} {match.time}
              </div>
              <div className="flex items-center justify-center gap-2">
                <Users className="h-4 w-4" />
                {match.totalLocked.toLocaleString()} locked
              </div>
              <div className="text-sm">{match.tournament}</div>

              <div className="flex items-center justify-center gap-2 text-xs opacity-80">
                <GameIcon game={match.game} size={14} className="opacity-90" />
                <span>{match.game}</span>
              </div>
            </div>
          </div>

          {/* Team B */}
          <div className="text-center">
            <motion.div whileHover={{ scale: 1.05 }} className="mx-auto mb-4">
              <TeamLogo
                name={match.teamB.name}
                logo={match.teamB.logo}
                size={96}
                className="mx-auto bg-white/10 ring-2 ring-purple-500/30"
              />
            </motion.div>
            <h3 className="mb-2 text-xl font-bold text-white">
              {match.teamB.name}
            </h3>
            <div className="font-semibold text-purple-400">
              {match.teamB.odds.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
