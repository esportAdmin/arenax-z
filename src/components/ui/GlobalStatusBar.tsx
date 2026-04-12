"use client";

import { useSeason } from "@/hooks/useSeason";
import { useLiveWars } from "@/hooks/useLiveWars";
import { useClubEconomy } from "@/hooks/useClubEconomy";

interface Props {
  clubId?: string | null;
}

export default function GlobalStatusBar({ clubId = null }: Props) {
  const { season } = useSeason();
  const { wars } = useLiveWars();
  const economy = useClubEconomy(clubId);

  const activeWars = wars.filter((w) => !!w.war_id).length;
  const territories = wars.filter((w) => w.club_id === clubId).length;

  return (
    <div className="absolute left-0 top-0 z-30 flex w-full justify-between border-b border-cyan-400/20 bg-black/80 px-4 py-2 text-xs text-white backdrop-blur">
      <div>🏰 Territories: {territories}</div>
      <div>🌍 Season: {season?.name ?? "No season"}</div>
      <div>⚔ Active Wars: {activeWars}</div>
      <div>💰 Gold: {economy?.gold ?? 0}</div>
      <div>⚡ Energy: {economy?.energy ?? 0}</div>
    </div>
  );
}
