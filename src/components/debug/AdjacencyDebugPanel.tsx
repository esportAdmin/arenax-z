"use client";

import { Network } from "lucide-react";
import { useAdjacencyDebug } from "@/hooks/useAdjacencyDebug";

export default function AdjacencyDebugPanel() {
  const { data, loading } = useAdjacencyDebug();

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/70">
        Loading adjacency graph...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <div className="mb-4 flex items-center gap-2 text-white">
        <Network className="h-5 w-5 text-cyan-300" />
        <h3 className="text-xl font-bold">Adjacency Debug</h3>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-auto">
        {data.map((item, index) => (
          <div
            key={`${item.territory_id}-${item.adjacent_territory_id}-${index}`}
            className="rounded border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80"
          >
            {item.territory_name} → {item.adjacent_territory_name}
          </div>
        ))}
      </div>
    </div>
  );
}
