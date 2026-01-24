import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Swords, Clock, Trophy, Target, TrendingUp, Check, X, 
  Loader2, Zap, Users, Calendar, Shield 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ClubWar, useClubWars } from '@/hooks/useClubWars';
import { toast } from 'sonner';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useClubs } from '@/hooks/useClubs';

const getStatusBadge = (status: ClubWar['status']) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">En attente</Badge>;
    case 'active':
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">En cours</Badge>;
    case 'completed':
      return <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">Terminée</Badge>;
    case 'declined':
      return <Badge variant="outline" className="bg-muted text-muted-foreground">Refusée</Badge>;
  }
};

interface ClubWarsProps {
  clubId?: string;
}

export const ClubWars = ({ clubId }: ClubWarsProps) => {
  const { wars, activeWar, pendingWars, loading, userClubId, isAdmin, createWar, respondToWar } = useClubWars(clubId);
  const { clubs, myClub } = useClubs();
  const [showChallengeDialog, setShowChallengeDialog] = useState(false);
  const [selectedClub, setSelectedClub] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);

  const eligibleClubs = clubs.filter(c => c.id !== myClub?.id);

  const handleCreateWar = async () => {
    if (!selectedClub) return;
    
    setIsCreating(true);
    const result = await createWar(selectedClub);
    setIsCreating(false);
    
    if (result.success) {
      toast.success('Défi envoyé !');
      setShowChallengeDialog(false);
      setSelectedClub(null);
    } else {
      toast.error(result.error || 'Erreur');
    }
  };

  const handleRespond = async (warId: string, accept: boolean) => {
    setRespondingTo(warId);
    const result = await respondToWar(warId, accept);
    setRespondingTo(null);
    
    if (result.success) {
      toast.success(accept ? 'Guerre acceptée !' : 'Guerre refusée');
    } else {
      toast.error(result.error || 'Erreur');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Swords className="h-6 w-6 text-red-500" />
            Guerres de Clubs
          </h2>
          <p className="text-muted-foreground text-sm">
            Défiez d'autres clubs et gagnez des récompenses
          </p>
        </div>
        {isAdmin && !activeWar && pendingWars.length === 0 && (
          <Button onClick={() => setShowChallengeDialog(true)} className="gap-2">
            <Swords className="h-4 w-4" />
            Défier un club
          </Button>
        )}
      </div>

      {/* Pending Wars (Incoming Challenges) */}
      {pendingWars.length > 0 && (
        <Card className="border-yellow-500/50 bg-yellow-500/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-500" />
              Défis en attente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingWars.map((war) => (
              <motion.div
                key={war.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50 border"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-yellow-500">
                    <AvatarImage src={war.challenger.logo_url || undefined} />
                    <AvatarFallback>{war.challenger.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">{war.challenger.name}</p>
                    <p className="text-sm text-muted-foreground">
                      vous défie en duel • {war.xp_reward} XP en jeu
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
                      {respondingTo === war.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleRespond(war.id, true)}
                      disabled={respondingTo === war.id}
                      className="gap-1"
                    >
                      {respondingTo === war.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      Accepter
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Active War */}
      {activeWar && (
        <Card className="border-red-500/50 bg-gradient-to-br from-red-500/10 to-orange-500/10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <Swords className="h-5 w-5 text-red-500 animate-pulse" />
                Guerre en cours
              </CardTitle>
              {getStatusBadge(activeWar.status)}
            </div>
            {activeWar.end_date && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Fin dans {formatDistanceToNow(new Date(activeWar.end_date), { locale: fr })}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {/* VS Display */}
            <div className="grid grid-cols-3 gap-4 items-center mb-6">
              {/* Challenger */}
              <div className="text-center">
                <Avatar className="h-20 w-20 mx-auto border-4 border-blue-500 mb-2">
                  <AvatarImage src={activeWar.challenger.logo_url || undefined} />
                  <AvatarFallback className="text-2xl">{activeWar.challenger.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="font-bold">{activeWar.challenger.name}</p>
                <p className="text-3xl font-display font-bold text-blue-500">{activeWar.challenger_xp}</p>
                <p className="text-xs text-muted-foreground">XP</p>
              </div>

              {/* VS */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <span className="text-2xl font-display font-bold text-white">VS</span>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">Récompense</p>
                  <p className="text-lg font-bold text-primary">{activeWar.xp_reward} XP</p>
                </div>
              </div>

              {/* Defender */}
              <div className="text-center">
                <Avatar className="h-20 w-20 mx-auto border-4 border-purple-500 mb-2">
                  <AvatarImage src={activeWar.defender.logo_url || undefined} />
                  <AvatarFallback className="text-2xl">{activeWar.defender.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="font-bold">{activeWar.defender.name}</p>
                <p className="text-3xl font-display font-bold text-purple-500">{activeWar.defender_xp}</p>
                <p className="text-xs text-muted-foreground">XP</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-4 rounded-full bg-muted overflow-hidden mb-4">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                style={{ 
                  width: `${activeWar.challenger_xp + activeWar.defender_xp > 0 
                    ? (activeWar.challenger_xp / (activeWar.challenger_xp + activeWar.defender_xp)) * 100 
                    : 50}%` 
                }}
              />
              <div 
                className="absolute right-0 top-0 h-full bg-gradient-to-l from-purple-500 to-purple-600 transition-all"
                style={{ 
                  width: `${activeWar.challenger_xp + activeWar.defender_xp > 0 
                    ? (activeWar.defender_xp / (activeWar.challenger_xp + activeWar.defender_xp)) * 100 
                    : 50}%` 
                }}
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    Pronostics
                  </span>
                  <span className="font-bold">{activeWar.challenger_predictions}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Victoires
                  </span>
                  <span className="font-bold">{activeWar.challenger_wins}</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    Pronostics
                  </span>
                  <span className="font-bold">{activeWar.defender_predictions}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Victoires
                  </span>
                  <span className="font-bold">{activeWar.defender_wins}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* War History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historique des guerres</CardTitle>
        </CardHeader>
        <CardContent>
          {wars.filter(w => w.status === 'completed').length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Swords className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune guerre terminée</p>
            </div>
          ) : (
            <div className="space-y-3">
              {wars
                .filter(w => w.status === 'completed')
                .map((war) => {
                  const isWinner = war.winner_id === userClubId;
                  const isDraw = !war.winner_id;
                  
                  return (
                    <motion.div
                      key={war.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        isDraw 
                          ? 'bg-muted/30' 
                          : isWinner 
                            ? 'bg-green-500/10 border-green-500/30' 
                            : 'bg-red-500/10 border-red-500/30'
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
                          <Badge variant="outline">Égalité</Badge>
                        ) : isWinner ? (
                          <Badge className="bg-green-500/20 text-green-400">
                            <Trophy className="h-3 w-3 mr-1" />
                            Victoire
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-400">Défaite</Badge>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Challenge Dialog */}
      <Dialog open={showChallengeDialog} onOpenChange={setShowChallengeDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Swords className="h-5 w-5 text-red-500" />
              Défier un club
            </DialogTitle>
            <DialogDescription>
              Choisissez un club à défier. La guerre durera 7 jours.
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-64 overflow-y-auto space-y-2">
            {eligibleClubs.map((club) => (
              <div
                key={club.id}
                onClick={() => setSelectedClub(club.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedClub === club.id 
                    ? 'border-primary bg-primary/10' 
                    : 'hover:border-muted-foreground/50'
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
                {selectedClub === club.id && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChallengeDialog(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleCreateWar} 
              disabled={!selectedClub || isCreating}
              className="gap-2"
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Swords className="h-4 w-4" />
              )}
              Envoyer le défi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
