"use client";

import GlobalRanking from "@/components/rankings/GlobalRanking";
import TopPlayersGlobal from "@/components/rankings/TopPlayersGlobal";
import SeasonLeaderboard from "@/components/seasons/SeasonLeaderboard";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function RankingsPage() {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-300 drop-shadow-[0_0_15px_#00d9ff]">
            Rankings
          </h1>
          <p className="text-gray-400 mt-2">
            Global club and player domination
          </p>
        </div>

        {/* GLOBAL CLUB RANKING */}
        <section>
          <GlobalRanking />
        </section>

        {/* TOP PLAYERS */}
        <section>
          <TopPlayersGlobal />
        </section>

        {/* SEASON LEADERBOARD */}
        <section>
          <SeasonLeaderboard />
        </section>
      </main>

      <Footer />
    </div>
  );
}
