"use client";

import { useActiveWar } from "@/hooks/useActiveWar";
import WarProgressBar from "./WarProgressBar";
import WarContributors from "./WarContributors";

export default function WarPanel({ territoryId }: { territoryId: string }) {
  const war = useActiveWar(territoryId);

  if (!war) {
    return <div className="text-sm text-muted-foreground">No active war</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Active War</h3>

      <WarProgressBar war={war} />

      <WarContributors warId={war.id} />
    </div>
  );
}
