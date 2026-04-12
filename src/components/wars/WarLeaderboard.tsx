"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Entry {
  user_id: string;
  username: string;
  total_xp: number;
}

export default function WarLeaderboard({ warId }: { warId: string }) {
  const [data, setData] = useState<Entry[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await (supabase as any)
        .from("war_mvp_top")
        .select("*")
        .eq("war_id", warId)
        .order("total_xp", { ascending: false })
        .limit(5);

      setData(data || []);
    }

    load();
  }, [warId]);

  return (
    <div className="text-xs space-y-1">
      {data.map((p, i) => (
        <div key={p.user_id} className="flex justify-between">
          <span>
            {i === 0 && "🥇 "}
            {i === 1 && "🥈 "}
            {i === 2 && "🥉 "}
            {p.username}
          </span>
          <span className="text-cyan-300">{p.total_xp}</span>
        </div>
      ))}
    </div>
  );
}
