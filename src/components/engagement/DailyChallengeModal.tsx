import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Zap, Trophy, Flame, Target, ChevronRight, Check } from "lucide-react";

interface Challenge {
  id: number;
  question: string;
  type: "winner" | "score" | "mvp";
  options: { id: string; label: string; odds?: string }[];
  match: {
    teamA: string;
    teamB: string;
    date: string;
    tournament: string;
  };
}

const dailyChallenges: Challenge[] = [
  {
    id: 1,
    question: "Qui remporte ce match ?",
    type: "winner",
    match: {
      teamA: "Team Vitality",
      teamB: "G2 Esports",
      date: "Aujourd'hui - 20:00",
      tournament: "BLAST Premier",
    },
    options: [
      { id: "vitality", label: "Team Vitality", odds: "1.85" },
      { id: "g2", label: "G2 Esports", odds: "2.10" },
    ],
  },
  {
    id: 2,
    question: "Nombre de maps joués ?",
    type: "score",
    match: {
      teamA: "NAVI",
      teamB: "FaZe Clan",
      date: "Demain - 18:00",
      tournament: "IEM Katowice",
    },
    options: [
      { id: "2maps", label: "2 Maps (2-0)", odds: "2.40" },
      { id: "3maps", label: "3 Maps (2-1)", odds: "1.65" },
    ],
  },
  {
    id: 3,
    question: "Quel joueur sera MVP ?",
    type: "mvp",
    match: {
      teamA: "Cloud9",
      teamB: "Heroic",
      date: "Demain - 21:00",
      tournament: "ESL Pro League",
    },
    options: [
      { id: "player1", label: "electronic (C9)" },
      { id: "player2", label: "Boombl4 (C9)" },
      { id: "player3", label: "TeSeS (Heroic)" },
      { id: "player4", label: "cadiaN (Heroic)" },
    ],
  },
];

interface DailyChallengeModalProps {
  isOpen: boolean;
  onComplete: (selections: Record<number, string>) => void;
  userName?: string;
  currentStreak?: number;
}

export const DailyChallengeModal = ({
  isOpen,
  onComplete,
  userName = "Champion",
  currentStreak = 0,
}: DailyChallengeModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = ((currentStep + 1) / dailyChallenges.length) * 100;
  const currentChallenge = dailyChallenges[currentStep];
  const isLastStep = currentStep === dailyChallenges.length - 1;
  const hasSelection = selections[currentChallenge?.id];

  const handleSelect = (optionId: string) => {
    setSelections((prev) => ({
      ...prev,
      [currentChallenge.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (isLastStep) {
      setIsSubmitting(true);
      // Simulate submission
      setTimeout(() => {
        onComplete(selections);
      }, 800);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "winner":
        return <Trophy className="w-5 h-5 text-accent" />;
      case "score":
        return <Target className="w-5 h-5 text-primary" />;
      case "mvp":
        return <Flame className="w-5 h-5 text-secondary" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <Dialog open={isOpen} modal>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden bg-card border-primary/30 [&>button]:hidden">
        {/* Header */}
        <div className="relative p-6 pb-4 bg-gradient-to-b from-primary/10 to-transparent">
          <div className="absolute inset-0 cyber-grid opacity-30" />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/20 glow-cyan">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl">
                  Défi Quotidien
                </h2>
                <p className="text-sm text-muted-foreground">
                  3 prédictions rapides pour +50 ARENA
                </p>
              </div>
            </div>

            {/* Streak Badge */}
            {currentStreak > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/30"
              >
                <Flame className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">
                  Série de {currentStreak} jours 🔥
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Progress */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Pronostic {currentStep + 1}/{dailyChallenges.length}
              </span>
              <span>{Math.round(progress)}% complété</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Challenge Content */}
        <div className="p-6 pt-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Match Info */}
              <div className="glass-card p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-primary uppercase tracking-wider">
                    {currentChallenge.match.tournament}
                  </span>
                  {getTypeIcon(currentChallenge.type)}
                </div>
                <div className="flex items-center justify-center gap-4 py-2">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-1">
                      <span className="text-lg font-bold">
                        {currentChallenge.match.teamA.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {currentChallenge.match.teamA}
                    </span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-bold">
                    VS
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-1">
                      <span className="text-lg font-bold">
                        {currentChallenge.match.teamB.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {currentChallenge.match.teamB}
                    </span>
                  </div>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-2">
                  {currentChallenge.match.date}
                </p>
              </div>

              {/* Question */}
              <h3 className="text-lg font-semibold mb-4 text-center">
                {currentChallenge.question}
              </h3>

              {/* Options */}
              <div className="grid gap-3">
                {currentChallenge.options.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(option.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                      selections[currentChallenge.id] === option.id
                        ? "border-primary bg-primary/10 glow-cyan"
                        : "border-border hover:border-primary/50 bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.label}</span>
                      {option.odds && (
                        <span className="px-2 py-1 rounded-md bg-secondary/20 text-secondary text-sm font-mono">
                          x{option.odds}
                        </span>
                      )}
                    </div>
                    {selections[currentChallenge.id] === option.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1/2 -translate-y-1/2 right-4"
                      >
                        <Check className="w-5 h-5 text-primary" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <Button
            onClick={handleNext}
            disabled={!hasSelection || isSubmitting}
            className="w-full h-12 text-base font-semibold"
            variant="default"
          >
            {isSubmitting ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Validation...
              </motion.div>
            ) : isLastStep ? (
              <span className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Valider mes pronostics
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Suivant
                <ChevronRight className="w-5 h-5" />
              </span>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-3">
            Récompense : <span className="text-primary font-medium">+50 ARENA</span>{" "}
            + <span className="text-accent font-medium">Badge Réactif</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
