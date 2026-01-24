import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Trophy, Target, Zap } from "lucide-react";

// Logo officiel du Token AXT
const AXT_TOKEN_URL =
  "https://z-cdn-media.chatglm.cn/files/d6b41cac-236b-49a9-8b19-197a0ffc3cdd.png?auth_key=1868291827-a844749638a642f992ca18cf4f58c70f-0-acbbd15ba8c50e87534153a6cf809201";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  colorClass?: string;
  iconImage?: string; // Pour afficher le logo AXT
}

function StatCard({ icon: Icon, label, value, change, trend, colorClass = "primary", iconImage }: StatCardProps) {
  const colorStyles = {
    primary: {
      icon: "text-primary",
      bg: "bg-primary/10",
      gradient: "gradient-text-primary",
    },
    accent: {
      icon: "text-accent",
      bg: "bg-accent/10",
      gradient: "gradient-text-accent",
    },
    secondary: {
      icon: "text-secondary",
      bg: "bg-secondary/10",
      gradient: "gradient-text-secondary",
    },
    success: {
      icon: "text-success",
      bg: "bg-success/10",
      gradient: "text-success",
    },
  };

  const colors = colorStyles[colorClass as keyof typeof colorStyles] || colorStyles.primary;

  return (
    <div className="glass-card p-5 group hover:border-primary/30 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}
        >
          {/* Affichage prioritaire de l'image (Token) ou de l'icône */}
          {iconImage ? (
            <img src={iconImage} alt={label} className="w-6 h-6 object-contain" />
          ) : (
            <Icon className={`w-5 h-5 ${colors.icon}`} />
          )}
        </div>
        {change && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="w-3 h-3" />
            ) : trend === "down" ? (
              <TrendingDown className="w-3 h-3" />
            ) : null}
            {change}
          </div>
        )}
      </div>
      <div className={`text-2xl font-display font-bold ${colors.gradient} mb-1`}>{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export function DashboardStats() {
  const stats = [
    {
      icon: Trophy,
      label: "ArenaX Score", // XYZVERSE -> ArenaX
      value: "2,450",
      change: "+120",
      trend: "up" as const,
      colorClass: "primary",
    },
    {
      icon: Trophy, // Fallback icon
      label: "AXT Balance", // XYZ Balance -> AXT Balance
      value: "1,250",
      change: "+85",
      trend: "up" as const,
      colorClass: "accent",
      iconImage: AXT_TOKEN_URL, // Logo du Token
    },
    {
      icon: Target,
      label: "Prediction Accuracy",
      value: "68%",
      change: "+5%",
      trend: "up" as const,
      colorClass: "success",
    },
    {
      icon: Zap,
      label: "Active Streak",
      value: "7 Days",
      change: "🔥",
      trend: "neutral" as const,
      colorClass: "secondary",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
}
