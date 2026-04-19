import { motion } from "framer-motion";
import { Crown, Flame } from "lucide-react";
import { BadgeDisplay } from "./BadgeDisplay";
import type { LeaderboardEntry } from "@/hooks/useLeaderboard";

interface LeaderboardPodiumProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardPodium({ entries }: LeaderboardPodiumProps) {
  const [first, second, third] = entries;

  if (!first) return null;

  const formatScore = (v: number | null | undefined) =>
    (v ?? 0).toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-3 gap-4 mb-8"
    >
      {/* 2nd Place */}
      {second && (
        <div className="glass-card p-4 md:p-6 text-center order-1 md:mt-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-400/5 to-transparent pointer-events-none" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="w-14 md:w-16 h-14 md:h-16 rounded-full bg-gradient-to-br from-slate-300/20 to-slate-500/20 flex items-center justify-center text-2xl md:text-3xl mx-auto mb-3 ring-2 ring-slate-400/30"
          >
            {second.avatar_url || "🎮"}
          </motion.div>
          <div className="w-8 md:w-10 h-8 md:h-10 rounded-lg badge-rank-silver flex items-center justify-center font-display font-bold mx-auto mb-2">
            2
          </div>
          <div className="font-display font-bold text-sm md:text-base mb-1 truncate">
            {second.display_name || second.username || "Anonymous"}
          </div>
          <div className="text-xl md:text-2xl font-display font-bold gradient-text-primary">
            {formatScore(second.arena_score)}
          </div>
          <div className="text-xs text-muted-foreground mb-2">Arena Score</div>
          <div className="flex justify-center">
            <BadgeDisplay badges={second.badges ?? []} maxDisplay={3} size="sm" />
          </div>
        </div>
      )}

      {/* 1st Place */}
      <motion.div
        className="glass-card p-4 md:p-6 text-center order-2 relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
        <div className="absolute top-2 left-2 right-2 flex justify-between">
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
        </div>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Crown className="w-6 md:w-8 h-6 md:h-8 text-amber-400 mx-auto mb-2" />
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-gradient-to-br from-amber-300/20 to-amber-600/20 flex items-center justify-center text-3xl md:text-4xl mx-auto mb-3 ring-4 ring-amber-400/50 shadow-[0_0_30px_rgba(251,191,36,0.3)]"
        >
          {first.avatar_url || "👑"}
        </motion.div>

        <div className="w-10 md:w-12 h-10 md:h-12 rounded-lg badge-rank-gold flex items-center justify-center font-display font-bold text-lg md:text-xl mx-auto mb-2 shadow-[0_0_20px_rgba(251,191,36,0.4)]">
          1
        </div>

        <div className="font-display font-bold text-base md:text-lg mb-1 truncate">
          {first.display_name || first.username || "Anonymous"}
        </div>

        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="text-2xl md:text-3xl font-display font-bold gradient-text-accent"
        >
          {formatScore(first.arena_score)}
        </motion.div>

        <div className="text-xs text-muted-foreground mb-2">Arena Score</div>

        <div className="flex justify-center">
          <BadgeDisplay badges={first.badges ?? []} maxDisplay={4} size="md" />
        </div>
      </motion.div>

      {/* 3rd Place */}
      {third && (
        <div className="glass-card p-4 md:p-6 text-center order-3 md:mt-12 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-700/5 to-transparent pointer-events-none" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="w-14 md:w-16 h-14 md:h-16 rounded-full bg-gradient-to-br from-amber-600/20 to-amber-800/20 flex items-center justify-center text-2xl md:text-3xl mx-auto mb-3 ring-2 ring-amber-600/30"
          >
            {third.avatar_url || "🎯"}
          </motion.div>
          <div className="w-8 md:w-10 h-8 md:h-10 rounded-lg badge-rank-bronze flex items-center justify-center font-display font-bold mx-auto mb-2">
            3
          </div>
          <div className="font-display font-bold text-sm md:text-base mb-1 truncate">
            {third.display_name || third.username || "Anonymous"}
          </div>
          <div className="text-xl md:text-2xl font-display font-bold gradient-text-primary">
            {formatScore(third.arena_score)}
          </div>
          <div className="text-xs text-muted-foreground mb-2">Arena Score</div>
          <div className="flex justify-center">
            <BadgeDisplay badges={third.badges ?? []} maxDisplay={3} size="sm" />
          </div>
        </div>
      )}
    </motion.div>
  );
}
