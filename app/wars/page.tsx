"use client";

import { useLiveWars } from "@/hooks/useLiveWars";

export default function MultiWarView() {
  const { wars } = useLiveWars();

  const active = wars.filter((w) => w.war_id);

  return (
    <div className="p-6 grid md:grid-cols-3 gap-4 text-white">
      {active.map((war) => (
        <div
          key={war.war_id}
          className="border border-white/10 rounded p-3 bg-black/40"
        >
          <div className="font-bold">{war.territory_name}</div>
          <div className="text-xs text-red-400">⚔ {war.total_xp} XP</div>
        </div>
      ))}
    </div>
  );
}
