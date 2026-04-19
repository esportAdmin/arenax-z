"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import WarAiLivePanel from "@/components/admin/WarAiLivePanel";
import TerritoryEconomyBoard from "@/components/economy/TerritoryEconomyBoard";
import AdjacencyDebugPanel from "@/components/debug/AdjacencyDebugPanel";

export default function LiveControlPage() {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <main className="container mx-auto space-y-8 px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-300 drop-shadow-[0_0_15px_#00d9ff]">
            Live Strategy Control
          </h1>
          <p className="mt-2 text-gray-400">
            AI, adjacency graph and economy monitoring
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <WarAiLivePanel />
          <TerritoryEconomyBoard />
        </div>

        <AdjacencyDebugPanel />
      </main>

      <Footer />
    </div>
  );
}
