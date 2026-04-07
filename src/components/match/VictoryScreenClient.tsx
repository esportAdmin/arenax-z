"use client";

/**
 * VictoryScreenClient.tsx
 * ─────────────────────────────────────────────────────────────────────
 * Composant client pour la Victory Screen — gère les animations.
 * Importé par app/match/[warId]/result/page.tsx (Server Component).
 *
 * Animations :
 *   - Fade-in staggeré sur chaque section
 *   - Count-up MMR (before → after)
 *   - Glow pulse sur le titre VICTORY/DEFEAT
 * ─────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface VictoryScreenProps {
  isWin: boolean;
  flavor: string | null;
  isSpectator: boolean;

  /** MMR courant avant/après du joueur */
  mmrBefore: number | null;
  mmrAfter: number | null;
  mmrDelta: number | null;

  /** Base ELO delta + contexte breakdown */
  baseDelta: number | null;
  contextBonus: number | null;  // positif ou négatif par rapport à base

  /** Win probability */
  playerWinProb: number | null;
  opponentWinProb: number | null;

  /** Match quality */
  matchQualityScore: number | null;
  matchQualityLabel: string | null;
  mmrDiffAtMatch: number | null;

  /** CTA */
  replayUrl: string;
}

// ─────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────

/**
 * Count-up animé : anime un nombre de `from` à `to` sur `duration` ms.
 */
function useCountUp(to: number, duration = 1200, delay = 400): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const startTime = performance.now() + delay;
    let rafId: number;

    function tick(now: number) {
      const elapsed = Math.max(0, now - startTime);
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(to * eased));
      if (progress < 1) rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [to, duration, delay]);

  return value;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function qualityColor(score: number | null): string {
  if (score == null) return "text-white/40";
  if (score >= 80)   return "text-emerald-400";
  if (score >= 60)   return "text-cyan-400";
  if (score >= 40)   return "text-amber-400";
  return "text-red-400";
}

function formatDeltaSign(n: number | null): string {
  if (n == null) return "—";
  return `${n > 0 ? "+" : ""}${n}`;
}

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

function StatCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-black/40 px-5 py-4 backdrop-blur">
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">
        {label}
      </div>
      {children}
    </div>
  );
}

/**
 * Barre de probabilité duale — You vs Opponent.
 */
function WinProbBar({
  playerProb,
  opponentProb,
  isWin,
}: {
  playerProb: number;
  opponentProb: number;
  isWin: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-2">
      {/* Labels */}
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className={isWin ? "text-cyan-300" : "text-white/50"}>
          You · {playerProb}%
        </span>
        <span className={!isWin ? "text-red-400/70" : "text-white/30"}>
          Opponent · {opponentProb}%
        </span>
      </div>

      {/* Barre */}
      <div className="flex h-3 overflow-hidden rounded-full bg-white/6">
        <motion.div
          className={`h-full rounded-full ${isWin ? "bg-cyan-400" : "bg-red-400/60"}`}
          initial={{ width: "50%" }}
          animate={{ width: mounted ? `${playerProb}%` : "50%" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
        />
      </div>

      {/* Labels numériques */}
      <div className="flex justify-between text-[10px] tabular-nums text-white/25">
        <span>{playerProb}% win chance</span>
        <span>{opponentProb}% win chance</span>
      </div>
    </div>
  );
}

/**
 * Rank Impact Breakdown — Base / Bonus / Final.
 * Affiché uniquement si baseDelta et contextBonus sont disponibles.
 */
function RankBreakdown({
  baseDelta,
  contextBonus,
  finalDelta,
}: {
  baseDelta: number;
  contextBonus: number;
  finalDelta: number;
}) {
  const isBonus   = contextBonus > 0;
  const isPenalty = contextBonus < 0;

  return (
    <div className="space-y-2">
      {/* Base */}
      <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/3 px-3 py-2">
        <span className="text-xs text-white/40">Base ELO delta</span>
        <span className="text-xs font-bold tabular-nums text-white/60">
          {formatDeltaSign(baseDelta)} MMR
        </span>
      </div>

      {/* Context adjustment */}
      {contextBonus !== 0 && (
        <div
          className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
            isBonus
              ? "border-amber-500/20 bg-amber-500/8"
              : "border-red-500/20 bg-red-500/8"
          }`}
        >
          <span className={`text-xs ${isBonus ? "text-amber-300" : "text-red-300"}`}>
            {isBonus ? "🔥 Upset bonus" : isPenalty && contextBonus < 0 ? "⚠️ Amplified loss" : "Context"}
          </span>
          <span
            className={`text-xs font-bold tabular-nums ${
              isBonus ? "text-amber-400" : "text-red-400"
            }`}
          >
            {formatDeltaSign(contextBonus)} MMR
          </span>
        </div>
      )}

      {/* Séparateur */}
      <div className="h-px bg-white/6" />

      {/* Final */}
      <div
        className={`flex items-center justify-between rounded-xl border px-3 py-3 ${
          finalDelta > 0
            ? "border-emerald-500/20 bg-emerald-500/8"
            : "border-red-500/20 bg-red-500/8"
        }`}
      >
        <span className="text-sm font-bold text-white/70">Final</span>
        <span
          className={`text-lg font-black tabular-nums ${
            finalDelta > 0 ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {formatDeltaSign(finalDelta)} MMR
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENT PRINCIPAL
// ─────────────────────────────────────────────

const FADE_UP: any = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function VictoryScreenClient({
  isWin, flavor, isSpectator,
  mmrBefore, mmrAfter, mmrDelta,
  baseDelta, contextBonus,
  playerWinProb, opponentWinProb,
  matchQualityScore, matchQualityLabel, mmrDiffAtMatch,
  replayUrl,
}: VictoryScreenProps) {
  // Count-up sur MMR after
  const countedMmrAfter = useCountUp(mmrAfter ?? 0, 1000, 600);

  const hasBreakdown = baseDelta != null && contextBonus != null && mmrDelta != null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Ambient glow pulsé */}
      <motion.div
        className="pointer-events-none fixed inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <motion.div
          className={`absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full blur-[120px] ${
            isWin ? "bg-cyan-500/10" : "bg-red-500/8"
          }`}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <div className="relative mx-auto max-w-2xl px-4 py-16">
        {/* ── 1. TITRE ── */}
        <motion.div
          className="mb-10 text-center"
          custom={0} variants={FADE_UP} initial="hidden" animate="show"
        >
          {flavor && (
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/35">
              {flavor}
            </div>
          )}

          <motion.h1
            className={`text-[72px] font-black leading-none tracking-tight ${
              isWin ? "text-cyan-300" : "text-red-400"
            }`}
            style={{
              textShadow: isWin
                ? "0 0 80px rgba(34,211,238,0.45)"
                : "0 0 80px rgba(248,113,113,0.4)",
            }}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "backOut" }}
          >
            {isWin ? "VICTORY" : "DEFEAT"}
          </motion.h1>

          {isSpectator && (
            <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/40">
              Spectator view
            </div>
          )}
        </motion.div>

        {/* ── 2. MMR BEFORE → AFTER ── */}
        {mmrBefore != null && mmrAfter != null && (
          <motion.div
            className="mb-4"
            custom={1} variants={FADE_UP} initial="hidden" animate="show"
          >
            <StatCard label="MMR Change">
              <div className="flex items-end gap-3">
                {/* Before */}
                <span className="text-2xl tabular-nums text-white/30">
                  {mmrBefore.toLocaleString()}
                </span>

                <span className="mb-0.5 text-white/20">→</span>

                {/* After — count-up */}
                <span
                  className={`text-4xl font-black tabular-nums ${
                    isWin ? "text-cyan-300" : "text-red-400"
                  }`}
                >
                  {countedMmrAfter.toLocaleString()}
                </span>

                {/* Delta badge */}
                {mmrDelta != null && (
                  <span
                    className={`mb-1 rounded-lg px-2 py-0.5 text-sm font-bold ${
                      mmrDelta > 0
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-red-500/12 text-red-400"
                    }`}
                  >
                    {formatDeltaSign(mmrDelta)}
                  </span>
                )}
              </div>
            </StatCard>
          </motion.div>
        )}

        {/* ── 3. WIN PROBABILITY BAR ── */}
        {playerWinProb != null && opponentWinProb != null && (
          <motion.div
            className="mb-4"
            custom={2} variants={FADE_UP} initial="hidden" animate="show"
          >
            <StatCard label="Win Probability">
              <WinProbBar
                playerProb={playerWinProb}
                opponentProb={opponentWinProb}
                isWin={isWin}
              />
            </StatCard>
          </motion.div>
        )}

        {/* ── 4. RANK IMPACT BREAKDOWN ── */}
        {hasBreakdown && (
          <motion.div
            className="mb-4"
            custom={3} variants={FADE_UP} initial="hidden" animate="show"
          >
            <StatCard label="Rank Impact Breakdown">
              <RankBreakdown
                baseDelta={baseDelta!}
                contextBonus={contextBonus!}
                finalDelta={mmrDelta!}
              />
            </StatCard>
          </motion.div>
        )}

        {/* ── 5. MATCH DETAILS ── */}
        <motion.div
          className="mb-6 overflow-hidden rounded-2xl border border-white/8 bg-black/40 backdrop-blur"
          custom={4} variants={FADE_UP} initial="hidden" animate="show"
        >
          <div className="border-b border-white/6 px-5 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
              Match Details
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-white/6">
            <div className="px-4 py-3">
              <div className="text-[10px] text-white/30">Quality</div>
              <div className={`mt-1 text-sm font-bold ${qualityColor(matchQualityScore)}`}>
                {matchQualityLabel ?? "—"} · {matchQualityScore ?? "—"}%
              </div>
            </div>
            <div className="px-4 py-3">
              <div className="text-[10px] text-white/30">MMR diff</div>
              <div className="mt-1 text-sm font-bold text-white/70">
                ±{mmrDiffAtMatch ?? "—"}
              </div>
            </div>
            <div className="px-4 py-3">
              <div className="text-[10px] text-white/30">Opponent chance</div>
              <div className="mt-1 text-sm font-bold text-white/70">
                {opponentWinProb != null ? `${opponentWinProb}%` : "—"}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 6. CALLOUT CONTEXTUEL ── */}
        {playerWinProb != null && (
          <motion.div
            className={`mb-8 rounded-2xl border px-5 py-4 text-sm ${
              isWin && playerWinProb <= 35
                ? "border-amber-500/20 bg-amber-500/8 text-amber-300"
                : !isWin && playerWinProb >= 65
                  ? "border-red-500/20 bg-red-500/8 text-red-300"
                  : !isWin && playerWinProb <= 35
                    ? "border-cyan-500/15 bg-cyan-500/5 text-cyan-300/70"
                    : "border-white/6 bg-white/3 text-white/40"
            }`}
            custom={5} variants={FADE_UP} initial="hidden" animate="show"
          >
            {isWin && playerWinProb <= 35 && <>🔥 Upset! You won as a {playerWinProb}% underdog — extra MMR awarded.</>}
            {isWin && playerWinProb >= 65 && <>✅ Expected win — MMR gain is moderate for an anticipated result.</>}
            {!isWin && playerWinProb <= 35 && <>🛡 Valiant effort as underdog — MMR loss is reduced.</>}
            {!isWin && playerWinProb >= 65 && <>⚠️ Unexpected defeat — MMR loss is amplified for a match you were expected to win.</>}
            {playerWinProb > 35 && playerWinProb < 65 && <>Even match — standard MMR applied.</>}
          </motion.div>
        )}

        {/* ── 7. CTA ── */}
        <motion.div
          className="flex justify-center gap-3"
          custom={6} variants={FADE_UP} initial="hidden" animate="show"
        >
          <a
            href={replayUrl}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
          >
            Watch Replay ↗
          </a>
          <a
            href="/profile"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/10"
          >
            Profile
          </a>
          <a
            href="/leaderboard"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/10"
          >
            Leaderboard
          </a>
        </motion.div>
      </div>
    </div>
  );
}
