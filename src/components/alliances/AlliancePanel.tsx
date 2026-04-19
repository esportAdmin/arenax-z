"use client";

import { useCallback, useEffect, useState } from "react";

interface Alliance {
  id: string;
  name: string;
}

export default function AlliancePanel({ clubId }: { clubId: string }) {
  const [alliance, setAlliance] = useState<Alliance | null>(null);
  const [members, setMembers] = useState<any[]>([]);

  const load = useCallback(async () => {
    if (!clubId) {
      setAlliance(null);
      setMembers([]);
      return;
    }

    const res = await fetch(`/api/alliances/my?clubId=${clubId}`);
    const data = await res.json();

    setAlliance(data.alliance);
    setMembers(data.members || []);
  }, [clubId]);

  useEffect(() => {
    void load();
  }, [clubId, load]);

  if (!alliance) {
    return <div className="p-4 border rounded text-white">No alliance</div>;
  }

  return (
    <div className="p-4 border rounded bg-black/40 text-white">
      <h3 className="font-bold mb-2">{alliance.name}</h3>

      <div className="space-y-1">
        {members.map((m) => (
          <div key={m.club_id} className="text-sm">
            🛡 {m.club_name}
          </div>
        ))}
      </div>
    </div>
  );
}
