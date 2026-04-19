"use client";

import { Shield, Swords, Trophy, Users } from "lucide-react";

const stats = [
  {
    icon: Users,
    label: "Total members",
    value: "45",
    description: "Core community",
    tone: "from-cyan-500/22 to-blue-500/8",
  },
  {
    icon: Shield,
    label: "Territories owned",
    value: "12",
    description: "Defendable ground",
    tone: "from-blue-500/22 to-violet-500/8",
  },
  {
    icon: Swords,
    label: "Active wars",
    value: "3",
    description: "Live pressure",
    tone: "from-violet-500/22 to-fuchsia-500/8",
  },
  {
    icon: Trophy,
    label: "Season rank",
    value: "#1",
    description: "Public prestige",
    tone: "from-amber-500/22 to-orange-500/8",
  },
];

export default function ClubStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ icon: Icon, label, value, description, tone }) => (
        <div
          key={label}
          className={`surface-panel hero-sheen min-h-[132px] bg-gradient-to-br ${tone} p-4 sm:p-5`}
        >
          <div className="flex items-center justify-between">
            <span className="truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              {label}
            </span>
            <Icon className="h-4 w-4 text-white/80" />
          </div>
          <div className="mt-4 text-3xl font-display font-bold text-white">
            {value}
          </div>
          <div className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            {description}
          </div>
        </div>
      ))}
    </div>
  );
}
