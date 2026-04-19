import { ArrowRight, Coins, Flame, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function StakingOverview() {
  const activityAmount = 2500;
  const totalRewards = 187;
  const rewardBoost = 15;
  const streakProgress = 65;
  const daysRemaining = 11;

  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-border/50 bg-gradient-to-r from-secondary/10 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
              <Coins className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-display font-bold">Reward Momentum</h3>
              <p className="text-xs text-muted-foreground">Standard Tier - 30 day streak</p>
            </div>
          </div>
          <Button variant="web3" size="sm" className="gap-1">
            Manage
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-1 text-sm text-muted-foreground">Activity Volume</div>
            <div className="font-display text-3xl font-bold gradient-text-secondary">
              {activityAmount.toLocaleString()}{" "}
              <span className="text-lg text-muted-foreground">ARENA</span>
            </div>
          </div>
          <div className="text-right">
            <div className="mb-1 text-sm text-muted-foreground">Current Boost</div>
            <div className="font-display text-2xl font-bold text-success">
              +{rewardBoost}%
            </div>
          </div>
        </div>

        <div className="glass-card bg-secondary/5 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">Progress Rewards</span>
            </div>
            <span className="text-xs text-muted-foreground">Claimable</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="font-display text-xl font-bold text-success">
              +{totalRewards} ARENA
            </div>
            <Button variant="success" size="sm">
              Claim
            </Button>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">Streak Window</span>
            </div>
            <span className="text-xs text-muted-foreground">{daysRemaining} days remaining</span>
          </div>
          <Progress value={streakProgress} className="h-2 bg-muted" />
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Started Dec 1</span>
            <span className="inline-flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Ends Dec 31
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
