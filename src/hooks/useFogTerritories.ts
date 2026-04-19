"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useFogTerritories() {
  const [visible, setVisible] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        // 🔥 CAST SAFE
        .from("visible_territories_live" as any)
        .select("id");

      if (!error && data) {
        const ids = (data as unknown as { id: string }[]).map((d) => d.id);

        setVisible(ids);
      }
    }

    load();
  }, []);

  return visible;
}
