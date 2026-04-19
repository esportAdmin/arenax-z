"use client";

import { useMemo, useState } from "react";
import { useWarReplay } from "@/hooks/useWarReplay";

interface Props {
  warId: string;
}

export default function WarReplayPanel({ warId }: Props) {
  const { events, loading } = useWarReplay(warId);
  const [playing, setPlaying] = useState(false);
  const [cursor, setCursor] = useState(0);

  const visibleEvents = useMemo(() => {
    if (!playing) return events;
    return events.slice(0, cursor);
  }, [events, playing, cursor]);

  function startReplay() {
    if (!events.length) return;

    setPlaying(true);
    setCursor(0);

    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      setCursor(i);

      if (i >= events.length) {
        window.clearInterval(timer);
        setPlaying(false);
      }
    }, 500);
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/70">
        Loading replay...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">War Replay</h3>

        <button
          type="button"
          onClick={startReplay}
          disabled={playing || events.length === 0}
          className="rounded bg-cyan-500 px-3 py-1 text-sm font-medium text-black disabled:opacity-50"
        >
          {playing ? "Playing..." : "Play Replay"}
        </button>
      </div>

      <div className="space-y-3">
        {visibleEvents.length === 0 && (
          <div className="text-sm text-white/60">No replay events</div>
        )}

        {visibleEvents.map((event) => (
          <div
            key={event.id}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <img
                src={event.avatar_url || "/default-avatar.png"}
                alt={event.username}
                className="h-8 w-8 rounded-full object-cover"
              />

              <div>
                <div className="font-medium text-white">{event.username}</div>
                <div className="text-xs text-white/50">
                  {new Date(event.created_at).toLocaleTimeString()}
                </div>
              </div>
            </div>

            <div className="font-bold text-cyan-300">+{event.xp} XP</div>
          </div>
        ))}
      </div>
    </div>
  );
}
