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
      label: "Prestige Score",
      value: profile.arena_score.toLocaleString("en-US"),
      icon: Trophy,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
    },
    {
      label: "Arena Credits",
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
      label: "Read Quality",
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
      className="section-shell p-5 sm:p-6"
    >
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="eyebrow-badge">Profile telemetry</div>
          <h2 className="mt-3 flex items-center gap-2 text-xl font-display font-black text-white">
            <BarChart3 className="h-5 w-5 text-primary" />
            Status cockpit
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-400">
          The numbers that make a player feel visible, progressing, and worth
          returning to.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className={`relative min-h-[118px] overflow-hidden rounded-2xl border p-4 transition-transform hover:scale-[1.02] ${stat.bgColor} ${stat.borderColor}`}
          >
            <div className="pointer-events-none absolute right-[-2rem] top-[-2rem] h-20 w-20 rounded-full bg-white/10 blur-2xl" />
            <div className="relative mb-3 flex items-center gap-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="truncate text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                {stat.label}
              </span>
            </div>
            <div className={`relative truncate text-2xl font-display font-black ${stat.color}`}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
