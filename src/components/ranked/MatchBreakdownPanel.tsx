"use client";

/**
 * MatchBreakdownPanel.tsx
 * ─────────────────────────────────────────────────────────────────────
 * Panneau post-game enrichi :
 *   - Summary strip (rôle / expected / winChance / MMR)
 *   - MMR Breakdown (base / context adjustment / final)
 *   - Competitive Timeline
 *   - Match Snapshot (quality / opponent / diff)
 *   - Performance Spotlight (MVP slot — null-safe)
 *
 * Correction vs doc : toneClass() retourne un objet structuré
 * au lieu d'une string CSS unique — évite le split(" ")[n] fragile
 * pour extraire la couleur du dot timeline.
 * ─────────────────────────────────────────────────────────────────────
 */

import Link from "next/link";
import type {
  PostGameBreakdown,
  PostGameHighlight,
  PostGameTimelineEntry,
  Tone,
} from "@/lib/ranked/postGameBreakdown";
import type { BattleInsights } from "@/lib/replay/battleLogsAdapter";
import { buildReplayHref } from "@/lib/replay/replaySync";
import { ExportReelButton } from "@/components/replay/ExportReelButton";

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────

interface ToneStyle {
  /** Classes pour le conteneur (border + bg + texte) */
  container: string;
  /** Classe couleur du texte seule — pour les valeurs inline */
  text:      string;
  /** Classe couleur de fond seule — pour le dot timeline */
  dot:       string;
}

function toneStyle(tone: Tone): ToneStyle {
  switch (tone) {
    case "good":
      return {
        container: "border-emerald-500/20 bg-emerald-500/8 text-emerald-300",
        text:      "text-emerald-300",
        dot:       "bg-emerald-500/60",
      };
    case "bad":
      return {
        container: "border-red-500/20 bg-red-500/8 text-red-300",
        text:      "text-red-300",
        dot:       "bg-red-500/60",
      };
    case "accent":
      return {
        container: "border-cyan-500/20 bg-cyan-500/8 text-cyan-300",
        text:      "text-cyan-300",
        dot:       "bg-cyan-500/60",
      };
    default:
      return {
        container: "border-white/8 bg-white/4 text-white/60",
        text:      "text-white/55",
        dot:       "bg-white/20",
      };
  }
}

function formatSigned(v: number | null, suffix = ""): string {
  if (v == null) return "—";
  return `${v > 0 ? "+" : ""}${v}${suffix}`;
}

function formatPercent(v: number | null): string {
  return v == null ? "—" : `${v}%`;
}

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

function SummaryTile({ label, value, tone = "neutral" }: { label: string; value: string; tone?: Tone }) {
  const s = toneStyle(tone);
  return (
    <div className={`rounded-2xl border px-4 py-3 ${s.container}`}>
      <div className="text-[10px] font-semibold uppercase tracking-widest opacity-60">{label}</div>
      <div className="mt-1 text-lg font-black tabular-nums">{value}</div>
    </div>
  );
}

function MmrCell({ label, value, tone }: { label: string; value: string; tone: Tone }) {
  const s = toneStyle(tone);
  return (
    <div className="rounded-xl border border-white/8 bg-white/4 p-4">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-white/30">{label}</div>
      <div className={`mt-1 text-2xl font-black tabular-nums ${s.text}`}>{value}</div>
    </div>
  );
}

function TimelineRow({ entry, isLast }: { entry: PostGameTimelineEntry; isLast: boolean }) {
  const s = toneStyle(entry.tone);
  return (
    <div className="flex gap-3">
      {/* Dot + vertical line */}
      <div className="flex flex-col items-center">
        <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${s.dot}`} />
        {!isLast && <div className="mt-1 w-px flex-1 bg-white/8" />}
      </div>

      {/* Content */}
      <div className="mb-3 flex-1 rounded-xl border border-white/6 bg-white/3 px-4 py-2.5">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-white/25">
          {entry.title}
        </div>
        <div className={`mt-0.5 text-sm font-semibold ${s.text}`}>
          {entry.value}
        </div>
      </div>
    </div>
  );
}

function HighlightRow({ item }: { item: PostGameHighlight }) {
  const s = toneStyle(item.tone);
  return (
    <div className={`rounded-xl border px-4 py-3 ${s.container}`}>
      <div className="text-[10px] font-semibold uppercase tracking-widest opacity-60">{item.label}</div>
      <div className="mt-1 text-sm font-bold">{item.value}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENT PRINCIPAL
// ─────────────────────────────────────────────

interface Props {
  breakdown: PostGameBreakdown;
  /** Insights combat — null si battle_logs absent ou war sans territory */
  insights?: BattleInsights | null;
  /** Cible replay — active les highlights cliquables et le reel export */
  replayTarget?: { warId: string; territoryId: string | null } | null;
}

export function MatchBreakdownPanel({ breakdown, insights, replayTarget }: Props) {
  const deltaTone = (v: number | null): Tone =>
    v == null ? "neutral" : v > 0 ? "good" : v < 0 ? "bad" : "neutral";

  return (
    <div className="space-y-4">
      {/* ── Summary strip ── */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryTile label="Role" value={breakdown.roleLabel} />
        <SummaryTile
          label="Expected Outcome"
          value={breakdown.expectedOutcome ?? "—"}
          tone="accent"
        />
        <SummaryTile
          label="Win Chance"
          value={formatPercent(breakdown.playerWinProbability)}
        />
        <SummaryTile
          label="Final MMR"
          value={formatSigned(breakdown.mmrDelta, " MMR")}
          tone={deltaTone(breakdown.mmrDelta)}
        />
      </div>

      {/* ── Main grid ── */}
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">

        {/* ── Colonne gauche ── */}
        <div className="space-y-4">

          {/* MMR Breakdown */}
          <div className="overflow-hidden rounded-2xl border border-white/8 bg-black/40 backdrop-blur">
            <div className="border-b border-white/6 px-5 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400/60">
                MMR Breakdown
              </div>
              <div className="mt-0.5 text-sm text-white/30">
                Base ELO delta · contextual adjustment · final
              </div>
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-3">
              <MmrCell
                label="Base Delta"
                value={formatSigned(breakdown.mmrBaseDelta, " MMR")}
                tone={deltaTone(breakdown.mmrBaseDelta)}
              />
              <MmrCell
                label="Context Adj."
                value={
                  breakdown.mmrContextAdjustment == null ? "—"
                  : breakdown.mmrContextAdjustment === 0  ? "±0"
                  : formatSigned(breakdown.mmrContextAdjustment, " MMR")
                }
                tone={deltaTone(breakdown.mmrContextAdjustment)}
              />
              <MmrCell
                label="Final Delta"
                value={formatSigned(breakdown.mmrDelta, " MMR")}
                tone={deltaTone(breakdown.mmrDelta)}
              />
            </div>

            {/* Before → After si disponible */}
            {breakdown.mmrBefore != null && breakdown.mmrAfter != null && (
              <div className="border-t border-white/6 px-5 py-3">
                <div className="flex items-center gap-2 text-sm tabular-nums">
                  <span className="text-white/30">{breakdown.mmrBefore.toLocaleString()}</span>
                  <span className="text-white/15">→</span>
                  <span className="font-bold text-white/80">{breakdown.mmrAfter.toLocaleString()} MMR</span>
                </div>
              </div>
            )}
          </div>

          {/* Competitive Timeline */}
          <div className="overflow-hidden rounded-2xl border border-white/8 bg-black/40 backdrop-blur">
            <div className="border-b border-white/6 px-5 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400/60">
                Competitive Timeline
              </div>
              <div className="mt-0.5 text-sm text-white/30">
                From pairing to final rating resolution
              </div>
            </div>

            <div className="p-5">
              {breakdown.timeline.map((entry, i) => (
                <TimelineRow
                  key={`${entry.title}-${i}`}
                  entry={entry}
                  isLast={i === breakdown.timeline.length - 1}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Colonne droite ── */}
        <div className="space-y-4">

          {/* Match Snapshot */}
          <div className="overflow-hidden rounded-2xl border border-white/8 bg-black/40 backdrop-blur">
            <div className="border-b border-white/6 px-5 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400/60">
                Match Snapshot
              </div>
            </div>
            <div className="grid gap-3 p-5">
              <SummaryTile
                label="Match Quality"
                value={
                  breakdown.matchQualityScore == null ? "—"
                  : `${breakdown.matchQualityLabel ?? "Unknown"} · ${breakdown.matchQualityScore}%`
                }
                tone={
                  breakdown.matchQualityScore == null ? "neutral"
                  : breakdown.matchQualityScore >= 80  ? "good"
                  : breakdown.matchQualityScore >= 60  ? "accent"
                  : breakdown.matchQualityScore >= 40  ? "neutral"
                  : "bad"
                }
              />
              <SummaryTile
                label="Opponent Win Chance"
                value={formatPercent(breakdown.opponentWinProbability)}
              />
              <SummaryTile
                label="MMR Diff at Pairing"
                value={breakdown.mmrDiffAtPairing == null ? "—" : `±${breakdown.mmrDiffAtPairing}`}
              />
            </div>
          </div>

          {/* Performance Spotlight — null-safe */}
          {(breakdown.mvp != null || breakdown.highlights.length > 0) && (
            <div className="overflow-hidden rounded-2xl border border-white/8 bg-black/40 backdrop-blur">
              <div className="border-b border-white/6 px-5 py-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400/60">
                  Performance Spotlight
                </div>
                <div className="mt-0.5 text-sm text-white/30">
                  Ready for battle_logs adapter
                </div>
              </div>

              <div className="p-5 space-y-3">
                {/* MVP card — uniquement si flavor notable */}
                {breakdown.mvp && (
                  <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
                      {breakdown.mvp.title}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-white/80">
                      {breakdown.mvp.subtitle}
                    </div>
                    {breakdown.mvp.score && (
                      <span className="mt-3 inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                        {breakdown.mvp.score}
                      </span>
                    )}
                  </div>
                )}

                {/* Highlights */}
                {breakdown.highlights.map((item) => (
                  <HighlightRow key={`${item.label}-${item.value}`} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Battle Insights — affiché uniquement si données réelles disponibles ── */}
      {insights?.hasData && (
        <div className="overflow-hidden rounded-2xl border border-white/8 bg-black/40 backdrop-blur">
          <div className="border-b border-white/6 px-5 py-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400/60">
              Battle Insights
            </div>
            <div className="mt-0.5 text-sm text-white/30">
              From battle_logs · {insights.tickCount} ticks recorded
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2">
            {/* Key Moments — highlights cliquables avec deep link + camera focus */}
            {insights.highlights.length > 0 && (
              <div>
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                  Key Moments
                </div>
                <div className="space-y-2">
                  {insights.highlights.map((h, i) => {
                    const href = replayTarget
                      ? buildReplayHref({
                          territoryId: replayTarget.territoryId,
                          warId:       replayTarget.warId,
                          offsetMs:    (h as any).offsetMs ?? 0,
                        })
                      : null;

                    const inner = (
                      <div className="flex items-center justify-between rounded-xl border border-white/6 bg-white/3 px-3 py-2 transition hover:border-cyan-400/30 hover:bg-cyan-500/6">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white/80">{h.label}</span>
                          <span className="font-mono text-[10px] tabular-nums text-white/30">
                            {h.matchTime}
                          </span>
                        </div>
                        {replayTarget && (
                          <span className="text-[11px] font-semibold text-cyan-300">
                            Jump ↗
                          </span>
                        )}
                      </div>
                    );

                    // Deep link uniquement — le bridge ReplayTimestampBridge
                    // sur la page replay dispatch le seek au montage.
                    return href ? (
                      <Link key={`${h.tag}-${i}`} href={href}>{inner}</Link>
                    ) : (
                      <div key={`${h.tag}-${i}`}>{inner}</div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Performance by Side */}
            {insights.stats.length > 0 && (
              <div>
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                  Performance by Side
                </div>
                <div className="space-y-2">
                  {insights.stats.map((s) => (
                    <div
                      key={s.clubId}
                      className={`rounded-xl border px-3 py-2 ${
                        s.clubId === insights.mvpClubId
                          ? "border-amber-500/20 bg-amber-500/6"
                          : "border-white/6 bg-white/3"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold tabular-nums text-white/30">
                          {s.clubId.slice(0, 8)}…
                          {s.clubId === insights.mvpClubId && (
                            <span className="ml-2 text-amber-400">★ Top</span>
                          )}
                        </span>
                        <span className="text-xs font-bold tabular-nums text-white/70">
                          Score: {s.performanceScore}
                        </span>
                      </div>
                      <div className="mt-1 flex gap-3 text-[10px] tabular-nums text-white/30">
                        {s.kills > 0 && (
                          <span className="text-emerald-400/70">⚔️ {s.kills}k</span>
                        )}
                        <span>{s.abilitiesUsed} abilities</span>
                        <span>{s.totalDamage} dmg</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Auto Highlight Reel — affiché si highlights + replayTarget disponibles ── */}
      {replayTarget && insights?.hasData && insights.highlights.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-white/8 bg-black/40 backdrop-blur">
          <div className="border-b border-white/6 px-5 py-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400/60">
              Auto Highlight Reel
            </div>
            <div className="mt-0.5 text-sm text-white/30">
              Best moments selected automatically · up to 5 clips · 90s max
            </div>
          </div>

          <div className="space-y-2 p-5">
            {insights.highlights.slice(0, 5).map((h, i) => (
              <div
                key={`reel-${h.tag}-${i}`}
                className="flex items-center justify-between rounded-xl border border-white/6 bg-white/3 px-4 py-3"
              >
                <div>
                  <div className="text-sm font-semibold text-white/80">{h.label}</div>
                  <div className="font-mono text-[11px] text-white/30">{h.matchTime}</div>
                </div>
                <Link
                  href={buildReplayHref({
                    territoryId: replayTarget.territoryId,
                    warId:       replayTarget.warId,
                    offsetMs:    (h as any).offsetMs ?? 0,
                  })}
                  className="rounded-lg border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
                >
                  Preview ↗
                </Link>
              </div>
            ))}

            <div className="pt-1">
              <ExportReelButton warId={replayTarget.warId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
