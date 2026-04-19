"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ActiveSeason {
  id: string;
  name: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  status: string | null;
}

export function useSeason() {
  const [season, setSeason] = useState<ActiveSeason | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeason = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("seasons")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      setSeason(data as ActiveSeason | null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch season");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeason();
  }, [fetchSeason]);

  return {
    season,
    loading,
    error,
    refetch: fetchSeason,
  };
}
