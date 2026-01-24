import { motion } from "framer-motion";
import { Trophy, Gift, Clock, Sparkles } from "lucide-react";
import { useWeeklyRewards } from "@/hooks/useLeaderboard";
import { Progress } from "@/components/ui/progress";

function getTimeRemaining(): { days: number; hours: number; minutes: number } {
  const now = new Date();
  const dayOfWeek = now.getUTCDay();
  const daysUntilSunday = (7 - dayOfWeek) % 7 || 7;
  const nextSunday = new Date(now);
  nextSunday.setUTCDate(now.getUTCDate() + daysUntilSunday);
  nextSunday.setUTCHours(23, 59, 59, 999);
  
  const diff = nextSunday.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes };
}

export function WeeklyRewardsPanel() {
  const { rewards, loading } = useWeeklyRewards();
  const timeRemaining = getTimeRemaining();

  if (loading) {
    return (
      <div className="glass-card p-6 animate-pulse">
        <div className="h-6 bg-muted rounded w-1/2 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-6 relative overflow-hidden"
    >
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-[60px] pointer-events-none" />
      
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="w-5 h-5 text-accent" />
          <h3 className="font-display font-bold text-lg">Récompenses Hebdo</h3>
        </div>

        {/* Countdown */}
        <div className="glass-card-hover p-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Clock className="w-4 h-4" />
            <span>Temps restant</span>
          </div>
          <div className="flex gap-3">
            <div className="text-center">
              <div className="font-display font-bold text-2xl text-accent">
                {timeRemaining.days}
              </div>
              <div className="text-xs text-muted-foreground">jours</div>
            </div>
            <div className="text-2xl text-muted-foreground">:</div>
            <div className="text-center">
              <div className="font-display font-bold text-2xl text-primary">
                {timeRemaining.hours}
              </div>
              <div className="text-xs text-muted-foreground">heures</div>
            </div>
            <div className="text-2xl text-muted-foreground">:</div>
            <div className="text-center">
              <div className="font-display font-bold text-2xl text-primary">
                {timeRemaining.minutes}
              </div>
              <div className="text-xs text-muted-foreground">min</div>
            </div>
          </div>
          <Progress value={((7 - timeRemaining.days) / 7) * 100} className="mt-3 h-1" />
        </div>

        {/* Rewards list */}
        <div className="space-y-3">
          {rewards.map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-sm ${
                  reward.rank_from === 1 ? "badge-rank-gold" :
                  reward.rank_from === 2 ? "badge-rank-silver" :
                  reward.rank_from === 3 ? "badge-rank-bronze" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {reward.rank_from === reward.rank_to 
                    ? `#${reward.rank_from}` 
                    : `${reward.rank_from}-${reward.rank_to}`
                  }
                </div>
                <div>
                  <div className="font-medium text-sm">
                    {reward.description || `Top ${reward.rank_to}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-accent" />
                <span className="font-display font-bold text-accent">
                  {reward.arena_points.toLocaleString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
