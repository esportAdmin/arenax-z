export type FormationMode = "line" | "column";

export interface TerritoryNode {
  id: string;
  moveCost: number;
  terrainType: string;
  ownerClubId: string | null;
  lat: number | null;
  lng: number | null;
}

export interface PathContext {
  adjacency: Record<string, string[]>;
  nodes: Record<string, TerritoryNode>;
  myClubId: string;
  avoidEnemyWeight?: number;
  blockedTerrain?: string[];
}

function heuristic(
  nodes: Record<string, TerritoryNode>,
  fromId: string,
  toId: string,
): number {
  const a = nodes[fromId];
  const b = nodes[toId];

  if (
    !a ||
    !b ||
    a.lat == null ||
    a.lng == null ||
    b.lat == null ||
    b.lng == null
  ) {
    return 1;
  }

  const dx = a.lng - b.lng;
  const dy = a.lat - b.lat;

  return Math.sqrt(dx * dx + dy * dy);
}

function getTerrainPenalty(
  node: TerritoryNode,
  blockedTerrain: string[],
): number {
  if (blockedTerrain.includes(node.terrainType)) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.max(1, node.moveCost || 1);
}

function getEnemyPenalty(
  node: TerritoryNode,
  myClubId: string,
  avoidEnemyWeight: number,
): number {
  if (!node.ownerClubId) return 0;
  if (node.ownerClubId === myClubId) return 0;
  return avoidEnemyWeight;
}

function reconstructPath(
  cameFrom: Record<string, string | null>,
  current: string,
): string[] {
  const path = [current];
  let cursor: string | null = current;

  while (cursor && cameFrom[cursor]) {
    cursor = cameFrom[cursor];
    if (cursor) {
      path.unshift(cursor);
    }
  }

  return path;
}

export function findWeightedPath(
  startId: string,
  goalId: string,
  context: PathContext,
): string[] {
  const {
    adjacency,
    nodes,
    myClubId,
    avoidEnemyWeight = 8,
    blockedTerrain = ["water"],
  } = context;

  if (!nodes[startId] || !nodes[goalId]) return [];
  if (startId === goalId) return [startId];

  const openSet = new Set<string>([startId]);
  const cameFrom: Record<string, string | null> = {};
  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};

  Object.keys(nodes).forEach((id) => {
    gScore[id] = Number.POSITIVE_INFINITY;
    fScore[id] = Number.POSITIVE_INFINITY;
    cameFrom[id] = null;
  });

  gScore[startId] = 0;
  fScore[startId] = heuristic(nodes, startId, goalId);

  while (openSet.size > 0) {
    let current: string | null = null;

    for (const candidate of openSet) {
      if (current === null || fScore[candidate] < fScore[current]) {
        current = candidate;
      }
    }

    if (!current) break;

    if (current === goalId) {
      return reconstructPath(cameFrom, current);
    }

    openSet.delete(current);

    for (const neighborId of adjacency[current] ?? []) {
      const neighbor = nodes[neighborId];
      if (!neighbor) continue;

      const terrainPenalty = getTerrainPenalty(neighbor, blockedTerrain);
      if (!Number.isFinite(terrainPenalty)) continue;

      const enemyPenalty = getEnemyPenalty(
        neighbor,
        myClubId,
        avoidEnemyWeight,
      );

      const tentative = gScore[current] + terrainPenalty + enemyPenalty;

      if (tentative < gScore[neighborId]) {
        cameFrom[neighborId] = current;
        gScore[neighborId] = tentative;
        fScore[neighborId] = tentative + heuristic(nodes, neighborId, goalId);
        openSet.add(neighborId);
      }
    }
  }

  return [];
}

export function buildFormationOffsets(
  formation: FormationMode,
  unitCount: number,
  spacing = 0.35,
): Array<{ x: number; y: number }> {
  if (unitCount <= 0) return [];

  if (formation === "column") {
    return Array.from({ length: unitCount }, (_, i) => ({
      x: 0,
      y: i * spacing,
    }));
  }

  const center = (unitCount - 1) / 2;

  return Array.from({ length: unitCount }, (_, i) => ({
    x: (i - center) * spacing,
    y: 0,
  }));
}

export function buildFormationPriority(
  formation: FormationMode,
  index: number,
  total: number,
): number {
  if (total <= 1) return 0;

  if (formation === "column") {
    // tête de colonne = priorité haute
    return total - index;
  }

  // ligne : centre prioritaire
  const center = (total - 1) / 2;
  return -Math.abs(index - center);
}
