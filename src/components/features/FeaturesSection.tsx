import { motion } from "framer-motion";
import { Zap, Trophy, Coins, Shield, Users, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Daily Signature Calls",
    description: "Complete a short slate of high-attention live calls each day to grow your standing and stack rewards.",
    color: "primary",
  },
  {
    icon: Trophy,
    title: "High-Conviction Reads",
    description: "Call match winners, standout performances, and pivotal outcomes across the biggest esports stages.",
    color: "accent",
  },
  {
    icon: Coins,
    title: "Smart Reward Locking",
    description: "Put idle balance to work with longer-term reward strategies designed for committed players.",
    color: "secondary",
  },
  {
    icon: BarChart3,
    title: "Live Prestige Rankings",
    description: "Track your position in real time, defend your status, and rise above the global field.",
    color: "primary",
  },
  {
    icon: Users,
    title: "Club Power Networks",
    description: "Join premium fan circles, unlock club-specific missions, and compete together with purpose.",
    color: "accent",
  },
  {
    icon: Shield,
    title: "Status Unlocks",
    description: "Earn badges, access passes, and reward drops that make your profile feel earned, not generic.",
    color: "secondary",
  },
];

const colorClasses = {
  primary: {
    icon: "text-primary",
    bg: "bg-primary/10",
    border: "group-hover:border-primary/50",
    glow: "group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]",
  },
  accent: {
    icon: "text-accent",
    bg: "bg-accent/10",
    border: "group-hover:border-accent/50",
    glow: "group-hover:shadow-[0_0_30px_hsl(var(--accent)/0.3)]",
  },
  secondary: {
    icon: "text-secondary",
    bg: "bg-secondary/10",
    border: "group-hover:border-secondary/50",
    glow: "group-hover:shadow-[0_0_30px_hsl(var(--secondary)/0.3)]",
  },
};

export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      <div className="container-arena">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
            <span className="text-foreground">A competition layer built for </span>
            <span className="gradient-text-primary">ambitious fans</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to turn passive viewing into reputation, momentum, and meaningful community rewards.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color as keyof typeof colorClasses];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group glass-card p-6 lg:p-8 transition-all duration-300 ${colors.border} ${colors.glow}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`w-6 h-6 ${colors.icon}`} />
                </div>
                <h3 className="font-display font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
