"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useWorldBoss() {
  const [boss, setBoss] = useState<any>(null);

  async function loadBoss() {
    const { data, error } = await (supabase as any)
      .from("world_boss")
      .select("*")
      .eq("status", "active")
      .maybeSingle();

    if (error) {
      console.error("World boss error:", error);
      return;
    }

    setBoss(data);
  }

  useEffect(() => {
    loadBoss();

    const channel = supabase
      .channel("world-boss")

      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "world_boss",
        },
        () => {
          loadBoss();
        },
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return boss;
}
