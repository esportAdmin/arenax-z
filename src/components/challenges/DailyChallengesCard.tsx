import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  Flame,
  Gift,
  Loader2,
  LogIn,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

import { CountdownPill } from "@/components/engagement/CountdownPill";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useDailyChallenges, UserChallenge } from "@/hooks/useDailyChallenges";
import { getNextUtcMidnight } from "@/lib/countdown";

const iconMap: Record<string, React.ElementType> = {
  target: Target,
  zap: Zap,
  "check-circle": CheckCircle,
  "log-in": LogIn,
  flame: Flame,
};

interface ChallengeItemProps {
  userChallenge: UserChallenge;
  onClaim: (id: string) => Promise<void>;
  claimingId: string | null;
}

function ChallengeItem({
  userChallenge,
  onClaim,
  claimingId,
}: ChallengeItemProps) {
  const challenge = userChallenge.challenge;
  const Icon = iconMap[challenge.icon] || Target;
  const progressPercent =
    (userChallenge.progress / challenge.requirement_value) * 100;
  const isClaiming = claimingId === userChallenge.id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`rounded-2xl border p-4 transition-all ${
        userChallenge.xp_claimed
          ? "border-white/8 bg-white/[0.03] opacity-70"
          : userChallenge.completed
            ? "border-cyan-400/20 bg-cyan-400/10"
            : "border-white/10 bg-white/[0.03] hover:border-cyan-400/20"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`rounded-2xl p-3 ${
            userChallenge.completed
              ? "bg-cyan-400/15 text-cyan-300"
              : "bg-white/5 text-slate-400"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h4 className="truncate font-semibold text-white">
                {challenge.title}
              </h4>
              <p className="mt-1 text-sm text-slate-400">
                {challenge.description}
              </p>
            </div>

            <div className="inline-flex shrink-0 items-center gap-1 rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold text-fuchsia-200">
              <Sparkles className="h-3 w-3" />+{challenge.xp_reward} XP
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">
                {userChallenge.progress} / {challenge.requirement_value}
              </span>
              {userChallenge.completed && !userChallenge.xp_claimed ? (
                <span className="font-medium text-cyan-300">
                  Ready to claim
                </span>
              ) : null}
              {userChallenge.xp_claimed ? (
                <span className="text-slate-500">Claimed</span>
              ) : null}
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          <AnimatePresence>
            {userChallenge.completed && !userChallenge.xp_claimed ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <Button
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => onClaim(userChallenge.id)}
                  disabled={isClaiming}
                >
                  {isClaiming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Gift className="h-4 w-4" />
                  )}
                  Claim {challenge.xp_reward} XP
                </Button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export function DailyChallengesCard() {
  const { userChallenges, loading, claimReward } = useDailyChallenges();
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const handleClaim = async (id: string) => {
    setClaimingId(id);
    await claimReward(id);
    setClaimingId(null);
  };

  const completedCount = userChallenges.filter((uc) => uc.completed).length;
  const totalCount = userChallenges.length;
  const completionRate = Math.round(
    (completedCount / Math.max(totalCount, 1)) * 100,
  );

  if (loading) {
    return (
      <div className="section-shell p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="section-shell"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-cyan-400/20 to-fuchsia-400/20 p-3">
            <Target className="h-5 w-5 text-cyan-300" />
          </div>
          <div>
            <h3 className="font-display text-xl font-black text-white">
              Daily challenges
            </h3>
            <p className="text-sm text-slate-400">
              {completedCount}/{totalCount} completed today
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <CountdownPill label="Reset" target={getNextUtcMidnight()} tone="cyan" />
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-right">
            <div className="text-2xl font-black text-cyan-300">
              {completionRate}%
            </div>
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
              completion
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {userChallenges.length === 0 ? (
          <div className="rounded-[1.4rem] border border-white/10 bg-black/20 px-4 py-6 text-center">
            <p className="text-slate-300">Sign in to see your daily missions.</p>
            <p className="mt-2 text-sm text-slate-500">
              The strongest daily loops feel immediately winnable.
            </p>
          </div>
        ) : (
          userChallenges.map((uc) => (
            <ChallengeItem
              key={uc.id}
              userChallenge={uc}
              onClaim={handleClaim}
              claimingId={claimingId}
            />
          ))
        )}
      </div>

      {completedCount === totalCount && totalCount > 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-5 rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-cyan-400/10 to-fuchsia-400/10 p-4 text-center"
        >
          <Sparkles className="mx-auto mb-2 h-6 w-6 text-cyan-300" />
          <p className="font-semibold text-white">All daily challenges complete</p>
          <p className="mt-1 text-sm text-slate-400">
            Come back tomorrow to keep the momentum alive.
          </p>
        </motion.div>
      ) : null}
    </motion.div>
  );
}
