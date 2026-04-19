"use client";

/**
 * ExportReelButton.tsx
 * ─────────────────────────────────────────────────────────────────────
 * Bouton client pour déclencher la génération d'un export highlight reel.
 * Remplace le <form action="..."> du doc (incompatible avec une route JSON).
 *
 * Monté dans MatchBreakdownPanel — isolated pour ne pas rendre le panel
 * entier inutilement client-side.
 * ─────────────────────────────────────────────────────────────────────
 */

import { useState } from "react";

interface Props {
  warId: string;
}

type Status = "idle" | "loading" | "success" | "error";

export function ExportReelButton({ warId }: Props) {
  const [status, setStatus]   = useState<Status>("idle");
  const [jobId,  setJobId]    = useState<string | null>(null);
  const [errMsg, setErrMsg]   = useState<string | null>(null);

  async function handleExport() {
    if (status === "loading") return;
    setStatus("loading");
    setErrMsg(null);

    try {
      const res = await fetch("/api/replay/export", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ warId }),
      });

      if (res.status === 422) {
        setStatus("error");
        setErrMsg("No highlights available for this match.");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      const data = await res.json();
      setJobId(data.job?.id ?? null);
      setStatus("success");
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3 text-sm text-emerald-300">
        ✅ Export queued{jobId && <span className="ml-1 text-emerald-400/60 text-xs font-mono">#{jobId.slice(0, 8)}</span>}
        <div className="mt-1 text-xs text-emerald-400/50">Processing time: ~2–5 min</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={status === "loading"}
        onClick={handleExport}
        className="w-full rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading" ? "Queuing export…" : "Generate Highlight Reel"}
      </button>

      {errMsg && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/8 px-3 py-2 text-xs text-red-300">
          {errMsg}
        </div>
      )}
    </div>
  );
}
