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
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/60">
        Select an alliance to view members
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/70">
        Loading alliance details...
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
        <Users className="h-5 w-5 text-cyan-300" />
        <h3 className="text-xl font-bold">Alliance Members</h3>
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-4 py-3"
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
