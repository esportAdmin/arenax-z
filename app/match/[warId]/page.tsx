"use client";

/**
 * app/match/[warId]/page.tsx
 * Écran d'entrée de match — affiché après acceptation du ready check.
 * Référencée par : QueueScreen.tsx:239, emailService.ts:181
 *
 * Rôle : charger le match en cours et rediriger vers /result en fin de partie.
 */

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

interface WarStatus {
  id:     string;
  status: string;
}

export default function MatchPage({
  params,
}: {
  params: Promise<{ warId: string }>;
}) {
  const { warId } = use(params);
  const router     = useRouter();
  const [war, setWar]     = useState<WarStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!warId) return;

    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    // Charger le statut initial
    sb.from("club_wars")
      .select("id, status")
      .eq("id", warId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) { setError("Match not found"); return; }
        setWar(data);
        if (data.status === "completed" || data.status === "resolved") {
          router.replace(`/match/${warId}/result`);
        }
      });

    // Realtime — rediriger quand le match se termine
    const channel = sb
      .channel(`war:${warId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "club_wars", filter: `id=eq.${warId}` },
        (payload) => {
          const updated = payload.new as WarStatus;
          if (updated.status === "completed" || updated.status === "resolved") {
            router.push(`/match/${warId}/result`);
          }
        },
      )
      .subscribe();

    return () => { void sb.removeChannel(channel); };
  }, [warId, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center gap-4 text-white">
        <p className="text-red-400">{error}</p>
        <button
          type="button"
          onClick={() => router.push("/play")}
          className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm hover:bg-white/10 transition"
        >
          Back to queue
        </button>
      </div>
    );
  }

  if (!war) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // TODO — monter ici le composant WorldMap / BattleHUD en mode spectateur live
  // Le match est en cours (war.status === "active" ou "pending")
  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col items-center justify-center gap-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-cyan-300">Match in progress</h1>
        <p className="text-sm text-white/40 font-mono">{warId}</p>
        <div className="flex items-center gap-2 justify-center text-xs text-white/30">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </div>
      </div>
      {/* TODO — <WorldMap /> en mode battle */}
    </div>
  );
}
