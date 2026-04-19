"use client";

import TerritoryEconomyBoard from "@/components/economy/TerritoryEconomyBoard";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function EconomyPage() {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <main className="container mx-auto space-y-8 px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-300 drop-shadow-[0_0_15px_#00d9ff]">
            Territory Economy
          </h1>
          <p className="mt-2 text-gray-400">
            Gold, energy, upkeep, and territory yield
          </p>
        </div>

        <TerritoryEconomyBoard />
      </main>

      <Footer />
    </div>
  );
}
