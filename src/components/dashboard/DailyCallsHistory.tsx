"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Trophy,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";

import { CountdownPill } from "@/components/engagement/CountdownPill";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getNextUtcMidnight } from "@/lib/countdown";
import { isLocalQaUser } from "@/lib/dev-auth";

interface MatchPick {
  matchId: string;
  teamA: string;
  teamB: string;
  selectedTeam: string;
  signalWeight: number;
  result?: "won" | "lost" | "pending";
}

type LegacyMatchPick = MatchPick & { odds?: number };

interface DailyPick {
  id: string;
  pick_date: string;
  matches: MatchPick[];
  total_potential_reward: number;
  status: "pending" | "won" | "lost" | "partial";
  created_at: string;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: "text-slate-300",
    bg: "bg-white/5",
    border: "border-white/10",
    label: "Pending",
  },
  won: {
    icon: Trophy,
    color: "text-emerald-300",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    label: "Won",
  },
  lost: {
    icon: XCircle,
    color: "text-red-300",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    label: "Lost",
  },
  partial: {
    icon: TrendingUp,
    color: "text-amber-300",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    label: "Partial",
  },
};

function formatPickDate(dateString: string) {
  const date = parseISO(dateString);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMMM d", { locale: enUS });
}

const FALLBACK_DAILY_PICKS: DailyPick[] = [
  {
    id: "qa-pick-1",
    pick_date: new Date().toISOString().split("T")[0],
    matches: [
      {
        matchId: "qa-match-1",
        teamA: "Shadow Legion",
        teamB: "Phoenix Rising",
        selectedTeam: "Shadow Legion",
        signalWeight: 1.72,
        result: "pending",
      },
      {
        matchId: "qa-match-2",
        teamA: "Titan Force",
        teamB: "Vanguard Elite",
        selectedTeam: "Titan Force",
        signalWeight: 1.94,
        result: "pending",
      },
    ],
    total_potential_reward: 336,
    status: "pending",
    created_at: new Date().toISOString(),
  },
  {
    id: "qa-pick-2",
    pick_date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    matches: [
      {
        matchId: "qa-match-3",
        teamA: "Storm Breakers",
        teamB: "Iron Wolves",
        selectedTeam: "Storm Breakers",
        signalWeight: 2.05,
        result: "won",
      },
    ],
    total_potential_reward: 205,
    status: "won",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export function DailyCallsHistory() {
  const { user } = useAuth();
  const [picks, setPicks] = useState<DailyPick[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPick, setExpandedPick] = useState<string | null>(null);
  const isLocalQa = isLocalQaUser(user);

  useEffect(() => {
    const fetchPicks = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      if (isLocalQa) {
        setPicks(FALLBACK_DAILY_PICKS);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("daily_pro_picks")
          .select("*")
          .eq("user_id", user.id)
          .order("pick_date", { ascending: false })
          .limit(10);

        if (error) {
          throw error;
        }

        const typedPicks: DailyPick[] = (data || []).map((pick) => ({
          id: pick.id,
          pick_date: pick.pick_date,
          matches: (pick.matches as unknown as LegacyMatchPick[]).map((match) => ({
            ...match,
            signalWeight: match.signalWeight ?? match.odds ?? 1,
          })),
          total_potential_reward: pick.total_potential_reward,
          status: pick.status as DailyPick["status"],
          created_at: pick.created_at,
        }));

        setPicks(typedPicks);
      } catch {
        setPicks([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchPicks();
  }, [isLocalQa, user]);

  const toggleExpand = (pickId: string) => {
    setExpandedPick((prev) => (prev === pickId ? null : pickId));
  };

  const stats = picks.reduce(
    (acc, pick) => {
      if (pick.status === "won") acc.wins++;
      else if (pick.status === "lost") acc.losses++;
      else acc.pending++;
      return acc;
    },
    { wins: 0, losses: 0, pending: 0 },
  );

  if (loading) {
    return (
      <div className="section-shell p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 rounded bg-white/5" />
          <div className="h-20 rounded bg-white/5" />
          <div className="h-20 rounded bg-white/5" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="section-shell p-6 text-center">
        <Calendar className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground">Sign in to view your live-call history.</p>
        <p className="mt-2 text-sm text-slate-500">
          History works best when players can see what they are protecting.
        </p>
      </div>
    );
  }

  if (picks.length === 0) {
    return (
      <div className="section-shell p-6 text-center">
        <Calendar className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground">No daily calls yet.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Build your record with your first comeback mission.
        </p>
        <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
          Your first strong call should make this feed feel alive
        </div>
      </div>
    );
  }

  return (
    <div className="section-shell overflow-hidden">
      <div className="border-b border-white/8 bg-gradient-to-r from-cyan-500/10 to-transparent p-5">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
            <Trophy className="h-5 w-5 text-cyan-300" />
          </div>
          <div>
            <h3 className="font-display text-xl font-black text-white">
              Daily call history
            </h3>
            <p className="text-xs text-slate-400">
              {picks.length} recent comeback sessions
            </p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <CountdownPill label="Reset" target={getNextUtcMidnight()} tone="cyan" />
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-medium text-emerald-300">{stats.wins}</span>
            <span className="text-slate-400">won</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-red-400" />
            <span className="font-medium text-red-300">{stats.losses}</span>
            <span className="text-slate-400">lost</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-slate-400" />
            <span className="font-medium text-slate-300">{stats.pending}</span>
            <span className="text-slate-400">pending</span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-white/6">
        {picks.map((pick, index) => {
          const config = statusConfig[pick.status];
          const StatusIcon = config.icon;
          const isExpanded = expandedPick === pick.id;

          return (
            <motion.div
              key={pick.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={config.bg}
            >
              <button
                onClick={() => toggleExpand(pick.id)}
                className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-white/[0.03]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${config.border} ${config.bg}`}
                  >
                    <StatusIcon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      {formatPickDate(pick.pick_date)}
                    </div>
                    <div className="text-xs text-slate-400">
                      {pick.matches.length} matches | {config.label}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div
                      className={`text-sm font-black ${
                        pick.status === "won" ? "text-emerald-300" : "text-white"
                      }`}
                    >
                      {pick.status === "won" ? "+" : ""}
                      {pick.total_potential_reward} ARENA
                    </div>
                    <div className="text-xs text-slate-500">
                      {pick.status === "pending"
                        ? "potential"
                        : pick.status === "won"
                          ? "secured"
                          : "settled"}
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 px-4 pb-4">
                      {pick.matches.map((match, matchIndex) => {
                        const matchResult = match.result || "pending";
                        const resultConfig =
                          statusConfig[
                            matchResult === "won"
                              ? "won"
                              : matchResult === "lost"
                                ? "lost"
                                : "pending"
                          ];
                        const MatchIcon = resultConfig.icon;

                        return (
                          <motion.div
                            key={matchIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: matchIndex * 0.05 }}
                            className={`rounded-xl border p-3 ${resultConfig.border} ${resultConfig.bg}`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <MatchIcon className={`h-4 w-4 ${resultConfig.color}`} />
                                <div>
                                  <div className="text-sm text-white">
                                    <span
                                      className={
                                        match.selectedTeam === match.teamA
                                          ? "font-bold text-cyan-300"
                                          : ""
                                      }
                                    >
                                      {match.teamA}
                                    </span>
                                    <span className="mx-2 text-slate-500">vs</span>
                                    <span
                                      className={
                                        match.selectedTeam === match.teamB
                                          ? "font-bold text-cyan-300"
                                          : ""
                                      }
                                    >
                                      {match.teamB}
                                    </span>
                                  </div>
                                  <div className="text-xs text-slate-400">
                                    Called{" "}
                                    <span className="font-medium text-cyan-300">
                                      {match.selectedTeam}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-sm font-black text-white">
                                  {Math.round(match.signalWeight * 100)} signal
                                </div>
                                <div className={`text-xs ${resultConfig.color}`}>
                                  {matchResult === "won"
                                    ? "Correct"
                                    : matchResult === "lost"
                                      ? "Incorrect"
                                      : "Pending"}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
