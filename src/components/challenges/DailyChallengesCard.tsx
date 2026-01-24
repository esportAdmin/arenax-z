import { motion, AnimatePresence } from "framer-motion";
import { Target, Zap, CheckCircle, LogIn, Flame, Gift, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useDailyChallenges, UserChallenge } from "@/hooks/useDailyChallenges";
import { useState } from "react";

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

function ChallengeItem({ userChallenge, onClaim, claimingId }: ChallengeItemProps) {
  const challenge = userChallenge.challenge;
  const Icon = iconMap[challenge.icon] || Target;
  const progressPercent = (userChallenge.progress / challenge.requirement_value) * 100;
  const isClaiming = claimingId === userChallenge.id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-xl border transition-all ${
        userChallenge.xp_claimed
          ? "bg-muted/20 border-border/30 opacity-60"
          : userChallenge.completed
            ? "bg-primary/10 border-primary/30"
            : "bg-muted/30 border-border/50 hover:border-primary/30"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`p-3 rounded-xl ${
            userChallenge.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-medium truncate">{challenge.title}</h4>
            <div className="flex items-center gap-1 text-sm font-medium text-primary shrink-0">
              <Sparkles className="w-3 h-3" />+{challenge.xp_reward} XP
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{challenge.description}</p>

          {/* Progress */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {userChallenge.progress} / {challenge.requirement_value}
              </span>
              {userChallenge.completed && !userChallenge.xp_claimed && (
                <span className="text-primary font-medium">Terminé !</span>
              )}
              {userChallenge.xp_claimed && <span className="text-muted-foreground">Réclamé ✓</span>}
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {/* Claim button */}
          <AnimatePresence>
            {userChallenge.completed && !userChallenge.xp_claimed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3"
              >
                <Button
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => onClaim(userChallenge.id)}
                  disabled={isClaiming}
                >
                  {isClaiming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}
                  Réclamer {challenge.xp_reward} XP
                </Button>
              </motion.div>
            )}
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

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
            <Target className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg">Défis du jour</h3>
            <p className="text-sm text-muted-foreground">
              {completedCount}/{totalCount} terminés
            </p>
          </div>
        </div>

        {/* Overall progress */}
        <div className="text-right">
          <div className="text-2xl font-display font-bold text-primary">
            {Math.round((completedCount / Math.max(totalCount, 1)) * 100)}%
          </div>
        </div>
      </div>

      {/* Challenge list */}
      <div className="space-y-3">
        {userChallenges.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">Connectez-vous pour voir vos défis quotidiens</p>
        ) : (
          userChallenges.map((uc) => (
            <ChallengeItem key={uc.id} userChallenge={uc} onClaim={handleClaim} claimingId={claimingId} />
          ))
        )}
      </div>

      {/* Bonus message */}
      {completedCount === totalCount && totalCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-4 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-center"
        >
          <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="font-medium">Tous les défis terminés !</p>
          <p className="text-sm text-muted-foreground">Revenez demain pour de nouveaux défis</p>
        </motion.div>
      )}
    </motion.div>
  );
}
