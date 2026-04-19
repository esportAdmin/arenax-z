import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useGameNotifications } from "@/contexts/NotificationContext";
import { isLocalQaUser } from "@/lib/dev-auth";

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

const FALLBACK_LEVEL_REWARDS: LevelReward[] = [
  {
    id: "reward-1",
    level_required: 2,
    reward_type: "arena_points",
    reward_value: "250",
    title: "Momentum Boost",
    description: "A quick ARENA injection to reward an early return habit.",
    icon: "zap",
    rarity: "rare",
  },
  {
    id: "reward-2",
    level_required: 4,
    reward_type: "xp_bonus",
    reward_value: "500",
    title: "Command XP Crate",
    description: "A prestige push that makes the next level feel close.",
    icon: "gift",
    rarity: "epic",
  },
  {
    id: "reward-3",
    level_required: 7,
    reward_type: "title",
    reward_value: "Frontline Commander",
    title: "Frontline Commander",
    description: "A visible identity upgrade worth defending.",
    icon: "crown",
    rarity: "legendary",
  },
];

export function useLevelRewards(currentLevel: number) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rewards, setRewards] = useState<LevelReward[]>([]);
  const [claimedRewards, setClaimedRewards] = useState<ClaimedReward[]>([]);
  const [loading, setLoading] = useState(true);
  const isLocalQa = isLocalQaUser(user);

  let notifyRewardClaimed: ((title: string, value: string) => void) | null =
    null;
  try {
    const notifications = useGameNotifications();
    notifyRewardClaimed = notifications.notifyRewardClaimed;
  } catch {
    notifyRewardClaimed = null;
  }

  const fetchRewards = useCallback(async () => {
    if (isLocalQa) {
      setRewards(FALLBACK_LEVEL_REWARDS);
      setClaimedRewards([
        {
          id: "qa-claimed-1",
          reward_id: "reward-1",
          claimed_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const { data: rewardsData, error: rewardsError } = await supabase
        .from("level_rewards")
        .select("*")
        .order("level_required", { ascending: true });

      if (rewardsError) {
        setRewards(FALLBACK_LEVEL_REWARDS);
        setClaimedRewards([]);
        return;
      }

      setRewards(rewardsData && rewardsData.length > 0 ? rewardsData : FALLBACK_LEVEL_REWARDS);

      if (user) {
        const { data: claimedData, error: claimedError } = await supabase
          .from("user_level_rewards")
          .select("*")
          .eq("user_id", user.id);

        if (claimedError) {
          setClaimedRewards([]);
          return;
        }

        setClaimedRewards(claimedData || []);
      }
    } catch {
      setRewards(FALLBACK_LEVEL_REWARDS);
      setClaimedRewards([]);
    } finally {
      setLoading(false);
    }
  }, [isLocalQa, user]);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const claimReward = async (rewardId: string) => {
    if (!user) {
      toast({
        title: "Sign-in required",
        description: "Sign in to claim your rewards.",
        variant: "destructive",
      });
      return { success: false };
    }

    if (isLocalQa) {
      const reward = rewards.find((item) => item.id === rewardId);
      if (!claimedRewards.some((item) => item.reward_id === rewardId)) {
        setClaimedRewards((prev) => [
          ...prev,
          {
            id: `qa-claimed-${rewardId}`,
            reward_id: rewardId,
            claimed_at: new Date().toISOString(),
          },
        ]);
      }

      if (notifyRewardClaimed && reward) {
        notifyRewardClaimed(reward.title, reward.reward_value);
      }

      toast({
        title: reward?.title || "Reward",
        description: "Reward claimed in local QA mode.",
      });
      return { success: true };
    }

    try {
      const { data, error } = await supabase.rpc("claim_level_reward", {
        p_reward_id: rewardId,
      });

      if (error) {
        throw error;
      }

      const result = data as {
        success: boolean;
        reward_type?: string;
        reward_value?: string;
        error?: string;
      };

      if (result.success) {
        const reward = rewards.find((item) => item.id === rewardId);

        let message = "Reward claimed.";
        let notifValue = "";

        if (result.reward_type === "arena_points") {
          message = `+${result.reward_value} ARENA added to your balance.`;
          notifValue = `+${result.reward_value} ARENA`;
        } else if (result.reward_type === "xp_bonus") {
          message = `+${result.reward_value} XP added to your progression.`;
          notifValue = `+${result.reward_value} XP`;
        } else if (result.reward_type === "title") {
          message = `Title "${result.reward_value}" unlocked.`;
          notifValue = result.reward_value || "";
        } else if (result.reward_type === "feature") {
          message = "Feature unlocked.";
          notifValue = "Unlocked";
        }

        if (notifyRewardClaimed && reward) {
          notifyRewardClaimed(reward.title, notifValue);
        }

        toast({
          title: reward?.title || "Reward",
          description: message,
        });

        fetchRewards();
        return { success: true };
      }

      throw new Error(result.error);
    } catch (error: any) {
      toast({
        title: "Claim failed",
        description: error.message || "Unable to claim this reward right now.",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  const availableRewards = rewards.filter(
    (reward) =>
      reward.level_required <= currentLevel &&
      !claimedRewards.some((claimed) => claimed.reward_id === reward.id),
  );
  const unlockedCount = rewards.filter(
    (reward) => reward.level_required <= currentLevel,
  ).length;
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
