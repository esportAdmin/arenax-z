import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  Flame,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface Challenge {
  id: number;
  question: string;
  type: "winner" | "score" | "mvp";
  options: { id: string; label: string; signal?: string }[];
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
    question: "Who takes this series?",
    type: "winner",
    match: {
      teamA: "Team Vitality",
      teamB: "G2 Esports",
      date: "Today - 8:00 PM",
      tournament: "BLAST Premier",
    },
    options: [
      { id: "vitality", label: "Team Vitality", signal: "185" },
      { id: "g2", label: "G2 Esports", signal: "210" },
    ],
  },
  {
    id: 2,
    question: "How long does it go?",
    type: "score",
    match: {
      teamA: "NAVI",
      teamB: "FaZe Clan",
      date: "Tomorrow - 6:00 PM",
      tournament: "IEM Katowice",
    },
    options: [
      { id: "2maps", label: "Fast closeout (2-0)", signal: "240" },
      { id: "3maps", label: "Distance battle (2-1)", signal: "165" },
    ],
  },
  {
    id: 3,
    question: "Who becomes the headline player?",
    type: "mvp",
    match: {
      teamA: "Cloud9",
      teamB: "Heroic",
      date: "Tomorrow - 9:00 PM",
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
  userName,
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
      setTimeout(() => {
        onComplete(selections);
        setCurrentStep(0);
        setSelections({});
        setIsSubmitting(false);
      }, 700);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "winner":
        return <Trophy className="h-5 w-5 text-amber-300" />;
      case "score":
        return <Target className="h-5 w-5 text-cyan-300" />;
      case "mvp":
        return <Flame className="h-5 w-5 text-fuchsia-300" />;
      default:
        return <Zap className="h-5 w-5 text-cyan-300" />;
    }
  };

  return (
    <Dialog open={isOpen} modal>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden border-cyan-400/20 bg-[linear-gradient(180deg,rgba(10,18,40,0.98),rgba(7,11,24,0.98))] p-0 [&>button]:hidden">
        <DialogTitle className="sr-only">
          Daily comeback mission
        </DialogTitle>
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,245,255,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,182,72,0.12),transparent_32%)]" />

          <div className="relative border-b border-white/8 p-6 pb-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <div className="eyebrow-badge">Daily comeback mission</div>
                  <div>
                    <h2 className="font-display text-3xl font-black text-white">
                      {userName ? `${userName.split("@")[0]}, lock in today.` : "Lock in today."}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                      Three fast reads. One clear reward. A simple reason to
                      return tomorrow and defend momentum.
                    </p>
                  </div>
                </div>

                {currentStreak > 0 ? (
                  <div className="metal-chip border-amber-400/20 bg-amber-400/10 text-amber-200">
                    <Flame className="h-4 w-4" />
                    {currentStreak}-day momentum
                  </div>
                ) : null}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>
                    Challenge step {currentStep + 1}/{dailyChallenges.length}
                  </span>
                  <span>{Math.round(progress)}% complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>

          <div className="relative p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="surface-panel border-white/10 bg-white/[0.03] p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">
                      {currentChallenge.match.tournament}
                    </span>
                    {getTypeIcon(currentChallenge.type)}
                  </div>

                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-2 text-center">
                    <div>
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg font-black text-white">
                        {currentChallenge.match.teamA.charAt(0)}
                      </div>
                      <div className="mt-2 text-sm font-semibold text-white">
                        {currentChallenge.match.teamA}
                      </div>
                    </div>

                    <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-sm font-bold text-cyan-200">
                      VS
                    </div>

                    <div>
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg font-black text-white">
                        {currentChallenge.match.teamB.charAt(0)}
                      </div>
                      <div className="mt-2 text-sm font-semibold text-white">
                        {currentChallenge.match.teamB}
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-center text-xs text-slate-500">
                    {currentChallenge.match.date}
                  </p>
                </div>

                <div>
                  <h3 className="text-center text-2xl font-black text-white">
                    {currentChallenge.question}
                  </h3>
                  <p className="mt-2 text-center text-sm text-slate-400">
                    Pick the strongest read and move fast.
                  </p>
                </div>

                <div className="grid gap-3">
                  {currentChallenge.options.map((option) => {
                    const isSelected =
                      selections[currentChallenge.id] === option.id;

                    return (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleSelect(option.id)}
                        className={`relative rounded-2xl border p-4 text-left transition-all ${
                          isSelected
                            ? "border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_24px_rgba(34,211,238,0.12)]"
                            : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-medium text-white">
                            {option.label}
                          </span>
                          {option.signal ? (
                            <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1 text-sm font-semibold text-fuchsia-200">
                              {option.signal} signal
                            </span>
                          ) : null}
                        </div>

                        {isSelected ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                          >
                            <Check className="h-5 w-5 text-cyan-300" />
                          </motion.div>
                        ) : null}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="border-t border-white/8 p-6 pt-5">
            <Button
              onClick={handleNext}
              disabled={!hasSelection || isSubmitting}
              className="w-full h-12 text-base font-semibold"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Locking challenge...
                </span>
              ) : isLastStep ? (
                <span className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Confirm my challenge
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Next pick
                  <ChevronRight className="h-5 w-5" />
                </span>
              )}
            </Button>

            <p className="mt-3 text-center text-xs text-slate-500">
              Reward: <span className="font-medium text-cyan-300">+50 ARENA</span>{" "}
              and stronger daily momentum
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
