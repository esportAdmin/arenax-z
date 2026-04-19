import { motion } from "framer-motion";
import {
  Award,
  Crown,
  Eye,
  Flame,
  Gem,
  Lock,
  Medal,
  Share2,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserBadge } from "@/hooks/useProfile";

interface ProfileBadgesProps {
  userBadges: UserBadge[];
}

const rarityLabels: Record<string, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

const rarityStyles: Record<
  string,
  { bg: string; border: string; text: string; glow: string }
> = {
  common: {
    bg: "bg-muted/50",
    border: "border-muted-foreground/30",
    text: "text-muted-foreground",
    glow: "",
  },
  rare: {
    bg: "bg-primary/10",
    border: "border-primary/50",
    text: "text-primary",
    glow: "shadow-[0_0_15px_hsl(var(--primary)/0.3)]",
  },
  epic: {
    bg: "bg-accent/10",
    border: "border-accent/50",
    text: "text-accent",
    glow: "shadow-[0_0_20px_hsl(var(--accent)/0.4)]",
  },
  legendary: {
    bg: "bg-amber-500/10",
    border: "border-amber-400/50",
    text: "text-amber-400",
    glow: "shadow-[0_0_25px_rgba(251,191,36,0.5)]",
  },
};

const categoryLabels: Record<string, string> = {
  prediction: "Live Calls",
  streak: "Streaks",
  engagement: "Engagement",
  achievement: "Achievements",
  leadership: "Leadership",
  special: "Special",
};

const badgeIcons: Record<string, typeof Award> = {
  award: Award,
  crown: Crown,
  flame: Flame,
  gem: Gem,
  medal: Medal,
  sparkles: Sparkles,
  star: Star,
};

function getBadgeIcon(icon: string) {
  return badgeIcons[icon?.toLowerCase()] ?? Award;
}

export function ProfileBadges({ userBadges }: ProfileBadgesProps) {
  const { toast } = useToast();

  const handleShareBadge = (badge: UserBadge) => {
    navigator.clipboard.writeText(
      `I unlocked the "${badge.badge.name}" badge on RallyGuild by ArenaX.`,
    );
    toast({
      title: "Badge copied",
      description: "Your share text is now in the clipboard.",
    });
  };

  const badgesByCategory = userBadges.reduce(
    (accumulator, userBadge) => {
      const category = userBadge.badge.category;
      if (!accumulator[category]) {
        accumulator[category] = [];
      }
      accumulator[category].push(userBadge);
      return accumulator;
    },
    {} as Record<string, UserBadge[]>,
  );

  if (userBadges.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="section-shell p-5 sm:p-6"
      >
        <h2 className="mb-6 flex items-center gap-2 text-xl font-display font-black text-white">
          <Award className="h-5 w-5 text-primary" />
          Badge vault
        </h2>
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-muted-foreground">
          <Lock className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p className="font-bold text-white">No badges unlocked yet.</p>
          <p className="mt-2 text-sm">
            Complete live calls and keep your streak alive to unlock your first
            status marker.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="section-shell p-5 sm:p-6"
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="eyebrow-badge">Identity vault</div>
          <h2 className="mt-3 flex items-center gap-2 text-xl font-display font-black text-white">
            <Award className="h-5 w-5 text-primary" />
            Earned badges ({userBadges.length})
          </h2>
        </div>
        <Button variant="ghost" size="sm" className="min-h-10 rounded-full px-4">
          <Eye className="mr-2 h-4 w-4" />
          View All
        </Button>
      </div>

      <div className="space-y-6">
        {Object.entries(badgesByCategory).map(([category, badges]) => (
          <div key={category}>
            <div className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">
              {categoryLabels[category] || category} ({badges.length})
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {badges.map((userBadge, index) => {
                const styles =
                  rarityStyles[userBadge.badge.rarity] || rarityStyles.common;
                const BadgeIcon = getBadgeIcon(userBadge.badge.icon);

                return (
                  <motion.div
                    key={userBadge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className={`group relative min-h-[132px] cursor-pointer overflow-hidden rounded-2xl border p-4 transition-all hover:scale-[1.03] ${styles.bg} ${styles.border} ${styles.glow}`}
                  >
                    <div className="pointer-events-none absolute right-[-2rem] top-[-2rem] h-20 w-20 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative text-center">
                      <div
                        className={`mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border ${styles.bg} ${styles.border}`}
                      >
                        <BadgeIcon className={`h-5 w-5 ${styles.text}`} />
                      </div>
                      <div className="truncate text-xs font-medium">
                        {userBadge.badge.name}
                      </div>
                      <div className={`mt-1 text-[10px] ${styles.text}`}>
                        {rarityLabels[userBadge.badge.rarity]}
                      </div>
                      <div className="mt-1 text-[10px] text-muted-foreground">
                        +{userBadge.badge.arena_points_reward} pts
                      </div>
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl bg-background/95 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleShareBadge(userBadge)}
                        className="min-h-9 rounded-full px-4"
                      >
                        <Share2 className="mr-1 h-3 w-3" />
                        Share
                      </Button>
                      <div className="px-2 text-center text-[10px] text-muted-foreground">
                        {userBadge.badge.description}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Earned on{" "}
                        {new Date(userBadge.earned_at).toLocaleDateString(
                          "en-US",
                        )}
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
