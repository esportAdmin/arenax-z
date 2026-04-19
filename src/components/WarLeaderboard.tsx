"use client";

import { Sword, Medal } from "lucide-react";
import { useWarLeaderboard } from "@/hooks/useWarLeaderboard";

interface Props {
  warId: string;
}

export default function WarLeaderboard({ warId }: Props) {
  const { data, loading, error } = useWarLeaderboard(warId);

  if (loading) {
    return <div className="text-sm text-white/60">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-sm">{error}</div>;
  }

  if (!data.length) {
    return <div className="text-white/60 text-sm">No contributions yet</div>;
  }

  return (
    <div className="rounded-lg border border-white/10 bg-black/30 p-4 mt-4">
      <div className="flex items-center gap-2 mb-3 font-bold text-white">
        <Sword className="w-4 h-4 text-red-400" />
        War Top Contributors
      </div>

      <div className="space-y-2">
        {data.map((player, index) => {
          const rank = index + 1;

          return (
            <div
              key={player.user_id}
              className="flex justify-between items-center text-sm"
            >
              <div className="flex items-center gap-2">
                {rank <= 3 ? (
                  <Medal className="w-4 h-4 text-yellow-400" />
                ) : (
                  <span className="w-5">#{rank}</span>
                )}

                <span>{player.username}</span>
              </div>

              <span className="font-semibold text-cyan-300">
                {player.total_xp} XP
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
