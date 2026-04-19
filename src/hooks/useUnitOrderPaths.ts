"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TerritoryRow {
  id: string;
  lat: number | null;
  lng: number | null;
}

interface UnitOrderRow {
  id: string;
  unit_id: string;
  path: string[] | null;
  status: string;
  target_territory_id: string;
}

export interface UnitOrderPathDisplay {
  orderId: string;
  unitId: string;
  status: string;
  targetTerritoryId: string;
  coords: Array<{
    territoryId: string;
    lat: number;
    lng: number;
  }>;
}

function dedupePath(path: string[]): string[] {
  const result: string[] = [];
  let prev: string | null = null;

  for (const id of path) {
    if (!id || id === prev) continue;
    result.push(id);
    prev = id;
  }

  return result;
}

export function useUnitOrderPaths(unitIds: string[]) {
  const [orders, setOrders] = useState<UnitOrderPathDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!unitIds || unitIds.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const [
        { data: orderRows, error: orderError },
        { data: territoryRows, error: territoryError },
      ] = await Promise.all([
        supabase
          .from("unit_orders")
          .select("id, unit_id, path, status, target_territory_id")
          .in("unit_id", unitIds)
          .in("status", ["queued", "started"])
          .order("created_at", { ascending: true }),
        supabase.from("club_territories").select("id, lat, lng"),
      ]);

      if (!mounted) return;

      if (orderError) {
        console.error("[useUnitOrderPaths][orders]", orderError);
      }

      if (territoryError) {
        console.error("[useUnitOrderPaths][territories]", territoryError);
      }

      const territoryMap = new Map(
        ((territoryRows ?? []) as TerritoryRow[]).map((row) => [row.id, row]),
      );

      const mapped: UnitOrderPathDisplay[] = (
        (orderRows ?? []) as UnitOrderRow[]
      )
        .map((order) => {
          const rawPath = Array.isArray(order.path) ? order.path : [];

          // nettoyage path (doublons + null)
          const cleanPath = dedupePath(rawPath).filter(Boolean);

          const coords = cleanPath
            .map((territoryId) => {
              const row = territoryMap.get(territoryId);
              if (!row || row.lat == null || row.lng == null) return null;

              return {
                territoryId,
                lat: row.lat,
                lng: row.lng,
              };
            })
            .filter(Boolean) as Array<{
            territoryId: string;
            lat: number;
            lng: number;
          }>;

          // 🔴 fallback critique : path vide mais target existe
          if (coords.length === 0 && order.target_territory_id) {
            const target = territoryMap.get(order.target_territory_id);

            if (target && target.lat != null && target.lng != null) {
              coords.push({
                territoryId: order.target_territory_id,
                lat: target.lat,
                lng: target.lng,
              });
            }
          }

          return {
            orderId: order.id,
            unitId: order.unit_id,
            status: order.status,
            targetTerritoryId: order.target_territory_id,
            coords,
          };
        })
        // 🔥 filtre final → évite paths inutiles dans WorldMap
        .filter((order) => order.coords.length > 0);

      setOrders(mapped);
      setLoading(false);
    }

    load();

    const channel = supabase
      .channel("unit-order-paths-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "unit_orders" },
        load,
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [unitIds]);

  const orderMap = useMemo(() => {
    return new Map(orders.map((order) => [order.unitId, order]));
  }, [orders]);

  return {
    orders,
    orderMap,
    loading,
  };
}
