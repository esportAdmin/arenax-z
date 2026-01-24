"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

// Imports des composants et hooks existants
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DailyProPick } from "@/components/dashboard/DailyProPick";
import { DailyPicksHistory } from "@/components/dashboard/DailyPicksHistory";
import { RecentPredictions } from "@/components/dashboard/RecentPredictions";
import { StakingOverview } from "@/components/dashboard/StakingOverview";
import { StreakDisplay } from "@/components/dashboard/StreakDisplay";
import { DailyChallengesCard } from "@/components/challenges/DailyChallengesCard";
import { DailyChallengeModal } from "@/components/engagement/DailyChallengeModal";
import { WelcomeBackScreen } from "@/components/engagement/WelcomeBackScreen";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { useDailyChallenge } from "@/hooks/useDailyChallenge";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAuth } from "@/contexts/AuthContext";
import { useArenaBalance } from "@/hooks/useArenaBalance";
import { supabase } from "@/integrations/supabase/client";
import { FEATURES } from "@/config/features";
import { logger } from "@/lib/logger";

// ASSETS
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
        .eq("user_id", user.id)
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
      if (hasCompletedToday) setEngagementStep("dashboard");
      else setEngagementStep("welcome");
    }
  }, [hasCompletedToday, challengeLoading, isLoadingProfile]);

  const handleStartChallenge = () => {
    setEngagementStep("challenge");
  };

  const handleChallengeComplete = async (
    selections: Record<number, string>,
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
          .eq("user_id", user.id)
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const level = Math.floor((profile?.arena_score || 0) / 1000) + 1;
  const pointsInLevel = (profile?.arena_score || 0) % 1000;
  const pointsToNextLevel = 1000 - pointsInLevel;
  const globalRank = 42;

  if (engagementStep === "welcome") {
    return (
      <WelcomeBackScreen
        userName={profile?.display_name || "Champion"}
        arenaScore={profile?.arena_score || 0}
        arenaBalance={arenaBalance}
        globalRank={globalRank}
        streak={arenaStreak}
        accuracy={profile?.prediction_accuracy || 0}
        level={level}
        pointsToNextLevel={pointsToNextLevel}
        nextLevelPoints={1000}
        onStartChallenge={handleStartChallenge}
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
          userName={profile?.display_name || "Champion"}
          currentStreak={arenaStreak}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      <OnboardingWizard open={showOnboarding} onComplete={completeOnboarding} />

      <main className="pb-12 relative z-10">
        <div className="container-arena">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center md:items-start justify-between gap-6 mb-8"
          >
            <div className="flex flex-col items-center md:items-start gap-2 w-full">
              <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm w-full md:w-auto justify-center md:justify-start">
                <img
                  src={ARENAX_LOGO_URL}
                  alt="ArenaX Logo"
                  className="h-10 w-auto object-contain"
                />
                <div className="h-8 w-[1px] bg-white/20 mx-2 hidden md:block" />
                <span className="text-primary font-display font-bold tracking-widest text-sm md:text-base hidden md:block">
                  L&apos;AVENIR SE JOUE ICI
                </span>
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col md:items-end gap-4">
              <h1 className="font-display font-bold text-2xl md:text-3xl text-white text-center md:text-right">
                Welcome back,{" "}
                <span className="gradient-text-primary">
                  {profile?.display_name || "Champion"}
                </span>
              </h1>

              <div className="flex items-center gap-2 justify-center md:justify-end">
                <Button variant="glass" size="icon" aria-label="Notifications">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button variant="glass" size="icon" aria-label="Settings">
                  <Settings className="w-4 h-4" />
                </Button>

                <Button
                  variant="glass"
                  size="icon"
                  asChild
                  aria-label="Profile"
                >
                  <Link href="/profile">
                    <User className="w-4 h-4" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                  onClick={handleLogout}
                  aria-label="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {FEATURES.DASHBOARD_STATS && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <DashboardStats />
            </motion.div>
          )}

          <div
            className={`grid gap-6 ${
              FEATURES.STREAKS ||
              FEATURES.CHALLENGES ||
              FEATURES.STAKING ||
              FEATURES.QUICK_ACTIONS
                ? "lg:grid-cols-3"
                : "lg:grid-cols-1 max-w-4xl mx-auto"
            }`}
          >
            <div
              className={`${
                FEATURES.STREAKS ||
                FEATURES.CHALLENGES ||
                FEATURES.STAKING ||
                FEATURES.QUICK_ACTIONS
                  ? "lg:col-span-2"
                  : ""
              } space-y-6`}
            >
              {FEATURES.DAILY_PICK && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <DailyProPick />
                </motion.div>
              )}

              {FEATURES.DAILY_PICK && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <DailyPicksHistory />
                </motion.div>
              )}

              {FEATURES.RECENT_PREDICTIONS && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <RecentPredictions />
                </motion.div>
              )}
            </div>

            {(FEATURES.STREAKS ||
              FEATURES.CHALLENGES ||
              FEATURES.STAKING ||
              FEATURES.QUICK_ACTIONS) && (
              <div className="space-y-6">
                {FEATURES.STREAKS && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <StreakDisplay />
                  </motion.div>
                )}

                {FEATURES.CHALLENGES && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <DailyChallengesCard />
                  </motion.div>
                )}

                {FEATURES.STAKING && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <StakingOverview />
                  </motion.div>
                )}

                {FEATURES.QUICK_ACTIONS && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-4 border border-white/5"
                  >
                    <h3 className="font-display font-bold mb-4 text-white">
                      Quick Actions
                    </h3>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                      >
                        🎯 Browse Predictions
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                      >
                        🏆 View Leaderboard
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                      >
                        💰 Stake More AXT
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                      >
                        🎮 Join a Club
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
