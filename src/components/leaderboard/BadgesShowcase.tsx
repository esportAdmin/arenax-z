import { motion } from "framer-motion";
import { Award, Lock } from "lucide-react";
import { useBadges } from "@/hooks/useLeaderboard";

const rarityLabels: Record<string, string> = {
  common: "Commun",
  rare: "Rare",
  epic: "Épique",
  legendary: "Légendaire",
};

const rarityStyles: Record<string, { bg: string; border: string; text: string }> = {
  common: { 
    bg: "bg-muted/50", 
    border: "border-muted-foreground/30",
    text: "text-muted-foreground"
  },
  rare: { 
    bg: "bg-primary/10", 
    border: "border-primary/50",
    text: "text-primary"
  },
  epic: { 
    bg: "bg-accent/10", 
    border: "border-accent/50",
    text: "text-accent"
  },
  legendary: { 
    bg: "bg-amber-500/10", 
    border: "border-amber-400/50",
    text: "text-amber-400"
  },
};

export function BadgesShowcase() {
  const { badges, loading } = useBadges();

  if (loading) {
    return (
      <div className="glass-card p-6 animate-pulse">
        <div className="h-6 bg-muted rounded w-1/3 mb-4" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }

  // Group badges by rarity
  const badgesByRarity = badges.reduce((acc, badge) => {
    if (!acc[badge.rarity]) {
      acc[badge.rarity] = [];
    }
    acc[badge.rarity].push(badge);
    return acc;
  }, {} as Record<string, typeof badges>);

  const rarityOrder = ["legendary", "epic", "rare", "common"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Award className="w-5 h-5 text-primary" />
        <h3 className="font-display font-bold text-lg">Collection de Badges</h3>
      </div>

      <div className="space-y-6">
        {rarityOrder.map((rarity) => {
          const rarityBadges = badgesByRarity[rarity];
          if (!rarityBadges || rarityBadges.length === 0) return null;

          const styles = rarityStyles[rarity];

          return (
            <div key={rarity}>
              <div className={`text-xs font-medium mb-3 ${styles.text}`}>
                {rarityLabels[rarity]} ({rarityBadges.length})
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {rarityBadges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative p-4 rounded-xl border ${styles.bg} ${styles.border} hover:scale-105 transition-transform cursor-pointer group`}
                  >
                    {/* Locked overlay for demo - would check user's badges */}
                    {Math.random() > 0.3 && (
                      <div className="absolute inset-0 bg-background/80 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className="text-2xl mb-2">{badge.icon}</div>
                      <div className="font-medium text-xs truncate">
                        {badge.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">
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
