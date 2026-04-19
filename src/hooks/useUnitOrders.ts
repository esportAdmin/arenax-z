"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UnitOrder {
  id: string;
  unit_id: string;
  target_territory_id: string;
  position: number;
  status: string;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

export function useUnitOrders(unitIds: string[]) {
  const [orders, setOrders] = useState<UnitOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (unitIds.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("unit_orders")
        .select("*")
        .in("unit_id", unitIds)
        .order("position", { ascending: true });

      if (error) {
        console.error("[useUnitOrders]", error);
        setLoading(false);
        return;
      }

      setOrders((data ?? []) as UnitOrder[]);
      setLoading(false);
    }

    load();

    const channel = supabase
      .channel("unit-orders-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "unit_orders" },
        load,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [unitIds]);

  return {
    orders,
    loading,
  };
}
