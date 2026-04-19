"use client";

import { Lock, Radio, Swords, UserPlus } from "lucide-react";

interface ClubLaunchSequenceProps {
  callAccuracy: number;
  hasActiveWar: boolean;
  membersCount: number;
  onNavigate: (href: string) => void;
}

const toneMap = {
  blue: {
    bar: "from-blue-300 to-cyan-200",
    border: "border-blue-300/30",
    glow: "bg-blue-400/12",
    text: "text-blue-200",
  },
  cyan: {
    bar: "from-cyan-300 to-teal-200",
    border: "border-cyan-300/30",
    glow: "bg-cyan-300/12",
    text: "text-cyan-200",
  },
  orange: {
    bar: "from-orange-300 to-amber-200",
    border: "border-orange-300/30",
    glow: "bg-orange-400/12",
    text: "text-orange-200",
  },
  violet: {
    bar: "from-violet-300 via-cyan-300 to-orange-300",
    border: "border-violet-300/30",
    glow: "bg-violet-400/12",
    text: "text-violet-200",
  },
};

/**
 * Shows the four-step launch ritual that teaches admins what to do next
 * without relying on a flat checklist.
 */
export function ClubLaunchSequence({
  callAccuracy,
  hasActiveWar,
  membersCount,
  onNavigate,
}: ClubLaunchSequenceProps) {
  const steps = [
    {
      action: "Schedule call now",
      body: "Establish your presence with one voice or video session.",
      href: "/live-calls",
      icon: Radio,
      progress: 64,
      step: "01",
      title: "Run first live call",
      tone: "cyan" as const,
    },
    {
      action: "Send invites",
      body: "Bring your first leaders into the command center.",
      href: "/clubs",
      icon: UserPlus,
      progress: Math.min(Math.max(membersCount * 20, 18), 76),
      step: "02",
      title: "Invite founding members",
      tone: "orange" as const,
    },
    {
      action: "Choose rivalry",
      body: "Choose a friendly competitive target to create return pressure.",
      href: "/war-map",
      icon: Swords,
      progress: hasActiveWar ? 82 : 42,
      step: "03",
      title: "Pick rivalry",
      tone: "blue" as const,
    },
    {
      action: "Claim badges",
      body: "Reward early members with a launch-era status marker.",
      href: "/rewards",
      icon: Lock,
      progress: callAccuracy > 0 ? Math.min(callAccuracy + 20, 92) : 26,
      step: "04",
      title: "Unlock prestige badge",
      tone: "violet" as const,
    },
  ];

  return (
    <section className="dashboard-card mb-6 border-cyan-300/25 p-5 shadow-[0_0_65px_rgba(34,211,238,0.12)] sm:p-7">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="eyebrow-badge border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
            Launch sequence
          </div>
          <h2 className="mt-4 font-display text-2xl font-black text-white md:text-3xl">
            Bring the club online in four visible moves
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-300">
          Every step creates a reason for members to return, react, and see
          public momentum.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {steps.map(({ action, body, href, icon: Icon, progress, step, title, tone }) => {
          const colors = toneMap[tone];

          return (
            <button
              key={title}
              className={`group relative overflow-hidden rounded-[1.35rem] border ${colors.border} bg-white/[0.055] p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_44px_rgba(0,0,0,0.22)] transition-all hover:-translate-y-1 hover:bg-white/[0.075]`}
              type="button"
              onClick={() => onNavigate(href)}
            >
              <div className={`absolute right-[-2rem] top-[-2rem] h-28 w-28 rounded-full ${colors.glow} blur-3xl`} />
              <div className="relative flex items-center gap-4">
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full border ${colors.border} ${colors.glow} font-display text-2xl font-black ${colors.text}`}>
                  {step}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                    Step {step}
                  </div>
                  <div className="mt-1 font-display text-lg font-black text-white">
                    {title}
                  </div>
                  <p className="mt-1 text-sm leading-5 text-slate-400">
                    {body}
                  </p>
                </div>
                <Icon className={`hidden h-6 w-6 ${colors.text} sm:block`} />
              </div>
              <div className="relative mt-4 flex items-center gap-4">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${colors.bar} shadow-[0_0_18px_rgba(34,211,238,0.45)]`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className={`rounded-full border ${colors.border} px-3 py-1 text-xs font-bold ${colors.text}`}>
                  {action}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
