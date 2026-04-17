"use client";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import RankedBoard from "@/components/ranked/RankedBoard";
import { Shield, Trophy, Zap } from "lucide-react";

export default function RankedPage() {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <main className="relative overflow-hidden px-4 pb-16 pt-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-[0.1] [background-image:linear-gradient(rgba(34,211,238,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.35)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-[120px]" />
          <div className="absolute right-1/4 top-48 h-72 w-72 rounded-full bg-amber-400/10 blur-[120px]" />
        </div>

        <div className="container-arena relative z-10 space-y-8">
          <section className="command-frame hero-sheen overflow-hidden p-6 text-center md:p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-300/25 bg-amber-400/10 shadow-[0_0_32px_rgba(245,158,11,0.2)]">
              <Trophy className="h-8 w-8 text-amber-200" />
            </div>
            <div className="eyebrow-badge mx-auto border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
              Club prestige ladder
            </div>
            <h1 className="mt-5 font-display text-4xl font-black text-white md:text-6xl">
              Ranked Competitive Command
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
              Track club strength, season momentum, and public prestige without
              turning the product into a financial-gaming surface.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <HeroChip icon={Shield} label="Fair ladder" value="ELO-based" />
              <HeroChip icon={Zap} label="Momentum" value="Live activity" />
              <HeroChip icon={Trophy} label="Prestige" value="Season rank" />
            </div>
          </section>

          <RankedBoard />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function HeroChip({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Shield;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 text-left">
      <Icon className="mb-3 h-5 w-5 text-cyan-300" />
      <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 font-display text-lg font-black text-white">
        {value}
      </div>
    </div>
  );
}
