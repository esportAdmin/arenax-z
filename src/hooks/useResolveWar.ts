"use client";

import { useCallback, useState } from "react";

interface ResolveWarResult {
  success: boolean;
  winnerClubId?: string;
  message?: string;
}

export function useResolveWar() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResolveWarResult | null>(null);

  const resolveWar = useCallback(async (warId: string) => {
    try {
      setLoading(true);
      setResult(null);

      const response = await fetch("/api/wars/resolve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ warId }),
      });

      const json = (await response.json()) as ResolveWarResult;

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
  }, []);

  return {
    loading,
    result,
    resolveWar,
  };
}
