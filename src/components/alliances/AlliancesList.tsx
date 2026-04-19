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
      <div className="dashboard-card text-white/70">
        Loading alliances...
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-card border-red-500/20 bg-red-500/10 text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <div className="mb-5 flex items-center gap-3 text-white">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10">
          <Shield className="h-5 w-5 text-cyan-300" />
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-200">
            Coalition registry
          </div>
          <h3 className="font-display text-2xl font-black">Alliances</h3>
        </div>
      </div>

      <div className="space-y-3">
        {alliances.map((alliance) => (
          <button
            key={alliance.id}
            type="button"
            onClick={() => onSelectAlliance?.(alliance.id)}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-left transition hover:border-cyan-400/40 hover:bg-white/[0.055]"
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
