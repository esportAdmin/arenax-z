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

const EUROPE_TOPOJSON_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const EUROPE_COUNTRIES = new Set([
  "Albania",
  "Austria",
  "Belarus",
  "Belgium",
  "Bosnia and Herz.",
  "Bulgaria",
  "Croatia",
  "Czechia",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Ireland",
  "Italy",
  "Latvia",
  "Lithuania",
  "Moldova",
  "Netherlands",
  "North Macedonia",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Russia",
  "Serbia",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Switzerland",
  "Turkey",
  "Ukraine",
  "United Kingdom",
]);

const COUNTRY_ALIASES: Record<string, string> = {
  "bosnia and herz.": "bosnia and herzegovina",
  czechia: "czech republic",
  russia: "russia west",
  "united kingdom": "uk",
};

const TERRITORY_COORDS: Record<string, [number, number]> = {
  argentina: [-58.38, -34.6],
  balkans: [20.7, 44.1],
  berlin: [13.4, 52.52],
  brazil: [-47.88, -15.79],
  canada: [-75.69, 45.42],
  china: [116.4, 39.9],
  egypt: [31.24, 30.04],
  florida: [-81.5, 28.1],
  france: [2.21, 46.23],
  germany: [10.45, 51.17],
  indonesia: [106.82, -6.2],
  iran: [51.39, 35.69],
  italy: [12.5, 41.9],
  japan: [139.76, 35.68],
  kenya: [36.82, -1.29],
  korea: [126.98, 37.56],
  london: [-0.13, 51.51],
  mexico: [-99.13, 19.43],
  midwest: [-93.27, 44.98],
  morocco: [-6.84, 34.02],
  pakistan: [73.05, 33.68],
  paris: [2.35, 48.86],
  peru: [-77.04, -12.05],
  poland: [19.15, 51.92],
  portugal: [-9.14, 38.72],
  rome: [12.5, 41.9],
  "russia west": [37.62, 55.75],
  scandinavia: [18.07, 59.33],
  "south africa": [28.05, -26.2],
  spain: [-3.7, 40.42],
  texas: [-97.74, 30.27],
  turkey: [32.86, 39.93],
  uae: [55.27, 25.2],
  uk: [-1.5, 52.5],
  ukraine: [30.52, 50.45],
};

interface RealEuropeCommandMapProps {
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
 * Normalizes labels so live territory rows can match map country names.
 *
 * Example:
 * ```ts
 * normalizeName("United Kingdom") === "united kingdom"
 * ```
 */
function normalizeName(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, " ");
}

/**
 * Resolves a geography country name to the matching live territory.
 *
 * Example:
 * ```ts
 * findTerritoryForCountry("France", territories)
 * ```
 */
function findTerritoryForCountry(countryName: string, territories: Territory[]) {
  const normalizedCountry = normalizeName(COUNTRY_ALIASES[normalizeName(countryName)] ?? countryName);

  return territories.find((territory) => {
    const normalizedTerritory = normalizeName(territory.name);
    return (
      normalizedTerritory === normalizedCountry ||
      normalizedTerritory.includes(normalizedCountry) ||
      normalizedCountry.includes(normalizedTerritory)
    );
  });
}

/**
 * Finds the best known longitude/latitude pair for a live territory.
 *
 * Example:
 * ```ts
 * getTerritoryCoordinates({ name: "France" } as Territory)
 * ```
 */
function getTerritoryCoordinates(territory: Territory) {
  const normalized = normalizeName(territory.name);
  return TERRITORY_COORDS[normalized];
}

/**
 * Returns a premium HUD fill for real map countries.
 *
 * Example:
 * ```ts
 * getCountryTone(true, false, false)
 * ```
 */
function getCountryTone(isControlled: boolean, isWar: boolean, isSelected: boolean) {
  if (isSelected) return "rgba(103,232,249,0.64)";
  if (isWar) return "rgba(248,113,113,0.6)";
  if (isControlled) return "rgba(34,211,238,0.35)";
  return "rgba(30,41,59,0.56)";
}

/**
 * Renders the real Europe command map with RallyGuild HUD overlays.
 *
 * Example:
 * ```tsx
 * <RealEuropeCommandMap territories={territories} onSelect={setTerritory} />
 * ```
 */
export function RealEuropeCommandMap({
  onSelect,
  selectedTerritoryId,
  territories,
}: RealEuropeCommandMapProps) {
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

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[1.75rem] bg-[#030916]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_46%_48%,rgba(249,115,22,0.2),transparent_23%),radial-gradient(circle_at_35%_42%,rgba(34,211,238,0.2),transparent_26%),radial-gradient(circle_at_66%_55%,rgba(168,85,247,0.18),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(34,211,238,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.12)_1px,transparent_1px)] [background-size:36px_36px]" />
      <ComposableMap
        height={620}
        projection="geoMercator"
        projectionConfig={{ center: [15, 51], scale: 760 }}
        width={1000}
        className="relative z-10 h-full w-full drop-shadow-[0_0_34px_rgba(34,211,238,0.24)]"
      >
        <defs>
          <filter id="realEuropeGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="realEuropeScan" x1="0" x2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
        </defs>
        <Geographies geography={EUROPE_TOPOJSON_URL}>
          {({ geographies }: { geographies: GeoLike[] }) =>
            geographies
              .filter((geo) => EUROPE_COUNTRIES.has(geo.properties?.name ?? ""))
              .map((geo) => {
                const territory = findTerritoryForCountry(
                  geo.properties?.name ?? "",
                  territories,
                );
                const isSelected = territory?.id === selectedTerritoryId;
                const isWar = territory ? warTerritoryIds.has(territory.id) : false;
                const isControlled = Boolean(territory?.controlling_club_id);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getCountryTone(isControlled, isWar, isSelected)}
                    onClick={() => {
                      if (territory) onSelect(territory);
                    }}
                    stroke={
                      isWar ? "#fb7185" : isSelected ? "#67e8f9" : "rgba(103,232,249,0.42)"
                    }
                    strokeWidth={isSelected || isWar ? 1.7 : 0.8}
                    style={{
                      default: { outline: "none" },
                      hover: {
                        fill: "rgba(251,146,60,0.5)",
                        outline: "none",
                      },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
          }
        </Geographies>

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
                r={isWar ? 16 : isSelected ? 14 : 10}
                fill={isWar ? "rgba(248,113,113,0.22)" : "rgba(34,211,238,0.18)"}
                stroke={isWar ? "#fb7185" : "#67e8f9"}
                strokeDasharray={isSelected ? "5 5" : undefined}
                strokeWidth={isSelected || isWar ? 2.2 : 1.3}
              />
              <circle
                r={isWar ? 5 : 3.5}
                fill={isWar ? "#fb7185" : "#67e8f9"}
                filter="url(#realEuropeGlow)"
              />
              {isWar ? (
                <text
                  y={-20}
                  textAnchor="middle"
                  fill="#fed7aa"
                  fontSize="9"
                  fontWeight="900"
                  letterSpacing="1"
                >
                  HOT
                </text>
              ) : null}
            </Marker>
          );
        })}
        <rect x={-280} y="0" width="220" height="620" fill="url(#realEuropeScan)">
          <animate
            attributeName="x"
            dur="16s"
            repeatCount="indefinite"
            values="-280;1080;-280"
          />
        </rect>
      </ComposableMap>
      <div className="pointer-events-none absolute left-6 top-6 z-20 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.18em] text-cyan-100">
        Real Europe theater
      </div>
      <div className="pointer-events-none absolute bottom-6 left-6 right-6 z-20 grid gap-2 text-[0.68rem] font-black uppercase tracking-[0.14em] text-slate-300 sm:grid-cols-3">
        <div className="rounded-2xl border border-cyan-300/18 bg-cyan-300/10 px-3 py-2">
          Cyan: owned or selected ground
        </div>
        <div className="rounded-2xl border border-orange-300/18 bg-orange-400/10 px-3 py-2">
          Orange: pressure corridor
        </div>
        <div className="rounded-2xl border border-rose-300/18 bg-rose-400/10 px-3 py-2">
          Red: active rivalry
        </div>
      </div>
    </div>
  );
}
