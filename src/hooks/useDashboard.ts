"use client";

import { useEffect, useState } from "react";
import { DashboardData } from "@/types/dashboard";

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/dashboard");
        const json: DashboardData = await res.json();

        setData(json);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { data, loading };
}
