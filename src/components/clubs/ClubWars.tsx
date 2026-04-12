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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useClubs } from "@/hooks/useClubs";
import { ClubWar, useClubWars } from "@/hooks/useClubWars";
import { formatDistanceToNow } from "date-fns";
import {
  Check,
  Clock,
  Loader2,
  Shield,
  Swords,
  Target,
  TrendingUp,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

const getStatusBadge = (status: ClubWar["status"]) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="border-yellow-500/30 bg-yellow-500/20 text-yellow-400">
          Pending
        </Badge>
      );
    case "active":
      return <Badge className="border-red-500/30 bg-red-500/20 text-red-400">Active</Badge>;
    case "completed":
      return (
        <Badge variant="outline" className="border-green-500/30 bg-green-500/20 text-green-400">
          Completed
        </Badge>
      );
    case "declined":
      return (
        <Badge variant="outline" className="bg-muted text-muted-foreground">
          Declined
        </Badge>
      );
  }
};

interface ClubWarsProps {
  clubId?: string;
}

export const ClubWars = ({ clubId }: ClubWarsProps) => {
  const {
    wars,
    activeWar,
    pendingWars,
    loading,
    userClubId,
    isAdmin,
    createWar,
    respondToWar,
  } = useClubWars(clubId);
  const { clubs, myClub } = useClubs();

  const [showChallengeDialog, setShowChallengeDialog] = useState(false);
  const [selectedClub, setSelectedClub] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);

  const eligibleClubs = clubs.filter((club) => club.id !== myClub?.id);

  const handleCreateWar = async () => {
    if (!selectedClub) return;

    setIsCreating(true);
    const result = await createWar(selectedClub);
    setIsCreating(false);

    if (result.success) {
      toast.success("War challenge sent");
      setShowChallengeDialog(false);
      setSelectedClub(null);
    } else {
      toast.error(result.error || "Error");
    }
  };

  const handleRespond = async (warId: string, accept: boolean) => {
    setRespondingTo(warId);
    const result = await respondToWar(warId, accept);
    setRespondingTo(null);

    if (result.success) {
      toast.success(accept ? "War accepted" : "War declined");
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Swords className="h-6 w-6 text-red-500" />
            Club Wars
          </h2>
          <p className="text-sm text-muted-foreground">
            Challenge rival clubs and fight for high-value rewards
          </p>
        </div>
        {isAdmin && !activeWar && pendingWars.length === 0 && (
          <Button onClick={() => setShowChallengeDialog(true)} className="gap-2">
            <Swords className="h-4 w-4" />
            Challenge a club
          </Button>
        )}
      </div>

      {pendingWars.length > 0 && (
        <Card className="border-yellow-500/50 bg-yellow-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-yellow-500" />
              Pending challenges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingWars.map((war) => (
              <motion.div
                key={war.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between rounded-lg border bg-background/50 p-4"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-yellow-500">
                    <AvatarImage src={war.challenger.logo_url || undefined} />
                    <AvatarFallback>{war.challenger.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">{war.challenger.name}</p>
                    <p className="text-sm text-muted-foreground">
                  has challenged you - {war.xp_reward} XP on the line
                    </p>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRespond(war.id, false)}
                      disabled={respondingTo === war.id}
                    >
                      {respondingTo === war.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleRespond(war.id, true)}
                      disabled={respondingTo === war.id}
                      className="gap-1"
                    >
                      {respondingTo === war.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Accept
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {activeWar && (
        <Card className="overflow-hidden border-red-500/50 bg-gradient-to-br from-red-500/10 to-orange-500/10">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-red-500 to-orange-500" />
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Swords className="h-5 w-5 animate-pulse text-red-500" />
                Live war
              </CardTitle>
              {getStatusBadge(activeWar.status)}
            </div>
            {activeWar.end_date && (
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Ends in {formatDistanceToNow(new Date(activeWar.end_date))}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid grid-cols-3 items-center gap-4">
              <div className="text-center">
                <Avatar className="mx-auto mb-2 h-20 w-20 border-4 border-blue-500">
                  <AvatarImage src={activeWar.challenger.logo_url || undefined} />
                  <AvatarFallback className="text-2xl">
                    {activeWar.challenger.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <p className="font-bold">{activeWar.challenger.name}</p>
                <p className="text-3xl font-bold text-blue-500">{activeWar.challenger_xp}</p>
                <p className="text-xs text-muted-foreground">XP</p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500">
                  <span className="text-2xl font-bold text-white">VS</span>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">Reward</p>
                  <p className="text-lg font-bold text-primary">
                    {activeWar.xp_reward} XP
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Avatar className="mx-auto mb-2 h-20 w-20 border-4 border-purple-500">
                  <AvatarImage src={activeWar.defender.logo_url || undefined} />
                  <AvatarFallback className="text-2xl">
                    {activeWar.defender.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <p className="font-bold">{activeWar.defender.name}</p>
                <p className="text-3xl font-bold text-purple-500">{activeWar.defender_xp}</p>
                <p className="text-xs text-muted-foreground">XP</p>
              </div>
            </div>

            <div className="relative mb-4 h-4 overflow-hidden rounded-full bg-muted">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                style={{
                  width: `${
                    activeWar.challenger_xp + activeWar.defender_xp > 0
                      ? (activeWar.challenger_xp /
                          (activeWar.challenger_xp + activeWar.defender_xp)) *
                        100
                      : 50
                  }%`,
                }}
              />
              <div
                className="absolute right-0 top-0 h-full bg-gradient-to-l from-purple-500 to-purple-600 transition-all"
                style={{
                  width: `${
                    activeWar.challenger_xp + activeWar.defender_xp > 0
                      ? (activeWar.defender_xp /
                          (activeWar.challenger_xp + activeWar.defender_xp)) *
                        100
                      : 50
                  }%`,
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    Live calls
                  </span>
                  <span className="font-bold">{activeWar.challenger_predictions}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Wins
                  </span>
                  <span className="font-bold">{activeWar.challenger_wins}</span>
                </div>
              </div>
              <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    Live calls
                  </span>
                  <span className="font-bold">{activeWar.defender_predictions}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Wins
                  </span>
                  <span className="font-bold">{activeWar.defender_wins}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">War history</CardTitle>
        </CardHeader>
        <CardContent>
          {wars.filter((war) => war.status === "completed").length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Swords className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>No completed wars yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {wars
                .filter((war) => war.status === "completed")
                .map((war) => {
                  const isWinner = war.winner_id === userClubId;
                  const isDraw = !war.winner_id;

                  return (
                    <motion.div
                      key={war.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`flex items-center justify-between rounded-lg border p-4 ${
                        isDraw
                          ? "bg-muted/30"
                          : isWinner
                            ? "border-green-500/30 bg-green-500/10"
                            : "border-red-500/30 bg-red-500/10"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                          <Avatar className="h-10 w-10 border-2 border-background">
                            <AvatarImage src={war.challenger.logo_url || undefined} />
                            <AvatarFallback>{war.challenger.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <Avatar className="h-10 w-10 border-2 border-background">
                            <AvatarImage src={war.defender.logo_url || undefined} />
                            <AvatarFallback>{war.defender.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <p className="font-semibold">
                            {war.challenger.name} vs {war.defender.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {war.challenger_xp} - {war.defender_xp} XP
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {isDraw ? (
                          <Badge variant="outline">Draw</Badge>
                        ) : isWinner ? (
                          <Badge className="bg-green-500/20 text-green-400">
                            <Trophy className="mr-1 h-3 w-3" />
                            Victory
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-400">
                            Defeat
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showChallengeDialog} onOpenChange={setShowChallengeDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Swords className="h-5 w-5 text-red-500" />
              Challenge a club
            </DialogTitle>
            <DialogDescription>
              Choose a club to challenge. The war will run for 7 days.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-64 space-y-2 overflow-y-auto">
            {eligibleClubs.map((club) => (
              <div
                key={club.id}
                onClick={() => setSelectedClub(club.id)}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                  selectedClub === club.id
                    ? "border-primary bg-primary/10"
                    : "hover:border-muted-foreground/50"
                }`}
              >
                <Avatar>
                  <AvatarFallback>{club.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{club.name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {club.member_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {club.total_xp.toLocaleString()} XP
                    </span>
                  </div>
                </div>
                {selectedClub === club.id && <Check className="h-5 w-5 text-primary" />}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChallengeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWar} disabled={!selectedClub || isCreating} className="gap-2">
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Swords className="h-4 w-4" />
              )}
              Send challenge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
