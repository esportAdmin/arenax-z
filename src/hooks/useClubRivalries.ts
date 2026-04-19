"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useClubRivalries(clubId?: string) {
  const [rivalries, setRivalries] = useState<any[]>([]);

  const load = useCallback(async () => {
    if (!clubId) {
      setRivalries([]);
      return;
    }

    const { data } = await (supabase as any)
      .from("club_rivalries")
      .select(
        `
        *,
        club_a:clubs!club_rivalries_club_a_fkey(name,logo_url),
        club_b:clubs!club_rivalries_club_b_fkey(name,logo_url)
      `,
      )
      .or(`club_a.eq.${clubId},club_b.eq.${clubId}`)
      .order("rivalry_level", { ascending: false });

    setRivalries(data || []);
  }, [clubId]);

  useEffect(() => {
    void load();
  }, [clubId, load]);

  return rivalries;
}
