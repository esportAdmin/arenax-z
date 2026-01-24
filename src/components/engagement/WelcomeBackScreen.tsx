import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Flame,
  Trophy,
  Target,
  Star,
  TrendingUp,
  Users,
  Zap,
  Gift,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface WelcomeBackScreenProps {
  userName: string;
  arenaScore: number;
  arenaBalance: number;
  globalRank: number;
  streak: number;
  accuracy: number;
  level: number;
  pointsToNextLevel: number;
  nextLevelPoints: number;
  onStartChallenge: () => void;
  onSkip?: () => void;
}

export const WelcomeBackScreen = ({
  userName,
  arenaScore,
  arenaBalance,
  globalRank,
  streak,
  accuracy,
  level,
  pointsToNextLevel,
  nextLevelPoints,
  onStartChallenge,
}: WelcomeBackScreenProps) => {
  const progressToLevel = ((nextLevelPoints - pointsToNextLevel) / nextLevelPoints) * 100;

  const quickStats = [
    {
      icon: Trophy,
      label: "Score Arena",
      value: arenaScore.toLocaleString(),
      color: "text-primary",
      bgColor: "bg-primary/20",
    },
    {
      icon: TrendingUp,
      label: "Précision",
      value: `${accuracy}%`,
      color: "text-success",
      bgColor: "bg-success/20",
    },
    {
      icon: Users,
      label: "Classement",
      value: `#${globalRank}`,
      color: "text-secondary",
      bgColor: "bg-secondary/20",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />

      <div className="relative w-full max-w-2xl mx-4 overflow-y-auto max-h-[90vh] scrollbar-thin">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 mb-4"
            >
              <Flame className="w-5 h-5 text-accent" />
              <span className="font-medium text-accent">
                Série de {streak} jours 🔥
              </span>
            </motion.div>

            <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">
              Bon retour,{" "}
              <span className="gradient-text-primary">{userName}</span> !
            </h1>
            <p className="text-muted-foreground">
              Ton arène t'attend. Voici ce qui t'attend aujourd'hui.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-3 mb-6"
          >
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="glass-card p-4"
              >
                <div
                  className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mx-auto mb-2`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className={`text-xl font-bold font-display ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Level Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-4 mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Star className="w-4 h-4 text-secondary" />
                </div>
                <span className="font-medium">Niveau {level}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {pointsToNextLevel} pts pour niveau {level + 1}
              </span>
            </div>
            <Progress value={progressToLevel} className="h-2" />
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>Débloque : Badge Élite + Bonus x2</span>
              <span>{Math.round(progressToLevel)}%</span>
            </div>
          </motion.div>

          {/* Main CTA - Daily Challenge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6 mb-6 border-primary/30 glow-cyan"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <div className="text-left">
                <h2 className="font-display font-bold text-xl">
                  Défi du Jour
                </h2>
                <p className="text-sm text-muted-foreground">
                  3 pronostics rapides • Termine en 2 min
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Target className="w-5 h-5 text-primary mx-auto mb-1" />
                <span className="text-xs text-muted-foreground">Match #1</span>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Target className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                <span className="text-xs text-muted-foreground">Match #2</span>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Target className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                <span className="text-xs text-muted-foreground">Match #3</span>
              </div>
            </div>

            <Button
              onClick={onStartChallenge}
              size="lg"
              className="w-full h-14 text-lg font-semibold glow-cyan"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Commencer le Défi
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>

            <div className="flex items-center justify-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-1 text-primary">
                <Gift className="w-4 h-4" />
                <span>+50 ARENA</span>
              </div>
              <div className="flex items-center gap-1 text-accent">
                <Trophy className="w-4 h-4" />
                <span>Badge Réactif</span>
              </div>
            </div>
          </motion.div>

          {/* Balance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
          >
            <span>Solde disponible :</span>
            <span className="font-bold text-foreground">
              {arenaBalance.toLocaleString()} ARENA
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
