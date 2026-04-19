"use client";

import { useClubEconomy } from "@/hooks/useClubEconomy";

export default function ClubEconomy({ clubId }: { clubId: string }) {
  const eco = useClubEconomy(clubId);

  if (!eco) return null;

  return (
    <div className="bg-black/60 p-3 rounded border border-cyan-400/30 text-xs text-white">
      <div>💰 Gold: {eco.gold}</div>
      <div>⚡ Energy: {eco.energy}</div>

      {eco.gold < 0 && (
        <div className="text-red-400 mt-2">⚠ Upkeep penalty active</div>
      )}
    </div>
  );
}
