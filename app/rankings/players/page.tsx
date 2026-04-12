"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import GlobalPlayerRanking from "@/components/rankings/GlobalPlayerRanking";

export default function PlayerRankingsPage() {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <main className="container mx-auto space-y-8 px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-300 drop-shadow-[0_0_15px_#00d9ff]">
            Global Player Rankings
          </h1>
          <p className="mt-2 text-gray-400">
            Cross-war leaderboard for all players
          </p>
        </div>

        <GlobalPlayerRanking />
      </main>

      <Footer />
    </div>
  );
}
