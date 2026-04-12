"use client";

import { useWarMVP } from "@/hooks/useWarMVP";

export default function MVPBadge({ warId }: { warId: string }) {
  const mvp = useWarMVP(warId);

  if (!mvp) return null;

  return <div className="text-xs text-yellow-400 mt-1">👑 {mvp.username}</div>;
}
