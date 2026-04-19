"use client";

import { useState } from "react";

export default function WarActions({ warId }: { warId: string }) {
  const [loading, setLoading] = useState(false);

  async function send(amount: number) {
    if (loading) return;

    setLoading(true);

    await fetch("/api/wars/contribute", {
      method: "POST",
      body: JSON.stringify({
        warId,
        amount,
      }),
    });

    setTimeout(() => setLoading(false), 600);
  }

  return (
    <div className="flex gap-2 mt-2">
      <button
        onClick={() => send(10)}
        className="bg-red-500 px-2 py-1 text-xs rounded"
      >
        ⚔ Attack
      </button>

      <button
        onClick={() => send(10)}
        className="bg-blue-500 px-2 py-1 text-xs rounded"
      >
        🛡 Defend
      </button>
    </div>
  );
}
