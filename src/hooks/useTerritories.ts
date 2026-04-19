"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useTerritories() {
  const [territories, setTerritories] = useState<any[]>([]);

  async function load() {
    const { data } = await supabase.from("club_territories").select("*");

    setTerritories(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  return territories;
}
