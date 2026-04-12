import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Gift,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface OnboardingWizardProps {
  open: boolean;
  onComplete: () => void;
}

const steps = [
  {
    id: "welcome",
    icon: Sparkles,
    title: "Welcome to FanArena Pro",
    subtitle: "Your community competition journey starts here",
    description:
      "Join clubs, make live calls, earn rewards, and compete with fans worldwide. Let's give you a quick tour.",
    image: null,
  },
  {
    id: "live-calls",
    icon: Gamepad2,
    title: "Make Live Calls",
    subtitle: "Back the teams you believe in",
    description:
      "Use your Arena Points to make live calls on match outcomes. Strong reads earn rewards and move you up the leaderboard.",
    features: [
      { icon: Target, text: "Call winners in live matches" },
      { icon: TrendingUp, text: "Stronger reads grow your reward momentum" },
    ],
  },
  {
    id: "leaderboard",
    icon: Trophy,
    title: "Climb the Leaderboard",
    subtitle: "Compete for weekly rewards",
    description:
      "Your live calls contribute to your Arena Score. Top community operators earn exclusive badges, Arena Points, and serious bragging rights.",
    features: [
      { icon: Award, text: "Weekly rankings with prizes" },
      { icon: Sparkles, text: "Unlock rare badges" },
    ],
  },
  {
    id: "clubs",
    icon: Users,
    title: "Join a Club",
    subtitle: "Team up with fellow fans",
    description:
      "Create or join clubs to compete together. Club Wars, team challenges, and exclusive chat make the experience social and fun.",
    features: [
      { icon: Users, text: "Collaborate with teammates" },
      { icon: Trophy, text: "Compete in Club Wars" },
    ],
  },
  {
    id: "rewards",
    icon: Gift,
    title: "Earn and Redeem Rewards",
    subtitle: "Your consistency pays off",
    description:
      "Earn Arena Points through live calls, challenges, and leveling up. Redeem them in the Rewards Store for exclusive prizes.",
    features: [
      { icon: Gift, text: "Exclusive merchandise" },
      { icon: Sparkles, text: "Gift cards and more" },
    ],
  },
] as const;

export function OnboardingWizard({
  open,
  onComplete,
}: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }

    onComplete();
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="gap-0 overflow-hidden border-border/50 bg-card p-0 sm:max-w-lg"
        hideCloseButton
      >
        <div className="px-6 pt-6">
          <Progress value={progress} className="h-1.5" />
          <p className="mt-2 text-right text-xs text-muted-foreground">
            {currentStep + 1} of {steps.length}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="px-6 py-8"
          >
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary">
                <step.icon className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>

            <div className="mb-6 text-center">
              <p className="mb-1 text-sm font-medium text-primary">
                {step.subtitle}
              </p>
              <h2 className="mb-3 text-2xl font-display font-bold">
                {step.title}
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>

            {"features" in step && step.features ? (
              <div className="space-y-3">
                {step.features.map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="flex items-center gap-3 rounded-lg bg-muted/50 p-3"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between gap-3 px-6 pb-6">
          {currentStep > 0 ? (
            <Button variant="ghost" onClick={handlePrev} className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={onComplete}
              className="text-muted-foreground"
            >
              Skip
            </Button>
          )}

          <Button onClick={handleNext} className="min-w-[120px] gap-1">
            {currentStep === steps.length - 1 ? (
              <>
                Get Started
                <Sparkles className="h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        <div className="flex justify-center gap-1.5 px-6 pb-6">
          {steps.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setCurrentStep(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? "w-6 bg-primary"
                  : index < currentStep
                    ? "w-2 bg-primary/50"
                    : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
