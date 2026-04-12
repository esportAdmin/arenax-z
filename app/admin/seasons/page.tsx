"use client";

import { useSeason } from "@/hooks/useSeason";
import StartSeasonButton from "@/components/admin/StartSeasonButton";
import EndSeasonButton from "@/components/admin/EndSeasonButton";
import MatchmakeWarsButton from "@/components/admin/MatchmakeWarsButton";
import RunWarAiButton from "@/components/admin/RunWarAiButton";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CalendarDays } from "lucide-react";

export default function AdminSeasonsPage() {
  const { season, loading } = useSeason();

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <main className="container mx-auto space-y-10 px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-300 drop-shadow-[0_0_15px_#00d9ff]">
            Season Control Panel
          </h1>
          <p className="mt-2 text-gray-400">
            Manage seasons, rewards, matchmaking, and AI
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <div className="mb-3 flex items-center gap-2">
            <CalendarDays className="text-cyan-300" />
            <h2 className="text-xl font-bold">Active Season</h2>
          </div>

          {loading ? (
            <p className="text-white/60">Loading...</p>
          ) : season ? (
            <div className="space-y-1">
              <p className="font-semibold text-white">{season.name}</p>
              <p className="text-sm text-white/60">
                Start: {new Date(season.start_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-white/60">
                End:{" "}
                {season.end_date
                  ? new Date(season.end_date).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          ) : (
            <p className="text-red-400">No active season</p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <StartSeasonButton />
          <EndSeasonButton />
          <MatchmakeWarsButton />
          <RunWarAiButton />
        </div>

        <div className="mt-6 text-center text-sm text-red-400">
          ⚠️ Ending a season distributes rewards automatically
        </div>
      </main>

      <Footer />
    </div>
  );
}
