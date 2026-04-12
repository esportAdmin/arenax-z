import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Gift,
  Shield,
  Swords,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";

const quickStartSteps = [
  {
    title: "Connect your community identity",
    body: "Start with Discord or Twitch so ArenaX recognizes the audience, status, and creator context you already operate inside every day.",
    icon: Compass,
  },
  {
    title: "Enter a club with real gravity",
    body: "Clubs are where loyalty forms. Join one early so the platform immediately feels social, strategic, and worth defending.",
    icon: Users,
  },
  {
    title: "Lock your first live decision",
    body: "Live calls create your daily rhythm. One strong read is enough to activate streak pressure, ARENA rewards, and repeat engagement.",
    icon: Zap,
  },
  {
    title: "Track the live war theater",
    body: "The map keeps moving between sessions. Check it often to understand where pressure is building and why your next visit matters now.",
    icon: Swords,
  },
];

const keyAreas = [
  {
    title: "Dashboard",
    description: "Your daily command center for streaks, missions, rewards, and momentum.",
    href: "/dashboard",
  },
  {
    title: "Live Calls",
    description: "Log match calls, build your record, and turn live attention into a repeat habit.",
    href: "/live-calls",
  },
  {
    title: "Clubs",
    description: "Join the social core of ArenaX and build loyalty around team identity.",
    href: "/clubs",
  },
  {
    title: "War Map",
    description: "Follow the live theater of territory pressure, front lines, and conflict.",
    href: "/war-map",
  },
  {
    title: "Leaderboard",
    description: "Protect your status, compare your progress, and see where prestige lives.",
    href: "/leaderboard",
  },
  {
    title: "Rewards",
    description: "Convert progress into visible value and keep the next unlock in sight.",
    href: "/rewards",
  },
];

const tips = [
  "Start with one simple action: join a club or make a live call.",
  "Check the dashboard daily to protect your streak and claim visible progress.",
  "Use the war map to understand why your next session matters right now.",
  "Visit the leaderboard often if prestige and public status matter to your community.",
  "Open rewards after every strong session so progress feels tangible.",
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pb-12 pt-24">
        <div className="container-arena space-y-8">
          <section className="command-frame hero-sheen relative overflow-hidden px-6 py-8 lg:px-10 lg:py-10">
            <div className="subtle-noise absolute inset-0 opacity-50" />
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(0,245,255,0.14),transparent_55%)]" />

            <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
              <div className="space-y-5">
              <div className="eyebrow-badge">User guide</div>
              <div className="eyebrow-badge">Concierge onboarding</div>

              <div>
                <h1 className="font-display text-4xl font-black tracking-tight text-white lg:text-6xl">
                    Enter ArenaX
                    <span className="gradient-text-primary block">
                      like a premium operator.
                    </span>
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 lg:text-lg">
                    This concierge guide is designed for Discord leaders,
                    Twitch-native creators, and high-intent players who want to
                    understand where to begin, what to prioritize, and how to
                    turn ArenaX into a daily ritual worth returning to.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/login">
                      Enter with your community
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href="/dashboard">Open command center</Link>
                  </Button>
              </div>
              </div>

              <div className="section-shell space-y-4">
                <div className="eyebrow-badge">Best first session</div>

                <div className="surface-panel">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    White-glove path
                  </div>
                  <div className="mt-2 text-xl font-black text-white">
                    Connect. Join a club. Make one live call. Protect your momentum.
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    That first loop is enough to reveal the product: community,
                    live pressure, visible prestige, and progress worth defending
                    tomorrow.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="surface-panel border-cyan-400/18 bg-cyan-400/8">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Shield className="h-4 w-4 text-cyan-300" />
                      Community-first access
                    </div>
                  </div>
                  <div className="surface-panel border-amber-400/18 bg-amber-400/8">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Gift className="h-4 w-4 text-amber-300" />
                      Premium reward visibility
                    </div>
                  </div>
                  <div className="surface-panel border-fuchsia-400/18 bg-fuchsia-400/8">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Trophy className="h-4 w-4 text-fuchsia-300" />
                      Prestige that pulls you back
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section-shell space-y-5">
            <div>
              <div className="eyebrow-badge">Quick start</div>
              <h2 className="mt-3 font-display text-3xl font-black text-white">
                Your first premium session
              </h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {quickStartSteps.map((step, index) => (
                <div key={step.title} className="surface-panel p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <step.icon className="h-5 w-5 text-cyan-300" />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Step {String(index + 1).padStart(2, "0")}
                      </div>
                      <h3 className="mt-2 text-lg font-bold text-white">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="section-shell space-y-5">
            <div>
              <div className="eyebrow-badge">Platform map</div>
              <h2 className="mt-3 font-display text-3xl font-black text-white">
                Where each surface creates value
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {keyAreas.map((area) => (
                <div key={area.title} className="surface-panel flex h-full flex-col p-5">
                  <h3 className="text-lg font-bold text-white">{area.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-slate-400">
                    {area.description}
                  </p>
                  <Button asChild variant="outline" className="mt-4 justify-between">
                    <Link href={area.href}>
                      Enter {area.title}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="section-shell space-y-4">
              <div>
              <div className="eyebrow-badge">Good habits</div>
              <h2 className="mt-3 font-display text-3xl font-black text-white">
                  How power users get value fast
                </h2>
              </div>

              <div className="space-y-3">
                {tips.map((tip) => (
                  <div key={tip} className="surface-panel p-4 text-sm leading-6 text-slate-300">
                    {tip}
                  </div>
                ))}
              </div>
            </div>

            <div className="section-shell space-y-4">
              <div>
              <div className="eyebrow-badge">Need help?</div>
              <h2 className="mt-3 font-display text-3xl font-black text-white">
                  Concierge support and next steps
                </h2>
              </div>

              <div className="surface-panel">
                <div className="text-sm font-semibold text-white">
                  Best path for first-time operators
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  If this is your first visit, start with the dashboard and
                  live calls. Once you feel the daily rhythm, clubs and the war
                  map become the deeper strategic layer.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button asChild size="lg">
                  <Link href="/contact">
                    Contact concierge support
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/faq">Open quick answers</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
