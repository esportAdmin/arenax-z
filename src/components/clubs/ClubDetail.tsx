"use client";

import { useState } from "react";
import { useLiveWars } from "@/hooks/useLiveWars"; // ✅ FIX
import WarLeaderboard from "@/components/wars/WarLeaderboard";

interface Props {
  clubId: string;
}

export default function ClubDetail({ clubId }: Props) {
  const { wars, loading } = useLiveWars();

  const clubWars = wars.filter((w) => w.club_id === clubId);

  const [selectedWar, setSelectedWar] = useState<string | null>(null);

  if (loading) {
    return <div className="p-6 text-white/70">Loading club wars...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-cyan-300">Active Wars</h2>

      {clubWars.length === 0 && (
        <div className="text-white/60 text-sm">No active wars</div>
      )}

      {clubWars.map((war) => (
        <div
          key={war.territory_id}
          className="border border-white/10 rounded-lg p-4 bg-black/30"
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-white font-semibold">
                {war.territory_name}
              </div>

              <div className="text-xs text-white/50">XP: {war.total_xp}</div>
            </div>

            <button
              onClick={() =>
                setSelectedWar(selectedWar === war.war_id ? null : war.war_id)
              }
              className="text-xs bg-cyan-500 px-2 py-1 rounded text-black"
            >
              {selectedWar === war.war_id ? "Hide" : "View"}
            </button>
          </div>

          {/* Leaderboard */}
          {selectedWar === war.war_id && war.war_id && (
            <div className="mt-3 border-t border-white/10 pt-2">
              <WarLeaderboard warId={war.war_id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
