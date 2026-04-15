"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Crown,
  Eye,
  Flame,
  Zap,
  Map,
  Radio,
  Shield,
  Trophy,
  UserPlus,
  Loader2,
  Swords,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useClubDetail } from "@/hooks/useClubDetail";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WarCard } from "@/components/clubs/WarCard";

interface Props {
  slug: string;
}

export default function ClubDetail({ slug }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const { club, members, myMembership, activeWar, loading, refresh } =
    useClubDetail(slug);

  const [joining, setJoining] = useState(false);
  const [creatingWar, setCreatingWar] = useState(false);

  /* =========================
     ADMIN CHECK (SAFE)
  ========================= */

  const isAdmin =
    myMembership?.role === "owner" || myMembership?.role === "admin";

  /* =========================
     DEBUG LOGS
  ========================= */

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    console.log("USER:", user?.id);
    console.log("MY MEMBERSHIP:", myMembership);
    console.log("IS ADMIN:", isAdmin);
  }, [user, myMembership, isAdmin]);

  /* =========================
     ACCURACY
  ========================= */

  const callAccuracy = useMemo(() => {
    if (!club) return 0;
    if (club.total_predictions <= 0) return 0;
    return Math.round((club.total_wins / club.total_predictions) * 100);
  }, [club]);

  const warHasScore =
    !!activeWar &&
    ((activeWar.challenger_xp ?? 0) > 0 || (activeWar.defender_xp ?? 0) > 0);

  const statCards = [
    {
      label: "Club XP",
      value: `${club?.total_xp?.toLocaleString() || "0"} / 100`,
      icon: Zap,
      tone: "text-cyan-300",
      bar: 10,
    },
    {
      label: "Live calls",
      value: club?.total_predictions ?? 0,
      icon: Radio,
      tone: "text-blue-300",
      bar: 6,
    },
    {
      label: "Wins",
      value: club?.total_wins ?? 0,
      icon: Trophy,
      tone: "text-amber-300",
      bar: 4,
    },
    {
      label: "Read rate",
      value: `${callAccuracy}%`,
      icon: Eye,
      tone: "text-emerald-300",
      bar: Math.max(callAccuracy, 7),
    },
  ];

  /* =========================
     JOIN CLUB
  ========================= */

  const handleJoin = async () => {
    if (!club) return;

    setJoining(true);

    const { data, error } = await (supabase as any).rpc("create_join_request", {
      p_club_id: club.id,
      p_message: null,
    });

    setJoining(false);

    if (error || !data?.success) {
      toast({
        title: "Error",
        description: error?.message || data?.error || "Unknown error",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Request sent",
      description: "Your join request has been sent.",
    });

    refresh();
  };

  /* =========================
     CREATE WAR
  ========================= */

  const handleCreateWar = async () => {
    if (!club) return;

    setCreatingWar(true);

    try {
      const res = await fetch("/api/wars/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubId: club.id }),
      });

      const data = await res.json();

      if (!data.success) {
        toast({
          title: "War creation failed",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "⚔️ War started!",
        description: "Your club is now in battle.",
      });

      refresh();
    } catch {
      toast({
        title: "Error",
        description: "Unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setCreatingWar(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 text-center">
          <h2>Club not found</h2>
        </main>
        <Footer />
      </div>
    );
  }

  /* =========================
     PAGE
  ========================= */

  return (
    <div className="min-h-screen bg-background text-white">
      <Navbar />

      <main className="relative overflow-hidden pb-16 pt-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(34,211,238,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.35)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="absolute left-[-12rem] top-20 h-[32rem] w-[32rem] rounded-full bg-cyan-500/10 blur-[150px]" />
          <div className="absolute right-[-10rem] top-48 h-[30rem] w-[30rem] rounded-full bg-blue-500/10 blur-[150px]" />
          <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-amber-500/8 blur-[140px]" />
        </div>

        <div className="container-arena relative z-10">
          <Button
            variant="ghost"
            className="mb-6 gap-2"
            onClick={() => router.push("/clubs")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to clubs
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="command-frame hero-sheen relative mb-5 overflow-hidden p-5 sm:p-7 lg:p-9"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(250,204,21,0.1),transparent_30%)]" />
            <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-[70px]" />

            <div className="relative flex flex-col items-center gap-7 text-center lg:flex-row lg:text-left">
              <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/8 shadow-[0_0_55px_rgba(34,211,238,0.25)] sm:h-36 sm:w-36">
                <div className="absolute inset-3 rounded-full border border-cyan-300/20" />
                <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_140deg,rgba(34,211,238,0.35),rgba(139,92,246,0.28),rgba(250,204,21,0.22),rgba(34,211,238,0.35))] opacity-80 blur-[1px]" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-slate-950 text-5xl font-display font-black text-cyan-200 sm:h-28 sm:w-28">
                  {club.name.charAt(0).toUpperCase()}
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
                    {isAdmin ? "Founder controls" : "Community access"}
                  </span>
                </div>

                <h1 className="text-balance text-4xl font-display font-black leading-tight text-white md:text-5xl">
                  {club.name}
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300 lg:mx-0">
                  {club.description ||
                    "Your community command center is live. Rally the first members, create the first live call, and turn this fresh club into a daily return ritual."}
                </p>

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap lg:justify-start">
                  <Button
                    className="h-12 justify-center gap-3 rounded-full bg-cyan-300 px-6 font-bold text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.45)] hover:bg-cyan-200"
                    onClick={() => router.push("/live-calls")}
                  >
                    Create first live call
                    <Radio className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="h-12 justify-center gap-3 rounded-full border-cyan-300/35 px-6 text-cyan-100 hover:bg-cyan-300/10"
                    onClick={() => router.push("/war-map")}
                  >
                    Open war map
                    <Map className="h-4 w-4" />
                  </Button>

                  {isAdmin && !activeWar ? (
                    <Button
                      onClick={handleCreateWar}
                      disabled={creatingWar}
                      className="h-12 justify-center gap-3 rounded-full border border-amber-300/45 bg-amber-400/14 px-6 font-bold text-amber-100 shadow-[0_0_24px_rgba(250,204,21,0.18)] hover:bg-amber-400/22"
                    >
                      {creatingWar ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Swords className="h-4 w-4" />
                      )}
                      Start first war
                    </Button>
                  ) : null}

                  {user && !myMembership ? (
                    <Button
                      onClick={handleJoin}
                      disabled={joining}
                      className="h-12 justify-center gap-3 rounded-full px-6"
                    >
                      {joining ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserPlus className="h-4 w-4" />
                      )}
                      Join club
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {statCards.map(({ label, value, icon: Icon, tone, bar }) => (
              <div
                key={label}
                className="group relative overflow-hidden rounded-[1.35rem] border border-cyan-300/18 bg-white/[0.055] p-5 shadow-[0_0_28px_rgba(34,211,238,0.08),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur transition-all hover:-translate-y-1 hover:border-cyan-300/35 hover:bg-cyan-300/8"
              >
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-300/10 blur-2xl transition-opacity group-hover:opacity-100" />
                <div className="relative flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    {label}
                  </span>
                  <Icon className={`h-6 w-6 ${tone}`} />
                </div>
                <div className="relative mt-5 text-3xl font-display font-black text-white">
                  {value}
                </div>
                <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 shadow-[0_0_18px_rgba(34,211,238,0.55)]"
                    style={{ width: `${Math.min(bar, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="section-shell"
            >
              <div className="eyebrow-badge">
                <Crown className="h-4 w-4 text-amber-300" />
                Launch sequence
              </div>

              <h2 className="mt-5 text-2xl font-display font-black text-white">
                Turn this new club into a habit loop
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                A blank club should still feel alive. Use these first actions
                to create momentum before members arrive.
              </p>

              <div className="relative mt-7 space-y-0 pl-7 before:absolute before:left-[0.9rem] before:top-3 before:h-[calc(100%-1.5rem)] before:w-px before:bg-gradient-to-b before:from-amber-300 before:via-cyan-300 before:to-white/15">
                {[
                  {
                    icon: Radio,
                    title: "Run the first live call",
                    body: "Give members one obvious ritual to join today.",
                    action: "Open live calls",
                    onClick: () => router.push("/live-calls"),
                  },
                  {
                    icon: Shield,
                    title: "Pick a territory story",
                    body: "Use the map as the visible reason to come back.",
                    action: "Open war map",
                    onClick: () => router.push("/war-map"),
                  },
                  {
                    icon: Trophy,
                    title: "Create prestige pressure",
                    body: "Show rankings and rewards before the first push.",
                    action: "Preview leaderboard",
                    onClick: () => router.push("/leaderboard"),
                  },
                ].map(({ icon: Icon, title, body, action, onClick }, index) => (
                  <button
                    key={title}
                    type="button"
                    onClick={onClick}
                    className="group relative mb-4 flex w-full items-center gap-4 rounded-[1.25rem] border border-white/10 bg-white/[0.045] p-4 text-left transition-all hover:border-cyan-300/25 hover:bg-cyan-300/8"
                  >
                    <span className={`absolute -left-[2.05rem] top-5 h-4 w-4 rounded-full border ${index === 0 ? "border-amber-200 bg-amber-300 shadow-[0_0_18px_rgba(250,204,21,0.65)]" : "border-slate-500 bg-slate-700"}`} />
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                        Step 0{index + 1}
                      </div>
                      <div className="mt-1 font-display text-base font-bold text-white">
                        {title}
                      </div>
                      <p className="mt-1 text-sm leading-5 text-slate-400">
                        {body}
                      </p>
                    </div>
                    <div className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-cyan-300 transition-transform group-hover:translate-x-1 sm:flex">
                      {action}
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="space-y-6"
            >
              {activeWar && warHasScore ? (
                <WarCard war={activeWar} clubId={club.id} members={members} />
              ) : (
                <div className="section-shell overflow-hidden">
                  <div className="relative rounded-[1.6rem] border border-rose-400/20 bg-gradient-to-br from-rose-500/12 via-slate-950/80 to-cyan-500/10 p-5">
                    <div className="absolute right-4 top-4 h-24 w-24 rounded-full bg-rose-400/15 blur-3xl" />
                    <div className="relative">
                      <div className="flex items-center justify-between gap-4">
                        <div className="eyebrow-badge border-rose-400/20 bg-rose-400/10 text-rose-200">
                          <Flame className="h-4 w-4 text-rose-300" />
                          War room warming up
                        </div>
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                          No score yet
                        </span>
                      </div>

                      <h2 className="mt-6 text-3xl font-display font-black text-white">
                        Your first rivalry is ready to become the hook.
                      </h2>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                        Instead of showing an empty 0 vs 0 battle, RallyGuild
                        should frame this as the pre-match moment: pick a front,
                        rally members, and create the first visible push.
                      </p>

                      <div className="mt-6 overflow-hidden rounded-[1.35rem] border border-cyan-300/15 bg-black/25 p-3">
                        <svg
                          viewBox="0 0 560 180"
                          className="h-36 w-full text-cyan-300"
                          role="img"
                          aria-label="Global territory network preview"
                        >
                          <defs>
                            <linearGradient id="club-map-line" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="#22d3ee" />
                              <stop offset="100%" stopColor="#facc15" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M24 118 C96 62 136 94 196 68 S318 28 392 84 488 68 536 34"
                            fill="none"
                            stroke="url(#club-map-line)"
                            strokeWidth="3"
                            strokeDasharray="8 10"
                            opacity="0.75"
                          />
                          <path
                            d="M70 136 C130 150 210 124 260 142 S368 158 452 116"
                            fill="none"
                            stroke="#8b5cf6"
                            strokeWidth="2"
                            strokeDasharray="5 9"
                            opacity="0.55"
                          />
                          {([
                            [24, 118, "#22d3ee"],
                            [116, 82, "#22d3ee"],
                            [196, 68, "#facc15"],
                            [302, 38, "#22d3ee"],
                            [392, 84, "#facc15"],
                            [452, 116, "#8b5cf6"],
                            [536, 34, "#facc15"],
                          ] as Array<[number, number, string]>).map(([cx, cy, color]) => (
                            <g key={`${cx}-${cy}`}>
                              <circle cx={cx} cy={cy} r="12" fill={`${color}22`} />
                              <circle cx={cx} cy={cy} r="5" fill={color} />
                            </g>
                          ))}
                        </svg>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                            Members
                          </div>
                          <div className="mt-2 text-2xl font-display font-black text-white">
                            {members.length}
                          </div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                            Status
                          </div>
                          <div className="mt-2 text-lg font-display font-black text-amber-200">
                            Priming
                          </div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                            Next move
                          </div>
                          <div className="mt-2 text-lg font-display font-black text-cyan-200">
                            Live call
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Button
                          className="justify-between gap-3 rounded-full"
                          onClick={() => router.push("/live-calls")}
                        >
                          Rally first members
                          <Radio className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          className="justify-between gap-3 rounded-full"
                          onClick={() => router.push("/war-map")}
                        >
                          Scout the map
                          <Map className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          <div className="mt-6 flex flex-col gap-4 rounded-[1.3rem] border border-cyan-300/18 bg-white/[0.045] px-5 py-4 text-sm text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="mr-3 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                Trust strip
              </span>
              Arena Points are virtual engagement units. No cash value. No
              financial return.
            </div>
            <div className="flex gap-3 text-cyan-200">
              <Shield className="h-5 w-5" />
              <CheckCircle2 className="h-5 w-5" />
              <BadgeCheck className="h-5 w-5" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
