import {
  Activity,
  Calendar,
  Radio,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ElementType;
  iconBg: string;
  label: string;
  value: string;
  change: number;
  subtitle: string;
}

function StatCard({ icon: Icon, iconBg, label, value, change, subtitle }: StatCardProps) {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-[#12121a] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", iconBg)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
      </div>
      
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-display font-bold text-foreground">{value}</span>
        <span className={cn(
          "flex items-center gap-1 text-sm font-semibold",
          isPositive ? "text-success" : "text-destructive"
        )}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {isPositive ? "+" : ""}{change}%
        </span>
      </div>
      
      <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
}

export function StatsGrid() {
  const stats: StatCardProps[] = [
    {
      icon: Trophy,
      iconBg: "bg-primary/20",
      label: "Active Events",
      value: "12",
      change: 3,
      subtitle: "vs last month",
    },
    {
      icon: Calendar,
      iconBg: "bg-secondary/20",
      label: "Live Calls Today",
      value: "28",
      change: 5,
      subtitle: "Total scheduled",
    },
    {
      icon: Radio,
      iconBg: "bg-success/20",
      label: "Ritual Completion",
      value: "89.5%",
      change: 2,
      subtitle: "Rolling 30-day avg",
    },
    {
      icon: Activity,
      iconBg: "bg-warning/20",
      label: "Member Touchpoints",
      value: "45.2K",
      change: 8,
      subtitle: "Monthly community actions",
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
