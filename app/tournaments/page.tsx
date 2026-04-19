"use client";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import GuildTournamentBoard from "@/components/tournaments/GuildTournamentBoard";
import { CalendarDays, Crown, Swords } from "lucide-react";

export default function TournamentsPage() {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <main className="relative overflow-hidden px-4 pb-16 pt-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-[0.09] [background-image:linear-gradient(rgba(34,211,238,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.35)_1px,transparent_1px)] [background-size:44px_44px]" />
          <div className="absolute left-[-8rem] top-16 h-80 w-80 rounded-full bg-orange-400/10 blur-[130px]" />
          <div className="absolute right-[-8rem] top-32 h-80 w-80 rounded-full bg-cyan-400/10 blur-[130px]" />
        </div>

        <div className="container-arena relative z-10 space-y-8">
          <section className="command-frame hero-sheen p-6 md:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="eyebrow-badge border-orange-300/25 bg-orange-500/10 text-orange-200">
                  <Swords className="h-4 w-4" />
                  Seasonal rivalry ladder
                </div>
                <h1 className="mt-5 font-display text-4xl font-black text-white md:text-6xl">
                  Guild Tournaments
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                  Package club-versus-club competition into repeatable rituals
                  that give members a reason to return before reset.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
                <HeroChip icon={CalendarDays} label="Cadence" value="Seasonal" />
                <HeroChip icon={Crown} label="Reward" value="Prestige" />
              </div>
            </div>
          </section>

          <GuildTournamentBoard />
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
  icon: typeof Swords;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
      <Icon className="mb-3 h-5 w-5 text-orange-300" />
      <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 font-display text-lg font-black text-white">
        {value}
      </div>
    </div>
  );
}
