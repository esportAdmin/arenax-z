"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarClock,
  Crosshair,
  Radio,
  ShieldCheck,
  Sparkles,
  Swords,
  TimerReset,
  Users,
} from "lucide-react";

type QueueStatus = "idle" | "joining" | "active" | "cancelled" | "error";

interface QueueSession {
  id?: string | null;
  estimated_wait_s?: number | null;
  session_id?: string | null;
}

interface QueueScreenProps {
  userId: string;
  queueType?: "ranked" | "casual";
}

const missionCards = [
  {
    label: "Live ritual",
    title: "Start the daily call",
    body: "Give members a visible reason to return before the next reset.",
    icon: Radio,
    href: "/live-calls",
    tone: "cyan",
  },
  {
    label: "War room",
    title: "Pick the active front",
    body: "Turn territory pressure into a shared community objective.",
    icon: Swords,
    href: "/wars",
    tone: "orange",
  },
  {
    label: "Club pulse",
    title: "Rally core members",
    body: "Bring the first group online and make momentum visible.",
    icon: Users,
    href: "/clubs",
    tone: "violet",
  },
];

const trustSignals = [
  "Discord/Twitch ready",
  "Community-first",
  "No cash value",
  "Retention focused",
];

/**
 * Formats a duration for the command cockpit timer.
 *
 * Example:
 * ```ts
 * formatTime(125) // "02:05"
 * ```
 */
function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const rest = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${rest}`;
}

/**
 * Renders the tone-specific border and glow used by mission cards.
 *
 * Example:
 * ```ts
 * getToneClasses("cyan")
 * ```
 */
function getToneClasses(tone: string) {
  if (tone === "orange") {
    return "border-orange-300/24 bg-orange-400/8 text-orange-100 shadow-[0_0_34px_rgba(251,146,60,0.12)]";
  }

  if (tone === "violet") {
    return "border-violet-300/24 bg-violet-400/8 text-violet-100 shadow-[0_0_34px_rgba(167,139,250,0.12)]";
  }

  return "border-cyan-300/24 bg-cyan-400/8 text-cyan-100 shadow-[0_0_34px_rgba(34,211,238,0.12)]";
}

export function QueueScreen({ userId, queueType = "casual" }: QueueScreenProps) {
  const router = useRouter();
  const [status, setStatus] = useState<QueueStatus>("idle");
  const [session, setSession] = useState<QueueSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const startedAt = useRef<number | null>(null);

  const estimatedWait = session?.estimated_wait_s ?? 150;
  const shortUserId = userId.slice(0, 8).toUpperCase();

  /**
   * Starts a lightweight community pairing request through the existing queue API.
   *
   * Example:
   * ```tsx
   * <button onClick={startRallySession}>Start rally session</button>
   * ```
   */
  async function startRallySession() {
    setStatus("joining");
    setError(null);
    startedAt.current = Date.now();

    try {
      const response = await fetch("/api/queue/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queue_type: queueType }),
      });
      const payload = await response.json();

      if (!response.ok || payload?.error) {
        setError(payload?.error ?? "The rally queue could not start.");
        setStatus("error");
        return;
      }

      setSession(payload.session ?? payload);
      setStatus("active");
    } catch {
      setError("The command uplink dropped. Try again in a moment.");
      setStatus("error");
    }
  }

  /**
   * Cancels the current rally queue session without leaving stale state behind.
   *
   * Example:
   * ```tsx
   * <button onClick={cancelRallySession}>Cancel</button>
   * ```
   */
  async function cancelRallySession() {
    const sessionId = session?.id ?? session?.session_id ?? null;

    await fetch("/api/queue/leave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    }).catch(() => undefined);

    setSession(null);
    setStatus("cancelled");
    startedAt.current = null;
    window.setTimeout(() => setStatus("idle"), 1600);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030915] px-4 py-24 text-white sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12%] top-[-18%] h-[28rem] w-[28rem] rounded-full bg-cyan-400/12 blur-3xl" />
        <div className="absolute right-[-8%] top-[18%] h-[30rem] w-[30rem] rounded-full bg-orange-500/12 blur-3xl" />
        <div className="absolute bottom-[-22%] left-[30%] h-[26rem] w-[26rem] rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.045)_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>

      <section className="relative mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/18 bg-[linear-gradient(135deg,rgba(8,23,42,0.94),rgba(5,10,24,0.9)_52%,rgba(49,24,12,0.72))] p-5 shadow-[0_0_90px_rgba(34,211,238,0.12)] backdrop-blur-xl sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/80 to-orange-200/70" />
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/24 bg-cyan-300/10 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.2em] text-cyan-200">
            <Sparkles className="h-3.5 w-3.5" />
            Rally launchpad
          </div>

          <h1 className="mt-5 max-w-3xl font-display text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl">
            Start a rally session players want to join.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Open a lightweight community session, route members into live calls,
            and turn today's activity into visible momentum before reset.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["Operator", shortUserId],
              ["Mode", queueType === "ranked" ? "Competitive" : "Community"],
              ["Est. pulse", formatTime(estimatedWait)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              >
                <div className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-slate-400">
                  {label}
                </div>
                <div className="mt-2 text-xl font-black text-white">{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {status === "active" || status === "joining" ? (
              <button
                type="button"
                onClick={cancelRallySession}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-5 text-sm font-black uppercase tracking-[0.12em] text-slate-200 transition hover:bg-white/10"
              >
                <TimerReset className="h-4 w-4" />
                Cancel rally queue
              </button>
            ) : (
              <button
                type="button"
                onClick={startRallySession}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-cyan-200/50 bg-cyan-300 px-5 text-sm font-black uppercase tracking-[0.12em] text-slate-950 shadow-[0_0_36px_rgba(34,211,238,0.42)] transition hover:bg-cyan-200"
              >
                <Radio className="h-4 w-4" />
                {status === "error" ? "Retry rally session" : "Start rally session"}
              </button>
            )}
            <button
              type="button"
              onClick={() => router.push("/war-map")}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-orange-300/32 bg-orange-400/10 px-5 text-sm font-black uppercase tracking-[0.12em] text-orange-100 transition hover:bg-orange-300/16"
            >
              <Crosshair className="h-4 w-4" />
              Open war map
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-rose-300/24 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-100">
              {error}
            </div>
          )}
        </div>

        <aside className="grid gap-4">
          <div className="rounded-[1.75rem] border border-cyan-300/18 bg-white/[0.045] p-5 shadow-[0_20px_70px_rgba(2,12,23,0.3)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200/80">
                  Session status
                </div>
                <h2 className="mt-2 text-2xl font-black text-white">
                  {status === "active"
                    ? "Rally queue live"
                    : status === "joining"
                      ? "Opening channel"
                      : "Ready to launch"}
                </h2>
              </div>
              <ShieldCheck className="h-10 w-10 text-cyan-200" />
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-300 to-orange-300 ${
                    status === "active" || status === "joining" ? "w-4/5" : "w-2/5"
                  }`}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {status === "active"
                  ? "Your rally queue is active. Pull members into the next live call or war room moment."
                  : "Start here when the community needs a clear next action."}
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {missionCards.map(({ body, href, icon: Icon, label, title, tone }) => (
              <button
                key={title}
                type="button"
                onClick={() => router.push(href)}
                className={`group rounded-[1.45rem] border p-4 text-left transition hover:-translate-y-0.5 ${getToneClasses(tone)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-2">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[0.62rem] font-black uppercase tracking-[0.22em] opacity-80">
                      {label}
                    </div>
                    <div className="mt-1 text-base font-black text-white">{title}</div>
                    <p className="mt-1 text-sm leading-5 text-slate-300">{body}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 opacity-70 transition group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        </aside>
      </section>

      <section className="relative mx-auto mt-5 flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 rounded-[1.35rem] border border-white/10 bg-white/[0.045] px-4 py-3 text-xs font-bold text-slate-300 backdrop-blur-xl">
        <div className="inline-flex items-center gap-2 text-cyan-100">
          <CalendarClock className="h-4 w-4" />
          Built for daily community rituals.
        </div>
        <div className="flex flex-wrap gap-2">
          {trustSignals.map((signal) => (
            <span
              key={signal}
              className="rounded-full border border-cyan-300/16 bg-cyan-300/8 px-3 py-1"
            >
              {signal}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
