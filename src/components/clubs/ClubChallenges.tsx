import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, Trophy, Zap, Flame, Shield, Crown, Clock, 
  Gift, Users, Loader2, Check, Play
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ClubChallenge, useClubChallenges } from '@/hooks/useClubChallenges';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  target: Target,
  trophy: Trophy,
  zap: Zap,
  flame: Flame,
  shield: Shield,
  crown: Crown,
};

const difficultyColors = {
  easy: 'bg-green-500/20 text-green-400 border-green-500/30',
  normal: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  hard: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  legendary: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const difficultyLabels = {
  easy: 'Facile',
  normal: 'Normal',
  hard: 'Difficile',
  legendary: 'Légendaire',
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
    claimReward 
  } = useClubChallenges(clubId);
  
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [isStarting, setIsStarting] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);

  const handleStartChallenge = async (templateId: string) => {
    setIsStarting(templateId);
    const result = await startChallenge(templateId);
    setIsStarting(null);
    
    if (result.success) {
      toast.success('Défi lancé !');
      setShowTemplateDialog(false);
    } else {
      toast.error(result.error || 'Erreur');
    }
  };

  const handleClaimReward = async () => {
    if (!activeChallenge) return;
    
    setIsClaiming(true);
    const result = await claimReward(activeChallenge.id);
    setIsClaiming(false);
    
    if (result.success) {
      toast.success('Récompenses réclamées !');
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

  const progressPercent = activeChallenge 
    ? Math.min((activeChallenge.current_value / activeChallenge.target_value) * 100, 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Défis Collectifs
          </h2>
          <p className="text-muted-foreground text-sm">
            Travaillez ensemble pour atteindre des objectifs communs
          </p>
        </div>
        {isAdmin && !activeChallenge && (
          <Button onClick={() => setShowTemplateDialog(true)} className="gap-2">
            <Play className="h-4 w-4" />
            Lancer un défi
          </Button>
        )}
      </div>

      {/* Active Challenge */}
      {activeChallenge ? (
        <Card className="border-primary/50 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {(() => {
                  const IconComponent = iconMap[activeChallenge.template.icon] || Target;
                  return (
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                  );
                })()}
                <div>
                  <CardTitle className="text-xl">{activeChallenge.template.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{activeChallenge.template.description}</p>
                </div>
              </div>
              <Badge className={difficultyColors[activeChallenge.template.difficulty]}>
                {difficultyLabels[activeChallenge.template.difficulty]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progression</span>
                <span className="font-bold">
                  {activeChallenge.current_value} / {activeChallenge.target_value}
                </span>
              </div>
              <Progress value={progressPercent} className="h-3" />
            </div>

            {/* Time remaining */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {activeChallenge.status === 'completed' 
                  ? 'Défi complété !'
                  : `Temps restant : ${formatDistanceToNow(new Date(activeChallenge.end_date), { locale: fr })}`
                }
              </span>
            </div>

            {/* Rewards */}
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="font-semibold">{activeChallenge.template.xp_reward} XP</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-accent" />
                <span className="font-semibold">{activeChallenge.template.arena_points_reward} AP</span>
              </div>
            </div>

            {/* Top Contributors */}
            {activeChallenge.contributions && activeChallenge.contributions.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Top Contributeurs
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeChallenge.contributions.slice(0, 5).map((c, i) => (
                    <div 
                      key={c.user_id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-sm"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={c.profile?.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">
                          {c.profile?.display_name?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <span>{c.profile?.display_name || 'Anonyme'}</span>
                      <Badge variant="outline" className="text-xs">
                        +{c.contribution_value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Claim Button */}
            {activeChallenge.status === 'completed' && !activeChallenge.rewards_claimed && isAdmin && (
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
                Réclamer les récompenses
              </Button>
            )}

            {activeChallenge.rewards_claimed && (
              <div className="flex items-center justify-center gap-2 text-green-500">
                <Check className="h-5 w-5" />
                <span>Récompenses réclamées</span>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Target className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-bold text-xl mb-2">Aucun défi actif</h3>
            <p className="text-muted-foreground mb-4">
              {isAdmin 
                ? 'Lancez un nouveau défi pour motiver votre équipe !'
                : 'Votre club n\'a pas de défi actif pour le moment.'
              }
            </p>
            {isAdmin && (
              <Button onClick={() => setShowTemplateDialog(true)} className="gap-2">
                <Play className="h-4 w-4" />
                Choisir un défi
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Past Challenges */}
      {pastChallenges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Historique des défis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastChallenges.slice(0, 5).map((challenge) => {
                const IconComponent = iconMap[challenge.template.icon] || Target;
                const isCompleted = challenge.status === 'completed';
                
                return (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      isCompleted 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isCompleted ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                        <IconComponent className={`h-5 w-5 ${
                          isCompleted ? 'text-green-500' : 'text-red-500'
                        }`} />
                      </div>
                      <div>
                        <p className="font-semibold">{challenge.template.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {challenge.current_value} / {challenge.target_value}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={
                      isCompleted ? 'text-green-500' : 'text-red-500'
                    }>
                      {isCompleted ? 'Complété' : 'Échoué'}
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template Selection Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Choisir un défi
            </DialogTitle>
            <DialogDescription>
              Sélectionnez un défi collectif pour votre club
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
                  className="p-4 rounded-lg border hover:border-primary/50 transition-all cursor-pointer group"
                  onClick={() => !isStarting && handleStartChallenge(template.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold">{template.title}</h4>
                        <Badge className={difficultyColors[template.difficulty]}>
                          {difficultyLabels[template.difficulty]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          Objectif: {template.target_value}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {template.duration_days} jours
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
                    <Button
                      size="sm"
                      disabled={isStarting === template.id}
                      className="shrink-0"
                    >
                      {isStarting === template.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-1" />
                          Lancer
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
