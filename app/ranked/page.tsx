"use client";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import RankedBoard from "@/components/ranked/RankedBoard";

export default function RankedPage() {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <main className="container mx-auto space-y-8 px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-300 drop-shadow-[0_0_15px_#00d9ff]">
            Ranked Competitive Mode
          </h1>
          <p className="mt-2 text-gray-400">
            Real ELO matchmaking and competitive club rankings
          </p>
        </div>

        <RankedBoard />
      </main>

      <Footer />
    </div>
  );
}
