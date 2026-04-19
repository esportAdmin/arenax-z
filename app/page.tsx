"use client";

import { useEffect } from "react";
import { ArrowRight, BellRing, Shield, TimerReset, Trophy, Users } from "lucide-react";

import HeroSection from "@/components/landing/HeroSection";
import Leaderboard from "@/components/Leaderboard";
import ActiveWarsDebug from "@/components/debug/ActiveWarsDebug";
import { CountdownPill } from "@/components/engagement/CountdownPill";
import LandingWorldMapPreview from "@/components/landing/LandingWorldMapPreview";
import { RouteButton } from "@/components/RouteButton";
import { Footer } from "@/components/layout/Footer";
import { getNextUtcMidnight, getNextWeeklyReset } from "@/lib/countdown";

const commandLoop = [
  {
    label: "Club identity",
    title: "Give players a side worth returning for",
    text: "A club is not just a label. It is the social anchor that makes rivalry, status, and loyalty feel real.",
    href: "/clubs",
    cta: "Open clubs",
    icon: Users,
  },
  {
    label: "Live ritual",
    title: "Turn one session into a daily comeback loop",
    text: "A strong live call creates visible momentum now and a reason to reopen the app before reset.",
    href: "/live-calls",
    cta: "Open live calls",
    icon: TimerReset,
  },
  {
    label: "Prestige pressure",
    title: "Make status move in public",
    text: "When the map shifts and the ladder moves, players feel urgency without needing to be pushed.",
    href: "/leaderboard",
    cta: "See the ladder",
    icon: Trophy,
  },
];

const returnSignals = [
  {
    title: "Map pressure creates natural urgency",
    text: "Territories flip while people are away. That alone creates a reason to return without paid acquisition tricks.",
  },
  {
    title: "Social gravity keeps communities active",
    text: "When one member moves, others want to know. Clubs make the product feel alive even before rewards matter.",
  },
  {
    title: "Visible prestige makes progress legible",
    text: "Rank, streaks, and contribution are more effective when movement is public, not hidden in a profile drawer.",
  },
];

export default function Page() {
  const dailyReset = getNextUtcMidnight();
  const nextClubDrop = getNextWeeklyReset(5, 20);

  useEffect(() => {
    const url = new URL(window.location.href);
    const hasOAuthResponse =
      url.searchParams.has("code") ||
      url.searchParams.has("error") ||
      url.searchParams.has("error_description");

    if (!hasOAuthResponse) return;

    const callbackUrl = new URL("/auth/callback", window.location.origin);
    for (const [key, value] of url.searchParams.entries()) {
      callbackUrl.searchParams.set(key, value);
    }
    if (!callbackUrl.searchParams.has("next")) {
      callbackUrl.searchParams.set("next", "/dashboard");
    }

    window.location.replace(callbackUrl.toString());
  }, []);

  return (
    <main className="min-h-screen overflow-hidden text-white">
      <HeroSection />

      <section className="px-4 py-14 sm:px-5 md:px-8 md:py-18 lg:px-10">
        <div className="mx-auto max-w-7xl space-y-10">
          <section className="section-shell">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="data-pill">Why this product retains</div>
                <h2 className="mt-3 text-3xl font-display font-bold text-white md:text-4xl">
                  A shorter, clearer path from first visit to daily habit
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                  RallyGuild works when the first action is obvious, the social layer feels alive,
                  and the next session already feels more valuable than logging off.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <CountdownPill label="Daily reset" target={dailyReset} />
                <CountdownPill label="Club drop" target={nextClubDrop} tone="amber" />
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {commandLoop.map((item, index) => (
                <div
                  key={item.title}
                  className={`surface-panel flex h-full flex-col justify-between p-5 ${
                    index === 0
                      ? "border-cyan-400/18 bg-[linear-gradient(180deg,rgba(34,211,238,0.1),rgba(255,255,255,0.03))]"
                      : index === 1
                        ? "border-amber-300/22 bg-[linear-gradient(180deg,rgba(251,191,36,0.1),rgba(255,255,255,0.03))]"
                        : "border-fuchsia-400/16 bg-[linear-gradient(180deg,rgba(217,70,239,0.08),rgba(255,255,255,0.03))]"
                  }`}
                >
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                        <item.icon className={`h-5 w-5 ${index === 1 ? "text-amber-300" : "text-cyan-300"}`} />
                      </div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {item.label}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {item.text}
                    </p>
                  </div>

                  <RouteButton
                    href={item.href}
                    variant="outline"
                    className="mt-5 justify-between text-slate-100"
                  >
                    {item.cta}
                    <ArrowRight className="h-4 w-4" />
                  </RouteButton>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
            <section className="section-shell">
              <div className="data-pill">Return pressure</div>
              <h2 className="mt-4 text-3xl font-display font-bold text-white md:text-4xl">
                Retention becomes believable when the world state is visible
              </h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                The strongest loops are not hidden in menus. They are visible in the map,
                the club pulse, and the ladder.
              </p>

              <div className="mt-8 space-y-4">
                {returnSignals.map((item, index) => (
                  <div key={item.title} className="surface-panel flex gap-4 p-4 md:p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-sm font-display font-bold text-primary">
                      0{index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-300">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  <BellRing className="h-4 w-4 text-primary" />
                  No cash value
                </div>
                <p className="mt-2 leading-6">
                  Arena Points, prestige, and badges are retention mechanics only. They are designed to create
                  return momentum, not financial expectation.
                </p>
              </div>
            </section>

            <section className="command-frame p-3 sm:p-4 md:p-5">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="data-pill">Live conflict view</div>
                  <h2 className="mt-3 text-2xl font-display font-bold text-white md:text-3xl">
                    A map serious players will want to monitor
                  </h2>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                  Live world state, club pressure, public prestige
                </div>
              </div>

              <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-1.5 sm:p-2 md:p-3">
                <LandingWorldMapPreview />
              </div>
            </section>
          </div>

          <section className="section-shell">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="data-pill">Live telemetry</div>
                <h2 className="mt-3 text-3xl font-display font-bold text-white">
                  Watch active fronts without losing the product story
                </h2>
              </div>
              <RouteButton href="/wars" variant="outline" className="w-full sm:w-auto">
                <Shield className="h-4 w-4 text-cyan-300" />
                Open war room
              </RouteButton>
            </div>

            <ActiveWarsDebug />
          </section>

          <Leaderboard />
        </div>
      </section>

      <Footer />
    </main>
  );
}
