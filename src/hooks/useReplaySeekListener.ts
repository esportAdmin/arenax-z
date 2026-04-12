"use client";

import { useEffect } from "react";
import {
  REPLAY_SEEK_EVENT,
  type ReplaySeekDetail,
  type ReplayFocus,
} from "@/lib/replay/replaySync";

type SeekCallback = (offsetMs: number, focus: ReplayFocus | null) => void;

export function useReplaySeekListener(onSeek: SeekCallback): void {
  useEffect(() => {
    function handleEvent(event: Event): void {
      const custom = event as CustomEvent<ReplaySeekDetail>;
      const { offsetMs, focus } = custom.detail ?? {};

      if (typeof offsetMs === "number" && Number.isFinite(offsetMs) && offsetMs >= 0) {
        onSeek(Math.round(offsetMs), focus ?? null);
      }
    }

    window.addEventListener(REPLAY_SEEK_EVENT, handleEvent as EventListener);

    if (typeof window.__arenaReplaySeekMs === "number") {
      onSeek(Math.round(window.__arenaReplaySeekMs), null);
    }

    return () => {
      window.removeEventListener(REPLAY_SEEK_EVENT, handleEvent as EventListener);
    };
  }, [onSeek]);
}
