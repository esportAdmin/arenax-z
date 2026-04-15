"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Crown,
  Flame,
  Zap,
  Map,
  Radio,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
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
            className="command-frame hero-sheen relative mb-6 overflow-hidden p-5 sm:p-7 lg:p-8"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(250,204,21,0.1),transparent_30%)]" />
            <div className="relative grid gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="eyebrow-badge">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Club identity launched
                </div>

                <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.8rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-400 via-blue-500 to-amber-300 text-4xl font-display font-black text-slate-950 shadow-[0_0_45px_rgba(34,211,238,0.28)]">
                    {club.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap gap-2">
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                        Online
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-300">
                        {isAdmin ? "Founder controls" : "Community access"}
                      </span>
                    </div>
                    <h1 className="text-balance text-4xl font-display font-black leading-tight text-white md:text-5xl">
                      {club.name}
                    </h1>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                      {club.description ||
                        "A fresh RallyGuild club shell ready for its first live call, first rivalry, and first reason for members to come back tomorrow."}
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    className="justify-between gap-3 rounded-full px-5"
                    onClick={() => router.push("/live-calls")}
                  >
                    Create first live call
                    <Radio className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-between gap-3 rounded-full px-5"
                    onClick={() => router.push("/war-map")}
                  >
                    Open war map
                    <Map className="h-4 w-4" />
                  </Button>

                  {user && !myMembership ? (
                    <Button
                      onClick={handleJoin}
                      disabled={joining}
                      className="justify-between gap-3 rounded-full px-5"
                    >
                      {joining ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserPlus className="h-4 w-4" />
                      )}
                      Join club
                    </Button>
                  ) : null}

                  {isAdmin && !activeWar ? (
                    <Button
                      onClick={handleCreateWar}
                      disabled={creatingWar}
                      className="justify-between gap-3 rounded-full border border-amber-300/30 bg-amber-400/16 px-5 text-amber-100 hover:bg-amber-400/24"
                    >
                      {creatingWar ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Swords className="h-4 w-4" />
                      )}
                      Start first war
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    label: "Club XP",
                    value: club.total_xp?.toLocaleString() || "0",
                    icon: Zap,
                    tone: "text-cyan-300",
                  },
                  {
                    label: "Live calls",
                    value: club.total_predictions,
                    icon: Target,
                    tone: "text-blue-300",
                  },
                  {
                    label: "Wins",
                    value: club.total_wins,
                    icon: Trophy,
                    tone: "text-amber-300",
                  },
                  {
                    label: "Read rate",
                    value: `${callAccuracy}%`,
                    icon: TrendingUp,
                    tone: "text-emerald-300",
                  },
                ].map(({ label, value, icon: Icon, tone }) => (
                  <div
                    key={label}
                    className="rounded-[1.35rem] border border-white/10 bg-white/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        {label}
                      </span>
                      <Icon className={`h-4 w-4 ${tone}`} />
                    </div>
                    <div className="mt-4 text-3xl font-display font-black text-white">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
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

              <div className="mt-6 space-y-3">
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
                    className="group flex w-full items-center gap-4 rounded-[1.25rem] border border-white/10 bg-white/[0.045] p-4 text-left transition-all hover:border-cyan-300/25 hover:bg-cyan-300/8"
                  >
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

                      <div className="mt-6 grid gap-3 sm:grid-cols-3">
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
