"use client";

import { useCallback, useEffect, useState } from "react";

interface Invite {
  id: string;
  alliance_id: string;
  club_id: string;
  status: string;
  created_at: string;
}

export default function AllianceInvites({ clubId }: { clubId: string }) {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/alliances/invites?clubId=${clubId}`);
      const data = await res.json();
      setInvites(data ?? []);
    } finally {
      setLoading(false);
    }
  }, [clubId]);

  useEffect(() => {
    if (!clubId) return;
    load();
  }, [clubId, load]);

  async function accept(inviteId: string) {
    await fetch("/api/alliances/accept", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inviteId }),
    });
    load();
  }

  async function decline(inviteId: string) {
    await fetch("/api/alliances/decline", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inviteId }),
    });
    load();
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/70">
        Loading invites...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <div className="mb-4 text-lg font-bold text-white">Alliance Invites</div>

      <div className="space-y-3">
        {invites.length === 0 && (
          <div className="text-sm text-white/60">No pending invites</div>
        )}

        {invites.map((invite) => (
          <div
            key={invite.id}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-4 py-3"
          >
            <div>
              <div className="font-medium text-white">Alliance invite</div>
              <div className="text-xs text-white/50">
                {new Date(invite.created_at).toLocaleString()}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => accept(invite.id)}
                className="rounded bg-green-500 px-3 py-1 text-sm text-white"
              >
                Accept
              </button>

              <button
                type="button"
                onClick={() => decline(invite.id)}
                className="rounded bg-red-500 px-3 py-1 text-sm text-white"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
