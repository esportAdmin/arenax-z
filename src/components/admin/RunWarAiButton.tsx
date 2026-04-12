"use client";

import { useState } from "react";

export default function RunWarAiButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleRun() {
    if (loading) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/war-ai/run", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to run war AI");
      }

      setMessage(`AI turns processed: ${result.processed}`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 text-white font-semibold">War AI</div>

      <button
        type="button"
        onClick={handleRun}
        disabled={loading}
        className="rounded bg-amber-500 px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
      >
        {loading ? "..." : "Run War AI"}
      </button>

      {message && <div className="mt-3 text-sm text-white/70">{message}</div>}
    </div>
  );
}
