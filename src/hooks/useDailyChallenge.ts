import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const CHALLENGE_COMPLETED_KEY = "arena_daily_challenge_completed";

export const useDailyChallenge = () => {
  const { user } = useAuth();
  const [hasCompletedToday, setHasCompletedToday] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkChallengeStatus();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const checkChallengeStatus = () => {
    const stored = localStorage.getItem(CHALLENGE_COMPLETED_KEY);
    if (stored) {
      const { date, userId } = JSON.parse(stored);
      const today = new Date().toDateString();
      
      if (date === today && userId === user?.id) {
        setHasCompletedToday(true);
      } else {
        setHasCompletedToday(false);
      }
    } else {
      setHasCompletedToday(false);
    }
    setIsLoading(false);
  };

  const markChallengeComplete = () => {
    const today = new Date().toDateString();
    localStorage.setItem(
      CHALLENGE_COMPLETED_KEY,
      JSON.stringify({ date: today, userId: user?.id })
    );
    setHasCompletedToday(true);
  };

  const resetChallenge = () => {
    localStorage.removeItem(CHALLENGE_COMPLETED_KEY);
    setHasCompletedToday(false);
  };

  return {
    hasCompletedToday,
    isLoading,
    markChallengeComplete,
    resetChallenge,
  };
};
