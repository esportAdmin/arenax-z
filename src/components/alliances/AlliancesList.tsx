"use client";

import { Shield } from "lucide-react";
import { useAlliances } from "@/hooks/useAlliances";

interface Props {
  onSelectAlliance?: (allianceId: string) => void;
}

export default function AlliancesList({ onSelectAlliance }: Props) {
  const { alliances, loading, error } = useAlliances();

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/70">
        Loading alliances...
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
        <Shield className="h-5 w-5 text-cyan-300" />
        <h3 className="text-xl font-bold">Alliances</h3>
      </div>

      <div className="space-y-3">
        {alliances.map((alliance) => (
          <button
            key={alliance.id}
            type="button"
            onClick={() => onSelectAlliance?.(alliance.id)}
            className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-left transition hover:border-cyan-400/40"
          >
            <div>
              <div className="font-semibold text-white">{alliance.name}</div>
              <div className="text-xs text-white/50">
                Owner: {alliance.owner_club_name ?? "Unknown"}
              </div>
              {alliance.description && (
                <div className="mt-1 text-xs text-white/60">
                  {alliance.description}
                </div>
              )}
            </div>

            <div className="text-sm font-medium text-cyan-300">
              {alliance.members_count} clubs
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
