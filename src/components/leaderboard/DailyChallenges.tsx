import { motion } from "framer-motion";
import { Target, Flame, Trophy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  reward: number;
  progress: number;
  target: number;
  completed: boolean;
}

const challenges: Challenge[] = [
  {
    id: "1",
    title: "Prédicteur du Jour",
    description: "Faire 5 prédictions aujourd'hui",
    icon: Target,
    reward: 100,
    progress: 3,
    target: 5,
    completed: false,
  },
  {
    id: "2",
    title: "En Feu",
    description: "Gagner 3 prédictions d'affilée",
    icon: Flame,
    reward: 150,
    progress: 2,
    target: 3,
    completed: false,
  },
  {
    id: "3",
    title: "Battre le Champion",
    description: "Surpasser le score du #1 du jour",
    icon: Trophy,
    reward: 250,
    progress: 0,
    target: 1,
    completed: false,
  },
];

export function DailyChallenges() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-display font-bold text-lg">Défis du Jour</h3>
        </div>
        <div className="text-xs text-muted-foreground">
          Reset dans 8h
        </div>
      </div>

      <div className="space-y-4">
        {challenges.map((challenge, index) => {
          const Icon = challenge.icon;
          const progressPercent = (challenge.progress / challenge.target) * 100;

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`p-4 rounded-xl border transition-all ${
                challenge.completed
                  ? "bg-success/10 border-success/30"
                  : "bg-muted/30 border-border/50 hover:border-primary/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    challenge.completed
                      ? "bg-success/20 text-success"
                      : "bg-primary/20 text-primary"
                  }`}
                >
                  {challenge.completed ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-sm">{challenge.title}</h4>
                    <div className="flex items-center gap-1 text-accent text-sm font-display">
                      +{challenge.reward}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {challenge.description}
                  </p>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progression</span>
                      <span className="font-medium">
                        {challenge.progress}/{challenge.target}
                      </span>
                    </div>
                    <Progress value={progressPercent} className="h-1.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Button variant="hero" size="sm" className="w-full mt-4">
        Voir tous les défis
      </Button>
    </motion.div>
  );
}
