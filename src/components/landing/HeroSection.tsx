"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Flame,
  LockKeyhole,
  Orbit,
  ShieldCheck,
  Shield,
  Sparkles,
  Swords,
  TimerReset,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { CountdownPill } from "@/components/engagement/CountdownPill";
import { RouteButton } from "@/components/RouteButton";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "./Navigation";
import LandingWorldMapPreview from "./LandingWorldMapPreview";
import StatPanel from "./StatPanel";
import { getNextUtcMidnight, getHoursFromNow } from "@/lib/countdown";

const BackgroundWorldMap = dynamic(() => import("./BackgroundWorldMap"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#050816]" />,
});

const returnLoops = [
  {
    icon: Flame,
    title: "Daily pressure",
    text: "Fresh wars, leaderboard shifts, and time-sensitive live calls give players a reason to check back every day.",
  },
  {
    icon: Users,
    title: "Social gravity",
    text: "Clubs create rivalry, pride, and accountability. When your squad moves, you want to know first.",
  },
  {
    icon: Trophy,
    title: "Prestige progression",
    text: "Status, streaks, rank, and territory control turn every session into visible momentum.",
  },
];

const firstSessionSteps = [
  {
    icon: Users,
    title: "Join a club",
    text: "Pick your side and get instant social context.",
  },
  {
    icon: Target,
    title: "Lock one live call",
    text: "Make one meaningful call and start your streak.",
  },
  {
    icon: ShieldCheck,
    title: "Defend your standing",
    text: "Track the map, rank, and reward window before reset.",
  },
];

export default function HeroSection() {
  const { user } = useAuth();
  const dailyReset = getNextUtcMidnight();
  const nextWarPulse = getHoursFromNow(3);
  const primaryHref = user ? "/dashboard" : "/auth";
  const primaryLabel = user ? "Open My Daily Mission" : "Start Your First Mission";

  return (
    <section
      className="relative overflow-hidden pb-12 pt-2 md:pb-14"
      style={{ minHeight: "100vh" }}
    >
      <BackgroundWorldMap />
      <Navigation />

      <div className="relative z-10 px-4 pt-[88px] sm:px-5 md:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-6 lg:gap-8 xl:grid-cols-[1.06fr_0.94fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="space-y-6 md:space-y-7"
            >
              <div className="eyebrow-badge">
                <Sparkles className="h-4 w-4 text-primary" />
                New player quick-start
              </div>

              <div className="space-y-5">
                <div className="max-w-4xl">
                  <h1 className="text-balance text-[2.8rem] font-black leading-[0.9] tracking-[0.04em] text-white sm:text-[3.6rem] lg:text-[5.3rem]">
                    Join a club.
                    <br />
                    <span className="gradient-text-primary text-glow-cyan">
                      Start climbing today.
                    </span>
                  </h1>
                </div>

                <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                  ArenaX-Z gives new players a clear first loop: join a club,
                  make your first live call, and come back before reset to
                  protect status, streak, and territory momentum.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <div className="w-full max-w-3xl rounded-[1.6rem] border border-amber-300/28 bg-[linear-gradient(135deg,rgba(251,191,36,0.16),rgba(34,211,238,0.1),rgba(255,255,255,0.03))] p-4 shadow-[0_0_40px_rgba(251,191,36,0.12)] backdrop-blur-xl">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100">
                        <Orbit className="h-3.5 w-3.5" />
                        Start here
                      </div>
                      <div className="mt-3 text-lg font-semibold text-white sm:text-xl">
                        New players should begin with one clear action
                      </div>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-200/90">
                        Create your path into the competition layer first. After
                        that, the map, clubs, and rewards make immediate sense.
                      </p>
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:w-auto">
                      <RouteButton
                        href={primaryHref}
                        variant="hero"
                        size="xl"
                        className="group w-full min-w-0 border-amber-200/25 shadow-[0_0_24px_rgba(251,191,36,0.16)] sm:min-w-[260px]"
                      >
                        {primaryLabel}
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </RouteButton>
                      <div className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100/80">
                        Recommended first action
                      </div>
                    </div>
                  </div>
                </div>

                <RouteButton
                  href="/war-map"
                  variant="glass"
                  size="xl"
                  className="w-full sm:w-auto"
                >
                  <Swords className="h-5 w-5 text-primary" />
                  Explore Live War Map
                </RouteButton>
              </div>

              <div className="rounded-[1.5rem] border border-cyan-400/18 bg-[linear-gradient(180deg,rgba(12,18,32,0.82),rgba(6,12,24,0.72))] p-4 shadow-[0_0_30px_rgba(34,211,238,0.06)] backdrop-blur-xl">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/85">
                      Start here
                    </div>
                    <div className="mt-1 text-lg font-semibold text-white">
                      In under 2 minutes, a new player can enter the loop.
                    </div>
                  </div>
                  <div className="metal-chip">
                    <TimerReset className="h-4 w-4 text-cyan-300" />
                    First reward window opens today
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {firstSessionSteps.map((step, index) => (
                    <div
                      key={step.title}
                      className={`rounded-2xl border p-4 ${
                        index === 0
                          ? "border-amber-300/24 bg-amber-300/10 shadow-[0_0_26px_rgba(251,191,36,0.08)]"
                          : index === 1
                            ? "border-cyan-400/18 bg-cyan-400/8"
                            : "border-fuchsia-400/16 bg-fuchsia-400/8"
                      }`}
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${
                            index === 0
                              ? "border-amber-300/24 bg-amber-300/14 text-amber-100"
                              : index === 1
                                ? "border-cyan-400/24 bg-cyan-400/12 text-cyan-100"
                                : "border-fuchsia-400/22 bg-fuchsia-400/12 text-fuchsia-100"
                          }`}
                        >
                          <step.icon className="h-4 w-4" />
                        </div>
                        <div
                          className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                            index === 0 ? "text-amber-100/80" : "text-slate-400"
                          }`}
                        >
                          Step 0{index + 1}
                        </div>
                      </div>
                      <div className="text-sm font-display font-bold uppercase tracking-[0.12em] text-white">
                        {step.title}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {step.text}
                      </p>
                      {index === 0 ? (
                        <div className="mt-3 inline-flex items-center rounded-full border border-amber-300/22 bg-amber-300/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-100">
                          Best first move
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <CountdownPill label="Daily reset" target={dailyReset} />
                <CountdownPill
                  label="Next war pulse"
                  target={nextWarPulse}
                  tone="rose"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="metal-chip">
                  <Shield className="h-4 w-4 text-primary" />
                  Club vs club territory warfare
                </div>
                <div className="metal-chip">
                  <Flame className="h-4 w-4 text-accent" />
                  Daily loops built for return visits
                </div>
                <div className="metal-chip">
                  <Trophy className="h-4 w-4 text-warning" />
                  Rank, reputation, and rewards
                </div>
                <div className="metal-chip">
                  <LockKeyhole className="h-4 w-4 text-slate-200" />
                  Premium tiers unlock through return momentum
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {returnLoops.map((loop, index) => (
                  <motion.div
                    key={loop.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 + index * 0.08 }}
                    className="surface-panel p-4"
                  >
                    <div className="mb-3 inline-flex rounded-2xl border border-white/10 bg-white/5 p-2.5">
                      <loop.icon className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="mb-2 text-sm font-display font-bold uppercase tracking-[0.14em] text-white">
                      {loop.title}
                    </h3>
                    <p className="text-sm leading-6 text-slate-300">
                      {loop.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="space-y-4"
            >
              <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <StatPanel label="Active Wars" value="1,245" variant="wars" />
                <StatPanel
                  label="Territories Claimed"
                  value="8,900+"
                  variant="territories"
                />
                <StatPanel
                  label="Players Tracking the Map"
                  value="450,000+"
                  variant="players"
                />
              </div>

              <div className="command-frame subtle-noise relative z-0 p-3 sm:p-4 md:p-5">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="data-pill">Live War Theater</div>
                    <h2 className="mt-3 text-2xl font-display font-bold text-white md:text-3xl">
                      The world moves whether you log in or not
                    </h2>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left md:text-right">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Current event feed
                    </div>
                    <div className="mt-1 text-sm text-slate-200">
                      37 battles resolved in the last hour
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-1.5 sm:p-2 md:p-3">
                  <LandingWorldMapPreview />
                </div>

                <div className="mt-4 flex flex-col gap-2 text-xs uppercase tracking-[0.18em] text-slate-400 sm:flex-row sm:flex-wrap sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)]" />
                    Critical battle
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
                    Controlled territory
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]" />
                    Recent swing
                  </div>
                  <div className="flex items-center gap-2">
                    <TimerReset className="h-3.5 w-3.5 text-cyan-300" />
                    Reset window live
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
