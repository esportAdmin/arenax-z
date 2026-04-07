import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Zap } from "lucide-react";
import { BadgeDisplay } from "./BadgeDisplay";
import { DivisionBadge } from "./DivisionBadge";
import type { LeaderboardEntry } from "@/hooks/useLeaderboard";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  startRank?: number;
}

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return "badge-rank-gold text-lg";
    case 2:
      return "badge-rank-silver text-lg";
    case 3:
      return "badge-rank-bronze text-lg";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card overflow-hidden"
    >
      <div className="grid grid-cols-12 gap-2 md:gap-4 p-4 border-b border-border/50 text-xs md:text-sm text-muted-foreground font-medium">
        <div className="col-span-1">Rank</div>
        <div className="col-span-5 md:col-span-4">Fan</div>
        <div className="col-span-3 md:col-span-2 text-right">Score</div>
        <div className="col-span-2 text-right hidden md:block">Predictions</div>
        <div className="col-span-2 text-right hidden md:block">Accuracy</div>
        <div className="col-span-3 md:col-span-1 text-right">Var.</div>
      </div>

      {entries.map((entry, index) => {
        const isChallenger = entry.tier === "challenger";
        const change = entry.change ?? 0;

        return (
          <motion.div
            key={entry.user_id || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.03 }}
            className={`grid grid-cols-12 gap-2 md:gap-4 p-3 md:p-4 items-center border-b border-border/30 transition-colors group ${
              isChallenger
                ? "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20"
                : "hover:bg-muted/20"
            }`}
          >
            <div className="col-span-1">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${getRankStyle(
                  entry.rank,
                )}`}
              >
                {entry.rank}
              </div>
            </div>

            <div className="col-span-5 md:col-span-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
                {entry.avatar_url || "🎮"}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold truncate">
                    {entry.display_name || entry.username || "Anonymous"}
                  </span>
                  <DivisionBadge tier={entry.tier ?? "bronze"} />
                </div>

                {entry.nextTier && (
                  <div className="w-full mt-2">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
                        style={{ width: `${entry.progressPercent ?? 0}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="hidden sm:flex items-center gap-1 mt-1">
                  <BadgeDisplay
                    badges={entry.badges ?? []}
                    maxDisplay={3}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-3 md:col-span-2 text-right font-bold gradient-text-primary">
              <Zap className="inline w-3 h-3 mr-1 text-accent" />
              {(entry.arena_score ?? 0).toLocaleString()}
            </div>

            <div className="col-span-2 hidden md:block text-right text-muted-foreground">
              {entry.total_predictions ?? "-"}
            </div>

            <div className="col-span-2 hidden md:block text-right text-success">
              {entry.prediction_accuracy
                ? `${Number(entry.prediction_accuracy).toFixed(0)}%`
                : "-"}
            </div>

            <div className="col-span-3 md:col-span-1 text-right">
              {change === 0 ? (
                "-"
              ) : change > 0 ? (
                <span className="text-success flex justify-end items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {change}
                </span>
              ) : (
                <span className="text-destructive flex justify-end items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  {Math.abs(change)}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
