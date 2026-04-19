"use client";

import { Coins, Zap } from "lucide-react";
import { useTerritoryEconomy } from "@/hooks/useTerritoryEconomy";

export default function TerritoryEconomyBoard() {
  const { territories, loading } = useTerritoryEconomy();

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/70">
        Loading territory economy...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <div className="mb-4 flex items-center gap-2 text-white">
        <Coins className="h-5 w-5 text-yellow-400" />
        <h3 className="text-xl font-bold">Territory Economy</h3>
      </div>

      <div className="space-y-3">
        {territories.map((territory) => (
          <div
            key={territory.id}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-4 py-3"
          >
            <div>
              <div className="font-semibold text-white">{territory.name}</div>
              <div className="mt-1 flex items-center gap-4 text-xs text-white/60">
                <span>Gold +{territory.gold_income}</span>
                <span className="inline-flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {territory.energy_income}
                </span>
                <span>Upkeep -{territory.upkeep_cost}</span>
              </div>
            </div>

            <div
              className={`font-bold ${
                territory.net_gold >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {territory.net_gold >= 0 ? "+" : ""}
              {territory.net_gold}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
