"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

/**
 * Donnée propre utilisée côté UI
 */
export type Contributor = {
  user_id: string;
  xp: number;
  username: string;
};

export function useWarContributors(warId: string) {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!warId) {
      setContributors([]);
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("war_contributions")
        .select(
          `
          user_id,
          xp,
          user:profiles(username)
        `,
        )
        .eq("war_id", warId)
        .order("xp", { ascending: false })
        .limit(10);

      if (error) {
        console.error("[useWarContributors]", { code: error.code });
        setError("Failed to load contributors");
        setContributors([]);
      } else {
        // 🔥 transformation SAFE (clé du fix)
        const cleaned: Contributor[] = (data ?? []).map((c: any) => ({
          user_id: c.user_id,
          xp: c.xp ?? 0,
          username: c.user?.[0]?.username ?? "Player",
        }));

        setContributors(cleaned);
      }

      setLoading(false);
    }

    load();
  }, [warId]);

  return {
    contributors,
    loading,
    error,
  };
}
