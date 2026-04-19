"use client";

import { Crown } from "lucide-react";
import { useTopPlayersGlobal } from "@/hooks/useTopPlayersGlobal";

export default function TopPlayersGlobal() {
  const { data, loading, error } = useTopPlayersGlobal();

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/70">
        Loading top players...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <div className="mb-4 flex items-center gap-2 text-white">
        <Crown className="h-5 w-5 text-yellow-400" />
        <h3 className="text-xl font-bold">Top Players Global</h3>
      </div>

      <div className="space-y-3">
        {data.map((player) => (
          <div
            key={player.user_id}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 text-center font-bold text-yellow-400">
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
