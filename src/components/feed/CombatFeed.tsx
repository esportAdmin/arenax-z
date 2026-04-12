"use client";

import { useWarNotifications } from "@/hooks/useWarNotifications";

export default function CombatFeed() {
  const events = useWarNotifications();

  return (
    <div className="h-64 overflow-auto bg-black/50 border border-cyan-400/20 rounded p-3">
      <div className="text-cyan-300 mb-2 text-sm font-bold">
        Live Combat Feed
      </div>

      {events.map((e) => (
        <div key={e.id} className="text-xs text-white/80 mb-1">
          {e.message}
        </div>
      ))}
    </div>
  );
}
