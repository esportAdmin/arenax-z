"use client";

import { useMemo } from "react";

interface FogOptions {
  enabled: boolean;
  visibleTerritoryNames: string[];
}

export function useFogOfWar({ enabled, visibleTerritoryNames }: FogOptions) {
  const visibleSet = useMemo(() => {
    return new Set(
      visibleTerritoryNames.map((name) => name.toLowerCase().trim()),
    );
  }, [visibleTerritoryNames]);

  const isVisible = useMemo(() => {
    return (territoryName: string) => {
      if (!enabled) return true;
      return visibleSet.has(territoryName.toLowerCase().trim());
    };
  }, [enabled, visibleSet]);

  return {
    isVisible,
  };
}
