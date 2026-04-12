"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface WarMapItem {
  territory_id: string;
  name: string;
  lat: number | null;
  lng: number | null;
  club_name: string | null;
  war_id: string | null;
}

export function useWarMap() {
  const [data, setData] = useState<WarMapItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("war_map_data").select("*");

      if (!error && data) {
        setData(data);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  return { data, loading };
}
