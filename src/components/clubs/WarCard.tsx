"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Clock, Flame, Shield, Swords, Trophy } from "lucide-react";

import type { ActiveWar } from "@/hooks/useClubDetail";
import type { ClubMember } from "@/hooks/useClubs";

interface Props {
  war: ActiveWar;
  clubId: string;
  members: ClubMember[];
}

type Flash = "green" | "orange" | null;
type Momentum = "up" | "down" | null;

function getContributorName(member: ClubMember, index: number) {
  return (
    member.profile?.display_name ||
    member.profile?.username ||
    `Member ${index + 1}`
  );
}

export function WarCard({ war, clubId, members }: Props) {
  const isChallenger = war.challenger_id === clubId;
  const myScore = isChallenger ? war.challenger_xp : war.defender_xp;
  const opponentScore = isChallenger ? war.defender_xp : war.challenger_xp;
  const diff = myScore - opponentScore;
  const previousDiff = useRef<number | null>(null);

  const [flash, setFlash] = useState<Flash>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [momentum, setMomentum] = useState<Momentum>(null);
  const [nowTick, setNowTick] = useState(0);

  useEffect(() => {
    if (previousDiff.current === null) {
      previousDiff.current = diff;
      return;
    }

    const oldDiff = previousDiff.current;

    if (oldDiff <= 0 && diff > 0) {
      setFlash("green");
      setMessage("You just took the lead.");
      setMomentum("up");
      previousDiff.current = diff;
      return;
    }

    if (oldDiff > 0 && diff <= 0) {
      setFlash("orange");
      setMessage("Your rival is pulling ahead.");
      setMomentum("down");
      previousDiff.current = diff;
      return;
    }

    if (diff > oldDiff) {
      setFlash("green");
      setMomentum("up");
      setMessage(diff <= 0 ? "Closing the gap." : "Extending the lead.");
    } else if (diff < oldDiff) {
      setFlash("orange");
      setMomentum("down");
      setMessage(diff >= 0 ? "Rival pressure is rising." : "Falling further behind.");
    }

    previousDiff.current = diff;
  }, [diff]);

  useEffect(() => {
    if (!flash && !momentum && !message) return;

    const timeout = setTimeout(() => {
      setFlash(null);
      setMessage(null);
      setMomentum(null);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [flash, momentum, message]);

  useEffect(() => {
    const interval = setInterval(() => setNowTick((value) => value + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  const timeSinceStart = useMemo(() => {
    void nowTick;
    const start = new Date(war.created_at).getTime();
    const elapsed = Date.now() - start;
    const hours = Math.max(0, Math.floor(elapsed / (1000 * 60 * 60)));
    const minutes = Math.max(0, Math.floor((elapsed / (1000 * 60)) % 60));

    return `${hours}h ${minutes}m`;
  }, [nowTick, war.created_at]);

  const progress =
    myScore + opponentScore === 0
      ? 50
      : (myScore / (myScore + opponentScore)) * 100;
  const myShare = Math.round(progress);
  const opponentShare = 100 - myShare;

  const topContributors = useMemo(() => {
    return [...members]
      .sort((a, b) => (b.xp_contributed ?? 0) - (a.xp_contributed ?? 0))
      .slice(0, 5);
  }, [members]);

  return (
    <div
      className={`relative mb-6 overflow-hidden rounded-[2rem] border p-5 shadow-[0_0_48px_rgba(249,115,22,0.08)] transition-all duration-300 sm:p-6 ${
        flash === "green"
          ? "border-emerald-400/45 bg-emerald-500/12"
          : flash === "orange"
            ? "border-orange-400/50 bg-orange-500/12"
            : "border-orange-300/25 bg-gradient-to-br from-orange-500/12 via-slate-950/80 to-cyan-500/10"
      }`}
    >
      <div className="pointer-events-none absolute right-[-4rem] top-[-4rem] h-48 w-48 rounded-full bg-orange-400/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-5rem] left-[-5rem] h-52 w-52 rounded-full bg-cyan-300/10 blur-3xl" />

      <div className="relative">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-300/25 bg-orange-500/10 px-3 py-1 text-[0.72rem] font-black uppercase tracking-[0.18em] text-orange-100">
            <Swords className="h-4 w-4" />
            War active
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm font-bold text-slate-300">
            <Clock className="h-4 w-4 text-cyan-300" />
            {timeSinceStart}
          </div>
        </div>

        {message ? (
          <div className="mb-4 animate-pulse rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-center font-bold text-white">
            {message}
          </div>
        ) : null}

        <div className="mb-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-[1.35rem] border border-white/10 bg-black/25 p-4 text-center">
          <div>
            <Shield className="mx-auto h-8 w-8 text-cyan-300" />
            <div className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-500">
              Your club
            </div>
            <div className="mt-1 font-display text-2xl font-black text-white">
              {myScore.toLocaleString()}
            </div>
          </div>

          <div className="font-display text-2xl font-black text-orange-200">
            VS
          </div>

          <div>
            <Shield className="mx-auto h-8 w-8 text-orange-300" />
            <div className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-500">
              Rival
            </div>
            <div className="mt-1 font-display text-2xl font-black text-white">
              {opponentScore.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mb-2 flex items-center justify-between text-sm font-bold text-slate-300">
          <span>Territory pressure</span>
          <span className="text-orange-100">
            {myShare}% / {opponentShare}%
          </span>
        </div>

        <div className="mb-5 h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-orange-300 to-orange-500 shadow-[0_0_18px_rgba(249,115,22,0.45)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mb-5 flex flex-wrap justify-center gap-2">
          {momentum === "up" ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-sm font-bold text-emerald-200">
              <Flame className="h-4 w-4 animate-bounce" />
              Momentum rising
            </div>
          ) : null}

          {momentum === "down" ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/25 bg-orange-400/10 px-3 py-1 text-sm font-bold text-orange-200">
              <Flame className="h-4 w-4 animate-bounce" />
              Rival pressure rising
            </div>
          ) : null}
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2 font-bold text-white">
            <Trophy className="h-4 w-4 text-yellow-300" />
            Top Contributors
          </div>

          <div className="space-y-2">
            {topContributors.length > 0 ? (
              topContributors.map((member, index) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2 text-sm"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-xs font-black text-cyan-100">
                      {index + 1}
                    </span>
                    <span className="truncate font-bold text-slate-200">
                      {getContributorName(member, index)}
                    </span>
                  </div>
                  <span className="shrink-0 font-black text-cyan-100">
                    {member.xp_contributed.toLocaleString()} XP
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">
                No contributors yet. Start a live call to create the first
                visible push.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
