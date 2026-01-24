import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown, Users, Target, TrendingUp, Gift } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useClubRankings } from '@/hooks/useClubRankings';
import { toast } from 'sonner';

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-6 w-6 text-yellow-400" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-300" />;
    case 3:
      return <Award className="h-6 w-6 text-amber-600" />;
    default:
      return <span className="text-muted-foreground font-bold">{rank}</span>;
  }
};

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/50';
    case 2:
      return 'bg-gradient-to-r from-gray-400/20 to-gray-300/20 border-gray-400/50';
    case 3:
      return 'bg-gradient-to-r from-amber-600/20 to-orange-500/20 border-amber-600/50';
    default:
      return 'bg-card border-border';
  }
};

export const ClubLeaderboard = () => {
  const { rankings, rewards, loading, userClubRanking, claimReward, getCurrentWeek } = useClubRankings();
  const { start, end } = getCurrentWeek();

  const handleClaimReward = async (rankingId: string) => {
    const result = await claimReward(rankingId);
    if (result.success) {
      toast.success('Récompense réclamée avec succès !');
    } else {
      toast.error(result.error || 'Erreur lors de la réclamation');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Classement Inter-Clubs
          </h2>
          <p className="text-muted-foreground text-sm">
            Semaine du {new Date(start).toLocaleDateString('fr-FR')} au {new Date(end).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>

      {/* Rewards Preview */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Récompenses Hebdomadaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className={`p-4 rounded-lg border ${
                  reward.rank_from === 1
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : reward.rank_from === 2
                    ? 'bg-gray-400/10 border-gray-400/30'
                    : 'bg-amber-600/10 border-amber-600/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {getRankIcon(reward.rank_from)}
                  <span className="font-semibold">{reward.badge_name}</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>+{reward.xp_bonus} XP pour le club</p>
                  <p>+{reward.arena_points} Arena Points</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User's Club Position */}
      {userClubRanking && (
        <Card className="border-primary bg-primary/10">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
                  {getRankIcon(userClubRanking.final_rank || 0)}
                </div>
                <div>
                  <p className="font-semibold">Votre club</p>
                  <p className="text-2xl font-bold">{userClubRanking.club.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">{userClubRanking.total_xp.toLocaleString()} XP</p>
                <p className="text-sm text-muted-foreground">
                  Rang #{userClubRanking.final_rank}
                </p>
              </div>
            </div>
            {userClubRanking.final_rank && userClubRanking.final_rank <= 3 && !userClubRanking.rewards_claimed && (
              <Button 
                className="w-full mt-4"
                onClick={() => handleClaimReward(userClubRanking.id)}
              >
                <Gift className="h-4 w-4 mr-2" />
                Réclamer les récompenses
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Podium for top 3 */}
      {rankings.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* 2nd place */}
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
              <div className="absolute -bottom-2 -right-2 bg-gray-400 rounded-full p-1">
                <Medal className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="font-semibold mt-2 text-center text-sm">{rankings[1]?.club.name}</p>
            <p className="text-muted-foreground text-xs">{rankings[1]?.total_xp.toLocaleString()} XP</p>
            <div className="w-full h-20 bg-gray-400/20 rounded-t-lg mt-2" />
          </motion.div>

          {/* 1st place */}
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
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-1">
                <Crown className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="font-bold mt-2 text-center">{rankings[0]?.club.name}</p>
            <p className="text-primary font-semibold">{rankings[0]?.total_xp.toLocaleString()} XP</p>
            <div className="w-full h-28 bg-yellow-400/20 rounded-t-lg mt-2" />
          </motion.div>

          {/* 3rd place */}
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
              <div className="absolute -bottom-2 -right-2 bg-amber-600 rounded-full p-1">
                <Award className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="font-semibold mt-2 text-center text-sm">{rankings[2]?.club.name}</p>
            <p className="text-muted-foreground text-xs">{rankings[2]?.total_xp.toLocaleString()} XP</p>
            <div className="w-full h-16 bg-amber-600/20 rounded-t-lg mt-2" />
          </motion.div>
        </div>
      )}

      {/* Full Rankings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Classement Complet</CardTitle>
        </CardHeader>
        <CardContent>
          {rankings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun classement pour cette semaine</p>
              <p className="text-sm">Les clubs seront classés en fonction de leur XP hebdomadaire</p>
            </div>
          ) : (
            <div className="space-y-2">
              {rankings.map((ranking, index) => (
                <motion.div
                  key={ranking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center justify-between p-4 rounded-lg border ${getRankStyle(index + 1)}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center">
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
                          {ranking.total_predictions} prédictions
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {ranking.total_wins} victoires
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{ranking.total_xp.toLocaleString()}</p>
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
