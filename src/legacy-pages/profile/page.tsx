"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Coins,
  Flame,
  LockKeyhole,
  Loader2,
  Radar,
  Shield,
  Sparkles,
  TimerReset,
  Trophy,
} from "lucide-react";

import { StreakDisplay } from "@/components/dashboard/StreakDisplay";
import { CountdownPill } from "@/components/engagement/CountdownPill";
import { ReturnNudgeCard } from "@/components/engagement/ReturnNudgeCard";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { LevelProgress } from "@/components/profile/LevelProgress";
import { LevelUpCelebration } from "@/components/profile/LevelUpCelebration";
import { LiveCallHistoryPanel } from "@/components/profile/LiveCallHistoryPanel";
import { ProfileBadges } from "@/components/profile/ProfileBadges";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { MmrProgressChart } from "@/components/ranked/MmrProgressChart";
import { RankedSection } from "@/components/ranked/RankedSection";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLevelUp } from "@/hooks/useLevelUp";
import { useProfile } from "@/hooks/useProfile";
import { getHoursFromNow, getNextUtcMidnight } from "@/lib/countdown";

export default function Profile() {
  const { loading: authLoading } = useAuth();
  const {
    profile,
    userBadges,
    liveCalls,
    loading,
    xpForNextLevel,
    updateProfile,
  } = useProfile();

  const {
    showCelebration,
    celebrationLevel,
    closeCelebration,
    triggerCelebration,
  } = useLevelUp({
    currentLevel: profile?.current_level ?? 1,
    enabled: !!profile,
  });

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pb-12 pt-24">
          <div className="container-arena py-20 text-center">
            <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-slate-950/60 p-8">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                Commander identity
              </div>
              <h1 className="mt-4 text-3xl font-display font-black text-white">
                Reconnect to reopen your profile
              </h1>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                Your ArenaX-Z profile depends on your active Discord or Twitch
                session. Re-authenticate to restore your progression, streak,
                and prestige data.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button asChild size="lg">
                  <Link href="/login">Continue with Discord</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/dashboard">Back to dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const xpRemaining = Math.max(xpForNextLevel - profile.current_xp, 0);
  const nextProfilePulse = getHoursFromNow(8);
  const dailyReset = getNextUtcMidnight();

  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <LevelUpCelebration
        isVisible={showCelebration}
        newLevel={celebrationLevel}
        onComplete={closeCelebration}
      />
      <Navbar />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[10%] h-[28rem] w-[28rem] rounded-full bg-cyan-400/10 blur-[9rem]" />
        <div className="absolute right-[4%] top-[18%] h-[30rem] w-[30rem] rounded-full bg-orange-500/10 blur-[10rem]" />
        <div className="absolute bottom-[4%] left-[28%] h-[24rem] w-[24rem] rounded-full bg-fuchsia-500/8 blur-[9rem]" />
      </div>

      <main className="relative z-10 pb-12 pt-24">
        <div className="container-arena space-y-8">
          <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="command-frame hero-sheen relative overflow-hidden px-6 py-8 lg:px-10 lg:py-10"
          >
            <div className="subtle-noise absolute inset-0 opacity-50" />
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(0,245,255,0.16),transparent_55%)]" />

            <div className="relative grid gap-8 lg:grid-cols-[1.5fr_0.85fr]">
              <div className="space-y-5">
                <div className="eyebrow-badge">Commander profile signal</div>

                <div>
                  <h1 className="font-display text-4xl font-black tracking-tight text-white lg:text-6xl">
                    Build a profile{" "}
                    <span className="gradient-text-primary block">
                      players remember.
                    </span>
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 lg:text-lg">
                    Your profile is now a live command board for prestige,
                    streak pressure, season status, and the next unlock worth
                    coming back for.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="surface-panel border-cyan-400/20 bg-cyan-400/10">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-cyan-200/70">
                      <Shield className="h-4 w-4" />
                      Level
                    </div>
                    <div className="mt-3 text-3xl font-black text-white">
                      {profile.current_level}
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      {xpRemaining.toLocaleString("en-US")} XP to the next unlock
                    </p>
                  </div>

                  <div className="surface-panel border-amber-400/20 bg-amber-400/10">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-amber-200/70">
                      <Flame className="h-4 w-4" />
                      Streak
                    </div>
                    <div className="mt-3 text-3xl font-black text-white">
                      {profile.active_streak}
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      Daily return momentum
                    </p>
                  </div>

                  <div className="surface-panel border-emerald-400/20 bg-emerald-400/10">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-emerald-200/70">
                      <Coins className="h-4 w-4" />
                      Balance
                    </div>
                    <div className="mt-3 text-3xl font-black text-white">
                      {profile.arena_balance.toLocaleString("en-US")}
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      Ready for rewards
                    </p>
                  </div>

                  <div className="surface-panel border-fuchsia-400/20 bg-fuchsia-400/10">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-fuchsia-200/70">
                      <Radar className="h-4 w-4" />
                      Season rank
                    </div>
                    <div className="mt-3 text-3xl font-black text-white">
                      {profile.last_season_rank ? `#${profile.last_season_rank}` : "--"}
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      Last confirmed placement
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="min-h-12 w-full min-w-0 rounded-full px-5 text-center text-sm font-black uppercase tracking-[0.12em] sm:min-w-[220px] sm:w-auto"
                  >
                    <Link href="/live-calls" prefetch={false}>
                      Make today&apos;s live calls
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="min-h-12 w-full min-w-0 rounded-full px-5 text-center text-sm font-black uppercase tracking-[0.12em] sm:min-w-[240px] sm:w-auto"
                  >
                    <Link href="/rewards" prefetch={false}>
                      Claim progression rewards
                    </Link>
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <CountdownPill label="Daily reset" target={dailyReset} />
                  <CountdownPill
                    label="Profile pulse"
                    target={nextProfilePulse}
                    tone="amber"
                  />
                </div>
              </div>

              <div className="section-shell space-y-4">
                <div className="eyebrow-badge">Return triggers</div>

                <div className="surface-panel">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Comeback reason
                  </div>
                  <div className="mt-2 text-xl font-black text-white">
                    Protect your streak and push your level tonight.
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    The strongest habit loops show the player what matters
                    right now, not later.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="surface-panel">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Season prestige
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-lg font-bold text-white">
                      <Trophy className="h-4 w-4 text-amber-300" />
                      {profile.season_wins > 0
                        ? `${profile.season_wins} season title${profile.season_wins > 1 ? "s" : ""}`
                        : "No title yet"}
                    </div>
                  </div>

                  <div className="surface-panel">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Read quality
                    </div>
                    <div className="mt-2 text-lg font-bold text-white">
                      {(profile.prediction_accuracy ?? 0).toFixed(1)}% read quality
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <section className="grid gap-4 md:grid-cols-3">
            <ReturnNudgeCard
              icon={Flame}
              label="Streak protection"
              title="Your next session should feel pre-decided"
              text="A player who can see what they lose by leaving is more likely to come back before the reset."
              tone="rose"
              lockedText="Inferno profile aura unlocks after the next 3-day push"
            />
            <ReturnNudgeCard
              icon={LockKeyhole}
              label="Identity upgrade"
              title="Locked profile cosmetics create aspiration"
              text="Badges, frames, and elite status markers make progression feel social, not just numerical."
              tone="amber"
              lockedText="Commander frame unlocks at the next profile tier"
            />
            <ReturnNudgeCard
              icon={TimerReset}
              label="Return timing"
              title="Short windows are better than vague promises"
              text="A visible timer gives the next session a deadline, which makes the app easier to reopen with intent."
              tone="cyan"
              lockedText="Tonight's fast-track bonus closes at reset"
            />
          </section>

          <div className="space-y-6">
            <ProfileHeader profile={profile} onUpdateProfile={updateProfile} />

            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <StreakDisplay />

              <LevelProgress
                currentLevel={profile.current_level}
                currentXp={profile.current_xp}
                xpForNextLevel={xpForNextLevel}
              />
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => triggerCelebration(profile.current_level + 1)}
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Preview level-up animation
              </Button>
            </div>

            <ProfileStats profile={profile} totalBadges={userBadges.length} />

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <RankedSection />

              <div className="section-shell space-y-4">
                <div className="eyebrow-badge">Next best actions</div>

                <div className="surface-panel">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Fastest win
                  </div>
                  <div className="mt-2 text-xl font-black text-white">
                    Make one live call and keep the streak alive.
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    Small daily actions are what create habit loops. Push the
                    player back into a meaningful decision within seconds.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <Button
                    asChild
                    className="min-h-12 justify-between rounded-2xl px-4 py-4 text-left"
                  >
                    <Link href="/war-map" prefetch={false}>
                      Open war command
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="min-h-12 justify-between rounded-2xl px-4 py-4 text-left"
                  >
                    <Link href="/leaderboard" prefetch={false}>
                      Check prestige ladder
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <MmrProgressChart />

            <div className="grid gap-6 lg:grid-cols-2">
              <LiveCallHistoryPanel liveCalls={liveCalls} />
              <ProfileBadges userBadges={userBadges} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
