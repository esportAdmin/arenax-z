"use client";

import { Globe, Shield, Crown } from "lucide-react";
import { useGlobalWarMap } from "@/hooks/useGlobalWarMap";

export function GlobalWarMap() {
  const { territories, loading } = useGlobalWarMap();

  if (loading) {
    return <div className="glass-card p-6 mt-6">Loading global war map...</div>;
  }

  return (
    <div className="glass-card p-6 mt-6">
      <div className="flex items-center gap-2 mb-4 font-bold">
        <Globe className="w-5 h-5 text-primary" />
        Global War Map
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {territories.map((territory) => (
          <div
            key={territory.id}
            className="rounded-xl border border-border/50 p-4 bg-card/40"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold">{territory.name}</div>
                <div className="text-xs text-muted-foreground">
                  {territory.region || "Unknown region"}
                </div>
              </div>

              {territory.controlling_club ? (
                <div className="flex items-center gap-1 text-primary text-xs font-medium">
                  <Crown className="w-4 h-4" />
                  Controlled
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">Unclaimed</div>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm mb-3">
              <Shield className="w-4 h-4 text-primary" />
              <span>
                {territory.controlling_club?.name || "No controlling club"}
              </span>
            </div>

            <div className="text-xs text-muted-foreground">
              +{territory.xp_bonus} XP • +{territory.arena_bonus} Arena • +
              {territory.prestige_bonus} Prestige
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
