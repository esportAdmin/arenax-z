"use client";

import { useState } from "react";

interface Props {
  ownerClubId: string;
}

export default function CreateAllianceForm({ ownerClubId }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleCreate() {
    if (!name.trim() || loading) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/alliances/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          ownerClubId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to create alliance");
      }

      setMessage(`Alliance created: ${result.name}`);
      setName("");
      setDescription("");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <div className="mb-4 text-lg font-bold text-white">Create Alliance</div>

      <div className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Alliance name"
          className="w-full rounded border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Alliance description"
          className="min-h-[100px] w-full rounded border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none"
        />

        <button
          type="button"
          onClick={handleCreate}
          disabled={loading || !name.trim()}
          className="rounded bg-cyan-500 px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
        >
          {loading ? "..." : "Create Alliance"}
        </button>

        {message && <div className="text-sm text-white/70">{message}</div>}
      </div>
    </div>
  );
}
