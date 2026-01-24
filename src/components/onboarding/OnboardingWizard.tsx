import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, 
  Trophy, 
  Users, 
  Gift, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Target,
  TrendingUp,
  Award
} from 'lucide-react';

interface OnboardingWizardProps {
  open: boolean;
  onComplete: () => void;
}

const steps = [
  {
    id: 'welcome',
    icon: Sparkles,
    title: 'Welcome to FanArena Pro',
    subtitle: 'Your esports prediction journey starts here',
    description: 'Predict match outcomes, earn rewards, and compete with fans worldwide. Let us show you around!',
    image: null,
  },
  {
    id: 'predictions',
    icon: Gamepad2,
    title: 'Make Predictions',
    subtitle: 'Bet on your favorite teams',
    description: 'Use your Arena Points to predict match outcomes. Choose wisely — correct predictions earn you rewards and boost your ranking!',
    features: [
      { icon: Target, text: 'Pick winners in live matches' },
      { icon: TrendingUp, text: 'Higher odds = bigger rewards' },
    ],
  },
  {
    id: 'leaderboard',
    icon: Trophy,
    title: 'Climb the Leaderboard',
    subtitle: 'Compete for weekly rewards',
    description: 'Your predictions contribute to your Arena Score. Top predictors earn exclusive badges, Arena Points, and bragging rights!',
    features: [
      { icon: Award, text: 'Weekly rankings with prizes' },
      { icon: Sparkles, text: 'Unlock rare badges' },
    ],
  },
  {
    id: 'clubs',
    icon: Users,
    title: 'Join a Club',
    subtitle: 'Team up with fellow fans',
    description: 'Create or join clubs to compete together. Club Wars, team challenges, and exclusive chat make the experience social and fun!',
    features: [
      { icon: Users, text: 'Collaborate with teammates' },
      { icon: Trophy, text: 'Compete in Club Wars' },
    ],
  },
  {
    id: 'rewards',
    icon: Gift,
    title: 'Earn & Redeem Rewards',
    subtitle: 'Your skills pay off',
    description: 'Earn Arena Points through predictions, challenges, and leveling up. Redeem them in the Rewards Store for exclusive prizes!',
    features: [
      { icon: Gift, text: 'Exclusive merchandise' },
      { icon: Sparkles, text: 'Gift cards & more' },
    ],
  },
];

export function OnboardingWizard({ open, onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden border-border/50 bg-card" hideCloseButton>
        {/* Progress bar */}
        <div className="px-6 pt-6">
          <Progress value={progress} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-2 text-right">
            {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="px-6 py-8"
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <step.icon className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>

            {/* Title & Description */}
            <div className="text-center mb-6">
              <p className="text-sm font-medium text-primary mb-1">{step.subtitle}</p>
              <h2 className="text-2xl font-display font-bold mb-3">{step.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>

            {/* Features */}
            {step.features && (
              <div className="space-y-3">
                {step.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="px-6 pb-6 flex items-center justify-between gap-3">
          {currentStep > 0 ? (
            <Button variant="ghost" onClick={handlePrev} className="gap-1">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          ) : (
            <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
              Skip
            </Button>
          )}

          <Button onClick={handleNext} className="gap-1 min-w-[120px]">
            {currentStep === steps.length - 1 ? (
              <>
                Get Started
                <Sparkles className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        {/* Step indicators */}
        <div className="px-6 pb-6 flex justify-center gap-1.5">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-primary w-6'
                  : index < currentStep
                  ? 'bg-primary/50'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}