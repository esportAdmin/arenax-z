"use client";

import { useState } from "react";

export default function MatchmakeWarsButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleMatchmake() {
    if (loading) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/wars/matchmake", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to matchmake wars");
      }

      setMessage(`${result.created} wars created`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 text-white font-semibold">Auto Matchmaking</div>

      <button
        type="button"
        onClick={handleMatchmake}
        disabled={loading}
        className="rounded bg-purple-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "..." : "Launch Matchmaking"}
      </button>

      {message && <div className="mt-3 text-sm text-white/70">{message}</div>}
    </div>
  );
}
