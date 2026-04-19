"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BellRing,
  LogOut,
  LockKeyhole,
  Shield,
  Sparkles,
  Swords,
  TimerReset,
  User,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { DailyChallengesCard } from "@/components/challenges/DailyChallengesCard";
import { DailyCallsHistory } from "@/components/dashboard/DailyCallsHistory";
import { DailyLiveCalls } from "@/components/dashboard/DailyLiveCalls";
import { StreakDisplay } from "@/components/dashboard/StreakDisplay";
import { CountdownPill } from "@/components/engagement/CountdownPill";
import { DailyChallengeModal } from "@/components/engagement/DailyChallengeModal";
import { ReturnNudgeCard } from "@/components/engagement/ReturnNudgeCard";
import { WelcomeBackScreen } from "@/components/engagement/WelcomeBackScreen";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useArenaBalance } from "@/hooks/useArenaBalance";
import { useDailyChallenge } from "@/hooks/useDailyChallenge";
import { useOnboarding } from "@/hooks/useOnboarding";
import { supabase } from "@/integrations/supabase/client";
import { getHoursFromNow, getNextUtcMidnight } from "@/lib/countdown";
import { logger } from "@/lib/logger";

const ARENAX_LOGO_URL =
  "https://z-cdn-media.chatglm.cn/files/34ef6f84-17d0-4331-90ac-2d97f265ebf6.png?auth_key=1868291827-dfaf2544b3f0458092a5318d7a8b73b0-0-331d62be4877ec51612406e8aa7da621";

interface UserProfile {
  display_name: string;
  arena_score: number;
  arena_balance: number;
  active_streak: number;
  prediction_accuracy: number;
  total_predictions: number;
}

type RawProfile = {
  display_name: string | null;
  arena_score: number;
  arena_balance: number;
  active_streak: number;
  prediction_accuracy: number | null;
  total_predictions: number;
};

function normalizeProfile(data: RawProfile | null): UserProfile {
  if (!data) {
    return {
      display_name: "Champion",
      arena_score: 0,
      arena_balance: 500,
      active_streak: 0,
      prediction_accuracy: 0,
      total_predictions: 0,
    };
  }

  return {
    display_name: data.display_name ?? "Champion",
    arena_score: data.arena_score ?? 0,
    arena_balance: data.arena_balance ?? 0,
    active_streak: data.active_streak ?? 0,
    prediction_accuracy: data.prediction_accuracy ?? 0,
    total_predictions: data.total_predictions ?? 0,
  };
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const {
    hasCompletedToday,
    isLoading: challengeLoading,
    markChallengeComplete,
  } = useDailyChallenge();

  const {
    showOnboarding,
    completeOnboarding,
    loading: onboardingLoading,
  } = useOnboarding();

  const {
    balance: arenaBalance,
    streak: arenaStreak,
    completeDailyChallenge,
  } = useArenaBalance();

  const [engagementStep, setEngagementStep] = useState<
    "welcome" | "challenge" | "dashboard"
  >("welcome");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const handleLogout = async () => {
    await signOut();
    router.replace("/auth");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setIsLoadingProfile(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "display_name, arena_score, arena_balance, active_streak, prediction_accuracy, total_predictions",
        )
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        logger.error("Error fetching profile:", error);
      }

      setProfile(normalizeProfile(data as RawProfile | null));
      setIsLoadingProfile(false);
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (!challengeLoading && !isLoadingProfile) {
      setEngagementStep(hasCompletedToday ? "dashboard" : "welcome");
    }
  }, [challengeLoading, hasCompletedToday, isLoadingProfile]);

  const handleStartChallenge = () => {
    setEngagementStep("challenge");
  };

  const handleChallengeComplete = async (
    _selections: Record<number, string>,
  ) => {
    markChallengeComplete();

    const success = await completeDailyChallenge(50);

    if (success) {
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select(
            "display_name, arena_score, arena_balance, active_streak, prediction_accuracy, total_predictions",
          )
          .eq("id", user.id)
          .maybeSingle();

        setProfile(normalizeProfile(data as RawProfile | null));
      }

      setEngagementStep("dashboard");
    } else {
      logger.error("Failed to complete daily challenge");
    }
  };

  if (challengeLoading || isLoadingProfile || onboardingLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const level = Math.floor((profile?.arena_score || 0) / 1000) + 1;
  const pointsInLevel = (profile?.arena_score || 0) % 1000;
  const pointsToNextLevel = 1000 - pointsInLevel;
  const progressToLevel = ((1000 - pointsToNextLevel) / 1000) * 100;
  const globalRank = 42;
  const accuracy = profile?.prediction_accuracy || 0;
  const displayName = profile?.display_name || "Champion";
  const dailyReset = getNextUtcMidnight();
  const nextCommandPulse = getHoursFromNow(4);

  if (engagementStep === "welcome") {
    return (
      <WelcomeBackScreen
        userName={displayName}
        arenaScore={profile?.arena_score || 0}
        arenaBalance={arenaBalance}
        globalRank={globalRank}
        streak={arenaStreak}
        accuracy={accuracy}
        level={level}
        pointsToNextLevel={pointsToNextLevel}
        nextLevelPoints={1000}
        onStartChallenge={handleStartChallenge}
        onSkip={() => setEngagementStep("dashboard")}
      />
    );
  }

  if (engagementStep === "challenge") {
    return (
      <>
        <div className="min-h-screen bg-background" />
        <DailyChallengeModal
          isOpen={true}
          onComplete={handleChallengeComplete}
          userName={displayName}
          currentStreak={arenaStreak}
        />
      </>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-[460px] w-[460px] rounded-full bg-cyan-500/8 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[460px] w-[460px] rounded-full bg-fuchsia-500/8 blur-[120px]" />
      </div>

      <OnboardingWizard open={showOnboarding} onComplete={completeOnboarding} />

      <main className="relative z-10 pb-12 pt-24">
        <div className="container-arena space-y-8">
          <div className="surface-panel flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
            <div className="flex items-center gap-3">
              <div className="hero-sheen flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/12">
                <img
                  src={ARENAX_LOGO_URL}
                  alt="ArenaX Logo"
                  className="h-8 w-auto object-contain"
                />
              </div>

              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">
                  Daily command cockpit
                </div>
                <div className="text-xl font-display font-bold text-white">
                  ArenaX personal command center
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <NotificationCenter />

              <Button variant="glass" size="icon" asChild aria-label="Profile">
                <Link href="/profile">
                  <User className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="border-red-500/30 text-destructive hover:bg-red-500/10 hover:text-red-400"
                onClick={handleLogout}
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="command-frame hero-sheen relative overflow-hidden px-6 py-8 lg:px-10 lg:py-10"
          >
            <div className="subtle-noise absolute inset-0 opacity-40" />
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(0,245,255,0.16),transparent_55%)]" />

            <div className="relative grid gap-8 xl:grid-cols-[1.45fr_0.85fr]">
              <div className="space-y-5">
                <div className="eyebrow-badge">Daily return mission</div>

                <div>
                  <h1 className="font-display text-4xl font-black tracking-tight text-white lg:text-6xl">
                    Welcome back,
                    <span className="gradient-text-primary block">
                      {displayName}
                    </span>
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 lg:text-lg">
                    This cockpit should tell you what matters right now: whether
                    your streak is safe, what reward is next, and which action
                    gets you back into the loop fastest.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="surface-panel border-cyan-400/20 bg-cyan-400/10">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-cyan-200/70">
                      <Zap className="h-4 w-4" />
                      ARENA
                    </div>
                    <div className="mt-3 text-3xl font-black text-white">
                      {arenaBalance.toLocaleString("en-US")}
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      Deployable balance
                    </p>
                  </div>

                  <div className="surface-panel border-amber-400/20 bg-amber-400/10">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-amber-200/70">
                      <Sparkles className="h-4 w-4" />
                      Level
                    </div>
                    <div className="mt-3 text-3xl font-black text-white">
                      {level}
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      {pointsToNextLevel} points to the next unlock
                    </p>
                  </div>

                  <div className="surface-panel border-emerald-400/20 bg-emerald-400/10">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-emerald-200/70">
                      <Shield className="h-4 w-4" />
                      Accuracy
                    </div>
                    <div className="mt-3 text-3xl font-black text-white">
                      {accuracy.toFixed(0)}%
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      Current signal quality
                    </p>
                  </div>

                  <div className="surface-panel border-fuchsia-400/20 bg-fuchsia-400/10">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-fuchsia-200/70">
                      <Swords className="h-4 w-4" />
                      Global rank
                    </div>
                    <div className="mt-3 text-3xl font-black text-white">
                      #{globalRank}
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      Prestige snapshot
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="w-full min-w-0 sm:min-w-[210px] sm:w-auto"
                  >
                    <Link href="/live-calls">
                      Open live calls
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full min-w-0 sm:min-w-[210px] sm:w-auto"
                    onClick={handleStartChallenge}
                  >
                    {hasCompletedToday
                      ? "Replay daily challenge"
                      : "Start daily challenge"}
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <CountdownPill label="Daily reset" target={dailyReset} />
                  <CountdownPill
                    label="Command pulse"
                    target={nextCommandPulse}
                    tone="amber"
                  />
                </div>
              </div>

              <div className="section-shell space-y-4">
                <div className="eyebrow-badge">Today&apos;s status</div>

                <div className="surface-panel">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Streak pressure
                  </div>
                  <div className="mt-2 text-xl font-black text-white">
                    {arenaStreak > 0
                      ? `${arenaStreak}-day streak is active`
                      : "No active streak yet"}
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    The fastest way to protect retention is to make streak loss
                    feel visible before the player leaves.
                  </p>
                </div>

                <div className="surface-panel">
                  <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                    <span>Level progress</span>
                    <span>{Math.round(progressToLevel)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-fuchsia-400"
                      style={{ width: `${progressToLevel}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-slate-400">
                    Next unlock in {pointsToNextLevel} score points.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <Button
                    asChild
                    className="h-auto justify-between py-4"
                    variant="outline"
                  >
                    <Link href="/rewards">
                      Review rewards
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    className="h-auto justify-between py-4"
                    variant="outline"
                  >
                    <Link href="/leaderboard">
                      Check prestige ladder
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.section>

          <section className="grid gap-4 md:grid-cols-3">
            <ReturnNudgeCard
              icon={BellRing}
              label="Return alert"
              title="The cockpit should explain why opening now matters"
              text="When a user lands here, the page should immediately answer: what changed, what is at risk, and what is worth claiming."
              tone="cyan"
              lockedText="Prime comeback alert unlocks after your next challenge streak"
            />
            <ReturnNudgeCard
              icon={LockKeyhole}
              label="Locked value"
              title="Premium rewards should stay close enough to feel tangible"
              text="The fastest way to reduce churn is to keep the next premium state emotionally nearby."
              tone="amber"
              lockedText="Executive command skin unlocks after the next level jump"
            />
            <ReturnNudgeCard
              icon={TimerReset}
              label="Session pressure"
              title="A visible timer turns passive browsing into intent"
              text="If the reset is visible, the player knows this session still matters."
              tone="rose"
              lockedText="Tonight's protected streak window closes at reset"
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
              >
                <DailyLiveCalls />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
              >
                <DailyCallsHistory />
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
              >
                <StreakDisplay />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <DailyChallengesCard />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24 }}
                className="section-shell"
              >
                <div className="eyebrow-badge">Quick launch actions</div>
                <div className="mt-4 grid gap-3">
                  <Button asChild variant="outline" className="justify-between">
                    <Link href="/live-calls">
                      Browse live calls
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="justify-between">
                    <Link href="/profile">
                      Open profile
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="justify-between">
                    <Link href="/clubs">
                      Explore clubs
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
