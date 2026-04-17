"use client";

import {
  Loader2,
  Map,
  Radio,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Club, ClubMember } from "@/hooks/useClubDetail";

interface ClubDetailHeroProps {
  club: Club;
  creatingWar: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  joining: boolean;
  myMembership: ClubMember | null;
  onCreateWar: () => void;
  onJoin: () => void;
  onNavigate: (href: string) => void;
}

/**
 * Rebuilds the club detail hero as a premium command-center header with a
 * strong crest, status chips, and clear first-action CTAs.
 */
export function ClubDetailHero({
  club,
  creatingWar,
  isAdmin,
  isAuthenticated,
  joining,
  myMembership,
  onCreateWar,
  onJoin,
  onNavigate,
}: ClubDetailHeroProps) {
  const titleInitial = club.name.charAt(0).toUpperCase();
  const membershipLabel = isAdmin ? "Founder controls" : "Community access";

  return (
    <section className="command-frame hero-sheen relative mb-6 overflow-hidden border-cyan-300/20 p-5 shadow-[0_0_70px_rgba(34,211,238,0.12)] sm:p-7 lg:p-9">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(250,204,21,0.1),transparent_30%)]" />
      <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-[70px]" />

      <div className="relative flex flex-col items-center gap-7 text-center lg:flex-row lg:text-left">
        <div className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/8 shadow-[0_0_60px_rgba(34,211,238,0.28)] sm:h-44 sm:w-44">
          <div className="absolute inset-3 rounded-full border border-cyan-300/20" />
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_140deg,rgba(34,211,238,0.35),rgba(139,92,246,0.28),rgba(250,204,21,0.22),rgba(34,211,238,0.35))] opacity-80 blur-[1px]" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-slate-950 font-display text-5xl font-black text-cyan-200 sm:h-32 sm:w-32 sm:text-6xl">
            {titleInitial}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap justify-center gap-2 lg:justify-start">
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300">
              Online
            </span>
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-200">
              New Club
            </span>
            <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-violet-200">
              {membershipLabel}
            </span>
          </div>

          <h1 className="break-words font-display text-4xl font-black leading-tight text-white md:text-5xl xl:text-6xl">
            {club.name}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300 lg:mx-0">
            {club.description ||
              "Your community command center is live. Rally the first members, create the first live call, and turn this fresh club into a daily return ritual."}
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <Button
              className="min-h-12 justify-center gap-3 rounded-[1rem] bg-cyan-300 px-4 py-3 text-center text-xs font-black leading-tight tracking-[0.08em] text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.48)] hover:bg-cyan-200 sm:text-sm"
              onClick={() => onNavigate("/live-calls")}
            >
              <Radio className="h-4 w-4" />
              Create first live call
            </Button>

            <Button
              variant="outline"
              className="min-h-12 justify-center gap-3 rounded-[1rem] border-blue-300/40 bg-blue-500/10 px-4 py-3 text-center text-xs font-black leading-tight tracking-[0.08em] text-blue-100 shadow-[0_0_24px_rgba(59,130,246,0.18)] hover:bg-blue-400/15 sm:text-sm"
              onClick={() => onNavigate("/war-map")}
            >
              <Map className="h-4 w-4" />
              Open war room
            </Button>

            <Button
              className="min-h-12 justify-center gap-3 rounded-[1rem] border border-orange-300/45 bg-orange-500/14 px-4 py-3 text-center text-xs font-black leading-tight tracking-[0.08em] text-orange-100 shadow-[0_0_24px_rgba(249,115,22,0.22)] hover:bg-orange-500/22 sm:text-sm"
              disabled={isAdmin ? creatingWar : false}
              onClick={isAdmin ? onCreateWar : () => onNavigate("/clubs")}
            >
              {creatingWar ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              {isAdmin ? "Start first war" : "Invite members"}
            </Button>
          </div>

          {isAuthenticated && !myMembership ? (
            <Button
              className="mt-3 min-h-12 w-full justify-center gap-3 rounded-[1rem] px-5 py-3 text-center text-sm font-black"
              disabled={joining}
              onClick={onJoin}
            >
              {joining ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
              Request club access
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
