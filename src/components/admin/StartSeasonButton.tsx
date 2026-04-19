"use client";

import { useState } from "react";

export default function StartSeasonButton() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleStartSeason() {
    if (!name.trim() || loading) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/seasons/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to start season");
      }

      setMessage(`Season started: ${result.name}`);
      setName("");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 text-white font-semibold">Start New Season</div>

      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Season name"
          className="flex-1 rounded border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none"
        />

        <button
          type="button"
          onClick={handleStartSeason}
          disabled={loading || !name.trim()}
          className="rounded bg-cyan-500 px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
        >
          {loading ? "..." : "Start Season"}
        </button>
      </div>

      {message && <div className="mt-3 text-sm text-white/70">{message}</div>}
    </div>
  );
}
