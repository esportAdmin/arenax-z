"use client";

import { motion } from "framer-motion";
import { Coins, Lock, TrendingUp, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLink } from "@/components/AppLink";

const lockingTiers = [
  {
    name: "Flexible",
    bonus: "8%",
    lockPeriod: "No Lock",
    minLock: "100 ARENA",
  },
  {
    name: "Standard",
    bonus: "15%",
    lockPeriod: "30 Days",
    minLock: "500 ARENA",
  },
  {
    name: "Premium",
    bonus: "25%",
    lockPeriod: "90 Days",
    minLock: "2,500 ARENA",
  },
];

export function StakingPreview() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container-arena relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Staking Tiers */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-2 lg:order-1"
          >
            <div className="space-y-4">
              {lockingTiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="glass-card-hover p-5 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                        {index === 0 ? (
                          <Coins className="w-6 h-6 text-secondary" />
                        ) : index === 1 ? (
                          <Lock className="w-6 h-6 text-secondary" />
                        ) : (
                          <Shield className="w-6 h-6 text-secondary" />
                        )}
                      </div>
                      <div>
                        <div className="font-display font-bold text-lg">
                          {tier.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {tier.lockPeriod} • Min: {tier.minLock}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-bold text-2xl gradient-text-secondary">
                        {tier.bonus}
                      </div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">
                        Bonus
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6">
              <Coins className="w-4 h-4" />
              Rewards Locking
            </div>

            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
              <span className="text-foreground">Earn While You </span>
              <span className="gradient-text-secondary">Hold</span>
            </h2>

            <p className="text-muted-foreground text-lg mb-6">
              Lock your ARENA credits and earn passive rewards. Choose flexible
              or locked tiers to maximize your bonus. ARENA credits have no cash
              value but unlock exclusive prizes.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="glass-card p-4">
                <div className="text-2xl font-display font-bold gradient-text-secondary">
                  250M
                </div>
                <div className="text-sm text-muted-foreground">
                  ARENA Locked
                </div>
              </div>
              <div className="glass-card p-4">
                <div className="text-2xl font-display font-bold gradient-text-secondary">
                  4,280
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Lockers
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button asChild variant="web3" size="lg" className="gap-2">
                <AppLink href="/staking">
                  Start Locking
                  <ArrowRight className="w-5 h-5" />
                </AppLink>
              </Button>

              <Button variant="glass" size="lg" className="gap-2">
                <TrendingUp className="w-5 h-5" />
                Calculate Rewards
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
