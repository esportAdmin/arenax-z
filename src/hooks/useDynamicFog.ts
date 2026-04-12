"use client";

import { useEffect, useMemo, useState } from "react";
import { useArmyUnitsLive } from "@/hooks/useArmyUnitsLive";
import { supabase } from "@/integrations/supabase/client";

interface TerritoryAdjacency {
  territory_id?: string;
  adjacent_territory_id?: string;
  from_territory_id?: string;
  to_territory_id?: string;
}

export function useDynamicFog(clubId: string | null) {
  const { units } = useArmyUnitsLive();
  const [edges, setEdges] = useState<TerritoryAdjacency[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data } = await (supabase as any)
        .from("territory_adjacency")
        .select("*");

      if (!mounted) return;
      setEdges((data ?? []) as TerritoryAdjacency[]);
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return useMemo(() => {
    if (!clubId) return [];

    const adjacency: Record<string, string[]> = {};

    edges.forEach((edge) => {
      const from = edge.territory_id ?? edge.from_territory_id;
      const to = edge.adjacent_territory_id ?? edge.to_territory_id;

      if (!from || !to) return;
      if (!adjacency[from]) adjacency[from] = [];
      adjacency[from].push(to);
    });

    const visible = new Set<string>();

    function explore(start: string, depth: number) {
      if (depth < 0) return;
      visible.add(start);

      for (const next of adjacency[start] ?? []) {
        if (!visible.has(next)) {
          explore(next, depth - 1);
        }
      }
    }

    units
      .filter((u) => u.club_id === clubId && u.territory_id)
      .forEach((unit) => {
        explore(unit.territory_id as string, unit.vision_radius ?? 1);
      });

    return Array.from(visible);
  }, [edges, units, clubId]);
}
