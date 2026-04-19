"use client";

import { Flame, Map, Users } from "lucide-react";

interface StatPanelProps {
  label: string;
  value: string;
  variant: "wars" | "territories" | "players";
}

const variantMap = {
  wars: {
    icon: Flame,
    accent: "from-red-500/20 to-orange-400/10",
    chip: "text-red-300",
  },
  territories: {
    icon: Map,
    accent: "from-primary/20 to-sky-400/10",
    chip: "text-primary",
  },
  players: {
    icon: Users,
    accent: "from-violet-500/18 to-fuchsia-400/8",
    chip: "text-violet-300",
  },
} as const;

export default function StatPanel({ label, value, variant }: StatPanelProps) {
  const config = variantMap[variant];
  const Icon = config.icon;

  return (
    <div className="surface-panel hero-sheen relative overflow-hidden p-4 sm:p-5">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${config.accent} opacity-90`}
      />

      <div className="relative flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <Icon className={`h-5 w-5 ${config.chip}`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {label}
          </div>
          <div className="text-3xl font-display font-bold tracking-[0.03em] text-white">
            {value}
          </div>
          <div className="mt-2 text-sm text-slate-300">
            {variant === "wars" && "Heat zones driving attention right now"}
            {variant === "territories" && "Persistent map progress players can rally around"}
            {variant === "players" && "A live audience creates social pull and urgency"}
          </div>
        </div>
      </div>
    </div>
  );
}
