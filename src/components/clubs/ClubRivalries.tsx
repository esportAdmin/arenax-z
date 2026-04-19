"use client";

import { Flame } from "lucide-react";

export function ClubRivalries({ rivalries }: any) {
  if (!rivalries || rivalries.length === 0) return null;

  return (
    <div className="glass-card p-6 mt-6">
      <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
        <Flame className="text-red-500" />
        Rivalries
      </h3>

      <div className="space-y-3">
        {rivalries.map((r: any) => (
          <div
            key={r.id}
            className="flex items-center justify-between p-3 rounded-xl bg-card/50"
          >
            <div>
              {r.club_a.name} ⚔ {r.club_b.name}
            </div>

            <div className="text-sm text-muted-foreground">
              Level {r.rivalry_level}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
