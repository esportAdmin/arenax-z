import { Coins, Lock, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function StakingOverview() {
  const stakedAmount = 2500;
  const totalRewards = 187;
  const apr = 15;
  const lockProgress = 65; // 65% through lock period
  const daysRemaining = 11;

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-border/50 bg-gradient-to-r from-secondary/10 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Coins className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-display font-bold">Locking Overview</h3>
              <p className="text-xs text-muted-foreground">Standard Tier • 30 Day Lock</p>
            </div>
          </div>
          <Button variant="web3" size="sm" className="gap-1">
            Manage
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Locked Amount */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total Locked</div>
            <div className="text-3xl font-display font-bold gradient-text-secondary">
              {stakedAmount.toLocaleString()} <span className="text-lg text-muted-foreground">ARENA</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">Current Bonus</div>
            <div className="text-2xl font-display font-bold text-success">{apr}%</div>
          </div>
        </div>

        {/* Rewards */}
        <div className="glass-card p-4 bg-secondary/5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-sm font-medium">Earned Rewards</span>
            </div>
            <span className="text-xs text-muted-foreground">Claimable</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xl font-display font-bold text-success">
              +{totalRewards} ARENA
            </div>
            <Button variant="success" size="sm">
              Claim
            </Button>
          </div>
        </div>

        {/* Lock Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium">Lock Period</span>
            </div>
            <span className="text-xs text-muted-foreground">{daysRemaining} days remaining</span>
          </div>
          <Progress value={lockProgress} className="h-2 bg-muted" />
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Started Dec 1</span>
            <span>Ends Dec 31</span>
          </div>
        </div>
      </div>
    </div>
  );
}
