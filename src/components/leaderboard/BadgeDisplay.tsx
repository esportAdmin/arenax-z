import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  arena_points_reward: number;
}

interface BadgeDisplayProps {
  badges: Badge[];
  maxDisplay?: number;
  size?: "sm" | "md" | "lg";
}

const rarityStyles: Record<string, string> = {
  common: "bg-muted border-muted-foreground/30",
  rare: "bg-primary/20 border-primary/50 shadow-[0_0_10px_hsl(var(--primary)/0.3)]",
  epic: "bg-accent/20 border-accent/50 shadow-[0_0_10px_hsl(var(--accent)/0.3)]",
  legendary: "bg-amber-500/20 border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.4)]",
};

const sizeStyles: Record<string, string> = {
  sm: "w-6 h-6 text-sm",
  md: "w-8 h-8 text-lg",
  lg: "w-10 h-10 text-xl",
};

export function BadgeDisplay({ badges, maxDisplay = 3, size = "sm" }: BadgeDisplayProps) {
  const displayBadges = badges.slice(0, maxDisplay);
  const remaining = badges.length - maxDisplay;

  if (badges.length === 0) return null;

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {displayBadges.map((badge, index) => (
          <Tooltip key={badge.id}>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-full border flex items-center justify-center cursor-pointer ${
                  sizeStyles[size]
                } ${rarityStyles[badge.rarity]}`}
              >
                {badge.icon}
              </motion.div>
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="bg-card border-border p-3"
            >
              <div className="text-center">
                <div className="text-2xl mb-1">{badge.icon}</div>
                <div className="font-display font-bold text-sm">{badge.name}</div>
                <div className="text-xs text-muted-foreground max-w-[150px]">
                  {badge.description}
                </div>
                <div className="text-xs text-primary mt-1">
                  +{badge.arena_points_reward} points
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
        {remaining > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`rounded-full bg-muted/50 border border-border flex items-center justify-center text-xs text-muted-foreground cursor-pointer ${sizeStyles[size]}`}
              >
                +{remaining}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs">
                {remaining} autres badges
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
