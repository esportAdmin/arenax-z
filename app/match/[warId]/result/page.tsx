/**
 * app/match/[warId]/result/page.tsx
 * ─────────────────────────────────────────────────────────────────────
 * Écran post-game — Server Component propre.
 *
 * Le service role key n'est plus inline ici.
 * La page fetch /api/match/[warId]/result qui l'encapsule.
 *
 * Flux :
 *   page → GET /api/match/[warId]/result (auth + service role)
 *        → buildPostGameBreakdown()       (logique métier pure)
 *        → MatchBreakdownPanel            (rendu pur)
 * ─────────────────────────────────────────────────────────────────────
 */

import { cookies, headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { MatchBreakdownPanel } from "@/components/ranked/MatchBreakdownPanel";
import { buildPostGameBreakdown, type PostGameWarRow } from "@/lib/ranked/postGameBreakdown";

// ─────────────────────────────────────────────
// HELPERS UI LOCAUX
// ─────────────────────────────────────────────

function StatCard({
  label, value, color, large = false,
}: { label: string; value: string; color?: string; large?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/40 px-5 py-4 backdrop-blur">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-white/30">{label}</div>
      <div className={`mt-1 font-black tabular-nums ${large ? "text-4xl" : "text-2xl"} ${color ?? "text-white/80"}`}>
        {value}
      </div>
    </div>
  );
}

function qualityColor(score: number | null): string {
  if (score == null) return "text-white/40";
  if (score >= 80)   return "text-emerald-400";
  if (score >= 60)   return "text-cyan-400";
  if (score >= 40)   return "text-amber-400";
  return "text-red-400";
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

interface Props {
  params: Promise<{ warId: string }>;
}

export default async function MatchResultPage({ params }: Props) {
  const { warId } = await params;

  // ── Vérification auth minimale côté page ─────────────────────────
  // La vraie vérification auth est faite dans la route API.
  // On vérifie ici pour rediriger proprement sans attendre le fetch.
  const cookieStore = await cookies();

  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    },
  );

  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) redirect(`/auth?redirect=/match/${warId}/result`);

  // ── Fetch données via API route (service role encapsulé) ──────────
  // On passe les cookies pour que la route API puisse vérifier l'auth.
  const headersList  = await headers();
  const cookieHeader = headersList.get("cookie") ?? "";
  const baseUrl      = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/match/${warId}/result`, {
    headers: { cookie: cookieHeader },
    cache:   "no-store",
  });

  if (res.status === 404) notFound();
  if (res.status === 401) redirect(`/auth?redirect=/match/${warId}/result`);
  if (!res.ok) {
    // Erreur serveur — afficher un fallback plutôt que de crasher
    console.error("[match/result] API error:", res.status);
    notFound();
  }

  const { war, viewerId, insights } = await res.json() as {
    war:      PostGameWarRow;
    viewerId: string;
    insights: import("@/lib/replay/battleLogsAdapter").BattleInsights | null;
  };

  // ── Breakdown — toute la logique POV déléguée au helper ──────────
  const breakdown = buildPostGameBreakdown({
    war,
    viewerPlayerId: viewerId,
  });

  // Replay URL
  const replayUrl = war.territory_id
    ? `/wars/${war.territory_id}/replay`
    : `/replay/${war.id}`;

  // Formatted values pour le hero
  const mmrDeltaText  = breakdown.mmrDelta == null ? "—"
    : `${breakdown.mmrDelta > 0 ? "+" : ""}${breakdown.mmrDelta} MMR`;
  const mmrDeltaColor = breakdown.mmrDelta == null ? "text-white/40"
    : breakdown.mmrDelta > 0                       ? "text-emerald-400"
    : breakdown.mmrDelta < 0                       ? "text-red-400"
    : "text-white/50";

  const winProbColor = breakdown.playerWinProbability == null ? "text-white/40"
    : breakdown.playerWinProbability >= 60 ? "text-emerald-400"
    : breakdown.playerWinProbability <= 40 ? "text-red-400/80"
    : "text-white/70";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0">
        <div
          className={`absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full blur-[120px] ${
            breakdown.playerWon ? "bg-cyan-500/8" : "bg-red-500/6"
          }`}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16">

        {/* ── Hero ── */}
        <div className="mb-10 text-center">
          {breakdown.flavor && (
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/35">
              {breakdown.flavor}
            </div>
          )}

          <h1
            className={`text-[72px] font-black leading-none tracking-tight ${
              breakdown.playerWon ? "text-cyan-300" : "text-red-400"
            }`}
            style={{
              textShadow: breakdown.playerWon
                ? "0 0 80px rgba(34,211,238,0.4)"
                : "0 0 80px rgba(248,113,113,0.35)",
            }}
          >
            {breakdown.resultTitle}
          </h1>

          {!breakdown.isParticipant && (
            <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/40">
              Spectator view
            </div>
          )}
        </div>

        {/* ── Top stats ── */}
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="MMR Change"
            value={mmrDeltaText}
            color={mmrDeltaColor}
            large
          />
          <StatCard
            label="Win Probability"
            value={breakdown.playerWinProbability != null ? `${breakdown.playerWinProbability}%` : "—"}
            color={winProbColor}
            large
          />
          <StatCard
            label="Opponent Win Chance"
            value={breakdown.opponentWinProbability != null ? `${breakdown.opponentWinProbability}%` : "—"}
            color="text-white/70"
          />
          <StatCard
            label="Match Quality"
            value={breakdown.matchQualityScore != null ? `${breakdown.matchQualityScore}%` : "—"}
            color={qualityColor(breakdown.matchQualityScore)}
          />
        </div>

        {/* ── Breakdown panel ── */}
        <MatchBreakdownPanel
          breakdown={breakdown}
          insights={insights}
          replayTarget={{
            warId:       war.id,
            territoryId: war.territory_id,
          }}
        />

        {/* ── Callout contextuel ── */}
        {breakdown.playerWinProbability != null && (
          <div
            className={`mt-6 rounded-2xl border px-5 py-4 text-sm ${
              breakdown.playerWon && breakdown.playerWinProbability <= 35
                ? "border-amber-500/20 bg-amber-500/8 text-amber-300"
                : !breakdown.playerWon && breakdown.playerWinProbability >= 65
                  ? "border-red-500/20 bg-red-500/8 text-red-300"
                  : "border-white/6 bg-white/3 text-white/50"
            }`}
          >
            {breakdown.playerWon && breakdown.playerWinProbability <= 35 && (
              <>🔥 Upset! You won as a {breakdown.playerWinProbability}% underdog — extra MMR awarded.</>
            )}
            {breakdown.playerWon && breakdown.playerWinProbability >= 65 && (
              <>✅ Expected win — MMR gain is moderate for an anticipated result.</>
            )}
            {!breakdown.playerWon && breakdown.playerWinProbability <= 35 && (
              <>🛡 Valiant effort as underdog — MMR loss is reduced.</>
            )}
            {!breakdown.playerWon && breakdown.playerWinProbability >= 65 && (
              <>⚠️ Unexpected defeat — MMR loss is amplified for a match you were expected to win.</>
            )}
            {breakdown.playerWinProbability > 35 && breakdown.playerWinProbability < 65 && (
              <>Even match — standard MMR applied.</>
            )}
          </div>
        )}

        {/* ── CTAs ── */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={replayUrl}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
          >
            Watch Replay ↗
          </Link>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/10"
          >
            Back to Profile
          </Link>
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/10"
          >
            Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}
