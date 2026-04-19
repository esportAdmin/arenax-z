"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Crown, LockKeyhole, Sparkles, Trophy } from "lucide-react";

import { CountdownPill } from "@/components/engagement/CountdownPill";
import { Button } from "@/components/ui/button";
import { getHoursFromNow } from "@/lib/countdown";

interface TierUpgradeModalProps {
  isOpen: boolean;
  tier: string;
  onClose: () => void;
}

const tierColors: Record<string, string> = {
  bronze: "from-amber-700 to-amber-500",
  silver: "from-slate-300 to-slate-100",
  gold: "from-yellow-500 to-yellow-300",
  platinum: "from-cyan-400 to-blue-500",
  diamond: "from-purple-500 to-indigo-600",
  challenger: "from-pink-500 via-purple-500 to-indigo-500",
};

export function TierUpgradeModal({
  isOpen,
  tier,
  onClose,
}: TierUpgradeModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timer = window.setTimeout(onClose, 6000);
    return () => window.clearTimeout(timer);
  }, [isOpen, onClose]);

  const gradient = tierColors[tier] ?? "from-primary to-accent";

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.78 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="command-frame hero-sheen relative w-full max-w-md overflow-hidden p-6 text-center sm:p-8">
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-15`} />

              <div className="relative z-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/5">
                  <Trophy className="h-8 w-8 text-amber-300" />
                </div>

                <div className="mt-4 flex justify-center">
                  <CountdownPill
                    label="Spotlight"
                    target={getHoursFromNow(6)}
                    tone="amber"
                  />
                </div>

                <h2 className="mt-5 text-3xl font-display font-black text-white">
                  Tier promotion secured
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Your profile just crossed into a more prestigious lane. This
                  moment should feel collectible, visible, and worth defending.
                </p>

                <div
                  className={`mt-5 bg-gradient-to-r ${gradient} bg-clip-text text-4xl font-display font-black text-transparent`}
                >
                  {tier.toUpperCase()}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="surface-panel p-4 text-left">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-400">
                      <Crown className="h-4 w-4 text-amber-300" />
                      Prestige unlocked
                    </div>
                    <div className="mt-2 text-sm font-semibold text-white">
                      Your public status just became more desirable.
                    </div>
                  </div>
                  <div className="surface-panel p-4 text-left">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-400">
                      <LockKeyhole className="h-4 w-4 text-primary" />
                      Next tease
                    </div>
                    <div className="mt-2 text-sm font-semibold text-white">
                      The next profile finish now feels close enough to chase.
                    </div>
                  </div>
                </div>

                <Button onClick={onClose} className="mt-6 w-full justify-between">
                  Keep the streak moving
                  <Sparkles className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
