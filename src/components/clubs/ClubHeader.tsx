"use client";

import Link from "next/link";
import {
  ArrowRight,
  Flame,
  Radio,
  Shield,
  Sparkles,
  Sword,
  UserPlus,
  Users,
} from "lucide-react";

import { CountdownPill } from "@/components/engagement/CountdownPill";
import { Button } from "@/components/ui/button";
import { getHoursFromNow, getNextWeeklyReset } from "@/lib/countdown";

const heroStats = [
  { label: "Members online", value: "184", icon: Users, tone: "text-cyan-300" },
  { label: "War fronts", value: "12", icon: Sword, tone: "text-rose-300" },
  { label: "Prestige tier", value: "Elite", icon: Shield, tone: "text-amber-300" },
];

export default function ClubHeader() {
  const nextWarPulse = getHoursFromNow(2);
  const nextCouncilDrop = getNextWeeklyReset(2, 19);

  return (
    <div className="command-frame hero-sheen relative overflow-hidden px-5 py-7 sm:px-6 lg:px-8">
      <div className="subtle-noise absolute inset-0 opacity-40" />
      <div className="absolute -left-10 top-8 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <div className="eyebrow-badge">
            <Sparkles className="h-4 w-4 text-primary" />
            Founder-tier club identity
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.75rem] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/14 via-blue-500/12 to-fuchsia-500/16 text-3xl font-display font-black text-white shadow-[0_0_35px_rgba(34,211,238,0.16)]">
              HG
            </div>

            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Established 2024
              </div>
              <h1 className="mt-2 text-balance text-3xl font-display font-black text-white sm:text-4xl lg:text-5xl">
                Hyperion Gaming
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                A prestige-first club shell built for loyalty, rivalry, and
                daily return pressure. Members should feel that this group keeps
                moving even when they are away.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <CountdownPill label="War pulse" target={nextWarPulse} tone="rose" />
            <CountdownPill
              label="Council drop"
              target={nextCouncilDrop}
              tone="amber"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Button
              asChild
              className="min-h-12 rounded-full px-5 text-sm font-black uppercase tracking-[0.12em]"
            >
              <Link href="/war-map" prefetch={false}>
                Open war map
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="min-h-12 rounded-full px-5 text-sm font-black uppercase tracking-[0.12em]"
            >
              <Link href="/live-calls" prefetch={false}>
                Start live call
                <Radio className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="min-h-12 rounded-full border-amber-300/30 px-5 text-sm font-black uppercase tracking-[0.12em] text-amber-200"
            >
              <Link href="/clubs" prefetch={false}>
                Invite members
                <UserPlus className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="metal-chip">
              <Flame className="h-4 w-4 text-rose-300" />
              Live fronts are pulling members back in
            </div>
            <div className="metal-chip">
              <Shield className="h-4 w-4 text-primary" />
              Elite banner remains locked behind club loyalty
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {heroStats.map(({ label, value, icon: Icon, tone }) => (
            <div key={label} className="surface-panel hero-sheen min-h-[112px] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {label}
                </span>
                <Icon className={`h-4 w-4 ${tone}`} />
              </div>
              <div className="mt-3 text-3xl font-display font-bold text-white">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
