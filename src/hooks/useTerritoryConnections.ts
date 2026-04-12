"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export type TerritoryConnection = {
  id: string;
  territory_a: string;
  territory_b: string;
};

export function useTerritoryConnections() {
  const [connections, setConnections] = useState<TerritoryConnection[]>([]);

  async function load() {
    const { data, error } = await supabase
      .from("territory_connections")
      .select("*");

    if (error) {
      console.error("connections error", error);
      return;
    }

    setConnections((data as TerritoryConnection[]) || []);
  }

  useEffect(() => {
    load();
  }, []);

  return connections;
}
