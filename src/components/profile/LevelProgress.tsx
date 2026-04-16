"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronRight,
  Crown,
  Flame,
  Gem,
  Gift,
  Lock,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useLevelRewards } from "@/hooks/useLevelRewards";
import { cn } from "@/lib/utils";

interface LevelProgressProps {
  currentLevel: number;
  currentXp: number;
  xpForNextLevel: number;
}

type Tier = { name: string; color: string; icon: typeof Star };

const rarityStyles: Record<string, { bg: string; border: string; text: string }> = {
  common: {
    bg: "bg-muted/50",
    border: "border-border",
    text: "text-muted-foreground",
  },
  rare: {
    bg: "bg-primary/10",
    border: "border-primary/30",
    text: "text-primary",
  },
  epic: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
  },
  legendary: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
  },
};

const rewardIcons: Record<string, typeof Gift> = {
  gift: Gift,
  crown: Crown,
  gem: Gem,
  flame: Flame,
  star: Star,
  sparkles: Sparkles,
};

function getLevelTier(level: number): Tier {
  if (level >= 50) {
    return { name: "Legendary", color: "text-amber-400", icon: Sparkles };
  }
  if (level >= 30) {
    return { name: "Master", color: "text-purple-400", icon: Star };
  }
  if (level >= 20) {
    return { name: "Expert", color: "text-accent", icon: TrendingUp };
  }
  if (level >= 10) {
    return { name: "Advanced", color: "text-primary", icon: Zap };
  }

  return { name: "Beginner", color: "text-muted-foreground", icon: Star };
}

export function LevelProgress({
  currentLevel,
  currentXp,
  xpForNextLevel,
}: LevelProgressProps) {
  const progressPercent =
    xpForNextLevel > 0 ? (currentXp / xpForNextLevel) * 100 : 0;
  const tier = getLevelTier(currentLevel);
  const TierIcon = tier.icon;
  const { rewards, claimedRewards, availableRewards, loading } =
    useLevelRewards(currentLevel);

  const upcomingRewards = rewards
    .filter((reward) => !claimedRewards.some((claimed) => claimed.reward_id === reward.id))
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="section-shell overflow-hidden p-5 sm:p-6"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="eyebrow-badge">Next unlock path</div>
          <h2 className="mt-3 flex items-center gap-2 text-xl font-display font-black text-white">
            <Zap className="h-5 w-5 text-primary" />
            Progress
          </h2>
        </div>
        <div className={`flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-bold ${tier.color}`}>
          <TierIcon className="h-4 w-4" />
          <span>{tier.name}</span>
        </div>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="relative"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent shadow-[0_0_30px_hsl(var(--primary)/0.4)]">
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-primary-foreground">
                {currentLevel}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-primary-foreground/80">
                Level
              </div>
            </div>
          </div>

          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-primary/50"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className="text-muted-foreground">
              Level {currentLevel} to {currentLevel + 1}
            </span>
            <span className="font-display font-bold text-primary">
              {currentXp.toLocaleString("en-US")} /{" "}
              {xpForNextLevel.toLocaleString("en-US")} XP
            </span>
          </div>

          <div className="relative h-4 overflow-hidden rounded-full border border-border/50 bg-muted/50">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>{Math.round(progressPercent)}% complete</span>
            <span>
              {(xpForNextLevel - currentXp).toLocaleString("en-US")} XP remaining
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-border/50 pt-4">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Rewards</span>
            {availableRewards.length > 0 && (
              <span className="animate-pulse rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                {availableRewards.length} to claim
              </span>
            )}
          </div>

          <Link
            href="/rewards"
            prefetch={false}
            className="inline-flex min-h-9 items-center justify-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 text-xs font-bold uppercase tracking-[0.12em] text-primary hover:bg-primary/15"
          >
            View all
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-16 flex-1 animate-pulse rounded-lg bg-muted/30"
              />
            ))}
          </div>
        ) : upcomingRewards.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {upcomingRewards.map((reward, index) => {
              const isUnlocked = currentLevel >= reward.level_required;
              const canClaim =
                isUnlocked &&
                !claimedRewards.some((claimed) => claimed.reward_id === reward.id);
              const rarity = rarityStyles[reward.rarity] || rarityStyles.common;
              const Icon = rewardIcons[reward.icon] || Gift;

              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={cn(
                    "relative min-h-[104px] rounded-2xl border p-3 text-center transition-all",
                    rarity.bg,
                    rarity.border,
                    canClaim &&
                      "ring-2 ring-primary ring-offset-2 ring-offset-background",
                    !isUnlocked && "opacity-50",
                  )}
                >
                  <div
                    className={cn(
                      "absolute -right-1.5 -top-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                      isUnlocked
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {reward.level_required}
                  </div>

                  <div
                    className={cn(
                      "mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-lg border",
                      rarity.bg,
                      rarity.border,
                    )}
                  >
                    {isUnlocked ? (
                      <Icon className={cn("h-4 w-4", rarity.text)} />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>

                  <div className="truncate text-[10px] font-medium">
                    {reward.title}
                  </div>

                  <div className={cn("mt-0.5 text-[9px]", rarity.text)}>
                    {reward.reward_type === "arena_points" &&
                      `+${reward.reward_value} ARENA`}
                    {reward.reward_type === "xp_bonus" &&
                      `+${reward.reward_value} XP`}
                    {reward.reward_type === "title" && "Title"}
                    {reward.reward_type === "feature" && "Feature"}
                  </div>

                  {canClaim && (
                    <div className="absolute inset-0 animate-pulse rounded-lg border-2 border-primary" />
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-4 text-center text-sm text-muted-foreground">
            <Gift className="mx-auto mb-2 h-8 w-8 opacity-50" />
            All rewards have been claimed.
          </div>
        )}
      </div>
    </motion.div>
  );
}
