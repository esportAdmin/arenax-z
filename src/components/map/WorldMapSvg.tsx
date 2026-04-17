"use client";

import { useMemo } from "react";

import { useActiveWars } from "@/hooks/useActiveWars";
import { WorldMapDefs, WorldMapHudBase } from "@/components/map/WorldMapHudBase";
import {
  getIntensity,
  getTerritoryFill,
  getTerritoryStroke,
  normalizeCoords,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
  type War,
} from "@/components/map/worldMapLayout";

export type Territory = {
  id: string;
  name: string;
  map_x: number | null;
  map_y: number | null;
  controlling_club_id: string | null;
  clubs?: { name: string } | null;
};

type Props = {
  territories: Territory[];
  onSelect: (territory: Territory) => void;
  selectedTerritoryId?: string | null;
};

export default function WorldMapSvg({
  territories,
  onSelect,
  selectedTerritoryId = null,
}: Props) {
  const wars = useActiveWars() as War[];

  const coords = useMemo(() => normalizeCoords(territories), [territories]);
  const visibleTerritories = territories.filter((territory) => coords.has(territory.id));
  const autoPlacedCount = visibleTerritories.filter(
    (territory) => coords.get(territory.id)?.isAutoPlaced,
  ).length;
  const radius =
    visibleTerritories.length > 36 ? 16 : visibleTerritories.length > 20 ? 18 : 22;

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      style={{ width: "100%", height: "100%", display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Animated global war map"
    >
      <WorldMapDefs />
      <WorldMapHudBase />

      {visibleTerritories.length === 0 && (
        <g>
          <text
            x={VIEWBOX_WIDTH / 2}
            y={VIEWBOX_HEIGHT / 2 - 12}
            textAnchor="middle"
            fill="rgba(125,211,252,0.52)"
            fontSize="14"
            fontFamily="monospace"
          >
            No territories available yet.
          </text>
          <text
            x={VIEWBOX_WIDTH / 2}
            y={VIEWBOX_HEIGHT / 2 + 12}
            textAnchor="middle"
            fill="rgba(125,211,252,0.26)"
            fontSize="10"
            fontFamily="monospace"
          >
            Connect live territory data to populate the global map.
          </text>
        </g>
      )}

      {autoPlacedCount > 0 && (
        <g transform="translate(26, 26)">
          <rect
            width="260"
            height="38"
            rx="12"
            fill="rgba(2, 12, 23, 0.78)"
            stroke="rgba(56,189,248,0.18)"
          />
          <text
            x="16"
            y="24"
            fill="rgba(186,230,253,0.92)"
            fontSize="11"
            fontFamily="monospace"
          >
            Smart auto-layout active for {autoPlacedCount} territories
          </text>
        </g>
      )}

      {visibleTerritories
        .filter((territory) => territory.controlling_club_id)
        .slice(0, 10)
        .map((territory, index, controlled) => {
          const coord = coords.get(territory.id);
          const next = controlled[index + 1] ? coords.get(controlled[index + 1].id) : null;
          if (!coord || !next) return null;

          return (
            <path
              key={`${territory.id}-route`}
              d={`M${coord.cx} ${coord.cy} C${(coord.cx + next.cx) / 2} ${coord.cy - 42}, ${(coord.cx + next.cx) / 2} ${next.cy + 42}, ${next.cx} ${next.cy}`}
              fill="none"
              stroke={index % 2 === 0 ? "rgba(34,211,238,0.2)" : "rgba(249,115,22,0.18)"}
              strokeWidth="1.2"
              strokeDasharray="5 8"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;-26"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>
          );
        })}

      {visibleTerritories.map((territory) => {
        const coord = coords.get(territory.id);
        if (!coord) return null;

        const { cx, cy, isAutoPlaced } = coord;
        const war = wars.find((activeWar) => activeWar.territory?.id === territory.id);
        const intensity = getIntensity(war);
        const isSelected = selectedTerritoryId === territory.id;
        const hexagon = [0, 1, 2, 3, 4, 5]
          .map((index) => {
            const angle = (Math.PI / 180) * (60 * index - 30);
            return `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`;
          })
          .join(" ");

        return (
          <g key={territory.id}>
            {war && (
              <>
                <circle cx={cx} cy={cy} r={radius + 20} fill="url(#wms-warGlow)" opacity={0.45}>
                  <animate
                    attributeName="r"
                    values={`${radius + 14};${radius + 34};${radius + 14}`}
                    dur={`${1.4 + intensity * 0.9}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.28;0.8;0.28"
                    dur={`${1.4 + intensity * 0.9}s`}
                    repeatCount="indefinite"
                  />
                </circle>
                <circle cx={cx} cy={cy} r={radius + 7} fill="#ff4444" opacity={0.12}>
                  <animate
                    attributeName="r"
                    values={`${radius + 3};${radius + 14};${radius + 3}`}
                    dur="1.9s"
                    repeatCount="indefinite"
                  />
                </circle>
              </>
            )}

            {territory.controlling_club_id && !war && (
              <circle cx={cx} cy={cy} r={radius + 10} fill="url(#wms-controlGlow)" opacity={0.52}>
                <animate
                  attributeName="opacity"
                  values="0.25;0.58;0.25"
                  dur="4.5s"
                  repeatCount="indefinite"
                />
              </circle>
            )}

            {isSelected && (
              <circle
                cx={cx}
                cy={cy}
                r={radius + 18}
                fill="none"
                stroke="#7dd3fc"
                strokeWidth="2.5"
                strokeDasharray="5,7"
                filter="url(#wms-selectedGlow)"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`0 ${cx} ${cy}`}
                  to={`360 ${cx} ${cy}`}
                  dur="10s"
                  repeatCount="indefinite"
                />
              </circle>
            )}

            <polygon
              points={hexagon}
              fill={getTerritoryFill(territory, war)}
              stroke={getTerritoryStroke(territory, war)}
              strokeWidth={isSelected ? 3 : war ? 2.5 : 1.5}
              filter={
                isSelected
                  ? "url(#wms-selectedGlow)"
                  : war
                    ? "url(#wms-redGlow)"
                    : territory.controlling_club_id
                      ? "url(#wms-blueGlow)"
                      : "none"
              }
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(territory)}
            />

            <text
              x={cx}
              y={cy + 3}
              textAnchor="middle"
              fill={
                war ? "#fecaca" : territory.controlling_club_id ? "#bfdbfe" : "#94a3b8"
              }
              fontSize={radius < 18 ? 7 : 8}
              fontWeight={war || isSelected ? "700" : "500"}
              fontFamily="monospace"
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {territory.name.toUpperCase().slice(0, 10)}
            </text>

            {war && intensity > 0 && (
              <g>
                {[0, 1, 2].map((index) => (
                  <rect
                    key={index}
                    x={cx - 10 + index * 8}
                    y={cy + radius + 4}
                    width="5"
                    height={3 + index * 1.5}
                    rx="1"
                    fill={
                      intensity > 0.66 ? "#ff6363" : intensity > 0.33 ? "#fb923c" : "#facc15"
                    }
                    opacity={intensity > index / 3 ? 1 : 0.22}
                  />
                ))}
              </g>
            )}

            {war && (
              <g>
                <g transform={`translate(${cx - 44}, ${cy - radius - 44})`}>
                  <rect
                    width="88"
                    height="20"
                    rx="8"
                    fill="rgba(127,29,29,0.82)"
                    stroke="rgba(251,146,60,0.5)"
                  />
                  <text
                    x="44"
                    y="14"
                    textAnchor="middle"
                    fontSize="8"
                    fontWeight="800"
                    fill="#fed7aa"
                    fontFamily="monospace"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    PRESSURE RISING
                  </text>
                </g>
                <circle cx={cx} cy={cy - radius - 12} r={10} fill="#ef4444" opacity={0.22}>
                  <animate
                    attributeName="r"
                    values="8;18;8"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.32;0;0.32"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx={cx}
                  cy={cy - radius - 12}
                  r={6}
                  fill="#ff5757"
                  filter="url(#wms-redGlow)"
                />
                <text
                  x={cx}
                  y={cy - radius - 8}
                  textAnchor="middle"
                  fontSize="8"
                  fill="#fff"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  W
                </text>
              </g>
            )}

            {territory.controlling_club_id && !war && (
              <circle
                cx={cx}
                cy={cy - radius - 8}
                r={5}
                fill={isAutoPlaced ? "#38bdf8" : "#60a5fa"}
                filter="url(#wms-blueGlow)"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
