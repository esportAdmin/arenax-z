import { useState } from "react";
import { motion } from "framer-motion";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useClubChallenges } from "@/hooks/useClubChallenges";
import { formatDistanceToNow } from "date-fns";
import {
  Check,
  Clock,
  Crown,
  Flame,
  Gift,
  Loader2,
  Play,
  Shield,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  target: Target,
  trophy: Trophy,
  zap: Zap,
  flame: Flame,
  shield: Shield,
  crown: Crown,
};

const difficultyColors = {
  easy: "bg-green-500/20 text-green-400 border-green-500/30",
  normal: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  hard: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  legendary: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const difficultyLabels = {
  easy: "Easy",
  normal: "Normal",
  hard: "Hard",
  legendary: "Legendary",
};

interface ClubChallengesProps {
  clubId?: string;
}

export const ClubChallenges = ({ clubId }: ClubChallengesProps) => {
  const {
    templates,
    activeChallenge,
    pastChallenges,
    loading,
    isAdmin,
    startChallenge,
    claimReward,
  } = useClubChallenges(clubId);

  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [isStarting, setIsStarting] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);

  const handleStartChallenge = async (templateId: string) => {
    setIsStarting(templateId);
    const result = await startChallenge(templateId);
    setIsStarting(null);

    if (result.success) {
      toast.success("Challenge launched");
      setShowTemplateDialog(false);
    } else {
      toast.error(result.error || "Error");
    }
  };

  const handleClaimReward = async () => {
    if (!activeChallenge) return;

    setIsClaiming(true);
    const result = await claimReward(activeChallenge.id);
    setIsClaiming(false);

    if (result.success) {
      toast.success("Rewards claimed");
    } else {
      toast.error(result.error || "Error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const progressPercent = activeChallenge
    ? Math.min((activeChallenge.current_value / activeChallenge.target_value) * 100, 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Target className="h-6 w-6 text-primary" />
            Club Challenges
          </h2>
          <p className="text-sm text-muted-foreground">
            Work together to complete high-impact team objectives
          </p>
        </div>
        {isAdmin && !activeChallenge && (
          <Button onClick={() => setShowTemplateDialog(true)} className="gap-2">
            <Play className="h-4 w-4" />
            Launch challenge
          </Button>
        )}
      </div>

      {activeChallenge ? (
        <Card className="overflow-hidden border-primary/50 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-primary to-secondary" />
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {(() => {
                  const IconComponent = iconMap[activeChallenge.template.icon] || Target;
                  return (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                  );
                })()}
                <div>
                  <CardTitle className="text-xl">
                    {activeChallenge.template.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {activeChallenge.template.description}
                  </p>
                </div>
              </div>
              <Badge className={difficultyColors[activeChallenge.template.difficulty]}>
                {difficultyLabels[activeChallenge.template.difficulty]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="font-bold">
                  {activeChallenge.current_value} / {activeChallenge.target_value}
                </span>
              </div>
              <Progress value={progressPercent} className="h-3" />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {activeChallenge.status === "completed"
                  ? "Challenge completed"
                  : `Time left: ${formatDistanceToNow(new Date(activeChallenge.end_date))}`}
              </span>
            </div>

            <div className="flex items-center gap-4 rounded-lg bg-muted/30 p-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="font-semibold">
                  {activeChallenge.template.xp_reward} XP
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-accent" />
                <span className="font-semibold">
                  {activeChallenge.template.arena_points_reward} AP
                </span>
              </div>
            </div>

            {activeChallenge.contributions && activeChallenge.contributions.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Users className="h-4 w-4" />
                  Top contributors
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeChallenge.contributions.slice(0, 5).map((contribution) => (
                    <div
                      key={contribution.user_id}
                      className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1.5 text-sm"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={contribution.profile?.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">
                          {contribution.profile?.display_name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{contribution.profile?.display_name || "Anonymous"}</span>
                      <Badge variant="outline" className="text-xs">
                        +{contribution.contribution_value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeChallenge.status === "completed" &&
              !activeChallenge.rewards_claimed &&
              isAdmin && (
                <Button
                  className="w-full gap-2"
                  onClick={handleClaimReward}
                  disabled={isClaiming}
                >
                  {isClaiming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Gift className="h-4 w-4" />
                  )}
                  Claim rewards
                </Button>
              )}

            {activeChallenge.rewards_claimed && (
              <div className="flex items-center justify-center gap-2 text-green-500">
                <Check className="h-5 w-5" />
                <span>Rewards already claimed</span>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Target className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
            <h3 className="mb-2 text-xl font-bold">No active challenge</h3>
            <p className="mb-4 text-muted-foreground">
              {isAdmin
                ? "Launch a new team challenge to rally your club."
                : "Your club does not have an active challenge right now."}
            </p>
            {isAdmin && (
              <Button onClick={() => setShowTemplateDialog(true)} className="gap-2">
                <Play className="h-4 w-4" />
                Choose a challenge
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {pastChallenges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Challenge history</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastChallenges.slice(0, 5).map((challenge) => {
                const IconComponent = iconMap[challenge.template.icon] || Target;
                const isCompleted = challenge.status === "completed";

                return (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex items-center justify-between rounded-lg border p-4 ${
                      isCompleted
                        ? "border-green-500/30 bg-green-500/10"
                        : "border-red-500/30 bg-red-500/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          isCompleted ? "bg-green-500/20" : "bg-red-500/20"
                        }`}
                      >
                        <IconComponent
                          className={`h-5 w-5 ${
                            isCompleted ? "text-green-500" : "text-red-500"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{challenge.template.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {challenge.current_value} / {challenge.target_value}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={isCompleted ? "text-green-500" : "text-red-500"}
                    >
                      {isCompleted ? "Completed" : "Failed"}
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Choose a challenge
            </DialogTitle>
            <DialogDescription>
              Select a team challenge for your club
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {templates.map((template) => {
              const IconComponent = iconMap[template.icon] || Target;

              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group cursor-pointer rounded-lg border p-4 transition-all hover:border-primary/50"
                  onClick={() => !isStarting && handleStartChallenge(template.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h4 className="font-bold">{template.title}</h4>
                        <Badge className={difficultyColors[template.difficulty]}>
                          {difficultyLabels[template.difficulty]}
                        </Badge>
                      </div>
                      <p className="mb-2 text-sm text-muted-foreground">
                        {template.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          Goal: {template.target_value}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {template.duration_days} days
                        </span>
                        <span className="flex items-center gap-1 text-primary">
                          <Zap className="h-3 w-3" />
                          {template.xp_reward} XP
                        </span>
                        <span className="flex items-center gap-1 text-accent">
                          <Gift className="h-3 w-3" />
                          {template.arena_points_reward} AP
                        </span>
                      </div>
                    </div>
                    <Button size="sm" disabled={isStarting === template.id} className="shrink-0">
                      {isStarting === template.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Play className="mr-1 h-4 w-4" />
                          Launch
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
