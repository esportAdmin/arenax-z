"use client";

import { Sword } from "lucide-react";

interface Props {
  xp: number;
}

export function WarAttackEffect({ xp }: Props) {
  const attack = Math.floor(xp * 0.2);

  if (attack <= 0) return null;

  return (
    <div className="glass-card p-4 mt-3 flex items-center justify-between border-red-500/30">
      <div className="flex items-center gap-2 text-red-400 font-semibold">
        <Sword className="w-4 h-4" />
        Attack on enemy club
      </div>

      <div className="text-lg font-bold text-red-400">-{attack} XP</div>
    </div>
  );
}
