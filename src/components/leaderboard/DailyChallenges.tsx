"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Flame, LockKeyhole, Target, Trophy } from "lucide-react";

import { CountdownPill } from "@/components/engagement/CountdownPill";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getNextUtcMidnight } from "@/lib/countdown";

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  target: number;
  completed: boolean;
  icon: typeof Target;
}

const challenges: Challenge[] = [
  {
    id: "1",
    title: "Predictor of the Day",
    description: "Make 5 live calls before reset",
    reward: 100,
    progress: 3,
    target: 5,
    completed: false,
    icon: Target,
  },
  {
    id: "2",
    title: "On Fire",
    description: "Hit 3 live calls in a row",
    reward: 150,
    progress: 2,
    target: 3,
    completed: false,
    icon: Flame,
  },
  {
    id: "3",
    title: "Beat the Champion",
    description: "Outscore today's #1 player",
    reward: 250,
    progress: 0,
    target: 1,
    completed: false,
    icon: Trophy,
  },
];

export function DailyChallenges() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="section-shell"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="eyebrow-badge">
            <Target className="h-4 w-4 text-primary" />
            Daily challenges
          </div>
          <h3 className="mt-3 text-2xl font-display font-bold text-white">
            Small wins that keep tomorrow alive
          </h3>
        </div>
        <CountdownPill label="Reset" target={getNextUtcMidnight()} tone="cyan" />
      </div>

      <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-300">
        These missions should feel light enough to start immediately and rich
        enough to justify reopening the app before the window closes.
      </div>

      <div className="mt-5 space-y-3">
        {challenges.map((challenge, index) => {
          const Icon = challenge.icon;
          const progressPercent = (challenge.progress / challenge.target) * 100;

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.08 }}
              className={`surface-panel p-4 ${
                challenge.completed ? "border-emerald-400/20 bg-emerald-400/8" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                    challenge.completed
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                      : "border-white/10 bg-white/5 text-primary"
                  }`}
                >
                  {challenge.completed ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {challenge.title}
                      </h4>
                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        {challenge.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-lg font-bold text-amber-300">
                        +{challenge.reward}
                      </div>
                      <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                        ARENA
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                      <span>Progress</span>
                      <span className="font-medium text-white">
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

      <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <LockKeyhole className="h-4 w-4 text-slate-200" />
          Elite challenge lane unlocks after your next completed streak
        </div>
      </div>

      <Button variant="hero" size="sm" className="mt-4 w-full justify-between">
        View all challenges
        <Target className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
