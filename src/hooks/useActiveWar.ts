"use client";

import { useMemo } from "react";
import { useActiveWars } from "./useActiveWars";

export function useActiveWar(territoryId: string) {
  const wars = useActiveWars();

  return useMemo(
    () => wars.find((war) => war.territory?.id === territoryId) ?? null,
    [territoryId, wars],
  );
}
