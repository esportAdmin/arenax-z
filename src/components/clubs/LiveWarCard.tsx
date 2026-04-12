"use client";

import { Sword } from "lucide-react";

export function LiveWarCard({ war }: any) {
  if (!war) return null;

  return (
    <div className="glass-card p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="font-bold text-lg">{war.challenger_name}</div>

        <Sword className="text-orange-500" />

        <div className="font-bold text-lg">{war.defender_name}</div>
      </div>

      <div className="grid grid-cols-3 text-center gap-4">
        <div>
          <div className="text-sm text-muted-foreground">XP</div>

          <div className="text-xl font-bold">
            {war.challenger_xp} / {war.defender_xp}
          </div>
        </div>

        <div>
      <div className="text-sm text-muted-foreground">Live calls</div>

          <div className="text-xl font-bold">
            {war.challenger_predictions} / {war.defender_predictions}
          </div>
        </div>

        <div>
          <div className="text-sm text-muted-foreground">Wins</div>

          <div className="text-xl font-bold">
            {war.challenger_wins} / {war.defender_wins}
          </div>
        </div>
      </div>
    </div>
  );
}
