import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useGameNotifications } from "@/contexts/NotificationContext";

export interface LevelReward {
  id: string;
  level_required: number;
  reward_type: string;
  reward_value: string;
  title: string;
  description: string;
  icon: string;
  rarity: string;
}

export interface ClaimedReward {
  id: string;
  reward_id: string;
  claimed_at: string;
}

export function useLevelRewards(currentLevel: number) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rewards, setRewards] = useState<LevelReward[]>([]);
  const [claimedRewards, setClaimedRewards] = useState<ClaimedReward[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Try to get notifications
  let notifyRewardClaimed: ((title: string, value: string) => void) | null = null;
  try {
    const notifications = useGameNotifications();
    notifyRewardClaimed = notifications.notifyRewardClaimed;
  } catch {
    // Not in notification provider context
  }

  const fetchRewards = useCallback(async () => {
    try {
      // Fetch all level rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from("level_rewards")
        .select("*")
        .order("level_required", { ascending: true });

      if (rewardsError) throw rewardsError;
      setRewards(rewardsData || []);

      // Fetch user's claimed rewards if logged in
      if (user) {
        const { data: claimedData, error: claimedError } = await supabase
          .from("user_level_rewards")
          .select("*")
          .eq("user_id", user.id);

        if (claimedError) throw claimedError;
        setClaimedRewards(claimedData || []);
      }
    } catch (error) {
      console.error("Error fetching level rewards:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const claimReward = async (rewardId: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour réclamer vos récompenses",
        variant: "destructive",
      });
      return { success: false };
    }

    try {
      const { data, error } = await supabase.rpc("claim_level_reward", {
        p_reward_id: rewardId,
      });

      if (error) throw error;

      const result = data as { success: boolean; reward_type?: string; reward_value?: string; error?: string };

      if (result.success) {
        const reward = rewards.find(r => r.id === rewardId);
        
        let message = "Récompense réclamée !";
        let notifValue = "";
        if (result.reward_type === "arena_points") {
          message = `+${result.reward_value} ARENA ajoutés !`;
          notifValue = `+${result.reward_value} ARENA`;
        } else if (result.reward_type === "xp_bonus") {
          message = `+${result.reward_value} XP ajoutés !`;
          notifValue = `+${result.reward_value} XP`;
        } else if (result.reward_type === "title") {
          message = `Titre "${result.reward_value}" débloqué !`;
          notifValue = result.reward_value || "";
        } else if (result.reward_type === "feature") {
          message = `Fonctionnalité débloquée !`;
          notifValue = "Débloqué";
        }

        // Send notification
        if (notifyRewardClaimed && reward) {
          notifyRewardClaimed(reward.title, notifValue);
        }

        toast({
          title: reward?.title || "Récompense",
          description: message,
        });

        // Refresh claimed rewards
        fetchRewards();
        return { success: true };
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

  // Calculate stats
  const availableRewards = rewards.filter(
    r => r.level_required <= currentLevel && !claimedRewards.some(c => c.reward_id === r.id)
  );
  const unlockedCount = rewards.filter(r => r.level_required <= currentLevel).length;
  const claimedCount = claimedRewards.length;

  return {
    rewards,
    claimedRewards,
    availableRewards,
    unlockedCount,
    claimedCount,
    loading,
    claimReward,
    refresh: fetchRewards,
  };
}
