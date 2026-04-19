"use client";

import { motion } from "framer-motion";
import { Coins, Flame, TrendingUp, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLink } from "@/components/AppLink";

const rewardTiers = [
  {
    name: "Flexible",
    bonus: "+8%",
    cadence: "Open",
    minimumActivity: "100 ARENA activity",
  },
  {
    name: "Standard",
    bonus: "+15%",
    cadence: "30-day streak",
    minimumActivity: "500 ARENA activity",
  },
  {
    name: "Premium",
    bonus: "+25%",
    cadence: "90-day prestige",
    minimumActivity: "2,500 ARENA activity",
  },
];

export function StakingPreview() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container-arena relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Reward tiers */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-2 lg:order-1"
          >
            <div className="space-y-4">
              {rewardTiers.map((tier, index) => (
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
                          <Flame className="w-6 h-6 text-secondary" />
                        ) : (
                          <Shield className="w-6 h-6 text-secondary" />
                        )}
                      </div>
                      <div>
                        <div className="font-display font-bold text-lg">
                          {tier.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {tier.cadence} - Min: {tier.minimumActivity}
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
              Reward Progression
            </div>

            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
              <span className="text-foreground">Turn Activity Into </span>
              <span className="gradient-text-secondary">Prestige</span>
            </h2>

            <p className="text-muted-foreground text-lg mb-6">
              Build streaks, complete live-call rituals, and unlock non-cash
              progression perks. ARENA credits have no monetary value and are
              used only for platform activity and community status.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="glass-card p-4">
                <div className="text-2xl font-display font-bold gradient-text-secondary">
                  250M
                </div>
                <div className="text-sm text-muted-foreground">
                  ARENA Activity
                </div>
              </div>
              <div className="glass-card p-4">
                <div className="text-2xl font-display font-bold gradient-text-secondary">
                  4,280
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Members
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button asChild variant="web3" size="lg" className="gap-2">
                <AppLink href="/rewards">
                  Open Rewards
                  <ArrowRight className="w-5 h-5" />
                </AppLink>
              </Button>

              <Button variant="glass" size="lg" className="gap-2">
                <TrendingUp className="w-5 h-5" />
                View Progression
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
