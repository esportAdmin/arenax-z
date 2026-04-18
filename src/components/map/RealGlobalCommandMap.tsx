"use client";

import { useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

import { useActiveWars } from "@/hooks/useActiveWars";
import type { Territory } from "@/hooks/useGlobalWarMap";

const WORLD_TOPOJSON_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const FEATURED_COUNTRIES = new Set([
  "Argentina",
  "Australia",
  "Brazil",
  "Canada",
  "China",
  "France",
  "Germany",
  "Japan",
  "Mexico",
  "Spain",
  "United Kingdom",
  "United States of America",
]);

const COUNTRY_TERRITORY_GROUPS: Record<string, string[]> = {
  argentina: ["argentina", "latam"],
  australia: ["australia", "oceania"],
  brazil: ["brazil", "latam"],
  canada: ["canada"],
  china: ["china", "apac"],
  france: ["france", "eu west"],
  germany: ["germany", "eu west"],
  japan: ["japan", "apac"],
  mexico: ["mexico", "latam"],
  spain: ["spain", "eu west"],
  "united kingdom": ["uk", "united kingdom", "eu west"],
  "united states of america": [
    "us east",
    "us west",
    "west coast",
    "texas",
    "midwest",
    "northeast",
    "florida",
  ],
};

const TERRITORY_COORDS: Record<string, [number, number]> = {
  apac: [139.76, 35.68],
  argentina: [-58.38, -34.6],
  australia: [151.21, -33.87],
  brazil: [-47.88, -15.79],
  canada: [-79.38, 43.65],
  china: [116.4, 39.9],
  "east coast": [-74.01, 40.71],
  "eu west": [2.35, 48.86],
  florida: [-81.5, 28.1],
  france: [2.21, 46.23],
  germany: [10.45, 51.17],
  japan: [139.76, 35.68],
  latam: [-46.63, -23.55],
  mexico: [-99.13, 19.43],
  midwest: [-93.27, 44.98],
  northeast: [-74.01, 40.71],
  spain: [-3.7, 40.42],
  texas: [-97.74, 30.27],
  uk: [-1.5, 52.5],
  "united kingdom": [-1.5, 52.5],
  "us east": [-74.01, 40.71],
  "us west": [-122.42, 37.77],
  "west coast": [-122.42, 37.77],
};

const US_COMMAND_ZONES = [
  {
    label: "West Coast",
    description: "Creator raids",
    coordinates: [-122.42, 37.77] as [number, number],
    tone: "cyan",
  },
  {
    label: "Texas Hub",
    description: "Guild ops",
    coordinates: [-97.74, 30.27] as [number, number],
    tone: "orange",
  },
  {
    label: "Midwest",
    description: "Daily rituals",
    coordinates: [-93.27, 44.98] as [number, number],
    tone: "violet",
  },
  {
    label: "East Coast",
    description: "Prime time",
    coordinates: [-74.01, 40.71] as [number, number],
    tone: "cyan",
  },
  {
    label: "Florida",
    description: "Return pulse",
    coordinates: [-81.5, 28.1] as [number, number],
    tone: "orange",
  },
];

interface RealGlobalCommandMapProps {
  onSelect: (territory: Territory) => void;
  selectedTerritoryId?: string | null;
  territories: Territory[];
}

type GeoLike = {
  rsmKey: string;
  properties?: {
    name?: string;
  };
};

/**
 * Normalizes labels so country names and live territory rows can match.
 *
 * Example:
 * ```ts
 * normalizeName("US East") === "us east"
 * ```
 */
function normalizeName(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, " ");
}

/**
 * Returns the live territories associated with a map country.
 *
 * Example:
 * ```ts
 * findTerritoriesForCountry("United States of America", territories)
 * ```
 */
function findTerritoriesForCountry(countryName: string, territories: Territory[]) {
  const aliases = COUNTRY_TERRITORY_GROUPS[normalizeName(countryName)] ?? [
    normalizeName(countryName),
  ];

  return territories.filter((territory) => {
    const normalizedTerritory = normalizeName(territory.name);
    return aliases.some(
      (alias) =>
        normalizedTerritory === alias ||
        normalizedTerritory.includes(alias) ||
        alias.includes(normalizedTerritory),
    );
  });
}

/**
 * Finds the best known longitude/latitude pair for a live territory.
 *
 * Example:
 * ```ts
 * getTerritoryCoordinates({ name: "Texas" } as Territory)
 * ```
 */
function getTerritoryCoordinates(territory: Territory) {
  return TERRITORY_COORDS[normalizeName(territory.name)];
}

/**
 * Returns a premium HUD fill for a strategic country on the global board.
 *
 * Example:
 * ```ts
 * getCountryTone(true, false, false)
 * ```
 */
function getCountryTone(isControlled: boolean, isWar: boolean, isSelected: boolean) {
  if (isSelected) return "rgba(103,232,249,0.62)";
  if (isWar) return "rgba(251,113,133,0.58)";
  if (isControlled) return "rgba(34,211,238,0.32)";
  return "rgba(30,41,59,0.5)";
}

/**
 * Renders a real world command map centered on the US market.
 *
 * Example:
 * ```tsx
 * <RealGlobalCommandMap territories={territories} onSelect={setTerritory} />
 * ```
 */
export function RealGlobalCommandMap({
  onSelect,
  selectedTerritoryId,
  territories,
}: RealGlobalCommandMapProps) {
  const wars = useActiveWars();

  const warTerritoryIds = useMemo(
    () => new Set(wars.map((war) => war.territory?.id).filter(Boolean)),
    [wars],
  );

  const mappedTerritories = useMemo(
    () =>
      territories
        .map((territory) => ({
          coords: getTerritoryCoordinates(territory),
          territory,
        }))
        .filter((entry): entry is { coords: [number, number]; territory: Territory } =>
          Boolean(entry.coords),
        ),
    [territories],
  );

  const firstSelectableTerritory = territories[0];

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[1.75rem] bg-[#030916]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_31%_42%,rgba(34,211,238,0.24),transparent_26%),radial-gradient(circle_at_40%_55%,rgba(249,115,22,0.18),transparent_21%),radial-gradient(circle_at_72%_42%,rgba(168,85,247,0.16),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(34,211,238,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.12)_1px,transparent_1px)] [background-size:36px_36px]" />
      <ComposableMap
        height={620}
        projection="geoMercator"
        projectionConfig={{ center: [-95, 39], scale: 390 }}
        width={1000}
        className="relative z-10 h-full w-full drop-shadow-[0_0_34px_rgba(34,211,238,0.24)]"
      >
        <defs>
          <filter id="realGlobalGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="realGlobalScan" x1="0" x2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
        </defs>
        <Geographies geography={WORLD_TOPOJSON_URL}>
          {({ geographies }: { geographies: GeoLike[] }) =>
            geographies
              .filter((geo) => FEATURED_COUNTRIES.has(geo.properties?.name ?? ""))
              .map((geo) => {
                const countryTerritories = findTerritoriesForCountry(
                  geo.properties?.name ?? "",
                  territories,
                );
                const selectedInCountry = countryTerritories.some(
                  (territory) => territory.id === selectedTerritoryId,
                );
                const warInCountry = countryTerritories.some((territory) =>
                  warTerritoryIds.has(territory.id),
                );
                const controlledInCountry = countryTerritories.some(
                  (territory) => territory.controlling_club_id,
                );
                const clickableTerritory = countryTerritories[0] ?? firstSelectableTerritory;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getCountryTone(controlledInCountry, warInCountry, selectedInCountry)}
                    onClick={() => {
                      if (clickableTerritory) onSelect(clickableTerritory);
                    }}
                    stroke={
                      warInCountry
                        ? "#fb7185"
                        : selectedInCountry
                          ? "#67e8f9"
                          : "rgba(103,232,249,0.38)"
                    }
                    strokeWidth={selectedInCountry || warInCountry ? 1.8 : 0.8}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "rgba(251,146,60,0.52)", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
          }
        </Geographies>

        {US_COMMAND_ZONES.map((zone) => (
          <Marker
            key={zone.label}
            coordinates={zone.coordinates}
            onClick={() => {
              if (firstSelectableTerritory) onSelect(firstSelectableTerritory);
            }}
          >
            <circle
              r={14}
              fill={
                zone.tone === "orange"
                  ? "rgba(251,146,60,0.2)"
                  : zone.tone === "violet"
                    ? "rgba(168,85,247,0.2)"
                    : "rgba(34,211,238,0.18)"
              }
              stroke={
                zone.tone === "orange"
                  ? "#fb923c"
                  : zone.tone === "violet"
                    ? "#c084fc"
                    : "#67e8f9"
              }
              strokeWidth={1.8}
            />
            <circle
              r={4}
              fill={zone.tone === "orange" ? "#fb923c" : "#67e8f9"}
              filter="url(#realGlobalGlow)"
            />
            <text
              y={-22}
              textAnchor="middle"
              fill="#cffafe"
              fontSize="8"
              fontWeight="900"
              letterSpacing="1"
            >
              {zone.label.toUpperCase()}
            </text>
            <text
              y={24}
              textAnchor="middle"
              fill="#fed7aa"
              fontSize="7"
              fontWeight="800"
              letterSpacing="0.8"
            >
              {zone.description.toUpperCase()}
            </text>
          </Marker>
        ))}

        {mappedTerritories.map(({ coords, territory }) => {
          const isSelected = selectedTerritoryId === territory.id;
          const isWar = warTerritoryIds.has(territory.id);

          return (
            <Marker
              key={territory.id}
              coordinates={coords}
              onClick={() => onSelect(territory)}
            >
              <circle
                r={isWar ? 17 : isSelected ? 15 : 10}
                fill={isWar ? "rgba(248,113,113,0.24)" : "rgba(34,211,238,0.18)"}
                stroke={isWar ? "#fb7185" : "#67e8f9"}
                strokeDasharray={isSelected ? "5 5" : undefined}
                strokeWidth={isSelected || isWar ? 2.2 : 1.2}
              />
              <circle
                r={isWar ? 5 : 3.5}
                fill={isWar ? "#fb7185" : "#67e8f9"}
                filter="url(#realGlobalGlow)"
              />
            </Marker>
          );
        })}
        <rect x={-280} y="0" width="220" height="620" fill="url(#realGlobalScan)">
          <animate attributeName="x" dur="16s" repeatCount="indefinite" values="-280;1080;-280" />
        </rect>
      </ComposableMap>
      <div className="pointer-events-none absolute left-6 top-6 z-20 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.18em] text-cyan-100">
        North America command map
      </div>
      <div className="pointer-events-none absolute bottom-6 left-6 right-6 z-20 grid gap-2 text-[0.68rem] font-black uppercase tracking-[0.14em] text-slate-300 sm:grid-cols-3">
        <div className="rounded-2xl border border-cyan-300/18 bg-cyan-300/10 px-3 py-2">
          Cyan: active community regions
        </div>
        <div className="rounded-2xl border border-orange-300/18 bg-orange-400/10 px-3 py-2">
          Orange: US prime-time pressure
        </div>
        <div className="rounded-2xl border border-violet-300/18 bg-violet-400/10 px-3 py-2">
          Violet: global expansion lanes
        </div>
      </div>
    </div>
  );
}
