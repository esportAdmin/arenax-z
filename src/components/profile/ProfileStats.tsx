import { motion } from "framer-motion";
import {
  Award,
  BarChart3,
  Coins,
  Flame,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { UserProfile } from "@/hooks/useProfile";

interface ProfileStatsProps {
  profile: UserProfile;
  totalBadges: number;
}

export function ProfileStats({ profile, totalBadges }: ProfileStatsProps) {
  const stats = [
    {
      label: "Arena Score",
      value: profile.arena_score.toLocaleString("en-US"),
      icon: Trophy,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
    },
    {
      label: "ARENA Balance",
      value: profile.arena_balance.toLocaleString("en-US"),
      icon: Coins,
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/30",
    },
    {
      label: "Live Calls",
      value: profile.total_live_calls.toString(),
      icon: Target,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      borderColor: "border-secondary/30",
    },
    {
      label: "Wins",
      value: profile.total_wins.toString(),
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/30",
    },
    {
      label: "Accuracy",
      value: `${profile.signal_accuracy?.toFixed(1) || 0}%`,
      icon: BarChart3,
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10",
      borderColor: "border-cyan-400/30",
    },
    {
      label: "Active Streak",
      value: profile.active_streak.toString(),
      icon: Flame,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
      borderColor: "border-amber-400/30",
    },
    {
      label: "Badges",
      value: totalBadges.toString(),
      icon: Award,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/30",
    },
    {
      label: "Member Since",
      value: new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      icon: Zap,
      color: "text-pink-400",
      bgColor: "bg-pink-400/10",
      borderColor: "border-pink-400/30",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-6"
    >
      <h2 className="mb-6 flex items-center gap-2 text-lg font-display font-bold">
        <BarChart3 className="h-5 w-5 text-primary" />
        Detailed Stats
      </h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className={`rounded-xl border p-4 transition-transform hover:scale-105 ${stat.bgColor} ${stat.borderColor}`}
          >
            <div className="mb-2 flex items-center gap-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-xs text-muted-foreground">
                {stat.label}
              </span>
            </div>
            <div className={`text-xl font-display font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
