"use client";

import { useCallback, useState } from "react";

interface MoveUnitResult {
  success: boolean;
  movementId?: string;
  message?: string;
}

export function useMoveUnit() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MoveUnitResult | null>(null);

  const moveUnit = useCallback(
    async (unitId: string, toTerritoryId: string) => {
      try {
        setLoading(true);
        setResult(null);

        const response = await fetch("/api/units/move", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            unitId,
            toTerritoryId,
          }),
        });

        const json = (await response.json()) as MoveUnitResult;
        setResult(json);

        return json.success;
      } catch (error) {
        const fallback = {
          success: false,
          message: error instanceof Error ? error.message : "Unexpected error",
        };

        setResult(fallback);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    result,
    moveUnit,
  };
}
