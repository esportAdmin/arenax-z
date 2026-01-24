import { useState, useEffect, useCallback } from "react";
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
  
  // Try to get notifications
  let notifyChallengeComplete: ((title: string, xp: number) => void) | null = null;
  try {
    const notifications = useGameNotifications();
    notifyChallengeComplete = notifications.notifyChallengeComplete;
  } catch {
    // Not in notification provider context
  }

  const fetchChallenges = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch all active challenges
      const { data: challengesData, error: challengesError } = await supabase
        .from("daily_challenges")
        .select("*")
        .eq("active", true);

      if (challengesError) throw challengesError;
      setChallenges(challengesData || []);

      // Fetch user's challenge progress for today
      const today = new Date().toISOString().split("T")[0];
      const { data: userChallengesData, error: userChallengesError } = await supabase
        .from("user_daily_challenges")
        .select(`
          *,
          challenge:daily_challenges(*)
        `)
        .eq("user_id", user.id)
        .eq("challenge_date", today);

      if (userChallengesError) throw userChallengesError;

      // Initialize challenges for today if not exists
      const existingChallengeIds = (userChallengesData || []).map(uc => uc.challenge_id);
      const missingChallenges = (challengesData || []).filter(
        c => !existingChallengeIds.includes(c.id)
      );

      if (missingChallenges.length > 0) {
        const newUserChallenges = missingChallenges.map(c => ({
          user_id: user.id,
          challenge_id: c.id,
          challenge_date: today,
          progress: 0,
          completed: false,
          xp_claimed: false,
        }));

        const { error: insertError } = await supabase
          .from("user_daily_challenges")
          .insert(newUserChallenges);

        if (insertError) throw insertError;

        // Refetch user challenges
        const { data: refreshedData } = await supabase
          .from("user_daily_challenges")
          .select(`
            *,
            challenge:daily_challenges(*)
          `)
          .eq("user_id", user.id)
          .eq("challenge_date", today);

        setUserChallenges(refreshedData || []);
      } else {
        setUserChallenges(userChallengesData || []);
      }

      // Auto-complete login challenge
      const loginChallenge = (userChallengesData || []).find(
        uc => uc.challenge?.challenge_type === "login" && !uc.completed
      );
      if (loginChallenge) {
        await supabase
          .from("user_daily_challenges")
          .update({ 
            progress: 1, 
            completed: true, 
            completed_at: new Date().toISOString() 
          })
          .eq("id", loginChallenge.id);
        
        // Refetch
        const { data: refreshedData } = await supabase
          .from("user_daily_challenges")
          .select(`
            *,
            challenge:daily_challenges(*)
          `)
          .eq("user_id", user.id)
          .eq("challenge_date", today);
        setUserChallenges(refreshedData || []);
      }
    } catch (error) {
      console.error("Error fetching daily challenges:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const claimReward = async (userChallengeId: string) => {
    // Find the challenge to get its title
    const userChallenge = userChallenges.find(uc => uc.id === userChallengeId);
    
    try {
      const { data, error } = await supabase.rpc("claim_challenge_reward", {
        p_user_challenge_id: userChallengeId,
      });

      if (error) throw error;

      const result = data as { success: boolean; xp_earned?: number; error?: string };
      
      if (result.success) {
        // Send notification
        if (notifyChallengeComplete && userChallenge) {
          notifyChallengeComplete(userChallenge.challenge.title, result.xp_earned || 0);
        }
        
        toast({
          title: "XP réclamé !",
          description: `+${result.xp_earned} XP ajoutés à votre profil`,
        });
        
        // Refresh challenges
        fetchChallenges();
        return { success: true, xpEarned: result.xp_earned };
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de réclamer la récompense",
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
