import { motion } from "framer-motion";
import { Zap, Trophy, Coins, Shield, Users, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Daily Pro Picks",
    description: "Complete 3 quick predictions daily to earn ARENA credits and boost your Arena Score.",
    color: "primary",
  },
  {
    icon: Trophy,
    title: "Competitive Predictions",
    description: "Lock credits on match outcomes. Predict winners, scores, and MVPs across CS2 and major leagues.",
    color: "accent",
  },
  {
    icon: Coins,
    title: "Rewards Locking",
    description: "Lock your ARENA credits to earn passive rewards. Higher returns for longer lock periods.",
    color: "secondary",
  },
  {
    icon: BarChart3,
    title: "Live Leaderboards",
    description: "Compete globally or within your club. Track your rank and climb to the top.",
    color: "primary",
  },
  {
    icon: Users,
    title: "Club Ecosystems",
    description: "Join exclusive fan communities. Access club-specific quests and merchandise drops.",
    color: "accent",
  },
  {
    icon: Shield,
    title: "Utility NFTs",
    description: "Earn achievement badges and utility passes. Unlock real-world perks and discounts.",
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
            <span className="text-foreground">Your </span>
            <span className="gradient-text-primary">Arena Awaits</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to transform passive watching into active engagement
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
