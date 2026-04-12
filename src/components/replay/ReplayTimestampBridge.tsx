"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { dispatchReplaySeek, parseReplaySeekMs } from "@/lib/replay/replaySync";

const SEEK_DELAYS_MS = [0, 120, 400, 900] as const;

export function ReplayTimestampBridge(): null {
  const searchParams = useSearchParams();

  useEffect(() => {
    const offsetMs = parseReplaySeekMs(searchParams.get("tms"));
    if (offsetMs == null) return;

    const timers = SEEK_DELAYS_MS.map((delay) =>
      window.setTimeout(() => {
        dispatchReplaySeek(offsetMs, "url", null);
      }, delay),
    );

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, [searchParams]);

  return null;
}
