"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Shield, Swords, Users } from "lucide-react";

import { RouteButton } from "@/components/RouteButton";
import { type Territory, useGlobalWarMap } from "@/hooks/useGlobalWarMap";

type Hotspot = {
  id: string;
  label: string;
  position: [number, number];
  tone: "cyan" | "rose" | "amber";
  territory: Territory | null;
};

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 500;

const CONTINENT_PATHS = [
  "M98 132 C152 88 252 88 310 132 C338 156 344 190 324 220 C304 254 256 282 214 288 C166 294 118 278 92 246 C64 212 62 162 98 132 Z",
  "M240 286 C270 282 294 298 304 330 C312 360 304 402 286 434 C270 462 246 476 222 470 C198 462 190 432 194 402 C198 364 214 326 240 286 Z",
  "M442 120 C482 92 560 94 612 126 C648 150 660 188 646 218 C630 252 594 280 552 288 C508 296 458 286 430 256 C402 226 404 160 442 120 Z",
  "M518 292 C560 286 600 304 626 336 C650 366 650 402 626 426 C602 452 560 460 524 448 C490 438 466 410 464 382 C460 340 480 300 518 292 Z",
  "M674 112 C722 84 814 90 878 124 C928 152 946 194 932 228 C916 268 866 294 814 300 C758 306 700 292 666 262 C632 232 634 142 674 112 Z",
  "M850 348 C878 338 912 346 936 366 C960 384 964 410 948 426 C932 442 902 446 876 438 C850 428 830 408 828 388 C824 370 832 354 850 348 Z",
];

const REGION_POSITIONS: Record<string, [number, number]> = {
  global: [520, 240],
  americas: [190, 210],
  north_america: [175, 165],
  south_america: [245, 330],
  europe: [500, 170],
  asia: [768, 190],
  oceania: [880, 360],
  africa: [540, 340],
  middle_east: [615, 260],
  arctic: [525, 88],
};

const TERRITORY_POSITIONS: Record<string, [number, number]> = {
  france: [472, 196],
  germany: [512, 188],
  spain: [442, 216],
  italy: [536, 228],
  poland: [566, 180],
  uk: [436, 154],
  united_kingdom: [436, 154],
  norway: [496, 120],
  sweden: [540, 124],
  ukraine: [614, 194],
  russia: [748, 152],
  usa: [170, 180],
  united_states: [170, 180],
  canada: [180, 128],
  brazil: [242, 344],
  japan: [842, 204],
  korea: [804, 194],
  australia: [866, 358],
};

const CTA_ITEMS = [
  {
    label: "Open live calls",
    href: "/live-calls",
    tone: "cyan",
  },
  {
    label: "Enter club command",
    href: "/clubs",
    tone: "rose",
  },
  {
    label: "Watch live wars",
    href: "/wars",
    tone: "amber",
  },
  {
    label: "View leaderboard",
    href: "/leaderboard",
    tone: "slate",
  },
] as const;

function normalizeKey(value: string | null | undefined) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function resolvePosition(territory: Territory, index: number): [number, number] {
  const nameKey = normalizeKey(territory.name);
  if (nameKey && TERRITORY_POSITIONS[nameKey]) {
    return TERRITORY_POSITIONS[nameKey];
  }

  const regionKey = normalizeKey(territory.region);
  if (regionKey && REGION_POSITIONS[regionKey]) {
    const [x, y] = REGION_POSITIONS[regionKey];
    const offsetX = ((index % 4) - 1.5) * 18;
    const offsetY = ((index % 3) - 1) * 14;
    return [x + offsetX, y + offsetY];
  }

  const fallbacks: [number, number][] = [
    [172, 176],
    [236, 336],
    [490, 182],
    [554, 332],
    [780, 174],
    [870, 358],
  ];

  return fallbacks[index % fallbacks.length];
}

function getTone(territory: Territory, index: number): Hotspot["tone"] {
  if (!territory.controlling_club_id) return "amber";
  return index % 3 === 0 ? "rose" : "cyan";
}

const markerTone = {
  cyan: {
    core: "#4ae9ff",
    ring: "rgba(74,233,255,0.35)",
    border: "rgba(125,211,252,0.9)",
  },
  rose: {
    core: "#ff6d6d",
    ring: "rgba(255,109,109,0.32)",
    border: "rgba(254,202,202,0.9)",
  },
  amber: {
    core: "#ffc857",
    ring: "rgba(255,200,87,0.28)",
    border: "rgba(253,224,71,0.88)",
  },
};

const ctaToneClasses = {
  cyan: "border-cyan-400/20 bg-cyan-400/10 hover:border-cyan-300/35 hover:bg-cyan-400/14",
  rose: "border-rose-400/20 bg-rose-400/10 hover:border-rose-300/35 hover:bg-rose-400/14",
  amber: "border-amber-400/20 bg-amber-400/10 hover:border-amber-300/35 hover:bg-amber-400/14",
  slate: "border-white/12 bg-white/5 hover:border-white/22 hover:bg-white/9",
};

export default function LandingWorldMapPreview() {
  const { territories, loading } = useGlobalWarMap();
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<string | null>(null);

  const hotspots = useMemo<Hotspot[]>(() => {
    return territories.slice(0, 14).map((territory, index) => ({
      id: territory.id,
      label: territory.name,
      position: resolvePosition(territory, index),
      tone: getTone(territory, index),
      territory,
    }));
  }, [territories]);

  const selectedHotspot = useMemo(
    () =>
      hotspots.find((hotspot) => hotspot.id === selectedTerritoryId) ??
      hotspots[0] ??
      null,
    [hotspots, selectedTerritoryId],
  );

  const battleLines = useMemo(() => {
    return hotspots.slice(0, Math.max(0, hotspots.length - 1)).map((hotspot, index) => {
      const next = hotspots[index + 1];
      return {
        id: `${hotspot.id}-${next.id}`,
        from: hotspot.position,
        to: next.position,
        tone: hotspot.tone === "rose" || next.tone === "rose" ? "rose" : "cyan",
      };
    });
  }, [hotspots]);

  const mapStats = [
    {
      label: "Active wars",
      value: "1,245",
      accent: "text-cyan-100",
      border: "border-cyan-400/18",
      bg: "bg-cyan-400/10",
    },
    {
      label: "Territories claimed",
      value: "8,900+",
      accent: "text-rose-100",
      border: "border-rose-400/18",
      bg: "bg-rose-400/10",
    },
    {
      label: "Players online",
      value: "450,000+",
      accent: "text-amber-100",
      border: "border-amber-400/18",
      bg: "bg-amber-400/10",
    },
  ];

  const regionLabels = [
    { label: "North America", x: 112, y: 104 },
    { label: "South America", x: 192, y: 316 },
    { label: "Europe", x: 472, y: 120 },
    { label: "Africa", x: 504, y: 300 },
    { label: "Asia", x: 742, y: 138 },
    { label: "Oceania", x: 846, y: 334 },
  ];

  if (loading) {
    return (
      <div className="flex h-[520px] items-center justify-center rounded-[1.25rem] border border-white/10 bg-slate-950/70 text-sm text-slate-300">
        Loading live world theater...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative h-[520px] overflow-hidden rounded-[1.6rem] border border-cyan-300/12 bg-[#020816] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_40px_120px_rgba(2,12,23,0.45)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[length:52px_52px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_24%,rgba(56,189,248,0.14),transparent_22%),radial-gradient(circle_at_82%_28%,rgba(168,85,247,0.12),transparent_24%),radial-gradient(circle_at_52%_78%,rgba(56,189,248,0.08),transparent_28%)]" />
          <div className="absolute inset-y-0 left-0 w-[36%] bg-[linear-gradient(90deg,rgba(2,8,22,0.82),rgba(2,8,22,0.18),transparent)]" />
          <div className="absolute inset-x-0 bottom-0 h-[24%] bg-[linear-gradient(180deg,transparent,rgba(2,8,22,0.94))]" />
        </div>

        <div className="pointer-events-none absolute left-5 top-5 z-20 hidden max-w-[200px] gap-3 xl:grid">
          {mapStats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-[1.15rem] border ${stat.border} ${stat.bg} px-4 py-3 backdrop-blur-xl`}
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                {stat.label}
              </div>
              <div className={`mt-2 text-2xl font-black ${stat.accent}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute right-5 top-5 z-20 w-[160px] rounded-[1.25rem] border border-white/10 bg-white/6 px-4 py-4 backdrop-blur-xl">
          <div className="text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            Current event feed
          </div>
          <div className="mt-3 text-center text-sm font-medium text-white">
            37 battles
          </div>
          <div className="mt-1 text-center text-sm text-slate-300">
            resolved in the last hour
          </div>
        </div>

        <svg
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          className="absolute inset-0 z-10 h-full w-full"
          role="img"
          aria-label="Live world theater map"
        >
          <defs>
            <linearGradient id="landing-map-ocean" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#041020" />
              <stop offset="50%" stopColor="#07162a" />
              <stop offset="100%" stopColor="#03111d" />
            </linearGradient>

            <linearGradient id="landing-map-continent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(19,40,68,0.88)" />
              <stop offset="100%" stopColor="rgba(7,23,44,0.82)" />
            </linearGradient>

            <filter id="landing-map-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill="url(#landing-map-ocean)" />

          {regionLabels.map((region) => (
            <text
              key={region.label}
              x={region.x}
              y={region.y}
              fontSize="11"
              fontWeight="700"
              fill="rgba(148,163,184,0.46)"
              style={{ userSelect: "none", letterSpacing: "0.18em" }}
            >
              {region.label.toUpperCase()}
            </text>
          ))}

          {[110, 220, 330, 440].map((y) => (
            <line
              key={`h-${y}`}
              x1="0"
              y1={y}
              x2={VIEWBOX_WIDTH}
              y2={y}
              stroke="rgba(56,189,248,0.04)"
              strokeWidth="0.9"
            />
          ))}

          {[120, 240, 360, 480, 600, 720, 840].map((x) => (
            <line
              key={`v-${x}`}
              x1={x}
              y1="0"
              x2={x}
              y2={VIEWBOX_HEIGHT}
              stroke="rgba(56,189,248,0.04)"
              strokeWidth="0.9"
            />
          ))}

          {CONTINENT_PATHS.map((path, index) => (
            <path
              key={path}
              d={path}
              fill="url(#landing-map-continent)"
              stroke="rgba(86,181,255,0.34)"
              strokeWidth="1.4"
              opacity={0.96}
              filter="url(#landing-map-glow)"
            >
              <animate
                attributeName="opacity"
                values={index % 2 === 0 ? "0.84;1;0.84" : "0.74;0.92;0.74"}
                dur={`${14 + index * 2}s`}
                repeatCount="indefinite"
              />
            </path>
          ))}

          <rect x="-220" y="0" width="180" height={VIEWBOX_HEIGHT} fill="rgba(34,211,238,0.05)">
            <animate
              attributeName="x"
              values="-220;1040;-220"
              dur="18s"
              repeatCount="indefinite"
            />
          </rect>

          {battleLines.map((line, index) => (
            <path
              key={line.id}
              d={`M ${line.from[0]} ${line.from[1]} Q ${(line.from[0] + line.to[0]) / 2} ${Math.min(line.from[1], line.to[1]) - 22} ${line.to[0]} ${line.to[1]}`}
              fill="none"
              stroke={
                line.tone === "rose"
                  ? "rgba(255,109,109,0.34)"
                  : "rgba(74,233,255,0.32)"
              }
              strokeWidth="2"
              strokeDasharray="7 9"
              opacity="0.9"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;-64"
                dur={`${5 + index * 0.4}s`}
                repeatCount="indefinite"
              />
            </path>
          ))}

          {hotspots.map((hotspot, index) => {
            const [x, y] = hotspot.position;
            const tone = markerTone[hotspot.tone];
            const isSelected = hotspot.id === selectedHotspot?.id;

            return (
              <g
                key={hotspot.id}
                onClick={() => setSelectedTerritoryId(hotspot.id)}
                style={{ cursor: "pointer" }}
              >
                <circle cx={x} cy={y} r={isSelected ? 26 : 18} fill={tone.ring} opacity="0.28">
                  <animate
                    attributeName="r"
                    values={isSelected ? "18;28;18" : "12;20;12"}
                    dur={`${1.7 + (index % 3) * 0.3}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.14;0.38;0.14"
                    dur={`${1.7 + (index % 3) * 0.3}s`}
                    repeatCount="indefinite"
                  />
                </circle>

                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 6 : 4.5}
                  fill={tone.core}
                  stroke={tone.border}
                  strokeWidth="1.4"
                />

                <rect
                  x={x + 10}
                  y={y - 11}
                  rx={7}
                  width={Math.max(58, hotspot.label.length * 6.8)}
                  height={20}
                  fill="rgba(3,10,22,0.88)"
                  stroke={isSelected ? tone.border : "rgba(148,163,184,0.22)"}
                />
                <text
                  x={x + 18}
                  y={y + 3.4}
                  fontSize="9"
                  fontWeight="700"
                  fill="rgba(226,232,240,0.92)"
                  style={{ userSelect: "none", pointerEvents: "none" }}
                >
                  {hotspot.label.toUpperCase().slice(0, 14)}
                </text>
              </g>
            );
          })}
        </svg>

        {selectedHotspot ? (
          <div className="pointer-events-none absolute bottom-5 left-5 z-20 w-[280px] rounded-[1.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(6,12,24,0.94),rgba(5,10,20,0.88))] px-4 py-4 backdrop-blur-xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Selected front
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              {selectedHotspot.label}
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-300">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  background: markerTone[selectedHotspot.tone].core,
                  boxShadow: `0 0 14px ${markerTone[selectedHotspot.tone].core}`,
                }}
              />
              {selectedHotspot.territory?.clubs?.name
                ? `${selectedHotspot.territory.clubs.name} is holding this sector`
                : "No club has secured this sector yet"}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs uppercase tracking-[0.16em] text-slate-400">
              <div className="rounded-2xl border border-white/8 bg-white/5 px-3 py-2">
                Pressure
                <div className="mt-1 text-base font-black text-white">
                  {selectedHotspot.tone === "rose" ? "Critical" : "Live"}
                </div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/5 px-3 py-2">
                Return value
                <div className="mt-1 text-base font-black text-white">
                  High
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
          {selectedHotspot ? (
            <>
              <span className="font-semibold text-white">
                {selectedHotspot.label}
              </span>
              {selectedHotspot.territory?.clubs?.name ? (
                <> is currently operating under {selectedHotspot.territory.clubs.name} control.</>
              ) : (
                <> is still contested and open for the next club push.</>
              )}
            </>
          ) : (
            "Select a front to inspect the active pressure point."
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-3">
          <div className="rounded-[1.25rem] border border-cyan-400/15 bg-cyan-400/10 px-4 py-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-100/80">
              <Swords className="h-3.5 w-3.5" />
              Hot zones
            </div>
            <div className="mt-2 text-xl font-black text-white">
              {Math.max(6, hotspots.length)}
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-rose-400/15 bg-rose-400/10 px-4 py-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-100/80">
              <Shield className="h-3.5 w-3.5" />
              Controlled
            </div>
            <div className="mt-2 text-xl font-black text-white">
              {territories.filter((territory) => territory.controlling_club_id).length}
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-amber-400/15 bg-amber-400/10 px-4 py-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-100/80">
              <Users className="h-3.5 w-3.5" />
              Live fronts
            </div>
            <div className="mt-2 text-xl font-black text-white">
              {territories.length}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {CTA_ITEMS.map((item) => (
          <RouteButton
            key={item.href}
            href={item.href}
            variant="outline"
            className={`h-12 justify-between rounded-2xl px-4 text-sm text-slate-100 ${ctaToneClasses[item.tone]}`}
          >
            {item.label}
            <ArrowRight className="h-4 w-4" />
          </RouteButton>
        ))}
      </div>
    </div>
  );
}
