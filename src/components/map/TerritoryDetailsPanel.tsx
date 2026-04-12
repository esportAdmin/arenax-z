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
      <div className="section-shell">
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
    <div className="section-shell overflow-hidden">
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

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        <div className="surface-panel border-amber-400/15 bg-amber-400/8 p-4">
          <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
            Controller
          </div>
          <div className="mt-2 flex items-center gap-2 text-lg font-bold text-white">
            <Crown className="h-4 w-4 text-amber-300" />
            {territory.controlling_club?.name || "Unclaimed"}
          </div>
        </div>

        <div className="surface-panel border-cyan-400/15 bg-cyan-400/8 p-4">
          <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
            XP bonus
          </div>
          <div className="mt-2 flex items-center gap-2 text-lg font-bold text-white">
            <Zap className="h-4 w-4 text-primary" />
            +{territory.xp_bonus}
          </div>
        </div>

        <div className="surface-panel border-emerald-400/15 bg-emerald-400/8 p-4">
          <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
            Prestige value
          </div>
          <div className="mt-2 flex items-center gap-2 text-lg font-bold text-white">
            <Shield className="h-4 w-4 text-emerald-300" />
            +{territory.prestige_bonus}
          </div>
        </div>

        <div className="surface-panel border-white/10 bg-white/5 p-4">
          <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
            Locked tier
          </div>
          <div className="mt-2 flex items-center gap-2 text-lg font-bold text-white">
            <LockKeyhole className="h-4 w-4 text-slate-200" />
            Signature territory aura
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
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
          className="mt-4 w-full justify-between"
        >
          Invade territory
          <Swords className="h-4 w-4" />
        </Button>
      ) : (
        <Button variant="outline" className="mt-4 w-full justify-between" disabled>
          Territory under your banner
          <Shield className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
