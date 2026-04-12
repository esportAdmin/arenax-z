"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";

import { CountdownPill } from "@/components/engagement/CountdownPill";
import { Button } from "@/components/ui/button";
import { useMatches, Match } from "@/hooks/useMatches";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { isLocalQaUser } from "@/lib/dev-auth";
import { playClickIfEnabled, playSuccessIfEnabled } from "@/lib/sounds";
import { getNextUtcMidnight } from "@/lib/countdown";
import { toast } from "sonner";

const triggerMiniConfetti = () => {
  confetti({
    particleCount: 30,
    spread: 60,
    origin: { y: 0.7 },
    colors: ["#22d3ee", "#3b82f6", "#d946ef"],
    scalar: 0.8,
    gravity: 1.2,
    decay: 0.92,
  });
};

const triggerSuccessConfetti = () => {
  const duration = 1800;
  const animationEnd = Date.now() + duration;
  const randomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    confetti({
      particleCount: 50,
      startVelocity: 30,
      spread: 360,
      origin: {
        x: randomInRange(0.2, 0.8),
        y: randomInRange(0.2, 0.5),
      },
      colors: ["#22d3ee", "#3b82f6", "#22c55e", "#f59e0b", "#d946ef"],
    });
  }, 180);
};

const getTimeUntilReset = () => {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

interface DailyPickData {
  id: string;
  matches: Array<{
    matchId: string;
    teamA: string;
    teamB: string;
    selectedTeam: string;
    signalWeight: number;
  }>;
  total_potential_reward: number;
  status: string;
}

const FALLBACK_DAILY_PICK_RECORD: DailyPickData = {
  id: "fallback-daily-pick",
  matches: [],
  total_potential_reward: 0,
  status: "pending",
};

export function DailyLiveCalls() {
  const { user } = useAuth();
  const { matches, loading, error } = useMatches({
    filter: "upcoming",
    refreshInterval: 60000,
  });

  const [currentPick, setCurrentPick] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [justSelected, setJustSelected] = useState<string | null>(null);
  const [todaysPick, setTodaysPick] = useState<DailyPickData | null>(null);
  const [checkingPick, setCheckingPick] = useState(true);
  const isLocalQa = isLocalQaUser(user);

  useEffect(() => {
    const checkTodaysPick = async () => {
      if (!user) {
        setCheckingPick(false);
        return;
      }

      if (isLocalQa) {
        setTodaysPick(null);
        setIsCompleted(false);
        setCheckingPick(false);
        return;
      }

      try {
        const today = new Date().toISOString().split("T")[0];
        const { data, error } = await supabase
          .from("daily_pro_picks")
          .select("*")
          .eq("user_id", user.id)
          .eq("pick_date", today)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (data) {
          setTodaysPick({
            id: data.id,
            matches: data.matches as DailyPickData["matches"],
            total_potential_reward: data.total_potential_reward,
            status: data.status,
          });
          setIsCompleted(true);
        }
      } catch {
        setTodaysPick(null);
      } finally {
        setCheckingPick(false);
      }
    };

    void checkTodaysPick();
  }, [isLocalQa, user]);

  const dailyMatches = useMemo(() => {
    if (!matches.length) return [];

    const uniqueTournaments = new Map<string, Match>();
    const selected: Match[] = [];

    for (const match of matches) {
      if (!uniqueTournaments.has(match.tournament) && selected.length < 3) {
        uniqueTournaments.set(match.tournament, match);
        selected.push(match);
      }
    }

    if (selected.length < 3) {
      for (const match of matches) {
        if (!selected.includes(match) && selected.length < 3) {
          selected.push(match);
        }
      }
    }

    return selected;
  }, [matches]);

  const handleSelect = useCallback((matchId: string, teamName: string) => {
    playClickIfEnabled();
    setJustSelected(teamName);
    triggerMiniConfetti();
    setSelections((prev) => ({ ...prev, [matchId]: teamName }));
    window.setTimeout(() => setJustSelected(null), 600);
  }, []);

  const projectedImpact = useMemo(() => {
    let totalSignalWeight = 1;
    for (const matchId in selections) {
      const match = dailyMatches.find((item) => item.id === matchId);
      if (match) {
        const selectedTeam = selections[matchId];
        const signalWeight =
          selectedTeam === match.teamA.name
            ? match.teamA.signalScore / 100
            : match.teamB.signalScore / 100;
        totalSignalWeight *= signalWeight;
      }
    }
    return Math.round(50 * totalSignalWeight);
  }, [dailyMatches, selections]);

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to submit your live calls.");
      return;
    }

    if (isLocalQa) {
      const matchesData = dailyMatches.map((match) => ({
        matchId: match.id,
        teamA: match.teamA.name,
        teamB: match.teamB.name,
        selectedTeam: selections[match.id],
        signalWeight:
          selections[match.id] === match.teamA.name
            ? match.teamA.signalScore / 100
            : match.teamB.signalScore / 100,
      }));

      setTodaysPick({
        id: "qa-daily-pick",
        matches: matchesData,
        total_potential_reward: projectedImpact,
        status: "pending",
      });
      setIsCompleted(true);
      playSuccessIfEnabled();
      triggerSuccessConfetti();
      toast.success("Daily call set secured in local QA mode.");
      return;
    }

    setIsSubmitting(true);

    try {
      const matchesData = dailyMatches.map((match) => ({
        matchId: match.id,
        teamA: match.teamA.name,
        teamB: match.teamB.name,
        selectedTeam: selections[match.id],
        signalWeight:
          selections[match.id] === match.teamA.name
            ? match.teamA.signalScore / 100
            : match.teamB.signalScore / 100,
      }));

      const { data, error } = await supabase
        .from("daily_pro_picks")
        .insert({
          user_id: user.id,
          matches: matchesData,
          total_potential_reward: projectedImpact,
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          toast.error("You already locked today's daily call set.");
        } else {
          throw error;
        }
        return;
      }

      setTodaysPick({
        id: data?.id ?? FALLBACK_DAILY_PICK_RECORD.id,
        matches: matchesData,
        total_potential_reward: projectedImpact,
        status: data?.status ?? FALLBACK_DAILY_PICK_RECORD.status,
      });
      setIsCompleted(true);
      playSuccessIfEnabled();
      triggerSuccessConfetti();
      toast.success("Daily call set saved. Good luck.");
    } catch {
      toast.error("We could not save your live calls. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const allSelected =
    dailyMatches.length > 0 &&
    Object.keys(selections).length === dailyMatches.length;
  const currentMatch = dailyMatches[currentPick];
  const currentSelection = currentMatch ? selections[currentMatch.id] : undefined;

  if (loading || checkingPick) {
    return (
      <div className="section-shell p-8 text-center">
        <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading today's live calls...</p>
      </div>
    );
  }

  if (error || dailyMatches.length === 0) {
    return (
      <div className="section-shell p-8 text-center">
        <AlertCircle className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground">
          {error || "No eligible matches are available right now."}
        </p>
      </div>
    );
  }

  if (isCompleted && todaysPick) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="section-shell relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,245,255,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(217,70,239,0.10),transparent_35%)]" />

        <div className="relative text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 ring-4 ring-emerald-400/10">
            <Trophy className="h-10 w-10 text-emerald-300" />
          </div>

          <h3 className="font-display text-2xl font-black text-white">
            Daily call set secured
          </h3>
          <p className="mt-2 text-slate-400">
            Your calls are locked in. Now the loop shifts from action to anticipation.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="surface-panel p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Potential reward
              </div>
              <div className="mt-2 text-2xl font-black text-cyan-300">
                +{todaysPick.total_potential_reward} ARENA
              </div>
            </div>
            <div className="surface-panel p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Status
              </div>
              <div className="mt-2 text-2xl font-black capitalize text-white">
                {todaysPick.status}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {todaysPick.matches.map((match, index) => (
              <div key={`${match.matchId}-${index}`} className="surface-panel p-3 text-sm">
                <span className="text-slate-400">
                  {match.teamA} vs {match.teamB}
                </span>
                <span className="mx-2 text-slate-600">|</span>
                <span className="font-semibold text-cyan-300">
                  {match.selectedTeam}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Return tomorrow to lock the next set.
          </p>
          <div className="mt-4 flex justify-center">
            <CountdownPill label="Next mission" target={getNextUtcMidnight()} tone="cyan" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="section-shell overflow-hidden">
      <div className="border-b border-white/8 bg-gradient-to-r from-cyan-500/10 to-transparent p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-cyan-400/10 p-3">
              <Zap className="h-6 w-6 text-cyan-300" />
            </div>
            <div>
              <div className="eyebrow-badge">Daily comeback mission</div>
              <h3 className="mt-3 font-display text-2xl font-black text-white">
                Daily live call set
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Lock three sharp calls before reset and build a habit around anticipation.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="metal-chip">
              <Clock className="h-4 w-4" />
              Resets in {getTimeUntilReset()}
            </div>
            <CountdownPill label="Hard reset" target={getNextUtcMidnight()} tone="cyan" />
          </div>
        </div>
      </div>

      <div className="border-b border-white/8 px-5 py-4">
        <div className="mb-2 flex justify-between text-xs text-slate-500">
          <span>
            Pick {currentPick + 1}/{dailyMatches.length}
          </span>
          <span>{Object.keys(selections).length} locked</span>
        </div>
        <div className="flex gap-2">
          {dailyMatches.map((match, index) => (
            <div
              key={match.id}
              className={`h-2 flex-1 rounded-full ${
                selections[match.id]
                  ? "bg-cyan-400"
                  : index === currentPick
                    ? "bg-cyan-400/40"
                    : "bg-white/8"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-5">
        <motion.div
          key={currentMatch?.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {currentMatch?.game}
              </div>
              <h4 className="mt-2 font-display text-2xl font-black text-white">
                Who wins this one?
              </h4>
              <p className="mt-1 text-sm text-slate-400">
                {currentMatch?.time} | {currentMatch?.date}
              </p>
            </div>

            <div className="metal-chip">{currentMatch?.tournament}</div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {currentMatch
              ? [currentMatch.teamA, currentMatch.teamB].map((team, index) => {
                  const isSelected = currentSelection === team.name;

                  return (
                    <motion.button
                      key={team.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleSelect(currentMatch.id, team.name)}
                      className={`relative overflow-hidden rounded-[24px] border p-5 text-left transition-all ${
                        isSelected
                          ? "border-cyan-400/30 bg-cyan-400/10 shadow-[0_0_28px_rgba(34,211,238,0.12)]"
                          : "border-white/10 bg-white/[0.03] hover:border-white/20"
                      }`}
                    >
                      <AnimatePresence>
                        {justSelected === team.name ? (
                          <motion.div
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 3, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.45 }}
                            className="absolute inset-0 rounded-full bg-cyan-400/20"
                            style={{ originX: 0.5, originY: 0.5 }}
                          />
                        ) : null}
                      </AnimatePresence>

                      <div className="relative z-10">
                        <div className="text-4xl">{team.logo}</div>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div>
                            <div className="text-xl font-black text-white">
                              {team.name}
                            </div>
                            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm font-semibold text-cyan-300">
                              {team.signalScore} signal
                            </div>
                          </div>

                          {isSelected ? (
                            <CheckCircle2 className="h-6 w-6 text-cyan-300" />
                          ) : null}
                        </div>
                      </div>
                    </motion.button>
                  );
                })
              : null}
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_0.9fr]">
            <div className="surface-panel p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Reward projection
              </div>
              <div className="mt-2 text-3xl font-black text-cyan-300">
                +{projectedImpact} ARENA
              </div>
              <p className="mt-2 text-sm text-slate-400">
                Multiplied across your current selections.
              </p>
              <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                Small daily wins should feel worth defending tomorrow
              </div>
            </div>

            <div className="surface-panel flex items-center justify-between gap-3 p-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPick((prev) => Math.max(prev - 1, 0))}
                disabled={currentPick === 0}
              >
                Previous
              </Button>

              {currentPick === dailyMatches.length - 1 ? (
                <Button onClick={handleSubmit} disabled={!allSelected || isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Locking...
                    </>
                  ) : (
                    <>
                      Submit calls
                      <Sparkles className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    setCurrentPick((prev) =>
                      Math.min(prev + 1, dailyMatches.length - 1),
                    )
                  }
                  disabled={!currentSelection}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
