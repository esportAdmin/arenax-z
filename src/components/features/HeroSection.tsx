import { motion } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Trophy,
  Target,
  Shield,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLink } from "@/components/AppLink";

const stats = [
  { value: "50K+", label: "Competitive Fans", icon: Target },
  { value: "1M+", label: "Live Calls Logged", icon: Sparkles },
  { value: "85%", label: "Top-Tier Accuracy", icon: Trophy },
  { value: "AXT", label: "Premium Rewards Layer", icon: Zap },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 cyber-grid opacity-20" />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="container-arena relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
          >
            <Shield className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-white">
              Premium competition. No paywall to enter.
            </span>
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight"
          >
            ARENA<span className="gradient-text-primary">X</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The premium layer for esports fans who want more than watching.{" "}
            <br className="hidden sm:block" />
            Make sharper live calls, climb the ladder, and unlock{" "}
            <span className="text-accent font-bold">AXT</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <AppLink href="/auth">
              <Button variant="hero" size="xl" className="group text-lg">
                Claim Your Spot
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </AppLink>

            <AppLink href="/game">
              <Button variant="web3" size="xl" className="text-lg">
                See Live Matchups
              </Button>
            </AppLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="glass-card p-4 md:p-6 text-center group hover:border-primary/30 transition-colors"
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-display font-bold text-2xl md:text-3xl gradient-text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
