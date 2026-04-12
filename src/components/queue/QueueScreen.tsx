"use client";

/**
 * QueueScreen.tsx
 * ─────────────────────────────────────────────────────────────────────
 * Écran de matchmaking complet :
 *   - Timer d'attente en temps réel
 *   - Estimation dynamique
 *   - Modal "Match Found" avec ready check (30s)
 *   - Cancel / reconnect propre
 *   - Realtime via Supabase
 * ─────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef } from "react";
import { useRouter }                                 from "next/navigation";
import { createClient }                              from "@supabase/supabase-js";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type QueueStatus = "idle" | "searching" | "match_found" | "ready_check" | "cancelled" | "error";

interface QueueSession {
  id:              string;
  status:          string;
  estimated_wait_s: number | null;
  war_id:          string | null;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

function ReadyCheckModal({
  warId,
  onAccept,
  onDecline,
}: {
  warId: string;
  onAccept:  () => void;
  onDecline: () => void;
}) {
  const [timeLeft,  setTimeLeft]  = useState(30);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { onDecline(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onDecline]);

  async function handleAccept() {
    setAccepting(true);
    try {
      await fetch("/api/queue/ready", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ warId, accept: true }),
      });
      onAccept();
    } catch {
      setAccepting(false);
    }
  }

  const pct = (timeLeft / 30) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl border border-cyan-400/20 bg-[#050816] p-8 text-center shadow-2xl">
        {/* Timer ring */}
        <div className="relative mx-auto mb-6 h-24 w-24">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="45" fill="none"
              stroke="#22d3ee" strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - pct / 100)}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-black text-cyan-300 tabular-nums">{timeLeft}</span>
          </div>
        </div>

        <h2 className="text-xl font-black text-white">Match Found!</h2>
        <p className="mt-1 text-sm text-white/50">Accept to enter the arena</p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            disabled={accepting}
            onClick={handleAccept}
            className="w-full rounded-xl border border-emerald-400/20 bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/25 disabled:opacity-50"
          >
            {accepting ? "Accepting…" : "✓ Accept Match"}
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-2 text-sm text-white/40 transition hover:text-white/60"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

interface QueueScreenProps {
  userId:    string;
  queueType?: "ranked" | "casual";
}

export function QueueScreen({ userId: _userId, queueType = "ranked" }: QueueScreenProps) {
  const router = useRouter();
  const [queueStatus,  setQueueStatus]  = useState<QueueStatus>("idle");
  const [session,      setSession]      = useState<QueueSession | null>(null);
  const [waitedS,      setWaitedS]      = useState(0);
  const [error,        setError]        = useState<string | null>(null);
  const startedAt = useRef<number | null>(null);

  // Timer d'attente
  useEffect(() => {
    if (queueStatus !== "searching") return;
    const interval = setInterval(() => {
      if (startedAt.current) {
        setWaitedS(Math.round((Date.now() - startedAt.current) / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [queueStatus]);

  // Realtime — écouter les changements de queue_sessions
  useEffect(() => {
    if (!session?.id || queueStatus !== "searching") return;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const channel = supabase
      .channel(`queue:${session.id}`)
      .on(
        "postgres_changes",
        {
          event:  "UPDATE",
          schema: "public",
          table:  "queue_sessions",
          filter: `id=eq.${session.id}`,
        },
        (payload) => {
          const updated = payload.new as QueueSession;
          setSession((prev) => prev ? { ...prev, ...updated } : prev);

          if (updated.status === "match_found") {
            setQueueStatus("match_found");
          }
        },
      )
      .subscribe();

    return () => { void supabase.removeChannel(channel); };
  }, [session?.id, queueStatus]);

  // Rejoindre la queue
  async function joinQueue() {
    setQueueStatus("searching");
    setError(null);
    startedAt.current = Date.now();

    try {
      const res = await fetch("/api/queue/join", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ queue_type: queueType }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to join queue");
        setQueueStatus("error");
        return;
      }

      const data = await res.json();
      setSession(data.session);
    } catch {
      setError("Network error");
      setQueueStatus("error");
    }
  }

  // Quitter la queue
  async function leaveQueue() {
    if (!session?.id) { setQueueStatus("idle"); return; }

    await fetch("/api/queue/leave", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ session_id: session.id }),
    }).catch(() => {});

    setQueueStatus("cancelled");
    setSession(null);
    startedAt.current = null;
    setTimeout(() => setQueueStatus("idle"), 1500);
  }

  // Match accepté
  function handleMatchAccepted() {
    setQueueStatus("idle");
    if (session?.war_id) {
      router.push(`/match/${session.war_id}`);
    }
  }

  // ── Rendu ──────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-[#050816] text-white flex items-center justify-center px-4">
      {/* Ready check modal */}
      {queueStatus === "match_found" && session?.war_id && (
        <ReadyCheckModal
          warId={session.war_id}
          onAccept={handleMatchAccepted}
          onDecline={leaveQueue}
        />
      )}

      <div className="w-full max-w-sm text-center space-y-8">
        {/* Pulsing arena icon */}
        <div className="relative mx-auto h-32 w-32">
          {queueStatus === "searching" && (
            <>
              <div className="absolute inset-0 animate-ping rounded-full bg-cyan-500/10" />
              <div className="absolute inset-4 animate-ping rounded-full bg-cyan-500/15 animation-delay-150" />
            </>
          )}
          <div className="absolute inset-0 flex items-center justify-center rounded-full border border-white/8 bg-white/4">
            <span className="text-5xl">⚔️</span>
          </div>
        </div>

        {/* Status text */}
        <div>
          {queueStatus === "idle" && (
            <>
              <h2 className="text-2xl font-black">Find a Match</h2>
              <p className="mt-1 text-sm text-white/40">
                {queueType === "ranked" ? "Ranked match · MMR-based pairing" : "Casual match"}
              </p>
            </>
          )}
          {queueStatus === "searching" && (
            <>
              <h2 className="text-2xl font-black text-cyan-300">Searching…</h2>
              <p className="mt-1 text-4xl font-mono font-black tabular-nums text-white/80">
                {formatTime(waitedS)}
              </p>
              {session?.estimated_wait_s && (
                <p className="mt-1 text-xs text-white/30">
                  Est. wait: ~{formatTime(session.estimated_wait_s)}
                </p>
              )}
            </>
          )}
          {queueStatus === "cancelled" && (
            <h2 className="text-2xl font-black text-white/50">Queue cancelled</h2>
          )}
          {queueStatus === "error" && (
            <h2 className="text-2xl font-black text-red-400">Error</h2>
          )}
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* CTA */}
        {queueStatus === "idle" || queueStatus === "error" || queueStatus === "cancelled" ? (
          <button
            type="button"
            onClick={joinQueue}
            className="w-full rounded-xl border border-cyan-400/20 bg-cyan-500/15 px-6 py-4 text-base font-semibold text-cyan-300 transition hover:bg-cyan-500/25"
          >
            {queueStatus === "error" ? "Retry" : "Find Match →"}
          </button>
        ) : queueStatus === "searching" ? (
          <button
            type="button"
            onClick={leaveQueue}
            className="w-full rounded-xl border border-white/8 bg-white/4 px-6 py-3 text-sm font-semibold text-white/40 transition hover:text-white/60"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  );
}
