"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Coins,
  Flame,
  LockKeyhole,
  Target,
  Trophy,
  TrendingUp,
} from "lucide-react";

import { CountdownPill } from "@/components/engagement/CountdownPill";
import { getNextUtcMidnight } from "@/lib/countdown";

interface LiveCall {
  id: string;
  match_id: string;
  selected_team: string;
  activityCommitment: number;
  projectedImpact: number;
  signalWeight: number;
  status: string;
  created_at: string;
}

interface UserPredictionsSidebarProps {
  liveCalls: LiveCall[];
  balance: number;
  totalLiveCalls: number;
  totalWins: number;
}

export const UserPredictionsSidebar = ({
  liveCalls,
  balance,
  totalLiveCalls,
  totalWins,
}: UserPredictionsSidebarProps) => {
  const recentLiveCalls = liveCalls.slice(0, 5);
  const pendingLiveCalls = liveCalls.filter((liveCall) => liveCall.status === "pending");
  const winRate =
    totalLiveCalls > 0 ? Math.round((totalWins / totalLiveCalls) * 100) : 0;

  const getStatusTone = (status: string) => {
    switch (status) {
      case "won":
        return "text-emerald-300";
      case "lost":
        return "text-rose-300";
      default:
        return "text-cyan-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "won":
        return "Won";
      case "lost":
        return "Lost";
      case "pending":
        return "Pending";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="section-shell"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="eyebrow-badge">
              <Coins className="h-4 w-4 text-primary" />
              Personal war chest
            </div>
            <h3 className="mt-3 text-2xl font-display font-bold text-white">
              Keep your live-call momentum visible
            </h3>
          </div>
          <CountdownPill label="Reset" target={getNextUtcMidnight()} tone="cyan" />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          <div className="surface-panel border-cyan-400/18 bg-cyan-400/8 p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-400">
              <Coins className="h-4 w-4 text-primary" />
              Balance
            </div>
            <div className="mt-2 text-3xl font-display font-bold text-white">
              {balance.toLocaleString("en-US")}
            </div>
          </div>

          <div className="surface-panel border-amber-400/18 bg-amber-400/8 p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-400">
              <Target className="h-4 w-4 text-amber-300" />
              Total picks
            </div>
            <div className="mt-2 text-3xl font-display font-bold text-white">
              {totalLiveCalls}
            </div>
          </div>

          <div className="surface-panel border-emerald-400/18 bg-emerald-400/8 p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-400">
              <Flame className="h-4 w-4 text-emerald-300" />
              Hit rate
            </div>
            <div className="mt-2 text-3xl font-display font-bold text-white">
              {winRate}%
            </div>
          </div>
        </div>
      </motion.div>

      {pendingLiveCalls.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="section-shell"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="eyebrow-badge">
              <Clock className="h-4 w-4 text-primary" />
              Pending calls
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white">
              {pendingLiveCalls.length}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {pendingLiveCalls.slice(0, 3).map((liveCall) => (
              <div key={liveCall.id} className="surface-panel p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-white">
                    {liveCall.selected_team}
                  </span>
                  <span className="rounded-full border border-cyan-400/18 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
                    {getStatusLabel(liveCall.status)}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                  <span>{liveCall.activityCommitment} ARENA activity</span>
                  <span className="font-semibold text-amber-300">
                    {liveCall.projectedImpact} impact
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="section-shell"
      >
        <div className="eyebrow-badge">
          <TrendingUp className="h-4 w-4 text-primary" />
          Recent activity
        </div>

        {recentLiveCalls.length > 0 ? (
          <div className="mt-4 space-y-3">
            {recentLiveCalls.map((liveCall) => (
              <div
                key={liveCall.id}
                className="surface-panel flex items-center justify-between gap-3 p-4"
              >
                <div className="flex items-center gap-3">
                  {liveCall.status === "won" ? (
                    <Trophy className="h-4 w-4 text-amber-300" />
                  ) : liveCall.status === "lost" ? (
                    <div className="h-3 w-3 rounded-full bg-rose-400" />
                  ) : (
                    <Clock className="h-4 w-4 text-primary" />
                  )}
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {liveCall.selected_team}
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                      {new Date(liveCall.created_at).toLocaleDateString("en-US")}
                    </div>
                  </div>
                </div>
                <div className={`text-sm font-bold ${getStatusTone(liveCall.status)}`}>
                  {liveCall.status === "won" ? "+" : ""}
                  {liveCall.status === "won"
                    ? liveCall.projectedImpact
                    : liveCall.activityCommitment}{" "}
                  ARENA
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-black/20 p-5 text-center text-sm text-slate-400">
            No live-call history yet. The first strong call should immediately
            make this sidebar feel alive.
          </div>
        )}
      </motion.div>

      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <LockKeyhole className="h-4 w-4 text-slate-200" />
          Premium call journal unlocks after your next accuracy tier
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Your sidebars should always suggest there is a sharper layer waiting
          above your current tier.
        </p>
      </div>
    </div>
  );
};
