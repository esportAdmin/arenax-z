import { useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Flame,
  Radio,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Team {
  name: string;
  logo: string;
  signalScore: number;
}

interface Match {
  id: string;
  teamA: Team;
  teamB: Team;
  tournament: string;
  time: string;
  date: string;
  isLive: boolean;
  totalLocked: number;
  game: string;
  mapScore?: { teamA: number; teamB: number };
}

interface MatchCardProps {
  match: Match;
  onSubmitLiveCall: (
    matchId: string,
    selectedTeam: string,
    activityCommitment: number,
    signalWeight: number,
  ) => Promise<boolean>;
  isPlacing: boolean;
  userBalance: number;
  isAuthenticated: boolean;
}

export const MatchCard = ({
  match,
  onSubmitLiveCall,
  isPlacing,
  userBalance,
  isAuthenticated,
}: MatchCardProps) => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [activityCommitment, setActivityCommitment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTeamSelect = (teamName: string) => {
    if (selectedTeam === teamName) {
      setSelectedTeam(null);
      setIsExpanded(false);
    } else {
      setSelectedTeam(teamName);
      setIsExpanded(true);
    }
  };

  const handleSubmitLiveCall = async () => {
    if (!selectedTeam || !activityCommitment) return;

    const signalWeight =
      selectedTeam === match.teamA.name
        ? match.teamA.signalScore / 100
        : match.teamB.signalScore / 100;
    const success = await onSubmitLiveCall(
      match.id,
      selectedTeam,
      parseInt(activityCommitment, 10),
      signalWeight,
    );

    if (success) {
      setSelectedTeam(null);
      setActivityCommitment("");
      setIsExpanded(false);
    }
  };

  const getSelectedSignalWeight = () => {
    if (!selectedTeam) return 0;
    return selectedTeam === match.teamA.name
      ? match.teamA.signalScore / 100
      : match.teamB.signalScore / 100;
  };

  const projectedImpact = activityCommitment
    ? Math.floor(parseFloat(activityCommitment) * getSelectedSignalWeight())
    : 0;
  const quickAmounts = [50, 100, 250, 500].filter((amount) => amount <= userBalance);

  return (
    <motion.div
      layout
      className={`relative overflow-hidden rounded-[28px] border transition-all duration-300 ${
        isExpanded
          ? "border-cyan-400/30 bg-[linear-gradient(180deg,rgba(18,28,58,0.95),rgba(7,12,28,0.95))] shadow-[0_0_40px_rgba(34,211,238,0.08)]"
          : "border-white/10 bg-[linear-gradient(180deg,rgba(11,18,38,0.92),rgba(7,11,24,0.92))]"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,245,255,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,182,72,0.08),transparent_32%)]" />
      {match.isLive ? (
        <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-red-500 via-orange-400 to-red-500" />
      ) : null}

      <div className="relative p-5 lg:p-6">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {match.isLive ? (
              <div className="metal-chip border-red-500/30 bg-red-500/10 text-red-200">
                <Radio className="h-3.5 w-3.5" />
                Live pressure
              </div>
            ) : (
              <div className="metal-chip">{match.date}</div>
            )}

            <div className="metal-chip">
              <Shield className="h-3.5 w-3.5" />
              {match.tournament}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <div className="metal-chip">
              <Users className="h-3.5 w-3.5" />
              {match.totalLocked.toLocaleString("en-US")} locked
            </div>
            <div className="metal-chip">
              <Clock className="h-3.5 w-3.5" />
              {match.time}
            </div>
          </div>
        </div>

        <div className="grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
          <button
            onClick={() => handleTeamSelect(match.teamA.name)}
            className={`group relative rounded-[24px] border p-5 text-left transition-all duration-200 ${
              selectedTeam === match.teamA.name
                ? "border-cyan-400/50 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                : "border-white/10 bg-white/[0.03] hover:border-cyan-400/30 hover:bg-white/[0.05]"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-4xl transition-transform group-hover:scale-105">
                {match.teamA.logo}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xl font-black text-white">
                  {match.teamA.name}
                </div>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm font-bold text-cyan-300">
                  <Zap className="h-3.5 w-3.5" />
                  {match.teamA.signalScore} signal
                </div>
              </div>
            </div>
          </button>

          <div className="flex flex-col items-center justify-center px-2 text-center">
            {match.isLive && match.mapScore ? (
              <div>
                <div className="text-3xl font-black text-white">
                  {match.mapScore.teamA}
                  <span className="mx-2 text-slate-500">:</span>
                  {match.mapScore.teamB}
                </div>
                <div className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">
                  Live maps
                </div>
              </div>
            ) : (
              <div className="text-2xl font-black text-slate-500">VS</div>
            )}

            <div className="mt-3 inline-flex items-center gap-1 text-xs text-amber-300/80">
              <Flame className="h-3.5 w-3.5" />
              High-attention match
            </div>
          </div>

          <button
            onClick={() => handleTeamSelect(match.teamB.name)}
            className={`group relative rounded-[24px] border p-5 text-left transition-all duration-200 ${
              selectedTeam === match.teamB.name
                ? "border-fuchsia-400/50 bg-fuchsia-400/10 shadow-[0_0_30px_rgba(217,70,239,0.15)]"
                : "border-white/10 bg-white/[0.03] hover:border-fuchsia-400/30 hover:bg-white/[0.05]"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-4xl transition-transform group-hover:scale-105">
                {match.teamB.logo}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xl font-black text-white">
                  {match.teamB.name}
                </div>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1 text-sm font-bold text-fuchsia-300">
                  <Zap className="h-3.5 w-3.5" />
                  {match.teamB.signalScore} signal
                </div>
              </div>
            </div>
          </button>
        </div>

        {isExpanded && selectedTeam ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 border-t border-white/8 pt-6"
          >
            <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr_0.9fr]">
              <div className="surface-panel border-white/10 bg-white/[0.03] p-4">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Activity commit
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Minimum 50"
                    value={activityCommitment}
                    onChange={(event) => setActivityCommitment(event.target.value)}
                    className="h-12 border-white/10 bg-black/20 pr-16 font-mono text-lg"
                    min={50}
                    max={userBalance}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                    ARENA
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setActivityCommitment(amount.toString())}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 transition-colors hover:border-cyan-400/30 hover:text-white"
                    >
                      {amount}
                    </button>
                  ))}
                </div>
              </div>

              <div className="surface-panel border-emerald-400/20 bg-emerald-400/10 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
                  Projected impact
                </div>
                <div className="mt-3 text-3xl font-black text-white">
                  +{projectedImpact.toLocaleString("en-US")}
                </div>
                <div className="mt-1 text-sm text-slate-300">
                  Based on current signal strength and activity weight
                </div>
              </div>

              <div className="surface-panel border-white/10 bg-white/[0.03] p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Command
                </div>
                <div className="mt-2 text-lg font-bold text-white">
                  Call {selectedTeam}
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  Commit only if the read is strong. Fast, clear, and deliberate.
                </p>

                {isAuthenticated ? (
                  <Button
                    onClick={handleSubmitLiveCall}
                    disabled={
                      isPlacing ||
                      !activityCommitment ||
                      parseInt(activityCommitment, 10) < 50
                    }
                    className="mt-4 w-full"
                  >
                    {isPlacing ? "Submitting..." : "Confirm live call"}
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    className="mt-4 w-full"
                    onClick={() => {
                      window.location.href = "/auth";
                    }}
                  >
                    Sign in to join the action
                  </Button>
                )}
              </div>
            </div>

            {isAuthenticated ? (
              <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                <span>Your available activity balance</span>
                <span className="font-bold text-white">
                  {userBalance.toLocaleString("en-US")} ARENA
                </span>
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
};
