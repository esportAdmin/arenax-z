"use client";

import { Map } from "lucide-react";
import { useClubTerritories } from "@/hooks/useClubTerritories";

export function ClubTerritoryMap() {
  const { territories, loading } = useClubTerritories();

  if (loading) {
    return <div className="glass-card p-6 mt-6">Loading territories...</div>;
  }

  return (
    <div className="glass-card p-6 mt-6">
      <div className="flex items-center gap-2 mb-4 font-bold">
        <Map className="w-5 h-5 text-primary" />
        Club Territory Map
      </div>

      <div className="space-y-3">
        {territories.map((territory) => (
          <div
            key={territory.id}
            className="flex items-center justify-between rounded-xl border border-border/50 p-3"
          >
            <div>
              <div className="font-semibold">{territory.name}</div>
              <div className="text-xs text-muted-foreground">
                {territory.region || "Unknown region"}
              </div>
            </div>

            <div className="text-right">
              <div className="font-medium">
                {territory.controlling_club?.name || "Unclaimed"}
              </div>
              <div className="text-xs text-muted-foreground">
                +{territory.xp_bonus} XP • +{territory.arena_bonus} Arena • +
                {territory.prestige_bonus} Prestige
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
