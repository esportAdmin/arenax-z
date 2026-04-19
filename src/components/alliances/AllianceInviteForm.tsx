"use client";

import { useState } from "react";

interface Props {
  allianceId: string;
  invitedByClubId: string;
}

export default function AllianceInviteForm({
  allianceId,
  invitedByClubId,
}: Props) {
  const [clubId, setClubId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleInvite() {
    if (!clubId.trim() || loading) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/alliances/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          allianceId,
          clubId: clubId.trim(),
          invitedByClubId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to send invite");
      }

      setMessage("Invite sent");
      setClubId("");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <div className="mb-4 text-lg font-bold text-white">Invite Club</div>

      <div className="space-y-3">
        <input
          value={clubId}
          onChange={(e) => setClubId(e.target.value)}
          placeholder="Target club UUID"
          className="w-full rounded border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none"
        />

        <button
          type="button"
          onClick={handleInvite}
          disabled={loading || !clubId.trim()}
          className="rounded bg-purple-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "..." : "Send Invite"}
        </button>

        {message && <div className="text-sm text-white/70">{message}</div>}
      </div>
    </div>
  );
}
