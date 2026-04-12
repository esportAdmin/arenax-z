"use client";

import { Trophy } from "lucide-react";
import { useWarContributors } from "@/hooks/useWarContributors";

interface Props {
  warId: string; // ⚠️ IMPORTANT : warId (pas clubId)
}

export function WarTopContributors({ warId }: Props) {
  const { contributors, loading, error } = useWarContributors(warId);

  // 🔄 Loading state
  if (loading) {
    return <div className="glass-card p-4">Loading contributors...</div>;
  }

  // ❌ Error state
  if (error) {
    return <div className="glass-card p-4 text-red-400">{error}</div>;
  }

  // 📭 Empty state
  if (contributors.length === 0) {
    return null; // ou UI vide custom
  }

  return (
    <div className="glass-card p-6 mt-6">
      <div className="flex items-center gap-2 mb-4 font-bold">
        <Trophy className="w-5 h-5 text-yellow-400" />
        Top War Contributors
      </div>

      <div className="space-y-2">
        {contributors.map((c, index) => (
          <div
            key={c.user_id}
            className="flex justify-between items-center border-b pb-2"
          >
            <div className="flex gap-3 items-center">
              <span className="font-bold w-6">#{index + 1}</span>
              <span>{c.username}</span>
            </div>

            <div className="font-semibold">{c.xp} XP</div>
          </div>
        ))}
      </div>
    </div>
  );
}
