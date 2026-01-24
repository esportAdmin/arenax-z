import { motion } from "framer-motion";
import { Flame, Calendar, Trophy, Gift } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface StreakData {
  active_streak: number;
  total_predictions: number;
}

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100];

export function StreakDisplay() {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreak = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("active_streak, total_predictions")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!error && data) {
        setStreakData(data);
      }
      setLoading(false);
    };

    fetchStreak();
  }, [user]);

  if (loading) {
    return (
      <div className="glass-card p-4 animate-pulse">
        <div className="h-20 bg-muted rounded" />
      </div>
    );
  }

  const streak = streakData?.active_streak || 0;
  const nextMilestone = STREAK_MILESTONES.find(m => m > streak) || 100;
  const prevMilestone = STREAK_MILESTONES.filter(m => m <= streak).pop() || 0;
  const progressToNext = ((streak - prevMilestone) / (nextMilestone - prevMilestone)) * 100;

  // Determine flame intensity based on streak
  const getFlameColor = () => {
    if (streak >= 30) return "text-orange-500";
    if (streak >= 14) return "text-amber-500";
    if (streak >= 7) return "text-yellow-500";
    if (streak >= 3) return "text-yellow-400";
    return "text-muted-foreground";
  };

  const getStreakMessage = () => {
    if (streak === 0) return "Commence ta série aujourd'hui !";
    if (streak === 1) return "C'est le début ! Reviens demain 🔥";
    if (streak < 3) return "Continue comme ça ! 💪";
    if (streak < 7) return "Tu es en feu ! 🔥";
    if (streak < 14) return "Incroyable série ! 🌟";
    if (streak < 30) return "Tu es une légende ! 👑";
    return "INVINCIBLE ! 🏆";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      {/* Header avec flamme */}
      <div className="p-4 border-b border-border/50 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                scale: streak > 0 ? [1, 1.1, 1] : 1,
              }}
              transition={{ 
                repeat: streak > 0 ? Infinity : 0, 
                duration: 1.5,
                ease: "easeInOut"
              }}
              className={`w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center`}
            >
              <Flame className={`w-5 h-5 ${getFlameColor()}`} />
            </motion.div>
            <div>
              <h3 className="font-display font-bold">Série Active</h3>
              <p className="text-xs text-muted-foreground">{getStreakMessage()}</p>
            </div>
          </div>
          
          {/* Streak counter */}
          <motion.div
            key={streak}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-right"
          >
            <div className="font-display font-bold text-3xl gradient-text-primary">
              {streak}
            </div>
            <div className="text-xs text-muted-foreground">jours</div>
          </motion.div>
        </div>
      </div>

      {/* Progress vers le prochain milestone */}
      <div className="p-4 space-y-4">
        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span className="flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              Prochain palier
            </span>
            <span className="font-medium text-foreground">{nextMilestone} jours</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressToNext}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{streak} / {nextMilestone}</span>
            <span>{nextMilestone - streak} jours restants</span>
          </div>
        </div>

        {/* Milestones preview */}
        <div className="flex items-center justify-between gap-2">
          {STREAK_MILESTONES.slice(0, 5).map((milestone, index) => {
            const isAchieved = streak >= milestone;
            const isNext = milestone === nextMilestone;
            
            return (
              <motion.div
                key={milestone}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex-1 text-center p-2 rounded-lg border transition-all ${
                  isAchieved 
                    ? "bg-primary/10 border-primary/30" 
                    : isNext 
                      ? "bg-orange-500/10 border-orange-500/30 ring-1 ring-orange-500/20" 
                      : "bg-muted/50 border-border/30"
                }`}
              >
                <div className={`text-lg mb-0.5 ${isAchieved ? "" : "grayscale opacity-50"}`}>
                  {milestone === 3 && "🔥"}
                  {milestone === 7 && "⭐"}
                  {milestone === 14 && "🌟"}
                  {milestone === 30 && "👑"}
                  {milestone === 60 && "💎"}
                  {milestone === 100 && "🏆"}
                </div>
                <div className={`text-xs font-medium ${isAchieved ? "text-primary" : "text-muted-foreground"}`}>
                  {milestone}j
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Reward teaser */}
        {streak > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
          >
            <Gift className="w-4 h-4 text-primary" />
            <span className="text-sm">
              <span className="font-medium text-primary">+{(nextMilestone - streak) * 10} ARENA</span>
              <span className="text-muted-foreground"> au prochain palier !</span>
            </span>
          </motion.div>
        )}

        {/* Call to action si streak = 0 */}
        {streak === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center p-3 rounded-lg bg-muted/50 border border-border/50"
          >
            <Calendar className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Fais ta première prédiction pour démarrer ta série !
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
