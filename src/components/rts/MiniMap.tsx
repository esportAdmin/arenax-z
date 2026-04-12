"use client";

import { useLiveWars } from "@/hooks/useLiveWars";

export default function MiniMap() {
  const { wars } = useLiveWars();

  return (
    <div className="absolute bottom-4 left-4 z-20 h-28 w-48 rounded border border-cyan-400/20 bg-black/70 p-2">
      <div className="mb-1 text-[10px] text-cyan-300">Mini Map</div>

      <div className="grid grid-cols-8 gap-[2px]">
        {wars.slice(0, 64).map((w) => (
          <div
            key={w.territory_id}
            className="h-2 w-2"
            style={{
              background: w.war_id ? "#ff0055" : w.club_color || "#00d9ff",
            }}
          />
        ))}
      </div>
    </div>
  );
}
