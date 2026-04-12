"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import { Swords, Clock, Flame, Trophy } from "lucide-react";
import type { ActiveWar } from "@/hooks/useClubDetail";
import type { ClubMember } from "@/hooks/useClubs";

interface Props {
  war: ActiveWar;
  clubId: string;
  members: ClubMember[];
}

type Flash = "green" | "red" | null;
type Momentum = "up" | "down" | null;

export function WarCard({ war, clubId, members }: Props) {
  const isChallenger = war.challenger_id === clubId;

  const myScore = isChallenger ? war.challenger_xp : war.defender_xp;
  const opponentScore = isChallenger ? war.defender_xp : war.challenger_xp;

  const diff = myScore - opponentScore;

  const previousDiff = useRef<number | null>(null);

  const [flash, setFlash] = useState<Flash>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [momentum, setMomentum] = useState<Momentum>(null);

  // ---------------------------
  // LEAD + MOMENTUM + MESSAGES
  // ---------------------------
  useEffect(() => {
    if (previousDiff.current === null) {
      previousDiff.current = diff;
      return;
    }

    const oldDiff = previousDiff.current;

    // Lead flip (ton "moment WOW")
    if (oldDiff <= 0 && diff > 0) {
      setFlash("green");
      setMessage("🔥 You just took the lead!");
      setMomentum("up");
      previousDiff.current = diff;
      return;
    }

    if (oldDiff > 0 && diff <= 0) {
      setFlash("red");
      setMessage("⚠️ You're falling behind!");
      setMomentum("down");
      previousDiff.current = diff;
      return;
    }

    // Sinon: on anime aussi à chaque variation (plus “vivant”)
    if (diff > oldDiff) {
      setFlash("green");
      setMomentum("up");
      // Si tu es toujours derrière, on le dit
      if (diff <= 0) setMessage("🟢 Closing the gap!");
      else setMessage("🟢 Extending the lead!");
    } else if (diff < oldDiff) {
      setFlash("red");
      setMomentum("down");
      if (diff >= 0) setMessage("🔴 Losing ground!");
      else setMessage("🔴 Falling further behind!");
    }

    previousDiff.current = diff;
  }, [diff]);

  // Reset anim (3s demandé)
  useEffect(() => {
    if (!flash && !momentum && !message) return;

    const t = setTimeout(() => {
      setFlash(null);
      setMessage(null);
      setMomentum(null);
    }, 3000);

    return () => clearTimeout(t);
  }, [flash, momentum, message]);

  // ---------------------------
  // TIMER (auto-update toutes les 30s)
  // ---------------------------
  const [nowTick, setNowTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setNowTick((v) => v + 1), 30_000);
    return () => clearInterval(i);
  }, []);

  const timeSinceStart = useMemo(() => {
    void nowTick; // force recalcul
    const start = new Date(war.created_at).getTime();
    const now = Date.now();
    const diffTime = now - start;

    const hours = Math.floor(diffTime / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime / (1000 * 60)) % 60);

    return `${hours}h ${minutes}m`;
  }, [war.created_at, nowTick]);

  const progress =
    myScore + opponentScore === 0
      ? 50
      : (myScore / (myScore + opponentScore)) * 100;

  // ---------------------------
  // TOP CONTRIBUTORS
  // ---------------------------
  const topContributors = useMemo(() => {
    return [...members]
      .sort((a, b) => (b.xp_contributed ?? 0) - (a.xp_contributed ?? 0))
      .slice(0, 5);
  }, [members]);

  return (
    <div
      className={`rounded-xl p-6 mb-6 transition-all duration-300 border ${
        flash === "green"
          ? "bg-emerald-500/15 border-emerald-500/50"
          : flash === "red"
            ? "bg-red-500/15 border-red-500/50"
            : "bg-gradient-to-br from-red-600/10 to-orange-500/10 border-red-500/30"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-red-400 font-bold">
          <Swords className="w-5 h-5" />
          WAR ACTIVE
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          {timeSinceStart}
        </div>
      </div>

      {/* MESSAGE */}
      {message && (
        <div className="text-center font-bold mb-3 animate-pulse">
          {message}
        </div>
      )}

      {/* MOMENTUM */}
      {momentum === "up" && (
        <div className="text-center text-emerald-400 mb-2 flex justify-center gap-1">
          <Flame className="w-4 h-4 animate-bounce" />
          Momentum rising!
        </div>
      )}

      {momentum === "down" && (
        <div className="text-center text-red-400 mb-2 flex justify-center gap-1">
          <Flame className="w-4 h-4 animate-bounce" />
          Enemy gaining momentum!
        </div>
      )}

      {/* SCORE */}
      <div className="flex justify-between items-center text-xl font-bold mb-3">
        <span>{myScore}</span>
        <span className="text-muted-foreground">vs</span>
        <span>{opponentScore}</span>
      </div>

      <div className="h-3 bg-muted rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-red-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* TOP CONTRIBUTORS */}
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-3 font-bold">
          <Trophy className="w-4 h-4 text-yellow-400" />
          Top Contributors
        </div>

        {topContributors.map((member, index) => (
          <div key={member.id} className="flex justify-between text-sm py-1">
            <span>
              #{index + 1} {member.user_id.slice(0, 6)}
            </span>
            <span className="font-semibold">{member.xp_contributed} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
}
