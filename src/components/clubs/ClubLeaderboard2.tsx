import { motion } from "framer-motion";
import {
  Award,
  Crown,
  Gift,
  Medal,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useClubRankings } from "@/hooks/useClubRankings";
import { toast } from "sonner";

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-6 w-6 text-yellow-400" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-300" />;
    case 3:
      return <Award className="h-6 w-6 text-amber-600" />;
    default:
      return <span className="font-bold text-muted-foreground">{rank}</span>;
  }
};

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return "border-yellow-500/50 bg-gradient-to-r from-yellow-500/20 to-amber-500/20";
    case 2:
      return "border-gray-400/50 bg-gradient-to-r from-gray-400/20 to-gray-300/20";
    case 3:
      return "border-amber-600/50 bg-gradient-to-r from-amber-600/20 to-orange-500/20";
    default:
      return "border-border bg-card";
  }
};

export const ClubLeaderboard = () => {
  const {
    rankings,
    rewards,
    loading,
    userClubRanking,
    claimReward,
    getCurrentWeek,
  } = useClubRankings();
  const { start, end } = getCurrentWeek();

  const handleClaimReward = async (rankingId: string) => {
    const result = await claimReward(rankingId);
    if (result.success) {
      toast.success("Reward claimed successfully");
    } else {
      toast.error(result.error || "Claim failed");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((index) => (
          <div key={index} className="h-24 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Trophy className="h-6 w-6 text-primary" />
            Inter-Club Leaderboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Week of {new Date(start).toLocaleDateString("en-US")} to{" "}
            {new Date(end).toLocaleDateString("en-US")}
          </p>
        </div>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Gift className="h-5 w-5 text-primary" />
            Weekly rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className={`rounded-lg border p-4 ${
                  reward.rank_from === 1
                    ? "border-yellow-500/30 bg-yellow-500/10"
                    : reward.rank_from === 2
                      ? "border-gray-400/30 bg-gray-400/10"
                      : "border-amber-600/30 bg-amber-600/10"
                }`}
              >
                <div className="mb-2 flex items-center gap-2">
                  {getRankIcon(reward.rank_from)}
                  <span className="font-semibold">{reward.badge_name}</span>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>+{reward.xp_bonus} XP for the club</p>
                  <p>+{reward.arena_points} Arena Points</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {userClubRanking && (
        <Card className="border-primary bg-primary/10">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  {getRankIcon(userClubRanking.final_rank || 0)}
                </div>
                <div>
                  <p className="font-semibold">Your club</p>
                  <p className="text-2xl font-bold">{userClubRanking.club.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">
                  {userClubRanking.total_xp.toLocaleString()} XP
                </p>
                <p className="text-sm text-muted-foreground">
                  Rank #{userClubRanking.final_rank}
                </p>
              </div>
            </div>
            {userClubRanking.final_rank &&
              userClubRanking.final_rank <= 3 &&
              !userClubRanking.rewards_claimed && (
                <Button className="mt-4 w-full" onClick={() => handleClaimReward(userClubRanking.id)}>
                  <Gift className="mr-2 h-4 w-4" />
                  Claim rewards
                </Button>
              )}
          </CardContent>
        </Card>
      )}

      {rankings.length >= 3 && (
        <div className="mb-6 grid grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center pt-8"
          >
            <div className="relative">
              <Avatar className="h-16 w-16 border-4 border-gray-400">
                <AvatarImage src={rankings[1]?.club.logo_url || undefined} />
                <AvatarFallback className="bg-gray-400/20 text-lg">
                  {rankings[1]?.club.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 rounded-full bg-gray-400 p-1">
                <Medal className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="mt-2 text-center text-sm font-semibold">
              {rankings[1]?.club.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {rankings[1]?.total_xp.toLocaleString()} XP
            </p>
            <div className="mt-2 h-20 w-full rounded-t-lg bg-gray-400/20" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-yellow-400">
                <AvatarImage src={rankings[0]?.club.logo_url || undefined} />
                <AvatarFallback className="bg-yellow-400/20 text-xl">
                  {rankings[0]?.club.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 rounded-full bg-yellow-400 p-1">
                <Crown className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="mt-2 text-center font-bold">{rankings[0]?.club.name}</p>
            <p className="font-semibold text-primary">
              {rankings[0]?.total_xp.toLocaleString()} XP
            </p>
            <div className="mt-2 h-28 w-full rounded-t-lg bg-yellow-400/20" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center pt-12"
          >
            <div className="relative">
              <Avatar className="h-14 w-14 border-4 border-amber-600">
                <AvatarImage src={rankings[2]?.club.logo_url || undefined} />
                <AvatarFallback className="bg-amber-600/20">
                  {rankings[2]?.club.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 rounded-full bg-amber-600 p-1">
                <Award className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="mt-2 text-center text-sm font-semibold">
              {rankings[2]?.club.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {rankings[2]?.total_xp.toLocaleString()} XP
            </p>
            <div className="mt-2 h-16 w-full rounded-t-lg bg-amber-600/20" />
          </motion.div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Full leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          {rankings.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Trophy className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>No rankings for this week</p>
              <p className="text-sm">
                Clubs will be ranked by their weekly XP totals
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {rankings.map((ranking, index) => (
                <motion.div
                  key={ranking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center justify-between rounded-lg border p-4 ${getRankStyle(index + 1)}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center">
                      {getRankIcon(index + 1)}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={ranking.club.logo_url || undefined} />
                      <AvatarFallback>{ranking.club.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{ranking.club.name}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {ranking.club.member_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                      {ranking.total_predictions} live calls
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {ranking.total_wins} wins
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">
                      {ranking.total_xp.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">XP</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
