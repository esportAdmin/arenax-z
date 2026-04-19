import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Crown,
  Flame,
  Gem,
  Gift,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { isLocalQaUser } from "@/lib/dev-auth";

interface StreakData {
  active_streak: number;
  total_predictions: number;
}

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100];

const milestoneIcons = {
  3: Flame,
  7: Sparkles,
  14: Trophy,
  30: Crown,
  60: Gem,
};

export function StreakDisplay() {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);
  const isLocalQa = isLocalQaUser(user);

  useEffect(() => {
    const fetchStreak = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      if (isLocalQa) {
        setStreakData({
          active_streak: 6,
          total_predictions: 48,
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("active_streak, total_predictions")
        .eq("id", user.id)
        .maybeSingle();

      if (!error && data) {
        setStreakData(data);
      }

      setLoading(false);
    };

    void fetchStreak();
  }, [isLocalQa, user]);

  if (loading) {
    return (
      <div className="section-shell animate-pulse p-4">
        <div className="h-24 rounded-2xl bg-white/5" />
      </div>
    );
  }

  const streak = streakData?.active_streak ?? 0;
  const totalPredictions = streakData?.total_predictions ?? 0;
  const nextMilestone =
    STREAK_MILESTONES.find((milestone) => milestone > streak) ?? 100;
  const previousMilestone =
    STREAK_MILESTONES.filter((milestone) => milestone <= streak).pop() ?? 0;
  const progressToNext =
    ((streak - previousMilestone) / (nextMilestone - previousMilestone || 1)) *
    100;

  const getFlameColor = () => {
    if (streak >= 30) return "text-orange-500";
    if (streak >= 14) return "text-amber-500";
    if (streak >= 7) return "text-yellow-500";
    if (streak >= 3) return "text-yellow-400";
    return "text-muted-foreground";
  };

  const getStreakMessage = () => {
    if (streak === 0) return "Start your streak today.";
    if (streak === 1) return "Nice start. Come back tomorrow.";
    if (streak < 3) return "Keep it going.";
    if (streak < 7) return "You're heating up.";
    if (streak < 14) return "Momentum is building.";
    if (streak < 30) return "You are in elite form.";
    return "You are almost untouchable.";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="section-shell overflow-hidden"
    >
      <div className="border-b border-white/8 bg-gradient-to-r from-orange-500/12 via-amber-500/10 to-cyan-500/5 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: streak > 0 ? [1, 1.08, 1] : 1 }}
              transition={{
                repeat: streak > 0 ? Infinity : 0,
                duration: 1.6,
                ease: "easeInOut",
              }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-400/20 bg-gradient-to-br from-orange-500/20 to-amber-500/20 shadow-[0_0_30px_rgba(251,146,60,0.18)]"
            >
              <Flame className={`h-5 w-5 ${getFlameColor()}`} />
            </motion.div>
            <div>
              <div className="eyebrow-badge mb-2">Daily comeback loop</div>
              <h3 className="font-display text-xl font-black text-white">
                Active Streak
              </h3>
              <p className="text-xs text-slate-400">{getStreakMessage()}</p>
            </div>
          </div>

          <motion.div
            key={streak}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-right"
          >
            <div className="gradient-text-primary text-4xl font-display font-black">
              {streak}
            </div>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
              days
            </div>
          </motion.div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="surface-panel border-orange-400/15 bg-orange-400/5 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Current streak
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              {streak} days
            </div>
          </div>

          <div className="surface-panel border-cyan-400/15 bg-cyan-400/5 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Live calls
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              {totalPredictions.toLocaleString("en-US")}
            </div>
          </div>

          <div className="surface-panel border-emerald-400/15 bg-emerald-400/5 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Next milestone
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              {nextMilestone}d
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              Next milestone
            </span>
            <span className="font-medium text-foreground">
              {nextMilestone} days
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(progressToNext, 0)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500"
            />
          </div>

          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>
              {streak} / {nextMilestone}
            </span>
            <span>{nextMilestone - streak} days remaining</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          {STREAK_MILESTONES.slice(0, 5).map((milestone, index) => {
            const isAchieved = streak >= milestone;
            const isNext = milestone === nextMilestone;
            const Icon =
              milestoneIcons[milestone as keyof typeof milestoneIcons] ?? Gift;

            return (
              <motion.div
                key={milestone}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex-1 rounded-xl border p-3 text-center transition-all ${
                  isAchieved
                    ? "border-primary/30 bg-primary/10"
                    : isNext
                      ? "border-orange-500/30 bg-orange-500/10 ring-1 ring-orange-500/20"
                      : "border-white/8 bg-white/5"
                }`}
              >
                <div className="mb-1 flex justify-center">
                  <Icon
                    className={`h-5 w-5 ${
                      isAchieved
                        ? "text-white"
                        : isNext
                          ? "text-orange-300"
                          : "text-slate-500"
                    }`}
                  />
                </div>
                <div
                  className={`text-xs font-medium ${
                    isAchieved ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {milestone}d
                </div>
              </motion.div>
            );
          })}
        </div>

        {streak > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10 p-4"
          >
            <Gift className="h-4 w-4 text-primary" />
            <span className="text-sm">
              <span className="font-medium text-primary">
                +{(nextMilestone - streak) * 10} ARENA
              </span>
              <span className="text-muted-foreground">
                {" "}
                waiting at the next milestone.
              </span>
            </span>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-white/8 bg-white/5 p-4 text-center"
          >
            <Calendar className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Start your first live call to begin your streak.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
