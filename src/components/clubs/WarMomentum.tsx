"use client";

import { Flame } from "lucide-react";

interface Props {
  war: any;
}

export function WarMomentum({ war }: Props) {
  if (!war) return null;

  const challengerXP = war.challenger_xp || 0;
  const defenderXP = war.defender_xp || 0;

  const leader =
    challengerXP > defenderXP
      ? "challenger"
      : defenderXP > challengerXP
        ? "defender"
        : null;

  if (!leader) {
    return (
      <div className="glass-card p-4 mt-4 text-center text-muted-foreground">
        Momentum neutral
      </div>
    );
  }

  const percent = Math.min(
    30,
    Math.round(
      (Math.abs(challengerXP - defenderXP) /
        Math.max(challengerXP, defenderXP, 1)) *
        30,
    ),
  );

  return (
    <div className="glass-card p-6 mt-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Flame className="w-6 h-6 text-orange-500" />

        <div>
          <div className="font-bold">War Momentum</div>

          <div className="text-sm text-muted-foreground">
            {leader === "challenger" ? war.challenger_id : war.defender_id}{" "}
            leading
          </div>
        </div>
      </div>

      <div className="text-xl font-bold text-orange-500">+{percent}% XP</div>
    </div>
  );
}
