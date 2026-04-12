"use client";

import { useState } from "react";
import { Crown, MapPinned, Shield } from "lucide-react";

const territories = [
  { name: "Nova Prime", region: "Americas", status: "Fortified", x: 18, y: 30 },
  { name: "Sector Atlas", region: "Europe", status: "Contested", x: 46, y: 24 },
  { name: "Helios Reach", region: "Asia", status: "Stable", x: 70, y: 38 },
  { name: "Delta Gate", region: "Oceania", status: "Fortified", x: 77, y: 68 },
  { name: "Polar Crown", region: "Arctic", status: "Rising", x: 57, y: 12 },
];

export default function OwnedTerritories() {
  const [selectedTerritory, setSelectedTerritory] = useState(territories[0].name);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/65">
        <div className="border-b border-white/10 px-4 py-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Territory network
          </div>
          <div className="mt-1 text-lg font-display font-bold text-white">
            Ground worth defending every day
          </div>
        </div>

        <div className="relative h-[280px] bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_40%),linear-gradient(180deg,rgba(2,6,23,0.86),rgba(2,6,23,0.96))] p-4">
          <div className="cyber-grid absolute inset-0 opacity-20" />
          {territories.map((territory) => {
            const isSelected = selectedTerritory === territory.name;

            return (
              <button
                key={territory.name}
                type="button"
                className="absolute -translate-x-1/2 -translate-y-1/2 text-left"
                style={{ left: `${territory.x}%`, top: `${territory.y}%` }}
                onMouseEnter={() => setSelectedTerritory(territory.name)}
                onFocus={() => setSelectedTerritory(territory.name)}
              >
                <div className="relative">
                  <div
                    className={`absolute inset-0 rounded-full blur-xl transition-opacity ${isSelected ? "opacity-100" : "opacity-40"}`}
                    style={{
                      background: isSelected
                        ? "rgba(34,211,238,0.35)"
                        : "rgba(34,211,238,0.12)",
                    }}
                  />
                  <div
                    className={`relative flex h-4 w-4 items-center justify-center rounded-full border-2 ${isSelected ? "border-cyan-300 bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.8)]" : "border-white/50 bg-cyan-400/60"}`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {territories.map((territory) => {
          const isSelected = selectedTerritory === territory.name;
          return (
            <button
              key={territory.name}
              type="button"
              onClick={() => setSelectedTerritory(territory.name)}
              className={`surface-panel w-full p-4 text-left transition-all ${isSelected ? "border-cyan-400/20 bg-cyan-400/8" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-white">{territory.name}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    {territory.region}
                  </div>
                </div>
                <MapPinned className="h-4 w-4 text-primary" />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <div className="metal-chip">
                  <Shield className="h-3.5 w-3.5 text-emerald-300" />
                  {territory.status}
                </div>
                <div className="metal-chip">
                  <Crown className="h-3.5 w-3.5 text-amber-300" />
                  Club-owned
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
