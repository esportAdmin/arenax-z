"use client";

import { useState } from "react";

import AllianceDetails from "@/components/alliances/AllianceDetails";
import AlliancesList from "@/components/alliances/AlliancesList";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Handshake, Shield, Users } from "lucide-react";

export default function AlliancesPage() {
  const [selectedAllianceId, setSelectedAllianceId] = useState<string | null>(
    null,
  );

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <main className="relative overflow-hidden px-4 pb-16 pt-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-[0.1] [background-image:radial-gradient(circle_at_center,rgba(34,211,238,0.2)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="absolute left-[-10rem] top-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-[130px]" />
          <div className="absolute right-[-10rem] top-28 h-80 w-80 rounded-full bg-violet-400/10 blur-[130px]" />
        </div>

        <div className="container-arena relative z-10 space-y-8">
          <section className="command-frame hero-sheen p-6 text-center md:p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10 shadow-[0_0_32px_rgba(34,211,238,0.2)]">
              <Handshake className="h-8 w-8 text-cyan-200" />
            </div>
            <div className="eyebrow-badge mx-auto border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
              Coalition command
            </div>
            <h1 className="mt-5 font-display text-4xl font-black text-white md:text-6xl">
              Alliances
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
              Build coalition stories, protect friendly clubs, and make
              diplomatic momentum visible to the community.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <HeroChip icon={Users} label="Coalitions" value="Shared momentum" />
              <HeroChip icon={Shield} label="Trust" value="Club-first" />
            </div>
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            <AlliancesList onSelectAlliance={setSelectedAllianceId} />
            <AllianceDetails allianceId={selectedAllianceId} />
          </div>
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
  icon: typeof Users;
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
