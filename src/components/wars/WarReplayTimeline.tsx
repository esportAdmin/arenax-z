"use client";

import { useEffect, useState } from "react";
import { useWarReplay } from "@/hooks/useWarReplay";

export default function WarReplayTimeline({ warId }: { warId: string }) {
  const { events } = useWarReplay(warId);

  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;

    let i = 0;

    const interval = setInterval(() => {
      i += 1;
      setCursor(i);

      if (i >= events.length) {
        clearInterval(interval);
        setPlaying(false);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [playing, events]);

  const visible = events.slice(0, cursor);

  return (
    <div className="rounded border border-cyan-400/20 bg-black/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold text-cyan-300">Replay Timeline</h3>

        <button
          type="button"
          onClick={() => {
            setCursor(0);
            setPlaying(true);
          }}
          className="rounded bg-cyan-500 px-3 py-1 text-xs text-black"
        >
          ▶ Play
        </button>
      </div>

      <div className="mb-4 h-2 overflow-hidden rounded bg-white/10">
        <div
          className="h-full bg-cyan-400 transition-all"
          style={{
            width: `${(cursor / Math.max(events.length, 1)) * 100}%`,
          }}
        />
      </div>

      <div className="max-h-64 space-y-2 overflow-auto">
        {visible.map((e) => (
          <div
            key={e.id}
            className="flex items-center justify-between border-b border-white/10 pb-1 text-xs"
          >
            <span className="text-white/70">{e.username}</span>
            <span className="text-cyan-300">+{e.xp} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
}
