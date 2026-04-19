"use client";

import { Bot } from "lucide-react";
import { useWarAiLive } from "@/hooks/useWarAiLive";

export default function WarAiLivePanel() {
  const { loading, processed, error, runAiTurn } = useWarAiLive();

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center gap-2 text-white">
        <Bot className="h-4 w-4 text-cyan-300" />
        <h3 className="font-semibold">War AI Live</h3>
      </div>

      <button
        type="button"
        onClick={runAiTurn}
        disabled={loading}
        className="rounded bg-amber-500 px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
      >
        {loading ? "Running..." : "Run AI Turn"}
      </button>

      {processed !== null && (
        <div className="mt-3 text-sm text-white/70">
          AI turns processed: {processed}
        </div>
      )}

      {error && <div className="mt-3 text-sm text-red-400">{error}</div>}
    </div>
  );
}
