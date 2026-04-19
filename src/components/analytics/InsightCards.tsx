import { Lightbulb, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  type: "insight" | "alert" | "opportunity";
  title: string;
  description: string;
}

const typeConfig = {
  insight: {
    icon: Lightbulb,
    bgClass: "bg-gradient-to-br from-success/20 to-success/5",
    borderClass: "border-success/30",
    iconBg: "bg-success/20",
    iconColor: "text-success",
    titleColor: "text-success"
  },
  alert: {
    icon: AlertTriangle,
    bgClass: "bg-gradient-to-br from-warning/20 to-warning/5",
    borderClass: "border-warning/30",
    iconBg: "bg-warning/20",
    iconColor: "text-warning",
    titleColor: "text-warning"
  },
  opportunity: {
    icon: Sparkles,
    bgClass: "bg-gradient-to-br from-secondary/20 to-secondary/5",
    borderClass: "border-secondary/30",
    iconBg: "bg-secondary/20",
    iconColor: "text-secondary",
    titleColor: "text-secondary"
  }
};

function InsightCard({ type, title, description }: InsightCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn(
      "rounded-2xl p-5 border",
      config.bgClass,
      config.borderClass
    )}>
      <div className="flex items-center gap-3 mb-3">
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", config.iconBg)}>
          <Icon className={cn("w-5 h-5", config.iconColor)} />
        </div>
        <h4 className={cn("font-semibold", config.titleColor)}>{title}</h4>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

export function InsightCards() {
  const insights: InsightCardProps[] = [
    {
      type: "insight",
      title: "Key Insight",
      description: "Club Alpha is creating a strong return loop this week: live calls, member replies, and challenge activity are all trending up."
    },
    {
      type: "alert",
      title: "Risk Alert",
      description: "Member momentum is softening before the next reset. Trigger a live ritual or founder update before attention drops."
    },
    {
      type: "opportunity",
      title: "Opportunity",
      description: "A high-signal rivalry is forming. Rally the community now while the story is still fresh and visible."
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {insights.map((insight, index) => (
        <InsightCard key={index} {...insight} />
      ))}
    </div>
  );
}
