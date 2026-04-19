import type { Territory } from "@/hooks/useGlobalWarMap";

export type War = {
  id: string;
  territory?: { id: string; name?: string } | null;
  challenger_xp: number;
  defender_xp: number;
  challenger?: { id: string; name: string } | null;
  defender?: { id: string; name: string } | null;
};

export type TerritoryCoordMap = Map<
  string,
  { cx: number; cy: number; isAutoPlaced: boolean }
>;

export const VIEWBOX_WIDTH = 1000;
export const VIEWBOX_HEIGHT = 500;
export const PADDING = 60;

export const CONTINENT_PATHS = [
  "M98 132 C152 88 252 88 310 132 C338 156 344 190 324 220 C304 254 256 282 214 288 C166 294 118 278 92 246 C64 212 62 162 98 132 Z",
  "M240 286 C270 282 294 298 304 330 C312 360 304 402 286 434 C270 462 246 476 222 470 C198 462 190 432 194 402 C198 364 214 326 240 286 Z",
  "M442 120 C482 92 560 94 612 126 C648 150 660 188 646 218 C630 252 594 280 552 288 C508 296 458 286 430 256 C402 226 404 160 442 120 Z",
  "M518 292 C560 286 600 304 626 336 C650 366 650 402 626 426 C602 452 560 460 524 448 C490 438 466 410 464 382 C460 340 480 300 518 292 Z",
  "M674 112 C722 84 814 90 878 124 C928 152 946 194 932 228 C916 268 866 294 814 300 C758 306 700 292 666 262 C632 232 634 142 674 112 Z",
  "M850 348 C878 338 912 346 936 366 C960 384 964 410 948 426 C932 442 902 446 876 438 C850 428 830 408 828 388 C824 370 832 354 850 348 Z",
];

export const REGION_LABELS = [
  { label: "NORTH AMERICA", x: 178, y: 120, anchor: "middle" },
  { label: "SOUTH AMERICA", x: 246, y: 410, anchor: "middle" },
  { label: "EUROPE", x: 510, y: 104, anchor: "middle" },
  { label: "AFRICA", x: 542, y: 404, anchor: "middle" },
  { label: "ASIA COMMAND", x: 786, y: 112, anchor: "middle" },
  { label: "OCEANIA", x: 884, y: 334, anchor: "middle" },
] as const;

/**
 * Keeps generated territory coordinates inside the SVG command board.
 *
 * Example:
 * ```ts
 * clamp(1200, 0, 1000) // 1000
 * ```
 */
export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Returns rivalry intensity from the XP balance of an active war.
 *
 * Example:
 * ```ts
 * getIntensity({ id: "w", challenger_xp: 50, defender_xp: 50 })
 * ```
 */
export function getIntensity(war: Pick<War, "challenger_xp" | "defender_xp"> | undefined) {
  if (!war) return 0;
  const total = war.challenger_xp + war.defender_xp;
  if (total === 0) return 0;
  return 1 - Math.abs(war.challenger_xp - war.defender_xp) / total;
}

/**
 * Chooses a tactical territory fill based on control and active pressure.
 *
 * Example:
 * ```ts
 * getTerritoryFill({ controlling_club_id: null } as Territory, undefined)
 * ```
 */
export function getTerritoryFill(territory: Territory, war: War | undefined) {
  if (war) return "#22090d";
  if (territory.controlling_club_id) return "#0d223b";
  return "#091321";
}

/**
 * Chooses a tactical territory stroke based on control and active pressure.
 *
 * Example:
 * ```ts
 * getTerritoryStroke({ controlling_club_id: "club" } as Territory, undefined)
 * ```
 */
export function getTerritoryStroke(territory: Territory, war: War | undefined) {
  if (war) return "#ff5d5d";
  if (territory.controlling_club_id) return "#63b3ff";
  return "#2d496d";
}

/**
 * Generates stable fallback positions for territories without map coordinates.
 *
 * Example:
 * ```ts
 * buildAutoLayoutCoords([{ id: "fr", name: "France" } as Territory])
 * ```
 */
export function buildAutoLayoutCoords(territories: Territory[]): TerritoryCoordMap {
  const anchors = [
    { x: 170, y: 170 },
    { x: 258, y: 318 },
    { x: 492, y: 176 },
    { x: 536, y: 326 },
    { x: 790, y: 170 },
    { x: 876, y: 356 },
  ];

  const result: TerritoryCoordMap = new Map();
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

/**
 * Normalizes database coordinates to the SVG command-board coordinate system.
 *
 * Example:
 * ```ts
 * normalizeCoords([{ id: "fr", name: "France", map_x: 10, map_y: 20 } as Territory])
 * ```
 */
export function normalizeCoords(territories: Territory[]): TerritoryCoordMap {
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
  const result: TerritoryCoordMap = new Map();

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
