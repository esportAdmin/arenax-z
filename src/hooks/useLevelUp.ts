import { useState, useEffect, useCallback } from "react";
import { useGameNotifications } from "@/contexts/NotificationContext";

interface UseLevelUpOptions {
  currentLevel: number;
  enabled?: boolean;
}

export function useLevelUp({ currentLevel, enabled = true }: UseLevelUpOptions) {
  const [previousLevel, setPreviousLevel] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationLevel, setCelebrationLevel] = useState(1);
  
  // Try to get notifications, but don't fail if not in provider
  let notifyLevelUp: ((level: number) => void) | null = null;
  try {
    const notifications = useGameNotifications();
    notifyLevelUp = notifications.notifyLevelUp;
  } catch {
    // Not in notification provider context
  }

  useEffect(() => {
    if (!enabled) return;
    
    // Initialize previous level on first render
    if (previousLevel === null) {
      setPreviousLevel(currentLevel);
      return;
    }

    // Detect level up
    if (currentLevel > previousLevel) {
      setCelebrationLevel(currentLevel);
      setShowCelebration(true);
      
      // Send notification
      if (notifyLevelUp) {
        notifyLevelUp(currentLevel);
      }
    }

    setPreviousLevel(currentLevel);
  }, [currentLevel, previousLevel, enabled, notifyLevelUp]);

  const closeCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);

  // Manual trigger for testing
  const triggerCelebration = useCallback((level: number) => {
    setCelebrationLevel(level);
    setShowCelebration(true);
    if (notifyLevelUp) {
      notifyLevelUp(level);
    }
  }, [notifyLevelUp]);

  return {
    showCelebration,
    celebrationLevel,
    closeCelebration,
    triggerCelebration,
  };
}
