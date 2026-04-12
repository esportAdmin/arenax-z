"use client";

import {
  Flame,
  Globe2,
  LockKeyhole,
  Shield,
  Sparkles,
  Swords,
  TimerReset,
  Trophy,
  Users,
} from "lucide-react";
import Navigation from "../../src/components/landing/Navigation";
import ActiveWars from "../../src/components/clubs/ActiveWars";
import ClubHeader from "../../src/components/clubs/ClubHeader";
import ClubLeaderboard from "../../src/components/clubs/ClubLeaderboard";
import ClubStats from "../../src/components/clubs/ClubStats";
import MemberList from "../../src/components/clubs/MemberList";
import OwnedTerritories from "../../src/components/clubs/OwnedTerritories";
import { CountdownPill } from "@/components/engagement/CountdownPill";
import { ReturnNudgeCard } from "@/components/engagement/ReturnNudgeCard";
import { getHoursFromNow, getNextWeeklyReset } from "@/lib/countdown";

const retentionCards = [
  {
    icon: Users,
    title: "Identity players rally around",
    text: "A club is not just a tag. It gives players loyalty, pride, and a reason to check what their squad is doing next.",
  },
  {
    icon: Flame,
    title: "Daily tension keeps energy high",
    text: "When wars evolve, rankings move, and members are visible, people come back to avoid missing the swing.",
  },
  {
    icon: Trophy,
    title: "Shared prestige scales better",
    text: "Winning feels bigger when it lifts a group. Clubs turn solo sessions into social momentum.",
  },
];

const clubMetrics = [
  {
    label: "Club fronts",
    value: "1,245",
    icon: Swords,
    tone: "from-rose-500/24 to-orange-500/6",
  },
  {
    label: "Territories in play",
    value: "8,900+",
    icon: Globe2,
    tone: "from-cyan-500/24 to-sky-500/6",
  },
  {
    label: "Members active today",
    value: "450,000+",
    icon: Users,
    tone: "from-violet-500/24 to-fuchsia-500/6",
  },
  {
    label: "Club prestige",
    value: "Top 1%",
    icon: Shield,
    tone: "from-amber-400/24 to-yellow-500/6",
  },
];

export default function ClubsPage() {
  const nextWarWave = getHoursFromNow(2);
  const nextRecruitmentRefresh = getNextWeeklyReset(3, 19);

  return (
    <div className="min-h-screen overflow-hidden text-white">
      <Navigation />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[8%] h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-[150px]" />
        <div className="absolute right-[4%] top-[22%] h-[520px] w-[520px] rounded-full bg-violet-500/10 blur-[170px]" />
        <div className="absolute bottom-[-6%] left-[30%] h-[420px] w-[420px] rounded-full bg-amber-400/8 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-[94px] sm:px-5 md:px-8">
        <section className="section-shell">
          <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
            <div className="space-y-6">
              <div className="eyebrow-badge">
                <Sparkles className="h-4 w-4 text-primary" />
                Clubs are the retention engine
              </div>

              <div className="max-w-3xl">
                <h1 className="text-balance text-4xl font-display font-black leading-tight text-white md:text-6xl">
                  Join the force players
                  <span className="gradient-text-primary"> come back for</span>
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                  Clubs give ArenaX-Z its social gravity. Territory wars,
                  collective rank, and visible member activity turn casual
                  visitors into players who keep checking the board.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <CountdownPill label="War wave" target={nextWarWave} tone="rose" />
                <CountdownPill
                  label="Recruit refresh"
                  target={nextRecruitmentRefresh}
                  tone="amber"
                />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {retentionCards.map((card) => (
                  <div key={card.title} className="surface-panel p-4">
                    <div className="mb-3 inline-flex rounded-2xl border border-white/10 bg-white/5 p-2.5">
                      <card.icon className="h-4 w-4 text-primary" />
                    </div>
                    <h2 className="text-sm font-display font-bold uppercase tracking-[0.14em] text-white">
                      {card.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {card.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {clubMetrics.map(({ label, value, icon: Icon, tone }) => (
                <div
                  key={label}
                  className={`surface-panel hero-sheen bg-gradient-to-br ${tone} p-5`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {label}
                    </span>
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="mt-4 text-4xl font-display font-bold text-white">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <ReturnNudgeCard
            icon={TimerReset}
            label="War tension"
            title="Members should feel the next front approaching"
            text="Countdowns and visible battle pressure make clubs feel alive even when nobody is chatting."
            tone="rose"
            lockedText="Critical war room opens after your next active defense"
          />
          <ReturnNudgeCard
            icon={LockKeyhole}
            label="Status unlock"
            title="Prestige banners should be earned, not handed out"
            text="Locked club identity systems create aspiration and social pull, especially on mobile repeat visits."
            tone="amber"
            lockedText="Elite crest unlocks at top 10% club power"
          />
          <ReturnNudgeCard
            icon={Shield}
            label="Loyalty loop"
            title="Make daily presence look like commitment"
            text="If the club looks stronger every time a member returns, churn starts to feel like abandoning a cause."
            tone="cyan"
            lockedText="Founders frame unlocks after 7 active nights"
          />
        </section>

        <div className="mt-8">
          <ClubHeader />
        </div>

        <div className="mt-6">
          <ClubStats />
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.1fr_0.95fr]">
          <div className="section-shell">
            <div className="mb-5 flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Member momentum
                </div>
                <div className="text-xl font-display font-bold text-white">
                  Who is driving the club
                </div>
              </div>
            </div>
            <MemberList />
          </div>

          <div className="space-y-6">
            <div className="section-shell">
              <div className="mb-5 flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Territory control
                  </div>
                  <div className="text-xl font-display font-bold text-white">
                    Own ground players can defend
                  </div>
                </div>
              </div>
              <OwnedTerritories />
            </div>

            <div className="section-shell">
              <div className="mb-5 flex items-center gap-3">
                <Swords className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Conflict queue
                  </div>
                  <div className="text-xl font-display font-bold text-white">
                    Wars that pull players back in
                  </div>
                </div>
              </div>
              <ActiveWars />
            </div>
          </div>

          <div className="section-shell">
            <div className="mb-5 flex items-center gap-3">
              <Trophy className="h-5 w-5 text-primary" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Prestige tracking
                </div>
                <div className="text-xl font-display font-bold text-white">
                  Club ladder
                </div>
              </div>
            </div>
            <ClubLeaderboard />
          </div>
        </section>
      </div>
    </div>
  );
}
