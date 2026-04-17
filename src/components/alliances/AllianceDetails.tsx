"use client";

import { Users } from "lucide-react";
import { useAllianceDetails } from "@/hooks/useAllianceDetails";

interface Props {
  allianceId: string | null;
}

export default function AllianceDetails({ allianceId }: Props) {
  const { members, loading, error } = useAllianceDetails(allianceId);

  if (!allianceId) {
    return (
      <div className="dashboard-card flex min-h-[220px] items-center justify-center text-center text-white/60">
        <div>
          <Users className="mx-auto mb-4 h-10 w-10 text-cyan-300/50" />
          <div className="font-display text-xl font-black text-white">
            Select an alliance
          </div>
          <p className="mt-2 text-sm text-slate-400">
            View member clubs, roles, and coalition structure.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-card text-white/70">
        Loading alliance details...
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
          <Users className="h-5 w-5 text-cyan-300" />
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-200">
            Member clubs
          </div>
          <h3 className="font-display text-2xl font-black">Alliance Members</h3>
        </div>
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              {member.logo_url ? (
                <img
                  src={member.logo_url}
                  alt={member.club_name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs text-white/60">
                  ?
                </div>
              )}

              <div>
                <div className="font-semibold text-white">
                  {member.club_name}
                </div>
                <div className="text-xs text-white/50">
                  {member.role} · joined{" "}
                  {new Date(member.joined_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
