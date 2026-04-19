"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import WarReplayPanel from "@/components/wars/WarReplayPanel";

export default function ReplaysPage() {
  const [warId, setWarId] = useState("");

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <main className="container mx-auto space-y-8 px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-300 drop-shadow-[0_0_15px_#00d9ff]">
            War Replays
          </h1>
          <p className="mt-2 text-gray-400">
            Revoir les combats contribution par contribution
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="mb-3 text-white font-semibold">War ID</div>

          <div className="flex gap-2">
            <input
              value={warId}
              onChange={(e) => setWarId(e.target.value)}
              placeholder="Enter war UUID"
              className="flex-1 rounded border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none"
            />
          </div>
        </div>

        {warId.trim() && <WarReplayPanel warId={warId.trim()} />}
      </main>

      <Footer />
    </div>
  );
}
