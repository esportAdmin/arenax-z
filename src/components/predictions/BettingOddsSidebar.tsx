"use client";

import { motion } from "framer-motion";
import { Timer, Zap } from "lucide-react";
import type { Match } from "@/hooks/useMatches";

interface BettingOddsSidebarProps {
  matches: Match[];
}

export const BettingOddsSidebar = ({ matches }: BettingOddsSidebarProps) => {
  const topMatches = matches.filter((m) => !m.isFinished).slice(0, 6);

  const getCountdown = (match: Match) => {
    if (match.isLive) return "LIVE";
    return `${Math.floor(Math.random() * 8)}h:${Math.floor(Math.random() * 60)
      .toString()
      .padStart(2, "0")}m`;
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-gradient-to-r from-primary/20 to-transparent border-b border-border/50">
        <h3 className="font-display font-bold text-sm flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          ESPORTS BETTING ODDS
        </h3>
      </div>

      <div className="divide-y divide-border/30">
        {topMatches.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            Aucun match disponible
          </div>
        ) : (
          topMatches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center -space-x-1">
                  <div className="text-lg">{match.teamA.logo}</div>
                  <div className="text-lg">{match.teamB.logo}</div>
                </div>

                <div
                  className={`flex-1 px-2 py-1 rounded text-center font-bold text-sm ${
                    match.teamA.odds < match.teamB.odds
                      ? "bg-accent/20 text-accent"
                      : "bg-muted/30 text-muted-foreground"
                  }`}
                >
                  {match.teamA.odds.toFixed(2)}
                </div>

                <div className="flex flex-col items-center min-w-[60px]">
                  <div
                    className={`flex items-center gap-1 text-xs ${
                      match.isLive
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Timer className="w-3 h-3" />
                    {getCountdown(match)}
                  </div>
                </div>

                <div
                  className={`flex-1 px-2 py-1 rounded text-center font-bold text-sm ${
                    match.teamB.odds < match.teamA.odds
                      ? "bg-accent/20 text-accent"
                      : "bg-muted/30 text-muted-foreground"
                  }`}
                >
                  {match.teamB.odds.toFixed(2)}
                </div>

                <div className="text-lg">{match.teamB.logo}</div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-border/50">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="block w-full py-2 px-4 bg-gradient-to-r from-primary to-secondary text-white font-bold text-center rounded-lg hover:opacity-90 transition-opacity text-sm"
        >
          MAKE A BET
        </button>
      </div>
    </div>
  );
};
