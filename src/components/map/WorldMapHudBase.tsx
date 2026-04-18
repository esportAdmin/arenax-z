import {
  REGION_LABELS,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
} from "@/components/map/worldMapLayout";

const TACTICAL_REGIONS = [
  {
    label: "North Realm",
    path: "M92 196 L202 110 L370 128 L452 218 L372 326 L158 304 Z",
    fill: "url(#wms-cyanRegion)",
    stroke: "#22d3ee",
    labelX: 238,
    labelY: 214,
  },
  {
    label: "Central Zone",
    path: "M340 240 L470 162 L644 188 L742 280 L666 398 L456 404 L322 330 Z",
    fill: "url(#wms-orangeRegion)",
    stroke: "#fb923c",
    labelX: 526,
    labelY: 304,
  },
  {
    label: "East Reach",
    path: "M636 352 L754 278 L896 318 L940 426 L808 486 L668 444 Z",
    fill: "url(#wms-violetRegion)",
    stroke: "#a855f7",
    labelX: 786,
    labelY: 386,
  },
  {
    label: "West Haven",
    path: "M168 350 L286 310 L394 386 L286 458 L144 430 Z",
    fill: "rgba(34,211,238,0.18)",
    stroke: "#67e8f9",
    labelX: 262,
    labelY: 402,
  },
] as const;

/**
 * Renders reusable SVG definitions for the tactical world map.
 *
 * Example:
 * ```tsx
 * <WorldMapDefs />
 * ```
 */
export function WorldMapDefs() {
  return (
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
      <linearGradient id="wms-cyanRegion" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0891b2" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.28" />
      </linearGradient>
      <linearGradient id="wms-orangeRegion" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.36" />
        <stop offset="100%" stopColor="#f97316" stopOpacity="0.82" />
      </linearGradient>
      <linearGradient id="wms-violetRegion" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.38" />
        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.72" />
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
      <filter id="wms-regionGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="7" result="blur" />
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
  );
}

/**
 * Renders the atmospheric HUD background behind territories.
 *
 * Example:
 * ```tsx
 * <WorldMapHudBase />
 * ```
 */
export function WorldMapHudBase() {
  return (
    <>
      <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill="url(#wms-ocean)" />
      <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill="url(#wms-grid)" />
      <rect
        width={VIEWBOX_WIDTH}
        height={VIEWBOX_HEIGHT}
        fill="url(#wms-hex)"
        opacity="0.75"
      />
      <path
        d="M42 34 H370 L392 54 H608 L630 34 H958 V466 H632 L606 446 H394 L368 466 H42 Z"
        fill="rgba(2,12,23,0.32)"
        stroke="url(#wms-hudFrame)"
        strokeWidth="3.2"
      />
      <path
        d="M70 62 H344 M656 62 H930 M70 438 H344 M656 438 H930"
        fill="none"
        stroke="url(#wms-hudFrame)"
        strokeLinecap="round"
        strokeWidth="4"
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
      <g opacity="0.68">
        <path d="M88 438 H900" stroke="rgba(103,232,249,0.16)" strokeWidth="2" />
        <path d="M126 84 H886" stroke="rgba(251,146,60,0.14)" strokeWidth="2" />
        <path d="M230 94 C386 152 548 148 744 106" stroke="rgba(34,211,238,0.18)" strokeDasharray="10 12" fill="none" strokeWidth="2" />
        <path d="M286 400 C430 318 602 318 820 392" stroke="rgba(168,85,247,0.22)" strokeDasharray="12 10" fill="none" strokeWidth="2" />
      </g>
      <g>
        {TACTICAL_REGIONS.map((region, index) => (
          <g key={region.label} filter="url(#wms-regionGlow)">
            <path
              d={region.path}
              fill={region.fill}
              stroke={region.stroke}
              strokeWidth="4.5"
              opacity="0.88"
            >
              <animate
                attributeName="opacity"
                values={index === 1 ? "0.74;1;0.74" : "0.62;0.84;0.62"}
                dur={`${8 + index * 2}s`}
                repeatCount="indefinite"
              />
            </path>
            <text
              x={region.labelX}
              y={region.labelY}
              textAnchor="middle"
              fill="#e0faff"
              fontSize="28"
              fontWeight="900"
              fontFamily="monospace"
              letterSpacing="2"
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {region.label.toUpperCase()}
            </text>
          </g>
        ))}
      </g>
      <g filter="url(#wms-regionGlow)">
        <circle cx="568" cy="292" r="44" fill="#fb923c" opacity="0.22" />
        <circle cx="568" cy="292" r="12" fill="#fed7aa" />
        <text x="568" y="250" textAnchor="middle" fill="#fed7aa" fontSize="13" fontFamily="monospace" fontWeight="900" letterSpacing="1">
          PRESSURE CORE
        </text>
      </g>
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
    </>
  );
}
