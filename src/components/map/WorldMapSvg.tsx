"use client";

import { useMemo } from "react";

import { useActiveWars } from "@/hooks/useActiveWars";

export type Territory = {
  id: string;
  name: string;
  map_x: number | null;
  map_y: number | null;
  controlling_club_id: string | null;
  clubs?: { name: string } | null;
};

type War = {
  id: string;
  territory?: { id: string; name?: string } | null;
  challenger_xp: number;
  defender_xp: number;
  challenger?: { id: string; name: string } | null;
  defender?: { id: string; name: string } | null;
};

type Props = {
  territories: Territory[];
  onSelect: (territory: Territory) => void;
  selectedTerritoryId?: string | null;
};

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 500;
const PADDING = 60;

const CONTINENT_PATHS = [
  "M98 132 C152 88 252 88 310 132 C338 156 344 190 324 220 C304 254 256 282 214 288 C166 294 118 278 92 246 C64 212 62 162 98 132 Z",
  "M240 286 C270 282 294 298 304 330 C312 360 304 402 286 434 C270 462 246 476 222 470 C198 462 190 432 194 402 C198 364 214 326 240 286 Z",
  "M442 120 C482 92 560 94 612 126 C648 150 660 188 646 218 C630 252 594 280 552 288 C508 296 458 286 430 256 C402 226 404 160 442 120 Z",
  "M518 292 C560 286 600 304 626 336 C650 366 650 402 626 426 C602 452 560 460 524 448 C490 438 466 410 464 382 C460 340 480 300 518 292 Z",
  "M674 112 C722 84 814 90 878 124 C928 152 946 194 932 228 C916 268 866 294 814 300 C758 306 700 292 666 262 C632 232 634 142 674 112 Z",
  "M850 348 C878 338 912 346 936 366 C960 384 964 410 948 426 C932 442 902 446 876 438 C850 428 830 408 828 388 C824 370 832 354 850 348 Z",
];

const REGION_LABELS = [
  { label: "NORTH AMERICA", x: 178, y: 120, anchor: "middle" },
  { label: "SOUTH AMERICA", x: 246, y: 410, anchor: "middle" },
  { label: "EUROPE", x: 510, y: 104, anchor: "middle" },
  { label: "AFRICA", x: 542, y: 404, anchor: "middle" },
  { label: "ASIA COMMAND", x: 786, y: 112, anchor: "middle" },
  { label: "OCEANIA", x: 884, y: 334, anchor: "middle" },
] as const;

type CoordMap = Map<string, { cx: number; cy: number; isAutoPlaced: boolean }>;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getIntensity(war: War | undefined): number {
  if (!war) return 0;
  const total = war.challenger_xp + war.defender_xp;
  if (total === 0) return 0;
  return 1 - Math.abs(war.challenger_xp - war.defender_xp) / total;
}

function getTerritoryFill(territory: Territory, war: War | undefined): string {
  if (war) return "#22090d";
  if (territory.controlling_club_id) return "#0d223b";
  return "#091321";
}

function getTerritoryStroke(territory: Territory, war: War | undefined): string {
  if (war) return "#ff5d5d";
  if (territory.controlling_club_id) return "#63b3ff";
  return "#2d496d";
}

function buildAutoLayoutCoords(territories: Territory[]): CoordMap {
  const anchors = [
    { x: 170, y: 170 },
    { x: 258, y: 318 },
    { x: 492, y: 176 },
    { x: 536, y: 326 },
    { x: 790, y: 170 },
    { x: 876, y: 356 },
  ];

  const result: CoordMap = new Map();
  const ordered = [...territories].sort((left, right) =>
    left.name.localeCompare(right.name),
  );

  ordered.forEach((territory, index) => {
    const anchor = anchors[index % anchors.length];
    const ring = Math.floor(index / anchors.length);
    const angle = ((index * 137.5) % 360) * (Math.PI / 180);
    const radius = 18 + ring * 18;

    result.set(territory.id, {
      cx: clamp(anchor.x + Math.cos(angle) * radius, PADDING, VIEWBOX_WIDTH - PADDING),
      cy: clamp(
        anchor.y + Math.sin(angle) * radius * 0.82,
        PADDING,
        VIEWBOX_HEIGHT - PADDING,
      ),
      isAutoPlaced: true,
    });
  });

  return result;
}

function normalizeCoords(territories: Territory[]): CoordMap {
  const valid = territories.filter(
    (territory) => territory.map_x !== null && territory.map_y !== null,
  );

  if (valid.length === 0) {
    return buildAutoLayoutCoords(territories);
  }

  const xs = valid.map((territory) => territory.map_x as number);
  const ys = valid.map((territory) => territory.map_y as number);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  const result: CoordMap = new Map();

  for (const territory of valid) {
    const x = territory.map_x as number;
    const y = territory.map_y as number;

    result.set(territory.id, {
      cx: PADDING + ((x - minX) / rangeX) * (VIEWBOX_WIDTH - PADDING * 2),
      cy: PADDING + ((y - minY) / rangeY) * (VIEWBOX_HEIGHT - PADDING * 2),
      isAutoPlaced: false,
    });
  }

  const missing = territories.filter((territory) => !result.has(territory.id));
  const fallback = buildAutoLayoutCoords(missing);

  missing.forEach((territory) => {
    const fallbackCoord = fallback.get(territory.id);
    if (fallbackCoord) {
      result.set(territory.id, fallbackCoord);
    }
  });

  return result;
}

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
      <defs>
        <linearGradient id="wms-ocean" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#020611" />
          <stop offset="55%" stopColor="#051224" />
          <stop offset="100%" stopColor="#07182b" />
        </linearGradient>

        <linearGradient id="wms-continent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(34,211,238,0.2)" />
          <stop offset="54%" stopColor="rgba(59,130,246,0.07)" />
          <stop offset="100%" stopColor="rgba(249,115,22,0.06)" />
        </linearGradient>

        <linearGradient id="wms-hudFrame" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.08" />
          <stop offset="18%" stopColor="#22d3ee" stopOpacity="0.88" />
          <stop offset="50%" stopColor="#67e8f9" stopOpacity="0.32" />
          <stop offset="82%" stopColor="#fb923c" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fb923c" stopOpacity="0.08" />
        </linearGradient>

        <radialGradient id="wms-warGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff4444" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ff4444" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="wms-controlGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="wms-scan" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(34,211,238,0)" />
          <stop offset="50%" stopColor="rgba(34,211,238,0.08)" />
          <stop offset="100%" stopColor="rgba(34,211,238,0)" />
        </linearGradient>

        <filter id="wms-redGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="wms-blueGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="wms-selectedGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <pattern id="wms-grid" width="44" height="44" patternUnits="userSpaceOnUse">
          <path
            d="M 44 0 L 0 0 0 44"
            fill="none"
            stroke="rgba(56,189,248,0.06)"
            strokeWidth="0.6"
          />
        </pattern>

        <pattern id="wms-hex" width="34" height="30" patternUnits="userSpaceOnUse">
          <path
            d="M8.5 1 L25.5 1 L34 15 L25.5 29 L8.5 29 L0 15 Z"
            fill="none"
            stroke="rgba(34,211,238,0.045)"
            strokeWidth="0.8"
          />
        </pattern>
      </defs>

      <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill="url(#wms-ocean)" />
      <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill="url(#wms-grid)" />
      <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill="url(#wms-hex)" opacity="0.75" />
      <path
        d="M42 34 H370 L392 54 H608 L630 34 H958 V466 H632 L606 446 H394 L368 466 H42 Z"
        fill="rgba(2,12,23,0.24)"
        stroke="url(#wms-hudFrame)"
        strokeWidth="2.2"
      />
      <path
        d="M70 62 H344 M656 62 H930 M70 438 H344 M656 438 H930"
        fill="none"
        stroke="url(#wms-hudFrame)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.7"
      />
      <g transform="translate(388, 28)">
        <rect
          width="224"
          height="38"
          rx="12"
          fill="rgba(2,12,23,0.82)"
          stroke="rgba(34,211,238,0.34)"
        />
        <text
          x="112"
          y="24"
          textAnchor="middle"
          fill="#a5f3fc"
          fontSize="12"
          fontWeight="800"
          fontFamily="monospace"
          letterSpacing="2"
        >
          TERRITORY CONTROL
        </text>
      </g>

      {CONTINENT_PATHS.map((path, index) => (
        <path
          key={path}
          d={path}
          fill="url(#wms-continent)"
          opacity={0.55}
          stroke="rgba(125,211,252,0.08)"
          strokeWidth="1.4"
        >
          <animate
            attributeName="opacity"
            values={index % 2 === 0 ? "0.28;0.52;0.28" : "0.18;0.38;0.18"}
            dur={`${14 + index * 2}s`}
            repeatCount="indefinite"
          />
        </path>
      ))}

      {REGION_LABELS.map(({ label, x, y, anchor }) => (
        <text
          key={label}
          x={x}
          y={y}
          textAnchor={anchor}
          fill="rgba(186,230,253,0.24)"
          fontSize="12"
          fontWeight="800"
          fontFamily="monospace"
          letterSpacing="2"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          {label}
        </text>
      ))}

      <rect x={-240} y={0} width={220} height={VIEWBOX_HEIGHT} fill="url(#wms-scan)">
        <animate
          attributeName="x"
          values="-240;1020;-240"
          dur="18s"
          repeatCount="indefinite"
        />
      </rect>

      {[VIEWBOX_HEIGHT * 0.22, VIEWBOX_HEIGHT * 0.5, VIEWBOX_HEIGHT * 0.78].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2={VIEWBOX_WIDTH}
          y2={y}
          stroke="rgba(56,189,248,0.07)"
          strokeWidth="0.7"
          strokeDasharray="5,9"
        />
      ))}

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
