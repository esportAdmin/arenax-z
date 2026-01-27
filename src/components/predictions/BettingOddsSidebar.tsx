// src/components/predictions/BettingOddsSidebar.tsx
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

import { TeamLogo } from "@/components/ui/team-logo";
import { GameBadge } from "@/components/ui/game-logo";
import type { Match } from "@/hooks/useMatches";

interface BettingOddsSidebarProps {
  matches: Match[];
}

/**
 * BettingOddsSidebar
 *
 * @example
 * <BettingOddsSidebar matches={matches} />
 */
export function BettingOddsSidebar({ matches }: BettingOddsSidebarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <div className="mb-6 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-400" />
          <h3 className="text-lg font-bold text-white">Cotes en Temps Réel</h3>
        </div>

        <div className="space-y-4">
          {matches.slice(0, 5).map((match) => (
            <div
              key={match.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TeamLogo
                    name={match.teamA.name}
                    logo={match.teamA.logo}
                    size={40}
                    className="bg-white/10"
                  />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-white">
                      {match.teamA.name}
                    </div>
                    <div className="text-xs text-white/50">vs</div>
                    <div className="truncate text-sm font-semibold text-white">
                      {match.teamB.name}
                    </div>
                  </div>
                </div>
                <TeamLogo
                  name={match.teamB.name}
                  logo={match.teamB.logo}
                  size={40}
                  className="bg-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-2 text-center">
                  <div className="text-sm font-bold text-cyan-400">
                    {match.teamA.odds.toFixed(2)}
                  </div>
                  <div className="truncate text-xs text-white/50">
                    {match.teamA.name}
                  </div>
                </div>
                <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-2 text-center">
                  <div className="text-sm font-bold text-purple-400">
                    {match.teamB.odds.toFixed(2)}
                  </div>
                  <div className="truncate text-xs text-white/50">
                    {match.teamB.name}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <GameBadge game={match.game} />
                <span className="text-xs text-white/50">{match.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
