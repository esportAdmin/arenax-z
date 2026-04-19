"use client";

import { Trophy } from "lucide-react";
import { useGlobalPlayerRanking } from "@/hooks/useGlobalPlayerRanking";

export default function GlobalPlayerRanking() {
  const { players, loading } = useGlobalPlayerRanking();

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/70">
        Loading global player ranking...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <div className="mb-4 flex items-center gap-2 text-white">
        <Trophy className="h-5 w-5 text-yellow-400" />
        <h3 className="text-xl font-bold">Global Player Ranking</h3>
      </div>

      <div className="space-y-3">
        {players.map((player) => (
          <div
            key={player.user_id}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 text-center font-bold text-cyan-300">
                #{player.rank}
              </div>

              <img
                src={player.avatar_url || "/default-avatar.png"}
                alt={player.username}
                className="h-8 w-8 rounded-full object-cover"
              />

              <div>
                <div className="font-semibold text-white">
                  {player.username}
                </div>
                <div className="text-xs text-white/50">
                  {player.contributions} contributions
                </div>
              </div>
            </div>

            <div className="font-bold text-cyan-300">
              {player.total_xp.toLocaleString()} XP
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
