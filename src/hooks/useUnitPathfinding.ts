"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  findWeightedPath,
  type PathContext,
  type FormationMode,
} from "@/lib/rts/pathfinding";

interface TerritoryRow {
  id: string;
  terrain_type: string | null;
  move_cost: number | null;
  controlling_club_id: string | null;
  lat: number | null;
  lng: number | null;
}

interface AdjacencyRow {
  territory_id?: string;
  adjacent_territory_id?: string;
  from_territory_id?: string;
  to_territory_id?: string;
}

export function useUnitPathfinding(clubId: string | null) {
  const [context, setContext] = useState<PathContext | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      const [{ data: territories }, { data: edges }] = await Promise.all([
        (supabase as any)
          .from("club_territories")
          .select("id, terrain_type, move_cost, controlling_club_id, lat, lng"),
        (supabase as any).from("territory_adjacency").select("*"),
      ]);

      if (!mounted) return;

      const nodes: PathContext["nodes"] = {};
      const adjacency: Record<string, string[]> = {};

      ((territories ?? []) as TerritoryRow[]).forEach((row) => {
        nodes[row.id] = {
          id: row.id,
          moveCost: Number(row.move_cost ?? 1),
          terrainType: row.terrain_type ?? "plains",
          ownerClubId: row.controlling_club_id ?? null,
          lat: row.lat ?? null,
          lng: row.lng ?? null,
        };
      });

      ((edges ?? []) as AdjacencyRow[]).forEach((row) => {
        const from = row.territory_id ?? row.from_territory_id;
        const to = row.adjacent_territory_id ?? row.to_territory_id;

        if (!from || !to) return;
        if (!adjacency[from]) adjacency[from] = [];
        adjacency[from].push(to);
      });

      setContext({
        adjacency,
        nodes,
        myClubId: clubId ?? "",
        avoidEnemyWeight: 8,
        blockedTerrain: ["water"],
      });

      setLoading(false);
    }

    load();

    return () => {
      mounted = false;
    };
  }, [clubId]);

  const computePath = useCallback(
    (startId: string, goalId: string) => {
      if (!context) return [];
      return findWeightedPath(startId, goalId, context);
    },
    [context],
  );

  const getPathCoords = useCallback(
    (path: string[]) => {
      if (!context) return [];

      return path
        .map((territoryId) => context.nodes[territoryId])
        .filter(Boolean)
        .filter((node) => node.lat != null && node.lng != null)
        .map((node) => ({
          territoryId: node.id,
          lat: node.lat as number,
          lng: node.lng as number,
        }));
    },
    [context],
  );

  const getFormationPreview = useCallback(
    (path: string[], formation: FormationMode, unitCount: number) => {
      const coords = getPathCoords(path);
      return {
        formation,
        unitCount,
        coords,
      };
    },
    [getPathCoords],
  );

  return {
    loading,
    context,
    computePath,
    getPathCoords,
    getFormationPreview,
  };
}
