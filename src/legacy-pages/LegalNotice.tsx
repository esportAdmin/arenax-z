import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Globe2,
  LockKeyhole,
  Scale,
  ShieldCheck,
} from "lucide-react";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

const complianceNotes = [
  {
    title: "Community engagement platform",
    body: "ArenaX / RallyGuild is positioned as software for community retention, live rituals, status progression, and club operations.",
    icon: ShieldCheck,
  },
  {
    title: "No cash-value rewards",
    body: "Arena Points, badges, status, and platform rewards are virtual engagement elements. They have no cash value and no financial return.",
    icon: LockKeyhole,
  },
  {
    title: "Discord and Twitch native",
    body: "The product is designed for gaming communities and creator-led operations using Discord and Twitch as identity and audience channels.",
    icon: Globe2,
  },
];

const requiredBeforeLaunch = [
  "Registered legal entity name",
  "Registered business address",
  "Official support and legal email addresses",
  "Hosting provider details",
  "Final Terms of Service and Privacy Policy review",
  "Billing provider disclosures once Lemon Squeezy is live",
];

export default function LegalNotice() {
  return (
    <div className="min-h-screen bg-[#030915] text-white">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-18%] h-[30rem] w-[30rem] rounded-full bg-cyan-400/12 blur-3xl" />
        <div className="absolute right-[-8%] top-[18%] h-[28rem] w-[28rem] rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.045)_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-cyan-300/18 bg-[linear-gradient(135deg,rgba(8,23,42,0.94),rgba(5,10,24,0.9)_54%,rgba(45,24,12,0.72))] p-6 shadow-[0_0_90px_rgba(34,211,238,0.12)] backdrop-blur-xl lg:p-8">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/80 to-orange-200/70" />
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/24 bg-cyan-300/10 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.22em] text-cyan-200">
            <Scale className="h-3.5 w-3.5" />
            Legal notice
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <h1 className="font-display text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl">
                Transparent legal footing before public launch.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                This page intentionally avoids fake company data. Final legal
                entity, address, and billing disclosures must be completed
                before ArenaX is made public.
              </p>
            </div>

            <div className="rounded-[1.35rem] border border-amber-300/24 bg-amber-400/10 p-4 text-sm leading-6 text-amber-50">
              <div className="flex items-center gap-2 font-black uppercase tracking-[0.18em]">
                <AlertTriangle className="h-4 w-4" />
                Pre-launch status
              </div>
              <p className="mt-3 text-amber-100/85">
                Replace this notice with attorney-reviewed production legal
                details before enabling a public domain and paid subscriptions.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-3">
          {complianceNotes.map(({ body, icon: Icon, title }) => (
            <div
              key={title}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/18 bg-cyan-300/10">
                <Icon className="h-5 w-5 text-cyan-200" />
              </div>
              <h2 className="mt-4 text-lg font-black text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
            </div>
          ))}
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.65rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-cyan-300/18 bg-cyan-300/10 p-3">
                <Building2 className="h-5 w-5 text-cyan-200" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200/80">
                  Current operator record
                </div>
                <h2 className="mt-1 text-2xl font-black text-white">
                  To be completed
                </h2>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
              <p>
                ArenaX is in pre-publication preparation. No final legal entity
                details are displayed here until incorporation, banking,
                billing, and counsel review are complete.
              </p>
              <p>
                For preview access, contact the project owner directly through
                the private onboarding channel.
              </p>
            </div>
          </div>

          <div className="rounded-[1.65rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200/80">
              Required before launch
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {requiredBeforeLaunch.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-semibold text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-5 flex flex-col gap-3 rounded-[1.35rem] border border-cyan-300/18 bg-cyan-300/8 p-4 text-sm text-slate-300 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <span>
            ArenaX / RallyGuild is community software. No cash-value rewards,
            no financial return, no wagering.
          </span>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-300/24 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-cyan-100 transition hover:bg-cyan-300/16"
          >
            Open user guide
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
