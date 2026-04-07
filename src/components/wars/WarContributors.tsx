"use client";

import { useWarContributors } from "@/hooks/useWarContributors";

export default function WarContributors({ warId }: { warId: string }) {
  const { contributors } = useWarContributors(warId);

  if (!contributors.length) {
    return (
      <div className="text-sm text-muted-foreground">No contributions yet</div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold">Top Contributors</h4>

      {contributors.map((c, i) => (
        <div key={i} className="flex justify-between text-sm">
          <span>{c.username ?? "Unknown"}</span>

          <span>{c.xp} XP</span>
        </div>
      ))}
    </div>
  );
}
