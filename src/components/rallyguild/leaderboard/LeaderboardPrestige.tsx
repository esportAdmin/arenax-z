"use client";

import { useState } from "react";

import { TrustStrip } from "@/components/rallyguild/TrustStrip";

import { LeaderboardHero } from "./LeaderboardHero";
import { PodiumSection } from "./PodiumSection";
import { RankingTable } from "./RankingTable";
import { players } from "./data";

const categories = ["Power", "Wins", "Win Rate", "Kills"] as const;
const regions = ["All", "Global", "Americas", "Europe", "Asia", "Arctic"] as const;

/**
 * Orchestrates the gold prestige leaderboard page.
 *
 * Example:
 * ```tsx
 * <LeaderboardPrestige />
 * ```
 */
export function LeaderboardPrestige() {
  const [category, setCategory] = useState<(typeof categories)[number]>("Power");
  const [region, setRegion] = useState<(typeof regions)[number]>("All");

  return (
    <div className="min-h-screen overflow-hidden bg-[#050912] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_16%,rgba(250,204,21,0.12),transparent_26%),radial-gradient(circle_at_72%_12%,rgba(251,146,60,0.12),transparent_24%)]" />
        <div className="absolute inset-0 opacity-[0.1] [background-image:linear-gradient(rgba(250,204,21,0.24)_1px,transparent_1px),linear-gradient(90deg,rgba(250,204,21,0.24)_1px,transparent_1px)] [background-size:46px_46px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-14 pt-28 sm:px-5 md:px-8">
        <LeaderboardHero />

        <section className="mt-6 grid gap-3 lg:grid-cols-2">
          <FilterStrip active={category} label="Category" onChange={setCategory} options={categories} />
          <FilterStrip active={region} label="Region" onChange={setRegion} options={regions} />
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
          <PodiumSection players={players.slice(0, 3)} />
          <RankingTable players={players} />
        </div>

        <div className="mt-8">
          <TrustStrip labels={["Prestige only", "No cash value", "Community-first"]} />
        </div>
      </main>
    </div>
  );
}

/**
 * Renders a compact gold filter strip.
 *
 * Example:
 * ```tsx
 * <FilterStrip label="Region" active="All" options={["All"]} onChange={fn} />
 * ```
 */
function FilterStrip<T extends string>({
  active,
  label,
  onChange,
  options,
}: {
  active: T;
  label: string;
  onChange: (value: T) => void;
  options: readonly T[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[1.4rem] border border-amber-300/16 bg-slate-950/72 p-3">
      <span className="px-2 text-xs font-black uppercase tracking-[0.16em] text-amber-100/70">
        {label}
      </span>
      {options.map((option) => (
        <button
          className={`rounded-xl border px-4 py-2 text-xs font-black uppercase tracking-[0.12em] ${
            active === option
              ? "border-amber-300/45 bg-amber-300/18 text-amber-100"
              : "border-white/10 bg-white/[0.04] text-slate-300"
          }`}
          key={option}
          onClick={() => onChange(option)}
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  );
}
