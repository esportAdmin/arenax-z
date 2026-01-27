// src/components/predictions/MatchCardCompact.tsx
import { motion } from "framer-motion";
import { Clock, Flame, Lock, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TeamLogo } from "@/components/ui/team-logo";
import { GameIcon } from "@/components/ui/game-logo";
import type { Match } from "@/hooks/useMatches";

interface MatchCardCompactProps {
  match: Match;
  index: number;
  onPredict: (matchId: string) => void;
}

/**
 * MatchCardCompact
 *
 * @example
 * <MatchCardCompact match={m} index={0} onPredict={() => {}} />
 */
export function MatchCardCompact({
  match,
  index,
  onPredict,
}: MatchCardCompactProps) {
  const isHot = match.isLive || match.totalLocked > 20000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 opacity-50" />

      <div className="relative flex items-center justify-between gap-6">
        {/* Match Info */}
        <div className="flex min-w-0 items-center gap-4">
          {/* Teams */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center"
            >
              <TeamLogo
                name={match.teamA.name}
                logo={match.teamA.logo}
                size={56}
                className="bg-white/5 ring-1 ring-white/10"
              />
            </motion.div>

            <div className="text-center">
              <div className="text-sm font-semibold text-white">VS</div>
              <div className="mt-0.5 flex items-center justify-center gap-1.5 text-xs text-white/60">
                <GameIcon game={match.game} size={14} className="opacity-90" />
                <span>{match.game}</span>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center"
            >
              <TeamLogo
                name={match.teamB.name}
                logo={match.teamB.logo}
                size={56}
                className="bg-white/5 ring-1 ring-white/10"
              />
            </motion.div>
          </div>

          {/* Match Details */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-lg font-semibold text-white">
                {match.teamA.name} vs {match.teamB.name}
              </h3>
              {isHot && (
                <Badge className="border-orange-500/30 bg-orange-500/20 text-orange-400">
                  <Flame className="mr-1 h-3 w-3" />
                  Hot
                </Badge>
              )}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/60">
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                <span className="truncate">{match.tournament}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {match.date} {match.time}
              </div>
              <div className="flex items-center gap-1">
                <Lock className="h-4 w-4" />
                {match.totalLocked.toLocaleString()} locked
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-white/60">Odds</div>
            <div className="text-lg font-bold text-white">
              {Math.min(match.teamA.odds, match.teamB.odds).toFixed(2)}
            </div>
          </div>

          <Button
            onClick={() => onPredict(match.id)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 font-semibold text-white hover:from-cyan-600 hover:to-blue-600"
          >
            Prédire
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
