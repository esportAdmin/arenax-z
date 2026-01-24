import { motion, AnimatePresence } from "framer-motion";
import { 
  Gift, Zap, Trophy, TrendingUp, Star, Badge, Award, Crown, 
  Shield, Image, Gem, Sparkles, Flame, Lock, Check, Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLevelRewards, LevelReward } from "@/hooks/useLevelRewards";
import { useState } from "react";
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

const rarityColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  common: { 
    bg: "bg-muted/50", 
    border: "border-border", 
    text: "text-muted-foreground",
    glow: ""
  },
  rare: { 
    bg: "bg-primary/10", 
    border: "border-primary/30", 
    text: "text-primary",
    glow: "shadow-[0_0_15px_hsl(var(--primary)/0.2)]"
  },
  epic: { 
    bg: "bg-purple-500/10", 
    border: "border-purple-500/30", 
    text: "text-purple-400",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]"
  },
  legendary: { 
    bg: "bg-amber-500/10", 
    border: "border-amber-500/30", 
    text: "text-amber-400",
    glow: "shadow-[0_0_25px_rgba(245,158,11,0.4)]"
  },
};

interface RewardCardProps {
  reward: LevelReward;
  currentLevel: number;
  isClaimed: boolean;
  onClaim: (id: string) => Promise<void>;
  claimingId: string | null;
}

function RewardCard({ reward, currentLevel, isClaimed, onClaim, claimingId }: RewardCardProps) {
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
        "relative p-4 rounded-xl border-2 transition-all",
        rarity.bg,
        rarity.border,
        isUnlocked ? rarity.glow : "opacity-60",
        isClaimed && "opacity-50"
      )}
    >
      {/* Level badge */}
      <div className={cn(
        "absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold",
        isUnlocked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      )}>
        Niv. {reward.level_required}
      </div>

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn(
          "p-3 rounded-xl",
          isUnlocked ? rarity.bg : "bg-muted",
          isUnlocked && "border",
          isUnlocked && rarity.border
        )}>
          {isUnlocked ? (
            <Icon className={cn("w-6 h-6", rarity.text)} />
          ) : (
            <Lock className="w-6 h-6 text-muted-foreground" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            "font-medium truncate",
            !isUnlocked && "text-muted-foreground"
          )}>
            {reward.title}
          </h4>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
            {reward.description}
          </p>

          {/* Reward type badge */}
          <div className={cn(
            "inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs",
            rarity.bg,
            rarity.text
          )}>
            {reward.reward_type === "arena_points" && `+${reward.reward_value} ARENA`}
            {reward.reward_type === "xp_bonus" && `+${reward.reward_value} XP`}
            {reward.reward_type === "title" && `Titre: ${reward.reward_value}`}
            {reward.reward_type === "feature" && "Fonctionnalité"}
            {reward.reward_type === "badge" && "Badge"}
          </div>
        </div>
      </div>

      {/* Claim button / Status */}
      <div className="mt-3">
        {isClaimed ? (
          <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
            <Check className="w-4 h-4" />
            Réclamé
          </div>
        ) : canClaim ? (
          <Button
            size="sm"
            className="w-full gap-2"
            onClick={() => onClaim(reward.id)}
            disabled={isClaiming}
          >
            {isClaiming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Gift className="w-4 h-4" />
            )}
            Réclamer
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            Niveau {reward.level_required} requis
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
  const { rewards, claimedRewards, availableRewards, loading, claimReward } = useLevelRewards(currentLevel);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "available" | "claimed">("all");

  const handleClaim = async (id: string) => {
    setClaimingId(id);
    await claimReward(id);
    setClaimingId(null);
  };

  const filteredRewards = rewards.filter(reward => {
    const isClaimed = claimedRewards.some(c => c.reward_id === reward.id);
    const isUnlocked = currentLevel >= reward.level_required;
    
    if (filter === "available") return isUnlocked && !isClaimed;
    if (filter === "claimed") return isClaimed;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
            <Gift className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl">Récompenses de Niveau</h3>
            <p className="text-sm text-muted-foreground">
              {availableRewards.length} récompense{availableRewards.length !== 1 ? "s" : ""} à réclamer
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {[
            { value: "all", label: "Toutes" },
            { value: "available", label: "Disponibles" },
            { value: "claimed", label: "Réclamées" },
          ].map(tab => (
            <Button
              key={tab.value}
              variant={filter === tab.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(tab.value as typeof filter)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Available rewards alert */}
      <AnimatePresence>
        {availableRewards.length > 0 && filter !== "claimed" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="font-medium">
                  Vous avez {availableRewards.length} récompense{availableRewards.length !== 1 ? "s" : ""} à réclamer !
                </p>
                <p className="text-sm text-muted-foreground">
                  Réclamez-les pour obtenir des bonus ARENA, XP et plus encore.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rewards grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRewards.map(reward => (
          <RewardCard
            key={reward.id}
            reward={reward}
            currentLevel={currentLevel}
            isClaimed={claimedRewards.some(c => c.reward_id === reward.id)}
            onClaim={handleClaim}
            claimingId={claimingId}
          />
        ))}
      </div>

      {filteredRewards.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucune récompense dans cette catégorie</p>
        </div>
      )}
    </motion.div>
  );
}
