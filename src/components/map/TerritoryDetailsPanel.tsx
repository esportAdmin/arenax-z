"use client";

import { Crown, LockKeyhole, Shield, Sparkles, Swords, Zap } from "lucide-react";

import { CountdownPill } from "@/components/engagement/CountdownPill";
import { Button } from "@/components/ui/button";
import { Territory } from "@/hooks/useGlobalWarMap";
import { getHoursFromNow } from "@/lib/countdown";

interface Props {
  territory: Territory | null;
  clubId?: string;
  canAttack?: boolean;
  onInvade?: (territory: Territory) => void;
}

export function TerritoryDetailsPanel({
  territory,
  clubId,
  canAttack,
  onInvade,
}: Props) {
  if (!territory) {
    return (
      <div className="relative overflow-hidden rounded-[1.85rem] border border-cyan-300/18 bg-white/[0.045] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-300/12 blur-3xl" />
        <div className="eyebrow-badge">Territory selection</div>
        <div className="mt-4 text-xl font-display font-bold text-white">
          Select a territory on the map
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          The right panel should immediately explain why this ground matters and
          what action the player can take next.
        </p>
      </div>
    );
  }

  const controlledByMe =
    territory.controlling_club_id &&
    clubId &&
    territory.controlling_club_id === clubId;

  return (
    <div className="relative overflow-hidden rounded-[1.85rem] border border-cyan-300/18 bg-[linear-gradient(145deg,rgba(15,23,42,0.82),rgba(6,12,26,0.9)_52%,rgba(43,20,10,0.52))] p-6 shadow-[0_0_48px_rgba(34,211,238,0.08),inset_0_1px_0_rgba(255,255,255,0.07)]">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-orange-400/12 blur-3xl" />
      <div className="eyebrow-badge">Territory command</div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-2xl font-display font-bold text-white">
            {territory.name}
          </div>
          <div className="mt-1 text-sm text-slate-400">
            {territory.region || "Unknown region"}
          </div>
        </div>
        <CountdownPill label="War pulse" target={getHoursFromNow(3)} tone="rose" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        <div className="rounded-[1.25rem] border border-amber-400/18 bg-amber-400/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
            Controller
          </div>
          <div className="mt-2 flex items-center gap-2 text-lg font-bold text-white">
            <Crown className="h-4 w-4 text-amber-300" />
            {territory.controlling_club?.name || "Unclaimed"}
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-cyan-400/18 bg-cyan-400/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
            XP bonus
          </div>
          <div className="mt-2 flex items-center gap-2 text-lg font-bold text-white">
            <Zap className="h-4 w-4 text-primary" />
            +{territory.xp_bonus}
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-emerald-400/18 bg-emerald-400/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
            Prestige value
          </div>
          <div className="mt-2 flex items-center gap-2 text-lg font-bold text-white">
            <Shield className="h-4 w-4 text-emerald-300" />
            +{territory.prestige_bonus}
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
            Locked tier
          </div>
          <div className="mt-2 flex items-center gap-2 text-lg font-bold text-white">
            <LockKeyhole className="h-4 w-4 text-slate-200" />
            Signature territory aura
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-black/24 p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
          <p className="text-sm leading-6 text-slate-300">
            This panel should make the territory feel consequential. The player
            needs to understand the reward, the owner, and the next pressure
            window immediately.
          </p>
        </div>
      </div>

      {!controlledByMe && canAttack && onInvade ? (
        <Button
          onClick={() => onInvade(territory)}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-4 text-center text-[0.82rem] font-black uppercase leading-tight tracking-[0.1em] text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.25)] hover:bg-cyan-200"
        >
          Start pressure window
          <Swords className="h-4 w-4" />
        </Button>
      ) : (
        <Button variant="outline" className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border-cyan-300/25 bg-cyan-300/5 px-4 text-center text-[0.82rem] font-black uppercase leading-tight tracking-[0.1em] text-cyan-100" disabled>
          Territory under your banner
          <Shield className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
