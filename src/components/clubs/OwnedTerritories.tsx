"use client";

import { useState } from "react";
import { Crown, MapPinned, Shield } from "lucide-react";

const territories = [
  {
    name: "Nova Prime",
    region: "Americas",
    status: "Fortified",
    x: 18,
    y: 34,
    color: "cyan",
    path: "M72 132 L126 92 L197 112 L217 171 L155 205 L91 185 Z",
  },
  {
    name: "Sector Atlas",
    region: "Europe",
    status: "Contested",
    x: 45,
    y: 28,
    color: "amber",
    path: "M190 96 L279 74 L343 117 L326 181 L244 191 L209 148 Z",
  },
  {
    name: "Helios Reach",
    region: "Asia",
    status: "Stable",
    x: 72,
    y: 39,
    color: "violet",
    path: "M324 126 L417 92 L514 122 L529 197 L435 230 L340 188 Z",
  },
  {
    name: "Delta Gate",
    region: "Oceania",
    status: "Fortified",
    x: 77,
    y: 70,
    color: "orange",
    path: "M373 220 L464 205 L538 244 L516 306 L423 320 L350 279 Z",
  },
  {
    name: "Polar Crown",
    region: "Arctic",
    status: "Rising",
    x: 57,
    y: 13,
    color: "blue",
    path: "M250 35 L333 18 L394 50 L357 92 L276 88 Z",
  },
];

export default function OwnedTerritories() {
  const [selectedTerritory, setSelectedTerritory] = useState(territories[0].name);
  const selected = territories.find((territory) => territory.name === selectedTerritory) ?? territories[0];

  const polygonTone = (territory: (typeof territories)[number]) => {
    const isSelected = selectedTerritory === territory.name;
    const tones: Record<string, string> = {
      cyan: isSelected ? "fill-cyan-400/20 stroke-cyan-200" : "fill-cyan-400/10 stroke-cyan-400/30",
      amber: isSelected ? "fill-amber-400/20 stroke-amber-200" : "fill-amber-400/10 stroke-amber-400/30",
      violet: isSelected ? "fill-violet-400/20 stroke-violet-200" : "fill-violet-400/10 stroke-violet-400/30",
      orange: isSelected ? "fill-orange-400/20 stroke-orange-200" : "fill-orange-400/10 stroke-orange-400/30",
      blue: isSelected ? "fill-sky-400/20 stroke-sky-200" : "fill-sky-400/10 stroke-sky-400/30",
    };
    return tones[territory.color] ?? tones.cyan;
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/65">
        <div className="border-b border-white/10 px-4 py-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Territory network
              </div>
              <div className="mt-1 text-lg font-display font-bold text-white">
                Ground worth defending every day
              </div>
            </div>
            <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100">
              {selected.status}
            </div>
          </div>
        </div>

        <div className="relative h-[320px] bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_40%),linear-gradient(180deg,rgba(2,6,23,0.86),rgba(2,6,23,0.96))] p-4">
          <div className="cyber-grid absolute inset-0 opacity-20" />
          <svg
            viewBox="0 0 600 350"
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="Stylized club territory control map"
          >
            <defs>
              <filter id="club-map-glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M105 175 C190 95 285 90 360 132 C430 172 474 185 525 158"
              className="fill-none stroke-cyan-300/20"
              strokeWidth="2"
              strokeDasharray="7 9"
            />
            <path
              d="M152 210 C235 255 345 274 454 232"
              className="fill-none stroke-orange-300/20"
              strokeWidth="2"
              strokeDasharray="6 8"
            />
            {territories.map((territory) => (
              <g
                key={territory.name}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedTerritory(territory.name)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedTerritory(territory.name);
                  }
                }}
                className="cursor-pointer outline-none"
              >
                <path
                  d={territory.path}
                  className={`${polygonTone(territory)} transition-all`}
                  strokeWidth={selectedTerritory === territory.name ? 3 : 2}
                  filter={selectedTerritory === territory.name ? "url(#club-map-glow)" : undefined}
                />
              </g>
            ))}
          </svg>
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
                <span className={`mt-2 hidden rounded-full border border-white/10 bg-slate-950/80 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white sm:block ${isSelected ? "opacity-100" : "opacity-0"}`}>
                  {territory.name}
                </span>
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
