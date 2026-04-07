"use client";

import { useEffect, useRef, useState } from "react";
import type {
  ReplayApi,
  ReplayApiFocus,
  ReplayApiSlowMotion,
} from "@/lib/replay/replayRenderApi";

type PageStatus = "idle" | "loading" | "ready" | "recording" | "error";

interface ReplayRenderPageProps {
  secret?: string | null;
}

export default function ReplayRenderPage({
  secret = null,
}: ReplayRenderPageProps) {
  const [status, setStatus] = useState<PageStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const viewerRef = useRef<HTMLDivElement>(null);
  const replayEngineRef = useRef<unknown>(null);
  const spectatorCameraRef = useRef<unknown>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const expected = process.env.NEXT_PUBLIC_REPLAY_RENDERER_SECRET;
  const isAuthorized = !expected || secret === expected;

  useEffect(() => {
    if (!isAuthorized) {
      setError("Unauthorized");
      return;
    }

    setStatus("loading");

    // TODO: brancher ici le vrai moteur replay headless.
    void replayEngineRef;
    void spectatorCameraRef;

    setStatus("ready");
  }, [isAuthorized]);

  useEffect(() => {
    if (status !== "ready") {
      return;
    }

    const api: ReplayApi = {
      async loadReplay({ warId, territoryId }) {
        void warId;
        void territoryId;
      },
      async seek(offsetMs) {
        void offsetMs;
      },
      async focusCamera(focus: ReplayApiFocus | null) {
        void focus;
      },
      async setPlaybackRate(rate) {
        void rate;
      },
      async setSlowMotionWindow(win: ReplayApiSlowMotion | null) {
        void win;
      },
      async startRecording() {
        recordedChunksRef.current = [];

        const canvas = viewerRef.current?.querySelector("canvas");
        if (!canvas) {
          throw new Error("No canvas found in replay viewer");
        }

        const stream = (canvas as HTMLCanvasElement).captureStream(30);
        const recorder = new MediaRecorder(stream, {
          mimeType: "video/webm;codecs=vp8,opus",
        });

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        recorder.start(100);
        mediaRecorderRef.current = recorder;
        setStatus("recording");

        return "recording-started";
      },
      async stopRecording() {
        const recorder = mediaRecorderRef.current;
        if (!recorder) {
          throw new Error("No active MediaRecorder");
        }

        return new Promise<string>((resolve, reject) => {
          recorder.onstop = async () => {
            try {
              const blob = new Blob(recordedChunksRef.current, {
                type: "video/webm",
              });
              const buffer = await blob.arrayBuffer();
              const base64 = btoa(
                String.fromCharCode(...new Uint8Array(buffer)),
              );

              recordedChunksRef.current = [];
              setStatus("ready");
              resolve(base64);
            } catch (cause) {
              reject(cause);
            }
          };

          recorder.onerror = (event) => reject(event);
          recorder.stop();
        });
      },
    };

    window.__REPLAY_API__ = api;
    (
      window as Window & {
        __REPLAY_READY__?: boolean;
      }
    ).__REPLAY_READY__ = true;

    return () => {
      delete window.__REPLAY_API__;
    };
  }, [status]);

  if (!isAuthorized) {
    return (
      <div style={{ display: "none" }} aria-hidden="true">
        Unauthorized
      </div>
    );
  }

  return (
    <div
      style={{
        width: "1280px",
        height: "720px",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <div ref={viewerRef} style={{ width: "100%", height: "100%" }}>
        {/* TODO: monter ici le vrai ReplayViewer headless. */}
      </div>

      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            background: "rgba(0,0,0,0.6)",
            color: "#22d3ee",
            fontSize: 11,
            padding: "4px 8px",
            fontFamily: "monospace",
          }}
        >
          [headless] status: {status}
          {error ? ` | error: ${error}` : ""}
        </div>
      )}
    </div>
  );
}
