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

const rarityStyles: Record<
  string,
  { bg: string; border: string; text: string }
> = {
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

/**
 * Get level tier label and style.
 *
 * @example
 * getLevelTier(1).name; // "Débutant"
 */
function getLevelTier(level: number): Tier {
  if (level >= 50)
    return { name: "Légendaire", color: "text-amber-400", icon: Sparkles };
  if (level >= 30)
    return { name: "Maître", color: "text-purple-400", icon: Star };
  if (level >= 20)
    return { name: "Expert", color: "text-accent", icon: TrendingUp };
  if (level >= 10) return { name: "Avancé", color: "text-primary", icon: Zap };
  return { name: "Débutant", color: "text-muted-foreground", icon: Star };
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
    .filter((r) => !claimedRewards.some((c) => c.reward_id === r.id))
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-lg flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Progression
        </h2>
        <div className={`flex items-center gap-1 text-sm ${tier.color}`}>
          <TierIcon className="w-4 h-4" />
          <span className="font-medium">{tier.name}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="relative"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.4)]">
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-primary-foreground">
                {currentLevel}
              </div>
              <div className="text-[10px] text-primary-foreground/80 uppercase tracking-wider">
                Niveau
              </div>
            </div>
          </div>

          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-primary/50"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Niveau {currentLevel} → {currentLevel + 1}
            </span>
            <span className="font-display font-bold text-primary">
              {currentXp.toLocaleString()} / {xpForNextLevel.toLocaleString()}{" "}
              XP
            </span>
          </div>

          <div className="relative h-4 bg-muted/50 rounded-full overflow-hidden border border-border/50">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
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

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{Math.round(progressPercent)}% complété</span>
            <span>
              {(xpForNextLevel - currentXp).toLocaleString()} XP restants
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Récompenses</span>
            {availableRewards.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary text-primary-foreground animate-pulse">
                {availableRewards.length} à réclamer
              </span>
            )}
          </div>

          <Link
            href="/rewards"
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            Voir tout
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-1 h-16 rounded-lg bg-muted/30 animate-pulse"
              />
            ))}
          </div>
        ) : upcomingRewards.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {upcomingRewards.map((reward, index) => {
              const isUnlocked = currentLevel >= reward.level_required;
              const canClaim =
                isUnlocked &&
                !claimedRewards.some((c) => c.reward_id === reward.id);
              const rarity = rarityStyles[reward.rarity] || rarityStyles.common;
              const Icon = rewardIcons[reward.icon] || Gift;

              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={cn(
                    "relative p-3 rounded-lg border text-center transition-all",
                    rarity.bg,
                    rarity.border,
                    canClaim &&
                      "ring-2 ring-primary ring-offset-2 ring-offset-background",
                    !isUnlocked && "opacity-50",
                  )}
                >
                  <div
                    className={cn(
                      "absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                      isUnlocked
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {reward.level_required}
                  </div>

                  <div
                    className={cn(
                      "w-8 h-8 mx-auto rounded-lg flex items-center justify-center mb-1",
                      rarity.bg,
                      rarity.border,
                      "border",
                    )}
                  >
                    {isUnlocked ? (
                      <Icon className={cn("w-4 h-4", rarity.text)} />
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>

                  <div className="text-[10px] font-medium truncate">
                    {reward.title}
                  </div>

                  <div className={cn("text-[9px] mt-0.5", rarity.text)}>
                    {reward.reward_type === "arena_points" &&
                      `+${reward.reward_value} ARENA`}
                    {reward.reward_type === "xp_bonus" &&
                      `+${reward.reward_value} XP`}
                    {reward.reward_type === "title" && "Titre"}
                    {reward.reward_type === "feature" && "Feature"}
                  </div>

                  {canClaim && (
                    <div className="absolute inset-0 rounded-lg border-2 border-primary animate-pulse" />
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4 text-sm text-muted-foreground">
            <Gift className="w-8 h-8 mx-auto mb-2 opacity-50" />
            Toutes les récompenses ont été réclamées !
          </div>
        )}
      </div>
    </motion.div>
  );
}
