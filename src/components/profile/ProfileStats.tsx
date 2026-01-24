import { motion } from "framer-motion";
import { Trophy, Target, TrendingUp, Coins, Award, Flame, BarChart3, Zap } from "lucide-react";
import { UserProfile } from "@/hooks/useProfile";

interface ProfileStatsProps {
  profile: UserProfile;
  totalBadges: number;
}

export function ProfileStats({ profile, totalBadges }: ProfileStatsProps) {
  const stats = [
    {
      label: "Score Aréna",
      value: profile.arena_score.toLocaleString(),
      icon: Trophy,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
    },
    {
      label: "Balance ARENA",
      value: profile.arena_balance.toLocaleString(),
      icon: Coins,
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/30",
    },
    {
      label: "Pronostics",
      value: profile.total_predictions.toString(),
      icon: Target,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      borderColor: "border-secondary/30",
    },
    {
      label: "Victoires",
      value: profile.total_wins.toString(),
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/30",
    },
    {
      label: "Précision",
      value: `${profile.prediction_accuracy?.toFixed(1) || 0}%`,
      icon: BarChart3,
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10",
      borderColor: "border-cyan-400/30",
    },
    {
      label: "Série Active",
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
      label: "Membre depuis",
      value: new Date(profile.created_at).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
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
      <h2 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        Statistiques Détaillées
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className={`p-4 rounded-xl ${stat.bgColor} border ${stat.borderColor} hover:scale-105 transition-transform`}
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <div className={`font-display font-bold text-xl ${stat.color}`}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
