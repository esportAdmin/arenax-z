import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Badge,
  Check,
  Crown,
  Flame,
  Gem,
  Gift,
  Image,
  Loader2,
  Lock,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { CountdownPill } from "@/components/engagement/CountdownPill";
import { Button } from "@/components/ui/button";
import { LevelReward, useLevelRewards } from "@/hooks/useLevelRewards";
import { getNextUtcMidnight } from "@/lib/countdown";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  gift: Gift,
  zap: Zap,
  trophy: Trophy,
  "trending-up": TrendingUp,
  star: Star,
  badge: Badge,
  award: Award,
  crown: Crown,
  shield: Shield,
  image: Image,
  gem: Gem,
  sparkles: Sparkles,
  flame: Flame,
};

const rarityColors: Record<
  string,
  { bg: string; border: string; text: string; glow: string }
> = {
  common: {
    bg: "bg-muted/50",
    border: "border-border",
    text: "text-muted-foreground",
    glow: "",
  },
  rare: {
    bg: "bg-primary/10",
    border: "border-primary/30",
    text: "text-primary",
    glow: "shadow-[0_0_15px_hsl(var(--primary)/0.2)]",
  },
  epic: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
  },
  legendary: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    glow: "shadow-[0_0_25px_rgba(245,158,11,0.4)]",
  },
};

interface RewardCardProps {
  reward: LevelReward;
  currentLevel: number;
  isClaimed: boolean;
  onClaim: (id: string) => Promise<void>;
  claimingId: string | null;
}

function RewardCard({
  reward,
  currentLevel,
  isClaimed,
  onClaim,
  claimingId,
}: RewardCardProps) {
  const Icon = iconMap[reward.icon] || Gift;
  const isUnlocked = currentLevel >= reward.level_required;
  const canClaim = isUnlocked && !isClaimed;
  const isClaiming = claimingId === reward.id;
  const rarity = rarityColors[reward.rarity] || rarityColors.common;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative min-h-[230px] overflow-hidden rounded-[1.35rem] border p-4 transition-all",
        rarity.bg,
        rarity.border,
        isUnlocked ? rarity.glow : "opacity-60",
        isClaimed && "opacity-50",
      )}
    >
      <div className="pointer-events-none absolute right-[-3rem] top-[-3rem] h-28 w-28 rounded-full bg-white/10 blur-3xl" />
      <div
        className={cn(
          "absolute right-3 top-3 rounded-full border px-2.5 py-1 text-xs font-bold",
          isUnlocked
            ? "border-primary/25 bg-primary/15 text-primary"
            : "border-white/10 bg-muted text-muted-foreground",
        )}
      >
        Lvl {reward.level_required}
      </div>

      <div className="relative flex items-start gap-3 pr-16">
        <div
          className={cn(
            "shrink-0 rounded-2xl p-3",
            isUnlocked ? rarity.bg : "bg-muted",
            isUnlocked && "border",
            isUnlocked && rarity.border,
          )}
        >
          {isUnlocked ? (
            <Icon className={cn("h-6 w-6", rarity.text)} />
          ) : (
            <Lock className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className={cn("truncate font-display text-lg font-black", !isUnlocked && "text-muted-foreground")}>
            {reward.title}
          </h4>
          <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
            {reward.description}
          </p>

          <div
            className={cn(
              "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
              rarity.bg,
              rarity.text,
            )}
          >
            {reward.reward_type === "arena_points" &&
              `+${reward.reward_value} credits`}
            {reward.reward_type === "xp_bonus" && `+${reward.reward_value} XP`}
            {reward.reward_type === "title" && `Title: ${reward.reward_value}`}
            {reward.reward_type === "feature" && "Feature"}
            {reward.reward_type === "badge" && "Badge"}
          </div>
        </div>
      </div>

      <div className="relative mt-5">
        {isClaimed ? (
          <div className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-bold text-emerald-200">
            <Check className="h-4 w-4" />
            Claimed
          </div>
        ) : canClaim ? (
          <Button
            size="sm"
            className="min-h-11 w-full gap-2 rounded-full text-sm font-black uppercase tracking-[0.12em]"
            onClick={() => onClaim(reward.id)}
            disabled={isClaiming}
          >
            {isClaiming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Gift className="h-4 w-4" />
            )}
            Claim
          </Button>
        ) : (
          <div className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-muted-foreground">
            <Lock className="h-4 w-4" />
            Requires level {reward.level_required}
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface LevelRewardsGridProps {
  currentLevel: number;
}

export function LevelRewardsGrid({ currentLevel }: LevelRewardsGridProps) {
  const { rewards, claimedRewards, availableRewards, loading, claimReward } =
    useLevelRewards(currentLevel);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "available" | "claimed">("all");

  const handleClaim = async (id: string) => {
    setClaimingId(id);
    await claimReward(id);
    setClaimingId(null);
  };

  const filteredRewards = rewards.filter((reward) => {
    const isClaimed = claimedRewards.some((claimed) => claimed.reward_id === reward.id);
    const isUnlocked = currentLevel >= reward.level_required;

    if (filter === "available") {
      return isUnlocked && !isClaimed;
    }
    if (filter === "claimed") {
      return isClaimed;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary to-secondary p-3 shadow-[0_0_28px_rgba(34,211,238,0.18)]">
            <Gift className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <div className="eyebrow-badge">Claim lane</div>
            <h3 className="mt-2 text-2xl font-display font-black text-white">
              Level rewards
            </h3>
            <p className="text-sm text-muted-foreground">
              {availableRewards.length} reward
              {availableRewards.length !== 1 ? "s" : ""} ready to claim
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <CountdownPill label="Reset" target={getNextUtcMidnight()} tone="amber" />
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "All" },
              { value: "available", label: "Available" },
              { value: "claimed", label: "Claimed" },
            ].map((tab) => (
              <Button
                key={tab.value}
                variant={filter === tab.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(tab.value as typeof filter)}
                className="min-h-10 rounded-full px-4 text-xs font-black uppercase tracking-[0.12em]"
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {availableRewards.length > 0 && filter !== "claimed" ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-[1.35rem] border border-primary/30 bg-gradient-to-r from-primary/20 via-cyan-400/10 to-secondary/20 p-4"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-medium">
                  You have {availableRewards.length} reward
                  {availableRewards.length !== 1 ? "s" : ""} ready to claim.
                </p>
                <p className="text-sm text-muted-foreground">
                  Claim them to unlock virtual credits, XP, and identity perks.
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRewards.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            currentLevel={currentLevel}
            isClaimed={claimedRewards.some((claimed) => claimed.reward_id === reward.id)}
            onClaim={handleClaim}
            claimingId={claimingId}
          />
        ))}
      </div>

      {filteredRewards.length === 0 ? (
        <div className="rounded-[1.5rem] border border-white/10 bg-black/20 px-5 py-12 text-center text-muted-foreground">
          <Gift className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p className="font-bold text-white">No rewards in this category.</p>
          <p className="mt-2 text-sm text-slate-500">
            Switch filters or keep progressing to reveal the next unlock.
          </p>
        </div>
      ) : null}
    </motion.div>
  );
}
