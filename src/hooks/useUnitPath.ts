"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUnitPath(unitId: string | null) {
  const [path, setPath] = useState<string[]>([]);

  useEffect(() => {
    if (!unitId) return;

    async function load() {
      const { data } = await (supabase as any)
        .from("unit_paths")
        .select("*")
        .eq("unit_id", unitId)
        .single();

      setPath(data?.path || []);
    }

    load();
  }, [unitId]);

  return path;
}
