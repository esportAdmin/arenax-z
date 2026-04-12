import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Flame,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  TimerReset,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";

import { DailyCallsHistory } from "@/components/dashboard/DailyCallsHistory";
import { CountdownPill } from "@/components/engagement/CountdownPill";
import { DailyChallengeModal } from "@/components/engagement/DailyChallengeModal";
import { ReturnNudgeCard } from "@/components/engagement/ReturnNudgeCard";
import { SignalSidebar } from "@/components/predictions/SignalSidebar";
import { GameFilterBar } from "@/components/predictions/GameFilterBar";
import { MatchCard } from "@/components/predictions/MatchCard";
import { MatchOfTheDay } from "@/components/predictions/MatchOfTheDay";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useArenaBalance } from "@/hooks/useArenaBalance";
import { useDailyChallenge } from "@/hooks/useDailyChallenge";
import { useMatches } from "@/hooks/useMatches";
import { useLiveCalls } from "@/hooks/useLiveCalls";
import { getHoursFromNow, getNextUtcMidnight } from "@/lib/countdown";

type GameFilter =
  | "all"
  | "lol"
  | "cs2"
  | "valorant"
  | "dota2"
  | "rl"
  | "pubg"
  | "cod"
  | "r6";

type StatusFilter = "all" | "live" | "upcoming" | "finished";

const LiveCalls = () => {
  const { user } = useAuth();
  const { profile, placing, submitLiveCall } = useLiveCalls();
  const { matches, loading, error } = useMatches({ refreshInterval: 30000 });
  const { completeDailyChallenge } = useArenaBalance();
  const {
    hasCompletedToday,
    isLoading: challengeLoading,
    markChallengeComplete,
  } = useDailyChallenge();

  const [gameFilter, setGameFilter] = useState<GameFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  const filteredMatches = useMemo(() => {
    if (!matches) return [];

    return matches.filter((match) => {
      if (gameFilter !== "all") {
        const gameMap: Record<string, string[]> = {
          lol: ["league of legends", "lol"],
          cs2: ["cs2", "counter-strike", "cs:go", "csgo"],
          valorant: ["valorant"],
          dota2: ["dota 2", "dota2"],
          rl: ["rocket league"],
          pubg: ["pubg"],
          cod: ["call of duty", "cod"],
          r6: ["rainbow six", "r6"],
        };

        const gameNames = gameMap[gameFilter] || [];
        if (!gameNames.some((name) => match.game.toLowerCase().includes(name))) {
          return false;
        }
      }

      if (statusFilter === "live" && !match.isLive) return false;
      if (statusFilter === "upcoming" && (match.isLive || match.isFinished)) {
        return false;
      }
      if (statusFilter === "finished" && !match.isFinished) return false;

      return true;
    });
  }, [gameFilter, matches, statusFilter]);

  const matchOfTheDay = useMemo(() => {
    if (!matches || matches.length === 0) return null;
    const liveMatch = matches.find((match) => match.isLive);
    if (liveMatch) return liveMatch;
    return matches.find((match) => !match.isFinished) || matches[0];
  }, [matches]);

  const liveMatchesCount = matches?.filter((match) => match.isLive).length || 0;
  const upcomingCount =
    matches?.filter((match) => !match.isFinished && !match.isLive).length || 0;
  const totalLiveCalls = profile?.total_live_calls || 0;
  const winRate =
    profile && profile.total_live_calls > 0
      ? Math.round((profile.total_wins / profile.total_live_calls) * 100)
      : 0;
  const nextMatchLock = getHoursFromNow(2);
  const dailyReset = getNextUtcMidnight();

  const handleChallengeComplete = async () => {
    markChallengeComplete();
    await completeDailyChallenge(50);
    setShowChallengeModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-arena space-y-8 pb-10 pt-24">
        <section className="command-frame hero-sheen relative overflow-hidden px-6 py-8 lg:px-10 lg:py-10">
          <div className="subtle-noise absolute inset-0 opacity-50" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(0,245,255,0.16),transparent_55%)]" />

          <div className="relative grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
            <div className="space-y-5">
              <div className="eyebrow-badge">Live call command room</div>

              <div>
                <h1 className="font-display text-4xl font-black tracking-tight text-white lg:text-6xl">
                  Turn live matches into{" "}
                  <span className="gradient-text-primary block">
                    daily comeback rituals.
                  </span>
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 lg:text-lg">
                  This is where urgency, reward, and momentum meet. Players
                  should immediately see a live reason to act, a challenge worth
                  completing, and a history worth defending tomorrow.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="surface-panel border-red-400/20 bg-red-400/10">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-red-200/70">
                    <Flame className="h-4 w-4" />
                    Live now
                  </div>
                  <div className="mt-3 text-3xl font-black text-white">
                    {liveMatchesCount}
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    Matches creating urgency
                  </p>
                </div>

                <div className="surface-panel border-cyan-400/20 bg-cyan-400/10">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-cyan-200/70">
                    <Zap className="h-4 w-4" />
                    ARENA
                  </div>
                  <div className="mt-3 text-3xl font-black text-white">
                    {profile?.arena_balance?.toLocaleString("en-US") || 0}
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    Ready to deploy
                  </p>
                </div>

                <div className="surface-panel border-amber-400/20 bg-amber-400/10">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-amber-200/70">
                    <Trophy className="h-4 w-4" />
                    Track record
                  </div>
                  <div className="mt-3 text-3xl font-black text-white">
                    {totalLiveCalls.toLocaleString("en-US")}
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    Calls logged
                  </p>
                </div>

                <div className="surface-panel border-emerald-400/20 bg-emerald-400/10">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-emerald-200/70">
                    <ShieldCheck className="h-4 w-4" />
                    Win rate
                  </div>
                  <div className="mt-3 text-3xl font-black text-white">
                    {winRate}%
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    Signal quality
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="w-full min-w-0 sm:min-w-[220px] sm:w-auto"
                  onClick={() => setShowChallengeModal(true)}
                  disabled={challengeLoading}
                >
                  {!hasCompletedToday
                    ? "Launch daily challenge"
                    : "Replay challenge flow"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full min-w-0 sm:min-w-[220px] sm:w-auto"
                >
                  {upcomingCount} more matches on deck
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <CountdownPill label="Daily reset" target={dailyReset} />
                <CountdownPill
                  label="Next lock"
                  target={nextMatchLock}
                  tone="rose"
                />
              </div>
            </div>

            <div className="section-shell space-y-4">
              <div className="eyebrow-badge">Comeback mission</div>

              <div className="surface-panel">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Daily pressure
                </div>
                <div className="mt-2 text-xl font-black text-white">
                  {!hasCompletedToday
                    ? "You still have a daily challenge reward to claim."
                    : "Your daily challenge is secured for today."}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Bring the player back with a small, visible win condition
                  before they leave the page.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="surface-panel">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Reward pulse
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-lg font-bold text-white">
                    <Sparkles className="h-4 w-4 text-cyan-300" />
                    +50 ARENA for the daily mission
                  </div>
                </div>

                <div className="surface-panel">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Return logic
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-lg font-bold text-white">
                    <TrendingUp className="h-4 w-4 text-emerald-300" />
                    Protect your history and improve tomorrow
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <ReturnNudgeCard
            icon={Flame}
            label="Live urgency"
            title="The best live-call surfaces feel hot, not archived"
            text="When match lock looks close, users act faster and are more likely to reopen before it closes."
            tone="rose"
            lockedText="Featured signal board opens on the next live slate"
          />
          <ReturnNudgeCard
            icon={LockKeyhole}
            label="Premium lane"
            title="Locked slips make sharp users feel like they are close"
            text="A visible premium path raises curiosity even when it stays gated for now."
            tone="amber"
            lockedText="Insider signal desk unlocks after your next accuracy jump"
          />
          <ReturnNudgeCard
            icon={TimerReset}
            label="Return ritual"
            title="Daily missions work best when they expire on schedule"
            text="A clean cadence turns live calls into a repeat ritual instead of a one-time feature."
            tone="cyan"
            lockedText="Tonight's mission bonus closes at reset"
          />
        </section>

        <section className="section-shell space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="eyebrow-badge">Filter the battlefield</div>
              <h2 className="mt-3 font-display text-3xl font-black text-white">
                Read the board and act fast
              </h2>
            </div>
          </div>

          <GameFilterBar
            activeGame={gameFilter}
            onGameChange={setGameFilter}
            activeStatus={statusFilter}
            onStatusChange={setStatusFilter}
          />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="section-shell space-y-5">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-black text-white">
                Today&apos;s match board
              </h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="text-muted-foreground">Loading matches...</span>
                </div>
              </div>
            ) : null}

            {error ? (
              <div className="glass-card rounded-xl p-8 text-center">
                <p className="text-destructive">Error: {error}</p>
              </div>
            ) : null}

            {!loading && !error ? (
              filteredMatches.length === 0 ? (
                <div className="glass-card rounded-xl p-12 text-center">
                  <TrendingUp className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-muted-foreground">
                    No matches found for these filters.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMatches.map((match, index) => (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      <MatchCard
                        match={match}
                        onSubmitLiveCall={submitLiveCall}
                        isPlacing={placing}
                        userBalance={profile?.arena_balance ?? 0}
                        isAuthenticated={!!user}
                      />
                    </motion.div>
                  ))}
                </div>
              )
            ) : null}
          </div>

          <div className="space-y-6">
            {matchOfTheDay ? <MatchOfTheDay match={matchOfTheDay} /> : null}
            <SignalSidebar matches={matches || []} />
            {user ? <DailyCallsHistory /> : null}
          </div>
        </section>
      </div>

      <DailyChallengeModal
        isOpen={showChallengeModal}
        onComplete={handleChallengeComplete}
        userName={user?.email || "Commander"}
        currentStreak={profile?.total_wins || 0}
      />
    </div>
  );
};

export default LiveCalls;
