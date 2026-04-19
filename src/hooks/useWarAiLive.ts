"use client";

import { useCallback, useState } from "react";

export function useWarAiLive() {
  const [loading, setLoading] = useState(false);
  const [processed, setProcessed] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAiTurn = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/war-ai/run", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to run war AI");
      }

      setProcessed(Number(result?.processed ?? 0));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    processed,
    error,
    runAiTurn,
  };
}
