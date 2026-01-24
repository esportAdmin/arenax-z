import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Coins, Lock, Unlock, TrendingUp, Shield, Info, Calculator, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

const lockingTiers = [
  { id: "flexible", name: "Flexible", bonus: 8, lockPeriod: 0, minLock: 100, description: "No lock period, withdraw anytime" },
  { id: "standard", name: "Standard", bonus: 15, lockPeriod: 30, minLock: 500, description: "30-day lock for higher rewards" },
  { id: "premium", name: "Premium", bonus: 25, lockPeriod: 90, minLock: 2500, description: "Maximum bonus for committed fans" },
];

const Staking = () => {
  const [selectedTier, setSelectedTier] = useState("standard");
  const [lockAmount, setLockAmount] = useState(1000);
  const [isConnected, setIsConnected] = useState(false);

  const currentTier = lockingTiers.find((t) => t.id === selectedTier)!;
  const projectedRewards = (lockAmount * (currentTier.bonus / 100) * (currentTier.lockPeriod || 365) / 365).toFixed(2);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 lg:pt-24 pb-12">
        <div className="container-arena">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
              <Coins className="w-4 h-4" />
              Rewards Locking
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
              <span className="text-foreground">Earn While </span>
              <span className="gradient-text-secondary">You Hold</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Lock your ARENA credits to earn bonus rewards. Choose your preferred tier and watch your holdings grow.
            </p>
            <p className="text-xs text-muted-foreground mt-2 max-w-lg mx-auto">
              ARENA are in-app credits, non-transferable, no cash value. Use them to redeem prizes in our Rewards Store.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-display font-bold gradient-text-secondary">250M</div>
              <div className="text-sm text-muted-foreground">ARENA Locked</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-display font-bold gradient-text-secondary">4,280</div>
              <div className="text-sm text-muted-foreground">Active Lockers</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-display font-bold text-success">25%</div>
              <div className="text-sm text-muted-foreground">Max Bonus</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-display font-bold gradient-text-primary">18M</div>
              <div className="text-sm text-muted-foreground">Rewards Distributed</div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Locking Interface */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Tier Selection */}
              <div className="glass-card p-6">
                <h3 className="font-display font-bold text-xl mb-4">Select Tier</h3>
                <div className="space-y-3">
                  {lockingTiers.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        selectedTier === tier.id
                          ? "border-secondary bg-secondary/10 shadow-[0_0_20px_hsl(var(--secondary)/0.3)]"
                          : "border-border hover:border-secondary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            selectedTier === tier.id ? "bg-secondary/20" : "bg-muted"
                          }`}>
                            {tier.lockPeriod === 0 ? (
                              <Unlock className="w-5 h-5 text-secondary" />
                            ) : tier.lockPeriod === 30 ? (
                              <Lock className="w-5 h-5 text-secondary" />
                            ) : (
                              <Shield className="w-5 h-5 text-secondary" />
                            )}
                          </div>
                          <div>
                            <div className="font-display font-bold">{tier.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {tier.lockPeriod === 0 ? "No Lock" : `${tier.lockPeriod} Days Lock`}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-display font-bold text-xl gradient-text-secondary">
                            {tier.bonus}%
                          </div>
                          <div className="text-xs text-muted-foreground">Bonus</div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {tier.description} • Min: {tier.minLock} ARENA
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Lock Amount */}
              <div className="glass-card p-6">
                <h3 className="font-display font-bold text-xl mb-4">Lock Amount</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      value={lockAmount}
                      onChange={(e) => setLockAmount(Number(e.target.value))}
                      className="flex-1 text-xl font-display font-bold bg-muted border-border"
                    />
                    <span className="text-muted-foreground font-display">ARENA</span>
                  </div>
                  <Slider
                    value={[lockAmount]}
                    onValueChange={(value) => setLockAmount(value[0])}
                    max={10000}
                    min={currentTier.minLock}
                    step={100}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Min: {currentTier.minLock} ARENA</span>
                    <span>Balance: 5,000 ARENA</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Summary & Connect */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Projection Card */}
              <div className="glass-card p-6 bg-gradient-to-br from-secondary/10 to-transparent">
                <div className="flex items-center gap-2 mb-6">
                  <Calculator className="w-5 h-5 text-secondary" />
                  <h3 className="font-display font-bold text-xl">Reward Projection</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">Lock Amount</span>
                    <span className="font-display font-bold">{lockAmount.toLocaleString()} ARENA</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">Selected Tier</span>
                    <span className="font-display font-bold">{currentTier.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">Bonus Rate</span>
                    <span className="font-display font-bold text-success">{currentTier.bonus}%</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">Lock Period</span>
                    <span className="font-display font-bold">
                      {currentTier.lockPeriod === 0 ? "Flexible" : `${currentTier.lockPeriod} Days`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-4 bg-secondary/10 rounded-xl px-4 -mx-4">
                    <span className="font-display font-bold">Projected Rewards</span>
                    <span className="text-2xl font-display font-bold gradient-text-secondary">
                      +{projectedRewards} ARENA
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-muted/50 flex items-start gap-3">
                  <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Rewards are calculated based on the lock period. Early unlock during locked tiers incurs a 24h cooldown and 5% penalty.
                  </p>
                </div>
              </div>

              {/* Account Connection */}
              <div className="glass-card p-6">
                {!isConnected ? (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                      <Wallet className="w-8 h-8 text-secondary" />
                    </div>
                    <h3 className="font-display font-bold text-xl mb-2">Connect Your Account</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      Sign in to start locking ARENA credits and earning rewards
                    </p>
                    <Button
                      variant="web3"
                      size="lg"
                      className="w-full"
                      onClick={() => setIsConnected(true)}
                    >
                      Sign In to Lock
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-success" />
                        </div>
                        <div>
                          <div className="font-semibold">Connected</div>
                          <div className="text-sm text-muted-foreground">CyberNinja</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setIsConnected(false)}>
                        Disconnect
                      </Button>
                    </div>
                    <Button variant="web3" size="lg" className="w-full">
                      Lock {lockAmount.toLocaleString()} ARENA
                    </Button>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-success" />
                <span>ARENA credits are secure and non-transferable</span>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Staking;