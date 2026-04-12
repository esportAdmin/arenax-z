"use client";

import { Skull } from "lucide-react";

interface Props {
  boss: any;
}

export function WorldBossCard({ boss }: Props) {
  if (!boss) return null;

  const percent = ((boss.max_hp - boss.current_hp) / boss.max_hp) * 100;

  return (
    <div className="glass-card p-6 mt-6">
      <div className="flex items-center gap-2 mb-4 font-bold">
        <Skull className="w-5 h-5 text-red-500" />
        WORLD BOSS
      </div>

      <div className="text-xl font-bold mb-2">{boss.name}</div>

      <div className="text-sm text-muted-foreground mb-3">
        HP: {boss.current_hp.toLocaleString()} / {boss.max_hp.toLocaleString()}
      </div>

      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-red-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
