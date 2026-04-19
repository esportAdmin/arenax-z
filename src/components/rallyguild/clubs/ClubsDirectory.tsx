"use client";

import { useMemo, useState } from "react";

import { TrustStrip } from "@/components/rallyguild/TrustStrip";

import { ClubDirectoryCard } from "./ClubDirectoryCard";
import { ClubFilters } from "./ClubFilters";
import { ClubsHero } from "./ClubsHero";
import { clubs, type ClubRegion, type ClubStatus } from "./data";

/**
 * Orchestrates the premium RallyGuild clubs directory.
 *
 * Example:
 * ```tsx
 * <ClubsDirectory />
 * ```
 */
export function ClubsDirectory() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<ClubRegion | "All">("Global");
  const [status, setStatus] = useState<ClubStatus | "All">("Recruiting");

  const filteredClubs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return clubs.filter((club) => {
      const matchesQuery =
        !normalizedQuery ||
        club.name.toLowerCase().includes(normalizedQuery) ||
        club.slogan.toLowerCase().includes(normalizedQuery);
      const matchesRegion =
        region === "All" || club.region === region || club.region === "Global";
      const matchesStatus = status === "All" || club.status === status;
      return matchesQuery && matchesRegion && matchesStatus;
    });
  }, [query, region, status]);

  return (
    <div className="min-h-screen overflow-hidden bg-[#040b14] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(34,211,238,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.35)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="absolute left-[-10rem] top-16 h-[34rem] w-[34rem] rounded-full bg-cyan-400/12 blur-[150px]" />
        <div className="absolute right-[-8rem] top-24 h-[34rem] w-[34rem] rounded-full bg-violet-500/14 blur-[150px]" />
        <div className="absolute bottom-[-12rem] left-[35%] h-[28rem] w-[28rem] rounded-full bg-orange-500/10 blur-[140px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-14 pt-28 sm:px-5 md:px-8">
        <ClubsHero />

        <div className="mt-8">
          <ClubFilters
            onQueryChange={setQuery}
            onRegionChange={setRegion}
            onStatusChange={setStatus}
            query={query}
            region={region}
            status={status}
          />
        </div>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {filteredClubs.map((club) => (
            <ClubDirectoryCard club={club} key={club.id} />
          ))}
        </section>

        {filteredClubs.length === 0 ? (
          <section className="mt-8 rounded-[2rem] border border-white/10 bg-slate-950/72 p-8 text-center">
            <div className="font-display text-2xl font-black text-white">
              No club signal found
            </div>
            <p className="mt-3 text-sm text-slate-400">
              Clear the filters or search another community name.
            </p>
          </section>
        ) : null}

        <div className="mt-8">
          <TrustStrip labels={["Discord/Twitch ready", "Community-first", "No cash value"]} />
        </div>
      </main>
    </div>
  );
}
