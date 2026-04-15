"use client";

import { ArrowRight, Flame, Loader2, Map, Radio, Shield, Swords, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

import Navigation from "@/components/landing/Navigation";
import { Button } from "@/components/ui/button";
import { useLiveWars } from "@/hooks/useLiveWars";

const fallbackFronts = [
  { territory_name: "Russia West", total_xp: 0, status: "priming", club_name: "Unclaimed front" },
  { territory_name: "Paris", total_xp: 0, status: "priming", club_name: "No active rally" },
  { territory_name: "Germany", total_xp: 0, status: "priming", club_name: "No active rally" },
  { territory_name: "Poland", total_xp: 0, status: "priming", club_name: "No active rally" },
];

export default function MultiWarView() {
  const router = useRouter();
  const { wars, loading } = useLiveWars();

  const active = wars.filter((war) => war.war_id || war.status);
  const displayedFronts = active.length > 0 ? active.slice(0, 8) : fallbackFronts;
  const totalXp = displayedFronts.reduce((sum, war) => sum + (war.total_xp ?? 0), 0);

  return (
    <div className="min-h-screen bg-background text-white">
      <Navigation />

      <main className="relative overflow-hidden pb-12 pt-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(34,211,238,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.35)_1px,transparent_1px)] [background-size:44px_44px]" />
          <div className="absolute left-[-10rem] top-24 h-[34rem] w-[34rem] rounded-full bg-cyan-400/10 blur-[150px]" />
          <div className="absolute right-[-10rem] top-48 h-[34rem] w-[34rem] rounded-full bg-orange-500/10 blur-[160px]" />
        </div>

        <div className="container-arena relative z-10 space-y-6">
          <section className="command-frame hero-sheen relative overflow-hidden p-6 md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.16),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.16),transparent_34%)]" />
            <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="eyebrow-badge border-orange-300/25 bg-orange-500/10 text-orange-200">
                  <Flame className="h-4 w-4 text-orange-300" />
                  War command center
                </div>
                <h1 className="mt-5 text-4xl font-display font-black text-white md:text-6xl">
                  Active fronts, clear next moves.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                  Track territory pressure, rally live calls, and turn quiet fronts into visible community momentum.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:w-[420px]">
                <div className="rounded-[1.2rem] border border-orange-300/20 bg-orange-500/10 p-4 text-center">
                  <Swords className="mx-auto h-5 w-5 text-orange-300" />
                  <div className="mt-2 font-display text-2xl font-black text-white">
                    {displayedFronts.length}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                    Fronts
                  </div>
                </div>
                <div className="rounded-[1.2rem] border border-cyan-300/20 bg-cyan-300/10 p-4 text-center">
                  <Trophy className="mx-auto h-5 w-5 text-cyan-300" />
                  <div className="mt-2 font-display text-2xl font-black text-white">
                    {totalXp.toLocaleString("en-US")}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                    Total XP
                  </div>
                </div>
                <div className="rounded-[1.2rem] border border-emerald-300/20 bg-emerald-400/10 p-4 text-center">
                  <Radio className="mx-auto h-5 w-5 text-emerald-300" />
                  <div className="mt-2 font-display text-2xl font-black text-white">
                    Live
                  </div>
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                    Pulse
                  </div>
                </div>
              </div>
            </div>
          </section>

          {loading ? (
            <section className="dashboard-card flex min-h-[260px] items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto mb-4 h-9 w-9 animate-spin text-cyan-300" />
                <div className="font-display text-xl font-black text-white">Loading war fronts</div>
                <p className="mt-2 text-sm text-slate-400">Syncing territory pressure...</p>
              </div>
            </section>
          ) : null}

          {!loading ? (
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {displayedFronts.map((war, index) => {
                const pressure = Math.min(Math.max((war.total_xp ?? 0) / 20, index === 0 ? 18 : 8), 100);
                const isCritical = pressure >= 60;

                return (
                  <article
                    key={`${war.territory_name}-${index}`}
                    className={`dashboard-card p-5 ${isCritical ? "border-orange-300/30" : "border-cyan-300/20"}`}
                  >
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                          Territory
                        </div>
                        <h2 className="mt-2 truncate font-display text-2xl font-black text-white">
                          {war.territory_name}
                        </h2>
                        <p className="mt-1 truncate text-sm text-slate-400">
                          {war.club_name || "Waiting for first club rally"}
                        </p>
                      </div>
                      <div className={`rounded-2xl border px-3 py-2 text-right ${isCritical ? "border-orange-300/25 bg-orange-500/12" : "border-cyan-300/20 bg-cyan-300/10"}`}>
                        <div className={`font-display text-xl font-black ${isCritical ? "text-orange-200" : "text-cyan-200"}`}>
                          {Math.round(pressure)}%
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                          pressure
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full ${isCritical ? "bg-gradient-to-r from-orange-300 to-red-400" : "bg-gradient-to-r from-cyan-300 to-blue-400"}`}
                        style={{ width: `${pressure}%` }}
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                          <Shield className="h-3.5 w-3.5" />
                          Status
                        </div>
                        <div className="mt-2 font-bold text-white">
                          {war.status || "Priming"}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                          <Map className="h-3.5 w-3.5" />
                          XP
                        </div>
                        <div className="mt-2 font-bold text-white">
                          {(war.total_xp ?? 0).toLocaleString("en-US")}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <Button
                        className="h-11 rounded-[0.9rem] bg-cyan-300 font-display font-black text-slate-950 hover:bg-cyan-200"
                        onClick={() => router.push("/live-calls")}
                      >
                        Rally live call
                      </Button>
                      <Button
                        variant="outline"
                        className="h-11 rounded-[0.9rem] border-orange-300/30 bg-orange-500/10 font-display font-black text-orange-100 hover:bg-orange-500/18"
                        onClick={() => router.push("/war-map")}
                      >
                        Open war map
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </article>
                );
              })}
            </section>
          ) : null}
        </div>
      </main>
    </div>
  );
}
