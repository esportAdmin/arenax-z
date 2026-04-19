import { motion } from "framer-motion";
import { Award, Lock } from "lucide-react";
import { useBadges } from "@/hooks/useLeaderboard";

const rarityLabels: Record<string, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

const rarityStyles: Record<string, { bg: string; border: string; text: string }> = {
  common: {
    bg: "bg-muted/50",
    border: "border-muted-foreground/30",
    text: "text-muted-foreground",
  },
  rare: {
    bg: "bg-primary/10",
    border: "border-primary/50",
    text: "text-primary",
  },
  epic: {
    bg: "bg-accent/10",
    border: "border-accent/50",
    text: "text-accent",
  },
  legendary: {
    bg: "bg-amber-500/10",
    border: "border-amber-400/50",
    text: "text-amber-400",
  },
};

export function BadgesShowcase() {
  const { badges, loading } = useBadges();

  if (loading) {
    return (
      <div className="glass-card animate-pulse p-6">
        <div className="mb-4 h-6 w-1/3 rounded bg-muted" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-20 rounded bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  const badgesByRarity = badges.reduce(
    (accumulator, badge) => {
      if (!accumulator[badge.rarity]) {
        accumulator[badge.rarity] = [];
      }
      accumulator[badge.rarity].push(badge);
      return accumulator;
    },
    {} as Record<string, typeof badges>,
  );

  const rarityOrder = ["legendary", "epic", "rare", "common"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-6"
    >
      <div className="mb-6 flex items-center gap-2">
        <Award className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-display font-bold">Badge Collection</h3>
      </div>

      <div className="space-y-6">
        {rarityOrder.map((rarity) => {
          const rarityBadges = badgesByRarity[rarity];
          if (!rarityBadges?.length) {
            return null;
          }

          const styles = rarityStyles[rarity];

          return (
            <div key={rarity}>
              <div className={`mb-3 text-xs font-medium ${styles.text}`}>
                {rarityLabels[rarity]} ({rarityBadges.length})
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {rarityBadges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group relative cursor-pointer rounded-xl border p-4 transition-transform hover:scale-105 ${styles.bg} ${styles.border}`}
                  >
                    {Math.random() > 0.3 ? (
                      <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/80 opacity-0 transition-opacity group-hover:opacity-100">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ) : null}

                    <div className="text-center">
                      <div className="mb-2 text-2xl">{badge.icon}</div>
                      <div className="truncate text-xs font-medium">
                        {badge.name}
                      </div>
                      <div className="mt-1 text-[10px] text-muted-foreground">
                        +{badge.arena_points_reward} pts
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
