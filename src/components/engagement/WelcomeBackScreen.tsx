import { motion } from "framer-motion";
import {
  ChevronRight,
  Flame,
  Gift,
  Shield,
  Sparkles,
  Star,
  Target,
  Trophy,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownPill } from "@/components/engagement/CountdownPill";
import { getNextUtcMidnight } from "@/lib/countdown";
import { Progress } from "@/components/ui/progress";

interface WelcomeBackScreenProps {
  userName: string;
  arenaScore: number;
  arenaBalance: number;
  globalRank: number;
  streak: number;
  accuracy: number;
  level: number;
  pointsToNextLevel: number;
  nextLevelPoints: number;
  onStartChallenge: () => void;
  onSkip?: () => void;
}

export const WelcomeBackScreen = ({
  userName,
  arenaScore,
  arenaBalance,
  globalRank,
  streak,
  accuracy,
  level,
  pointsToNextLevel,
  nextLevelPoints,
  onStartChallenge,
  onSkip,
}: WelcomeBackScreenProps) => {
  const progressToLevel =
    ((nextLevelPoints - pointsToNextLevel) / nextLevelPoints) * 100;
  const dailyReset = getNextUtcMidnight();

  const quickStats = [
    {
      icon: Trophy,
      label: "Arena score",
      value: arenaScore.toLocaleString("en-US"),
      color: "text-cyan-300",
      bg: "bg-cyan-400/10",
    },
    {
      icon: TrendingUp,
      label: "Accuracy",
      value: `${accuracy}%`,
      color: "text-emerald-300",
      bg: "bg-emerald-400/10",
    },
    {
      icon: Shield,
      label: "Global rank",
      value: `#${globalRank}`,
      color: "text-fuchsia-300",
      bg: "bg-fuchsia-400/10",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-background px-3 py-4 sm:px-4 sm:py-6">
      <div className="absolute inset-0 cyber-grid opacity-15" />
      <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-[360px] w-[460px] rounded-full bg-fuchsia-500/10 blur-[120px]" />

      <div className="relative max-h-[94vh] w-full max-w-5xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="command-frame hero-sheen relative overflow-hidden px-6 py-8 lg:px-10 lg:py-10"
        >
          <div className="subtle-noise absolute inset-0 opacity-50" />

          <div className="relative grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="eyebrow-badge">Welcome back protocol</div>

              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-200">
                  <Flame className="h-4 w-4" />
                  {streak}-day streak
                </div>

                <h1 className="mt-5 font-display text-4xl font-black tracking-tight text-white lg:text-6xl">
                  Welcome back,
                  <span className="gradient-text-primary block">
                    {userName}
                  </span>
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 lg:text-lg">
                  Your daily mission is simple: secure momentum, protect your
                  streak, and turn today&apos;s attention into tomorrow&apos;s return.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <CountdownPill label="Daily reset" target={dailyReset} />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {quickStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + index * 0.07 }}
                    className="surface-panel p-4"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}
                    >
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div className={`mt-4 text-2xl font-black ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="mt-1 text-sm text-slate-400">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="section-shell">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-cyan-300" />
                    <span className="text-sm font-semibold text-white">
                      Level {level}
                    </span>
                  </div>
                  <span className="text-sm text-slate-400">
                    {pointsToNextLevel} points to level {level + 1}
                  </span>
                </div>
                <Progress value={progressToLevel} className="h-2" />
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>Next unlock: prestige progress + reward momentum</span>
                  <span>{Math.round(progressToLevel)}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="section-shell">
                <div className="eyebrow-badge">Priority action</div>
                <div className="mt-4 flex items-start gap-3">
                  <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3">
                    <Zap className="h-7 w-7 text-cyan-300" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">
                      Daily challenge
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Three quick calls, one visible reward, and a simple reason
                      to come back tomorrow.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                  <div className="surface-panel border-cyan-400/15 bg-cyan-400/5 p-4">
                    <Target className="h-5 w-5 text-cyan-300" />
                    <div className="mt-3 text-sm font-semibold text-white">
              3 rapid live calls
                    </div>
                  </div>
                  <div className="surface-panel border-amber-400/15 bg-amber-400/5 p-4">
                    <Gift className="h-5 w-5 text-amber-300" />
                    <div className="mt-3 text-sm font-semibold text-white">
                      +50 ARENA reward
                    </div>
                  </div>
                  <div className="surface-panel border-emerald-400/15 bg-emerald-400/5 p-4">
                    <Sparkles className="h-5 w-5 text-emerald-300" />
                    <div className="mt-3 text-sm font-semibold text-white">
                      Stronger comeback loop
                    </div>
                  </div>
                </div>

                <Button
                  onClick={onStartChallenge}
                  size="lg"
                  className="mt-5 w-full"
                >
                  Launch today&apos;s challenge
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="section-shell">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Available balance
                </div>
                <div className="mt-3 text-3xl font-black text-white">
                  {arenaBalance.toLocaleString("en-US")} ARENA
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  Ready for picks, rewards, and momentum plays.
                </p>
              </div>

              {onSkip ? (
                <Button variant="outline" className="w-full" onClick={onSkip}>
                  Open my cockpit
                </Button>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
