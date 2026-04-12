"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import WorldMap from "@/components/wars/world/WorldMap";
import TerritoryEconomyBoard from "@/components/economy/TerritoryEconomyBoard";
import WarAiLivePanel from "@/components/admin/WarAiLivePanel";
import AdjacencyDebugPanel from "@/components/debug/AdjacencyDebugPanel";

export default function GamePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#050816] text-white">
      <Navbar />

      <main className="container mx-auto flex-1 space-y-8 px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-300 drop-shadow-[0_0_15px_#00d9ff]">
            Global War Command
          </h1>
          <p className="mt-2 text-gray-400">
            Real-time strategy map with live wars, alliances and economy
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-cyan-400/20">
          <WorldMap />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <TerritoryEconomyBoard />
          <WarAiLivePanel />
          <AdjacencyDebugPanel />
        </div>
      </main>

      <Footer />
    </div>
  );
}
