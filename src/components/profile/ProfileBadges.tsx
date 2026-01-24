import { motion } from "framer-motion";
import { Award, Lock, Share2, Eye } from "lucide-react";
import { UserBadge } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProfileBadgesProps {
  userBadges: UserBadge[];
}

const rarityLabels: Record<string, string> = {
  common: "Commun",
  rare: "Rare",
  epic: "Épique",
  legendary: "Légendaire",
};

const rarityStyles: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  common: { 
    bg: "bg-muted/50", 
    border: "border-muted-foreground/30",
    text: "text-muted-foreground",
    glow: ""
  },
  rare: { 
    bg: "bg-primary/10", 
    border: "border-primary/50",
    text: "text-primary",
    glow: "shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
  },
  epic: { 
    bg: "bg-accent/10", 
    border: "border-accent/50",
    text: "text-accent",
    glow: "shadow-[0_0_20px_hsl(var(--accent)/0.4)]"
  },
  legendary: { 
    bg: "bg-amber-500/10", 
    border: "border-amber-400/50",
    text: "text-amber-400",
    glow: "shadow-[0_0_25px_rgba(251,191,36,0.5)]"
  },
};

const categoryLabels: Record<string, string> = {
  prediction: "Pronostics",
  streak: "Séries",
  engagement: "Engagement",
  achievement: "Accomplissements",
  special: "Spécial",
};

export function ProfileBadges({ userBadges }: ProfileBadgesProps) {
  const { toast } = useToast();

  const handleShareBadge = (badge: UserBadge) => {
    navigator.clipboard.writeText(`J'ai obtenu le badge "${badge.badge.name}" sur FanArena Pro ! 🏆`);
    toast({
      title: "Badge partagé",
      description: "Le texte a été copié dans le presse-papier",
    });
  };

  // Group badges by category
  const badgesByCategory = userBadges.reduce((acc, userBadge) => {
    const category = userBadge.badge.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(userBadge);
    return acc;
  }, {} as Record<string, UserBadge[]>);

  if (userBadges.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h2 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Badges Collectés
        </h2>
        <div className="text-center py-8 text-muted-foreground">
          <Lock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucun badge débloqué</p>
          <p className="text-sm mt-2">Participez pour gagner des badges !</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-lg flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Badges Collectés ({userBadges.length})
        </h2>
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          Voir Tous
        </Button>
      </div>

      <div className="space-y-6">
        {Object.entries(badgesByCategory).map(([category, badges]) => (
          <div key={category}>
            <div className="text-sm font-medium text-muted-foreground mb-3">
              {categoryLabels[category] || category} ({badges.length})
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {badges.map((userBadge, index) => {
                const styles = rarityStyles[userBadge.badge.rarity] || rarityStyles.common;

                return (
                  <motion.div
                    key={userBadge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className={`relative p-4 rounded-xl border ${styles.bg} ${styles.border} ${styles.glow} hover:scale-105 transition-all cursor-pointer group`}
                  >
                    {/* Badge Content */}
                    <div className="text-center">
                      <div className="text-3xl mb-2">{userBadge.badge.icon}</div>
                      <div className="font-medium text-xs truncate">
                        {userBadge.badge.name}
                      </div>
                      <div className={`text-[10px] ${styles.text} mt-1`}>
                        {rarityLabels[userBadge.badge.rarity]}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        +{userBadge.badge.arena_points_reward} pts
                      </div>
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-background/90 rounded-xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleShareBadge(userBadge)}
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        Partager
                      </Button>
                      <div className="text-[10px] text-muted-foreground text-center px-2">
                        {userBadge.badge.description}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Obtenu le {new Date(userBadge.earned_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
