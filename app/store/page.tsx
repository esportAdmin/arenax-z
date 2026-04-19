"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Crown,
  Flame,
  Gift,
  LockKeyhole,
  Radio,
  Shield,
  Sparkles,
  Trophy,
} from "lucide-react";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

const perkTracks = [
  {
    name: "Founder Signal",
    status: "Unlocked by launch activity",
    description: "A visible profile mark for early community operators.",
    icon: Crown,
    tone: "cyan",
  },
  {
    name: "War Room Badge",
    status: "Earn through active fronts",
    description: "Show that your club rallied during pressure windows.",
    icon: Shield,
    tone: "orange",
  },
  {
    name: "Live Ritual Frame",
    status: "Keep the weekly loop alive",
    description: "A cosmetic frame tied to consistent live calls.",
    icon: Radio,
    tone: "violet",
  },
  {
    name: "Club Pulse Emblem",
    status: "Invite and activate members",
    description: "Prestige for clubs that bring people back repeatedly.",
    icon: Flame,
    tone: "emerald",
  },
];

const unlockSteps = [
  "Join or launch a club",
  "Run a live ritual",
  "Rally a pressure window",
  "Protect the weekly streak",
];

/**
 * Returns the premium neon style for each perk track.
 *
 * Example:
 * ```ts
 * getToneClasses("orange")
 * ```
 */
function getToneClasses(tone: string) {
  if (tone === "orange") {
    return "border-orange-300/24 bg-orange-400/8 text-orange-100 shadow-[0_0_34px_rgba(251,146,60,0.12)]";
  }

  if (tone === "violet") {
    return "border-violet-300/24 bg-violet-400/8 text-violet-100 shadow-[0_0_34px_rgba(167,139,250,0.12)]";
  }

  if (tone === "emerald") {
    return "border-emerald-300/24 bg-emerald-400/8 text-emerald-100 shadow-[0_0_34px_rgba(52,211,153,0.12)]";
  }

  return "border-cyan-300/24 bg-cyan-400/8 text-cyan-100 shadow-[0_0_34px_rgba(34,211,238,0.12)]";
}

export default function StorePage() {
  return (
    <div className="min-h-screen bg-[#030915] text-white">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-12%] top-[-18%] h-[30rem] w-[30rem] rounded-full bg-cyan-400/12 blur-3xl" />
        <div className="absolute right-[-8%] top-[18%] h-[28rem] w-[28rem] rounded-full bg-orange-500/12 blur-3xl" />
        <div className="absolute bottom-[-18%] left-[28%] h-[26rem] w-[26rem] rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.045)_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-cyan-300/18 bg-[linear-gradient(135deg,rgba(8,23,42,0.94),rgba(5,10,24,0.9)_54%,rgba(49,24,12,0.72))] p-6 shadow-[0_0_90px_rgba(34,211,238,0.12)] backdrop-blur-xl lg:p-8">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/80 to-orange-200/70" />
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/24 bg-cyan-300/10 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.22em] text-cyan-200">
            <Gift className="h-3.5 w-3.5" />
            Perks vault
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <h1 className="font-display text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl">
                Make progress feel visible, collectible, and worth protecting.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                The vault is a prestige layer for community status, profile
                cosmetics, club recognition, and retention loops. No cash value.
                No financial return.
              </p>
            </div>

            <div className="rounded-[1.4rem] border border-amber-300/22 bg-amber-400/10 p-5">
              <div className="flex items-center gap-3">
                <LockKeyhole className="h-8 w-8 text-amber-200" />
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.22em] text-amber-100/80">
                    Launch-safe policy
                  </div>
                  <div className="mt-1 text-xl font-black text-white">
                    Virtual engagement only
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-amber-100/80">
                Perks are designed to motivate community return behavior, not
                to represent money, winnings, or transferable value.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-4">
          {perkTracks.map(({ description, icon: Icon, name, status, tone }) => (
            <article
              key={name}
              className={`rounded-[1.55rem] border p-5 backdrop-blur-xl ${getToneClasses(tone)}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                  <Icon className="h-6 w-6" />
                </div>
                <BadgeCheck className="h-5 w-5 opacity-70" />
              </div>
              <h2 className="mt-5 text-xl font-black text-white">{name}</h2>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] opacity-80">
                {status}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {description}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.65rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/18 bg-cyan-300/8 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
              <Sparkles className="h-4 w-4" />
              How unlocks work
            </div>
            <div className="mt-5 space-y-3">
              {unlockSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-300/18 bg-cyan-300/10 text-xs font-black text-cyan-100">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <span className="text-sm font-semibold text-slate-200">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.65rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Vault focus", value: "Status", icon: Trophy },
                { label: "Next loop", value: "Daily", icon: Flame },
                { label: "Value type", value: "Virtual", icon: Shield },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <Icon className="h-5 w-5 text-cyan-200" />
                  <div className="mt-3 text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-500">
                    {label}
                  </div>
                  <div className="mt-1 text-2xl font-black text-white">
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/rewards"
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-cyan-200/50 bg-cyan-300 px-5 text-sm font-black uppercase tracking-[0.12em] text-slate-950 shadow-[0_0_36px_rgba(34,211,238,0.42)] transition hover:bg-cyan-200"
              >
                Open rewards loop
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/subscription"
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-orange-300/32 bg-orange-400/10 px-5 text-sm font-black uppercase tracking-[0.12em] text-orange-100 transition hover:bg-orange-300/16"
              >
                See community plans
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
