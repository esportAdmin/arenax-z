"use client";

import {
  ArrowRight,
  CalendarDays,
  Eye,
  Flame,
  Map,
  Radio,
  Shield,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ClubDetailTrustStrip } from "@/components/rallyguild/club-detail/ClubDetailTrustStrip";
import { TerritoryNetworkPreview } from "@/components/rallyguild/club-detail/TerritoryNetworkPreview";
import type { ActiveWar, Club, ClubMember } from "@/hooks/useClubDetail";

interface ClubActivationPanelsProps {
  activeWar: ActiveWar | null;
  callAccuracy: number;
  club: Club;
  members: ClubMember[];
  onNavigate: (href: string) => void;
}

/**
 * Combines the cockpit metrics, rivalry state, live ritual, activation prompt,
 * and trust strip into the lower club detail experience.
 */
export function ClubActivationPanels({
  activeWar,
  callAccuracy,
  club,
  members,
  onNavigate,
}: ClubActivationPanelsProps) {
  const warHasScore =
    !!activeWar &&
    ((activeWar.challenger_xp ?? 0) > 0 || (activeWar.defender_xp ?? 0) > 0);
  const xpProgress = Math.min(club.total_xp || 10, 100);

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="dashboard-card">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="eyebrow-badge border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
                <Zap className="h-4 w-4 text-cyan-300" />
                Club momentum
              </div>
              <h2 className="mt-4 font-display text-2xl font-black text-white">
                Activation cockpit
              </h2>
            </div>
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-right">
              <div className="font-display text-2xl font-black text-cyan-200">
                {club.total_xp || 0}/100
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Club XP
              </div>
            </div>
          </div>

          <div className="mb-6 h-3 overflow-hidden rounded-full border border-cyan-300/15 bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-orange-300 shadow-[0_0_18px_rgba(34,211,238,0.55)]"
              style={{ width: `${xpProgress}%` }}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard icon={Radio} label="Live calls" value={club.total_predictions} />
            <MetricCard icon={Trophy} label="Wins" value={club.total_wins} />
            <MetricCard icon={Eye} label="Read rate" value={`${callAccuracy}%`} />
          </div>

          <Button
            className="mt-6 h-12 w-full justify-center gap-3 rounded-[1rem] bg-cyan-300 font-display font-black text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.35)] hover:bg-cyan-200"
            onClick={() => onNavigate("/live-calls")}
          >
            Schedule daily ritual
            <ArrowRight className="h-4 w-4" />
          </Button>
        </section>

        {warHasScore && activeWar ? (
          <ActiveWarPanel activeWar={activeWar} club={club} members={members} />
        ) : (
          <PrimingWarPanel membersCount={members.length} onNavigate={onNavigate} />
        )}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <LiveRitualPanel onNavigate={onNavigate} />
        <MemberActivationPanel membersCount={members.length} onNavigate={onNavigate} />
      </div>

      <ClubDetailTrustStrip />
    </>
  );
}

/**
 * Renders a compact cockpit KPI card for the club detail command center.
 */
function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Radio;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-[1.15rem] border border-white/10 bg-white/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </span>
        <Icon className="h-5 w-5 text-cyan-300" />
      </div>
      <div className="mt-3 font-display text-2xl font-black text-white">
        {value}
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-1/2 rounded-full bg-cyan-300" />
      </div>
    </div>
  );
}

/**
 * Presents a live rivalry as a readable pressure card without exposing raw
 * backend internals to the page layout.
 */
function ActiveWarPanel({
  activeWar,
  club,
  members,
}: {
  activeWar: ActiveWar;
  club: Club;
  members: ClubMember[];
}) {
  const total = activeWar.challenger_xp + activeWar.defender_xp;
  const pressure = total > 0 ? Math.round((activeWar.challenger_xp / total) * 100) : 50;

  return (
    <section className="dashboard-card border-orange-300/25">
      <div className="eyebrow-badge border-orange-300/25 bg-orange-500/10 text-orange-200">
        <Flame className="h-4 w-4 text-orange-300" />
        Active rivalry
      </div>
      <h2 className="mt-5 font-display text-3xl font-black text-white">
        {club.name} is creating territory pressure.
      </h2>
      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-[1.35rem] border border-white/10 bg-black/25 p-4 text-center">
        <ScoreSide label="Your club" score={activeWar.challenger_xp} tone="text-cyan-300" />
        <div className="font-display text-2xl font-black text-orange-200">VS</div>
        <ScoreSide label="Rival" score={activeWar.defender_xp} tone="text-orange-300" />
      </div>
      <div className="mb-2 mt-5 flex items-center justify-between text-sm font-bold text-slate-300">
        <span>Territory pressure</span>
        <span className="text-orange-100">{pressure}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-orange-300 to-orange-500 shadow-[0_0_18px_rgba(249,115,22,0.45)]"
          style={{ width: `${pressure}%` }}
        />
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-300">
        {members.length} members are attached to this command center. Use live
        calls to turn passive attention into visible momentum.
      </p>
    </section>
  );
}

/**
 * Displays one side of the active rivalry score card.
 */
function ScoreSide({
  label,
  score,
  tone,
}: {
  label: string;
  score: number;
  tone: string;
}) {
  return (
    <div>
      <Shield className={`mx-auto h-8 w-8 ${tone}`} />
      <div className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 font-display text-2xl font-black text-white">
        {score.toLocaleString()}
      </div>
    </div>
  );
}

/**
 * Shows the pre-war state as an exciting warm-up instead of a dead empty card.
 */
function PrimingWarPanel({
  membersCount,
  onNavigate,
}: {
  membersCount: number;
  onNavigate: (href: string) => void;
}) {
  return (
    <section className="section-shell overflow-hidden">
      <div className="relative rounded-[1.6rem] border border-rose-400/20 bg-gradient-to-br from-rose-500/12 via-slate-950/80 to-cyan-500/10 p-5">
        <div className="absolute right-4 top-4 h-24 w-24 rounded-full bg-rose-400/15 blur-3xl" />
        <div className="relative">
          <div className="eyebrow-badge border-rose-400/20 bg-rose-400/10 text-rose-200">
            <Flame className="h-4 w-4 text-rose-300" />
            War room warming up
          </div>
          <h2 className="mt-6 font-display text-3xl font-black text-white">
            Your first rivalry is ready to become the hook.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Pick a front, rally members, and create the first visible push.
          </p>

          <TerritoryNetworkPreview />

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <SmallStat label="Members" value={membersCount} />
            <SmallStat label="Status" value="Priming" />
            <SmallStat label="Next move" value="Live call" />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => onNavigate("/live-calls")}>
              Rally first members
              <Radio className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => onNavigate("/war-map")}>
              Scout the map
              <Map className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Renders a compact label/value stat used in warm-up panels.
 */
function SmallStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 font-display text-lg font-black text-cyan-200">
        {value}
      </div>
    </div>
  );
}

/**
 * Shows the live ritual empty state as an actionable retention loop.
 */
function LiveRitualPanel({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <section className="dashboard-card border-blue-300/20">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <div className="eyebrow-badge border-blue-300/25 bg-blue-400/10 text-blue-200">
            <CalendarDays className="h-4 w-4 text-blue-300" />
            Live ritual
          </div>
          <h2 className="mt-4 font-display text-2xl font-black text-white">
            No live call scheduled yet
          </h2>
        </div>
        <Radio className="h-8 w-8 text-cyan-300" />
      </div>
      <p className="text-sm leading-6 text-slate-300">
        Plan the first community gathering and turn passive members into a
        daily return habit.
      </p>
      <Button
        className="mt-5 h-12 w-full justify-center gap-3 rounded-[1rem] bg-cyan-300 font-display font-black text-slate-950 hover:bg-cyan-200"
        onClick={() => onNavigate("/live-calls")}
      >
        Schedule daily ritual
        <ArrowRight className="h-4 w-4" />
      </Button>
    </section>
  );
}

/**
 * Frames member invitation as an unlockable club pulse loop.
 */
function MemberActivationPanel({
  membersCount,
  onNavigate,
}: {
  membersCount: number;
  onNavigate: (href: string) => void;
}) {
  return (
    <section className="dashboard-card border-orange-300/20">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <div className="eyebrow-badge border-orange-300/25 bg-orange-500/10 text-orange-200">
            <Users className="h-4 w-4 text-orange-300" />
            Member activation
          </div>
          <h2 className="mt-4 font-display text-2xl font-black text-white">
            Invite 5 members to unlock Club Pulse
          </h2>
        </div>
        <div className="rounded-2xl border border-orange-300/25 bg-orange-500/12 px-4 py-3 text-right">
          <div className="font-display text-2xl font-black text-orange-200">
            {Math.min(membersCount, 5)} / 5
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Founding crew
          </div>
        </div>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-300 to-cyan-300 shadow-[0_0_18px_rgba(249,115,22,0.45)]"
          style={{ width: `${Math.min(Math.max(membersCount * 20, 12), 100)}%` }}
        />
      </div>
      <Button
        className="mt-5 h-12 w-full justify-center gap-3 rounded-[1rem] border-orange-300/35 bg-orange-500/10 font-display font-black text-orange-100 hover:bg-orange-500/18"
        variant="outline"
        onClick={() => onNavigate("/clubs")}
      >
        Invite members
        <ArrowRight className="h-4 w-4" />
      </Button>
    </section>
  );
}
