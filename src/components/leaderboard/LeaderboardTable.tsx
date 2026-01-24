import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Zap } from "lucide-react";
import { BadgeDisplay } from "./BadgeDisplay";
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

export function LeaderboardTable({ entries, startRank = 1 }: LeaderboardTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card overflow-hidden"
    >
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-2 md:gap-4 p-4 border-b border-border/50 text-xs md:text-sm text-muted-foreground font-medium">
        <div className="col-span-1">Rank</div>
        <div className="col-span-5 md:col-span-4">Fan</div>
        <div className="col-span-3 md:col-span-2 text-right">Score</div>
        <div className="col-span-2 text-right hidden md:block">Prédictions</div>
        <div className="col-span-2 text-right hidden md:block">Précision</div>
        <div className="col-span-3 md:col-span-1 text-right">Var.</div>
      </div>

      {/* Rows */}
      {entries.map((entry, index) => (
        <motion.div
          key={entry.user_id || index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + index * 0.03 }}
          className="grid grid-cols-12 gap-2 md:gap-4 p-3 md:p-4 items-center border-b border-border/30 hover:bg-muted/20 transition-colors group"
        >
          {/* Rank */}
          <div className="col-span-1">
            <div
              className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center font-display font-bold text-xs md:text-sm ${getRankStyle(
                entry.rank
              )}`}
            >
              {entry.rank}
            </div>
          </div>

          {/* Fan Info */}
          <div className="col-span-5 md:col-span-4 flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-muted flex items-center justify-center text-lg md:text-xl shrink-0">
              {entry.avatar_url || "🎮"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-sm md:text-base truncate">
                {entry.display_name || entry.username || "Anonymous"}
              </div>
              <div className="hidden sm:flex items-center gap-1 mt-0.5">
                <BadgeDisplay badges={entry.badges} maxDisplay={3} size="sm" />
              </div>
            </div>
          </div>

          {/* Score */}
          <div className="col-span-3 md:col-span-2 text-right">
            <div className="flex items-center justify-end gap-1">
              <Zap className="w-3 h-3 text-accent hidden md:block" />
              <span className="font-display font-bold text-sm md:text-base gradient-text-primary">
                {(entry.arena_score ?? 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Predictions */}
          <div className="col-span-2 text-right hidden md:block text-muted-foreground">
            {entry.total_predictions}
          </div>

          {/* Accuracy */}
          <div className="col-span-2 text-right hidden md:block">
            <span className="text-success font-semibold">
              {entry.prediction_accuracy ? `${Number(entry.prediction_accuracy).toFixed(0)}%` : "—"}
            </span>
          </div>

          {/* Change */}
          <div className="col-span-3 md:col-span-1 text-right">
            {entry.change === 0 ? (
              <span className="text-muted-foreground text-xs md:text-sm">—</span>
            ) : entry.change > 0 ? (
              <motion.span 
                initial={{ y: -5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center justify-end gap-0.5 md:gap-1 text-success text-xs md:text-sm"
              >
                <TrendingUp className="w-3 h-3" />
                {entry.change}
              </motion.span>
            ) : (
              <motion.span 
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center justify-end gap-0.5 md:gap-1 text-destructive text-xs md:text-sm"
              >
                <TrendingDown className="w-3 h-3" />
                {Math.abs(entry.change)}
              </motion.span>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
