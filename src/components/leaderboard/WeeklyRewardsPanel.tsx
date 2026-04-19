"use client";

import { motion } from "framer-motion";
import { Crown, Gift, Sparkles, Trophy } from "lucide-react";

import { CountdownPill } from "@/components/engagement/CountdownPill";
import { useWeeklyRewards } from "@/hooks/useLeaderboard";
import { getNextWeeklyReset } from "@/lib/countdown";

export function WeeklyRewardsPanel() {
  const { rewards, loading } = useWeeklyRewards();
  const nextRewardClose = getNextWeeklyReset(0, 23);

  if (loading) {
    return (
      <div className="section-shell animate-pulse">
        <div className="h-6 w-40 rounded bg-white/8" />
        <div className="mt-4 space-y-3">
          {[1, 2, 3].map((index) => (
            <div key={index} className="h-16 rounded-2xl bg-white/6" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="section-shell overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="eyebrow-badge">
            <Gift className="h-4 w-4 text-amber-300" />
            Weekly reward track
          </div>
          <h3 className="mt-3 text-2xl font-display font-bold text-white">
            Make next week feel too valuable to miss
          </h3>
        </div>
        <CountdownPill label="Closes" target={nextRewardClose} tone="amber" />
      </div>

      <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-300">
        Weekly rewards work best when they feel visible, time-bound, and just
        close enough to change behavior before reset.
      </div>

      <div className="mt-5 space-y-3">
        {rewards.map((reward, index) => (
          <motion.div
            key={reward.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="surface-panel p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-display font-bold text-white">
                  {reward.rank_from === 1 ? (
                    <Crown className="h-5 w-5 text-amber-300" />
                  ) : reward.rank_from <= 3 ? (
                    <Trophy className="h-5 w-5 text-primary" />
                  ) : (
                    `#${reward.rank_from}`
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {reward.description || `Top ${reward.rank_to}`}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    {reward.rank_from === reward.rank_to
                      ? `Rank #${reward.rank_from}`
                      : `Ranks #${reward.rank_from} - #${reward.rank_to}`}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-sm font-display font-bold text-amber-300">
                  <Sparkles className="h-4 w-4" />
                  {reward.arena_points.toLocaleString("en-US")}
                </div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  ARENA
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
