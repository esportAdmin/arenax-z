import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useGameNotifications } from "@/contexts/NotificationContext";

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  challenge_type: string;
  requirement_value: number;
  icon: string;
}

export interface UserChallenge {
  id: string;
  challenge_id: string;
  challenge_date: string;
  progress: number;
  completed: boolean;
  completed_at: string | null;
  xp_claimed: boolean;
  challenge: DailyChallenge;
}

export function useDailyChallenges() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  let notifyChallengeComplete: ((title: string, xp: number) => void) | null =
    null;
  try {
    const notifications = useGameNotifications();
    notifyChallengeComplete = notifications.notifyChallengeComplete;
  } catch {
    notifyChallengeComplete = null;
  }

  const fetchChallenges = useCallback(async () => {
    if (!user) {
      setChallenges([]);
      setUserChallenges([]);
      setLoading(false);
      return;
    }

    try {
      const { data: challengesData, error: challengesError } = await supabase
        .from("daily_challenges")
        .select("*")
        .eq("active", true);

      if (challengesError) {
        throw challengesError;
      }

      setChallenges(challengesData || []);

      const today = new Date().toISOString().split("T")[0];
      const { data: userChallengesData, error: userChallengesError } =
        await supabase
          .from("user_daily_challenges")
          .select(
            `
            *,
            challenge:daily_challenges(*)
          `,
          )
          .eq("user_id", user.id)
          .eq("challenge_date", today);

      if (userChallengesError) {
        throw userChallengesError;
      }

      const existingChallengeIds = (userChallengesData || []).map(
        (challenge) => challenge.challenge_id,
      );
      const missingChallenges = (challengesData || []).filter(
        (challenge) => !existingChallengeIds.includes(challenge.id),
      );

      if (missingChallenges.length > 0) {
        const newUserChallenges = missingChallenges.map((challenge) => ({
          user_id: user.id,
          challenge_id: challenge.id,
          challenge_date: today,
          progress: 0,
          completed: false,
          xp_claimed: false,
        }));

        const { error: insertError } = await supabase
          .from("user_daily_challenges")
          .insert(newUserChallenges);

        if (insertError) {
          throw insertError;
        }

        const { data: refreshedData } = await supabase
          .from("user_daily_challenges")
          .select(
            `
            *,
            challenge:daily_challenges(*)
          `,
          )
          .eq("user_id", user.id)
          .eq("challenge_date", today);

        setUserChallenges(refreshedData || []);
      } else {
        setUserChallenges(userChallengesData || []);
      }

      const loginChallenge = (userChallengesData || []).find(
        (challenge) =>
          challenge.challenge?.challenge_type === "login" &&
          !challenge.completed,
      );
      if (loginChallenge) {
        await supabase
          .from("user_daily_challenges")
          .update({
            progress: 1,
            completed: true,
            completed_at: new Date().toISOString(),
          })
          .eq("id", loginChallenge.id);

        const { data: refreshedData } = await supabase
          .from("user_daily_challenges")
          .select(
            `
            *,
            challenge:daily_challenges(*)
          `,
          )
          .eq("user_id", user.id)
          .eq("challenge_date", today);
        setUserChallenges(refreshedData || []);
      }
    } catch {
      setChallenges([]);
      setUserChallenges([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const claimReward = async (userChallengeId: string) => {
    const userChallenge = userChallenges.find(
      (challenge) => challenge.id === userChallengeId,
    );

    try {
      const { data, error } = await supabase.rpc("claim_challenge_reward", {
        p_user_challenge_id: userChallengeId,
      });

      if (error) {
        throw error;
      }

      const result = data as {
        success: boolean;
        xp_earned?: number;
        error?: string;
      };

      if (result.success) {
        if (notifyChallengeComplete && userChallenge) {
          notifyChallengeComplete(
            userChallenge.challenge.title,
            result.xp_earned || 0,
          );
        }

        toast({
          title: "XP claimed",
          description: `+${result.xp_earned} XP added to your profile.`,
        });

        fetchChallenges();
        return { success: true, xpEarned: result.xp_earned };
      }

      throw new Error(result.error);
    } catch (error: any) {
      toast({
        title: "Claim failed",
        description: error.message || "Unable to claim this challenge reward.",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  return {
    challenges,
    userChallenges,
    loading,
    claimReward,
    refresh: fetchChallenges,
  };
}
