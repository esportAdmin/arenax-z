"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TierUpgradeModalProps {
  isOpen: boolean;
  tier: string;
  onClose: () => void;
}

export function TierUpgradeModal({
  isOpen,
  tier,
  onClose,
}: TierUpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.8, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 30 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="glass-card p-8 max-w-md w-full text-center space-y-6"
        >
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl">
              <Trophy className="w-10 h-10 text-white" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-display font-bold mb-2">
              Promotion !
            </h2>
            <p className="text-muted-foreground">
              Vous avez atteint la division{" "}
              <span className="font-bold uppercase text-primary">{tier}</span>{" "}
              <Sparkles className="inline w-4 h-4 text-yellow-400" />
            </p>
          </div>

          <Button variant="hero" onClick={onClose} className="w-full">
            Continuer
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
