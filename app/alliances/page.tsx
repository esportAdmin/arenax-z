"use client";

import { useState } from "react";

import AllianceDetails from "@/components/alliances/AllianceDetails";
import AlliancesList from "@/components/alliances/AlliancesList";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function AlliancesPage() {
  const [selectedAllianceId, setSelectedAllianceId] = useState<string | null>(
    null,
  );

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <main className="container mx-auto space-y-10 px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-300 drop-shadow-[0_0_15px_#00d9ff]">
            Alliances
          </h1>
          <p className="mt-2 text-gray-400">
            Diplomacy, coalitions, and strategic dominance
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <AlliancesList onSelectAlliance={setSelectedAllianceId} />
          <AllianceDetails allianceId={selectedAllianceId} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
