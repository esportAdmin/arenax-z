"use client";

import { BellRing, Sparkles, TimerReset } from "lucide-react";

import HeroSection from "@/components/landing/HeroSection";
import Leaderboard from "@/components/Leaderboard";
import ActiveWarsDebug from "@/components/debug/ActiveWarsDebug";
import { CountdownPill } from "@/components/engagement/CountdownPill";
import { ReturnNudgeCard } from "@/components/engagement/ReturnNudgeCard";
import LandingWorldMapPreview from "@/components/landing/LandingWorldMapPreview";
import { RouteButton } from "@/components/RouteButton";
import { getNextUtcMidnight, getNextWeeklyReset } from "@/lib/countdown";

const startPath = [
  {
    step: "Step 01",
    title: "Create or join your side",
    text: "Start with a club so the product immediately feels social, competitive, and alive.",
    href: "/clubs",
    cta: "Open clubs",
    tone: "amber",
    emphasis: "Recommended first action",
  },
  {
    step: "Step 02",
    title: "Make one fast live call",
    text: "One strong read is enough to create momentum and make tomorrow matter.",
    href: "/live-calls",
    cta: "Open live calls",
    tone: "cyan",
    emphasis: "Daily habit builder",
  },
  {
    step: "Step 03",
    title: "Track map pressure and prestige",
    text: "The war map and leaderboard give the player a reason to check back before reset.",
    href: "/leaderboard",
    cta: "See the ladder",
    tone: "fuchsia",
    emphasis: "Comeback trigger",
  },
];

const comebackSignals = [
  {
    title: "Check the map before your rivals do",
    text: "Territories flip, wars escalate, and the balance of power changes while people are offline.",
  },
  {
    title: "Build loyalty around a club identity",
    text: "Clubs give players a banner, a social circle, and a reason to show up when the pressure rises.",
  },
  {
    title: "Track momentum that actually feels visible",
    text: "Rank, progression, streaks, and prestige create feedback loops that reward repeat visits.",
  },
];

export default function Page() {
  const dailyReset = getNextUtcMidnight();
  const nextClubDrop = getNextWeeklyReset(5, 20);

  return (
    <main className="min-h-screen overflow-hidden text-white">
      <HeroSection />

      <section className="px-4 py-14 sm:px-5 md:px-8 md:py-18 lg:px-10">
        <div className="mx-auto max-w-7xl space-y-12">
          <section id="start-here" className="section-shell">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="data-pill">Where to start</div>
                <h2 className="mt-3 text-3xl font-display font-bold text-white md:text-4xl">
                  New players should know exactly what to do next
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                  The fastest path into ArenaX-Z is simple: pick a side, make a
                  first live call, then watch your status move before reset.
                </p>
              </div>

              <RouteButton href="/auth" size="lg" className="w-full sm:w-auto">
                Start the onboarding path
              </RouteButton>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {startPath.map((item, index) => (
                <div
                  key={item.step}
                  className={`surface-panel flex h-full flex-col justify-between p-5 ${
                    index === 0
                      ? "border-amber-300/24 bg-[linear-gradient(180deg,rgba(251,191,36,0.12),rgba(255,255,255,0.03))] shadow-[0_0_28px_rgba(251,191,36,0.08)]"
                      : item.tone === "cyan"
                        ? "border-cyan-400/16 bg-[linear-gradient(180deg,rgba(34,211,238,0.08),rgba(255,255,255,0.03))]"
                        : "border-fuchsia-400/16 bg-[linear-gradient(180deg,rgba(217,70,239,0.08),rgba(255,255,255,0.03))]"
                  }`}
                >
                  <div>
                    <div
                      className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                        index === 0 ? "text-amber-100/85" : "text-cyan-200/80"
                      }`}
                    >
                      {item.step}
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {item.text}
                    </p>
                    <div
                      className={`mt-3 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                        item.tone === "amber"
                          ? "border border-amber-300/22 bg-amber-300/12 text-amber-100"
                          : item.tone === "cyan"
                            ? "border border-cyan-400/22 bg-cyan-400/12 text-cyan-100"
                            : "border border-fuchsia-400/22 bg-fuchsia-400/12 text-fuchsia-100"
                      }`}
                    >
                      {item.emphasis}
                    </div>
                  </div>

                  <RouteButton
                    href={item.href}
                    variant="outline"
                    className={`mt-5 justify-between text-slate-100 ${
                      item.tone === "amber"
                        ? "border-amber-300/18 bg-amber-300/10 hover:border-amber-300/34 hover:bg-amber-300/14"
                        : item.tone === "cyan"
                          ? "border-cyan-400/18 bg-cyan-400/10 hover:border-cyan-400/32 hover:bg-cyan-400/14"
                          : "border-fuchsia-400/18 bg-fuchsia-400/10 hover:border-fuchsia-400/32 hover:bg-fuchsia-400/14"
                    }`}
                  >
                    {item.cta}
                  </RouteButton>
                </div>
              ))}
            </div>
          </section>

          <section className="section-shell">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="data-pill">Return pressure</div>
                <h2 className="mt-3 text-3xl font-display font-bold text-white md:text-4xl">
                  Give players a reason to re-open the app before the day ends
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                  The strongest retention surfaces combine urgency, scarcity,
                  and a visible next reward. Mobile users should understand
                  that in one glance.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <CountdownPill label="Daily reset" target={dailyReset} />
                <CountdownPill
                  label="Club drop"
                  target={nextClubDrop}
                  tone="amber"
                />
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <ReturnNudgeCard
                icon={TimerReset}
                label="Daily loop"
                title="Tonight's reward window is still open"
                text="One fast live call, one streak-safe action, and one visible reward is enough to justify the next session."
                tone="cyan"
                lockedText="Next vault bonus unlocks after today's mission"
                actionHref="/live-calls"
                actionLabel="Open daily calls"
              />
              <ReturnNudgeCard
                icon={BellRing}
                label="Social pull"
                title="Your club should feel alive without a push notification"
                text="If members move, territories shift, and ladder pressure rises, the product creates its own return trigger."
                tone="rose"
                lockedText="Elite club banner reveals after 3 active nights"
                actionHref="/clubs"
                actionLabel="Enter club command"
              />
              <ReturnNudgeCard
                icon={Sparkles}
                label="Prestige"
                title="Make tomorrow look more valuable than logging off"
                text="Visible status movement and locked premium cosmetics keep the next visit emotionally loaded."
                tone="amber"
                lockedText="Signature frame unlocks at the next season jump"
                actionHref="/leaderboard"
                actionLabel="View prestige ladder"
              />
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="section-shell">
              <div className="data-pill">Why people return</div>
              <h2 className="mt-4 text-3xl font-display font-bold text-white md:text-4xl">
                Retention starts with visible tension
              </h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                When the world state is alive, clubs matter, and rank can move
                fast, players do not need a notification to come back. They feel
                the pull.
              </p>

              <div className="mt-8 space-y-4">
                {comebackSignals.map((item, index) => (
                  <div
                    key={item.title}
                    className="surface-panel flex gap-4 p-4 md:p-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-sm font-display font-bold text-primary">
                      0{index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-300">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="command-frame p-3 sm:p-4 md:p-5">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="data-pill">Live conflict view</div>
                  <h2 className="mt-3 text-2xl font-display font-bold text-white md:text-3xl">
                    A map players want to monitor
                  </h2>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                  24 active fronts currently under pressure
                </div>
              </div>

              <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-1.5 sm:p-2 md:p-3">
                <LandingWorldMapPreview />
              </div>
            </div>
          </div>

          <div className="section-shell">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="data-pill">Conflict telemetry</div>
                <h2 className="mt-3 text-3xl font-display font-bold text-white">
                  Watch the war state evolve in real time
                </h2>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                More live context means more reason to return
              </div>
            </div>

            <ActiveWarsDebug />
          </div>

          <Leaderboard />
        </div>
      </section>
    </main>
  );
}
