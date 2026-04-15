"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Crown,
  Flame,
  Gift,
  Loader2,
  LogOut,
  Radio,
  Shield,
  Trophy,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FaDiscord, FaTwitch } from "react-icons/fa";
import { CountdownPill } from "@/components/engagement/CountdownPill";
import Navigation from "@/components/landing/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getHoursFromNow, getNextUtcMidnight } from "@/lib/countdown";

interface Guild {
  id: string;
  name: string;
  icon: string | null;
}

const notifications = [
  {
    title: "Member unlocked new badge",
    body: "A club member reached Vanguard status.",
    tone: "border-cyan-300/20 bg-cyan-300/10",
    icon: Trophy,
    action: "View",
  },
  {
    title: "War zone approaching critical",
    body: "Pressure window opens soon. Rally action recommended.",
    tone: "border-orange-300/24 bg-orange-500/12",
    icon: Flame,
    action: "Open map",
  },
  {
    title: "Reward claim available",
    body: "Your weekly momentum reward is ready.",
    tone: "border-amber-300/20 bg-amber-300/10",
    icon: Gift,
    action: "Claim",
  },
];

const schedule = [
  { day: "Today", title: "Daily live ritual", time: "3:00 PM EST" },
  { day: "Tomorrow", title: "Strategy session", time: "5:00 PM EST" },
  { day: "Friday", title: "Community raid", time: "7:00 PM EST" },
];

export default function Page() {
  const { getDiscordAccessToken, session, user, signOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<string | null>(null);
  const [guildSyncIssue, setGuildSyncIssue] = useState<string | null>(null);

  useEffect(() => {
    const loadGuilds = async () => {
      const token = getDiscordAccessToken();
      if (!token) {
        setGuildSyncIssue(null);
        setLoading(false);
        return;
      }

      try {
        setGuildSyncIssue(null);
        const response = await fetch("/api/discord/guilds", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: token }),
        });

        if (!response.ok) {
          setGuildSyncIssue(
            "Discord is connected, but server access could not be refreshed yet. You can keep using the cockpit while we retry later.",
          );
          setLoading(false);
          return;
        }

        const data = await response.json();
        setGuilds(data);
      } catch {
        setGuildSyncIssue(
          "The server list could not be refreshed. This does not block the rest of the dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadGuilds();
  }, [getDiscordAccessToken]);

  const handleCreateClub = async (guild: Guild) => {
    if (!user) return;

    setCreating(guild.id);

    const response = await fetch("/api/clubs/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serverId: guild.id,
        serverName: guild.name,
        serverIcon: guild.icon,
        userId: user.id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast({
        title: "Club launch failed",
        description: data?.error || "We could not create the club shell.",
        variant: "destructive",
      });
      setCreating(null);
      return;
    }

    if (!data?.slug) {
      toast({
        title: "Club created, but launch is incomplete",
        description: "No club slug was returned by the server.",
        variant: "destructive",
      });
      setCreating(null);
      return;
    }

    router.push(`/clubs/${data.slug}`);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const handleSwitchProvider = async () => {
    await signOut();
    router.push("/login?redirect=/dashboard");
  };

  const dailyReset = getNextUtcMidnight();
  const liveCallPulse = getHoursFromNow(2);
  const sessionProvider = String(session?.user?.app_metadata?.provider ?? "");
  const isTwitchSession = sessionProvider === "twitch";
  const hasDiscordProvider = sessionProvider === "discord";
  const displayName = useMemo(() => {
    const name =
      session?.user?.user_metadata?.full_name ||
      session?.user?.user_metadata?.name ||
      session?.user?.user_metadata?.preferred_username ||
      user?.email?.split("@")[0] ||
      "Commander";

    return String(name).split(/[_.-]/)[0] || "Commander";
  }, [session, user]);
  const activeClubName = guilds[0]?.name || "Raiders of the Realm";
  const missionProgress = guilds.length > 0 ? 75 : isTwitchSession ? 52 : 18;

  return (
    <div className="min-h-screen text-white">
      <Navigation />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(34,211,238,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.35)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="absolute left-1/2 top-16 h-[560px] w-[760px] -translate-x-1/2 rounded-full bg-cyan-400/12 blur-[155px]" />
        <div className="absolute right-[-12rem] top-64 h-[520px] w-[520px] rounded-full bg-violet-500/12 blur-[150px]" />
        <div className="absolute bottom-0 left-0 h-[460px] w-[460px] rounded-full bg-amber-400/8 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-8 pt-28 sm:px-5 md:px-8 md:pb-10 md:pt-32">
        <div className="mb-6 flex flex-col gap-3 rounded-[1.35rem] border border-white/10 bg-white/[0.045] px-4 py-3 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10 font-display text-sm font-black text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.18)]">
              RG
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300">
                Daily command center
              </div>
              <div className="font-display text-lg font-black text-white">
                RallyGuild Dashboard
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {user ? (
              <div className="metal-chip">
                <User className="h-4 w-4 text-primary" />
                {user.email}
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => router.push("/rewards")}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition-colors hover:bg-white/10"
              aria-label="Open rewards"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white">
                3
              </span>
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/16"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="command-frame hero-sheen relative overflow-hidden p-5 sm:p-7 xl:min-h-[230px]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.18),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.16),transparent_34%)]" />
            <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(250px,310px)] xl:items-center">
              <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_45px_rgba(34,211,238,0.22)]">
                  <User className="h-10 w-10 text-cyan-200" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-balance text-3xl font-display font-black leading-tight text-white md:text-4xl 2xl:text-5xl">
                    Welcome back,{" "}
                    <span className="bg-gradient-to-r from-cyan-200 to-violet-300 bg-clip-text text-transparent">
                      {displayName}!
                    </span>
                  </h1>
                  <div className="mt-5 max-w-xl">
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                      <span>
                        Today&apos;s mission:{" "}
                        <strong className="text-white">Start today&apos;s live call</strong>
                      </span>
                      <span className="font-bold text-cyan-300">
                        {missionProgress}% complete
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 shadow-[0_0_18px_rgba(34,211,238,0.55)]"
                        style={{ width: `${missionProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <button
                  type="button"
                  onClick={() => router.push("/live-calls")}
                  className="inline-flex min-h-14 items-center justify-center gap-3 whitespace-normal rounded-[1.1rem] bg-cyan-300 px-5 py-4 text-center font-display text-sm font-black uppercase leading-tight tracking-[0.06em] text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.45)] transition-transform hover:-translate-y-0.5 hover:bg-cyan-200"
                >
                  Start Live Call
                  <Radio className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/clubs")}
                  className="inline-flex min-h-14 items-center justify-center gap-3 whitespace-normal rounded-[1.1rem] border border-orange-300/45 bg-orange-500/16 px-5 py-4 text-center font-display text-sm font-black uppercase leading-tight tracking-[0.06em] text-orange-100 shadow-[0_0_28px_rgba(249,115,22,0.2)] transition-transform hover:-translate-y-0.5 hover:bg-orange-500/24"
                >
                  Open Club Command
                  <Crown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="relative overflow-hidden rounded-[1.35rem] border border-orange-300/30 bg-gradient-to-br from-orange-500/12 via-cyan-300/8 to-slate-950/80 p-5 shadow-[0_0_35px_rgba(249,115,22,0.12)]"
          >
            <div className="absolute right-[-2rem] top-[-2rem] h-32 w-32 rounded-full bg-orange-300/18 blur-3xl" />
            <div className="relative">
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Streak card
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-[1.2rem] border border-orange-300/30 bg-orange-500/16">
                  <Flame className="h-8 w-8 text-orange-300" />
                </div>
                <div>
                  <div className="font-display text-3xl font-black text-white">
                    14-Day{" "}
                    <span className="bg-gradient-to-r from-orange-200 to-cyan-200 bg-clip-text text-transparent">
                      Streak
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-slate-300">
                    Next reward:{" "}
                    <span className="font-bold text-orange-200">
                      Unlock Elite Badge
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <CountdownPill label="Reset" target={dailyReset} tone="cyan" />
              </div>
            </div>
          </motion.aside>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr_0.95fr]">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="section-shell"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <div className="data-pill">Club momentum panel</div>
                <h2 className="mt-3 text-2xl font-display font-black text-white">
                  {activeClubName}
                </h2>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-orange-300/25 bg-orange-500/12 text-lg font-display font-black text-orange-200">
                {guilds.length > 0 ? "80%" : "12%"}
              </div>
            </div>

            <div className="relative mb-5 overflow-hidden rounded-[1.35rem] border border-cyan-300/15 bg-black/25 p-4">
              <svg viewBox="0 0 520 250" className="h-52 w-full" role="img" aria-label="Territory control map">
                <defs>
                  <filter id="dashboard-territory-glow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path d="M48 88 L128 42 L225 68 L270 128 L205 190 L98 178 L34 136 Z" fill="rgba(34,211,238,0.17)" stroke="#22d3ee" strokeWidth="4" filter="url(#dashboard-territory-glow)" />
                <path d="M225 68 L340 44 L462 86 L478 162 L382 210 L270 128 Z" fill="rgba(168,85,247,0.18)" stroke="#a855f7" strokeWidth="4" filter="url(#dashboard-territory-glow)" />
                <path d="M205 190 L270 128 L382 210 L298 235 Z" fill="rgba(249,115,22,0.18)" stroke="#fb923c" strokeWidth="4" filter="url(#dashboard-territory-glow)" />
                <path d="M128 42 L225 68 L340 44" fill="none" stroke="#67e8f9" strokeWidth="2" strokeDasharray="6 9" opacity="0.65" />
                <path d="M270 128 L478 162" fill="none" stroke="#fb923c" strokeWidth="2" strokeDasharray="6 9" opacity="0.65" />
                {([
                  [110, 112, "#22d3ee"],
                  [210, 120, "#22d3ee"],
                  [346, 104, "#a855f7"],
                  [418, 156, "#fb923c"],
                ] as Array<[number, number, string]>).map(([cx, cy, color]) => (
                  <g key={`${cx}-${cy}`}>
                    <circle cx={cx} cy={cy} r="17" fill={`${color}25`} />
                    <circle cx={cx} cy={cy} r="7" fill={color} />
                  </g>
                ))}
              </svg>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-300">Territory pressure</span>
                  <span className="font-bold text-orange-200">War Zone 7 - 87%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[87%] rounded-full bg-gradient-to-r from-cyan-300 via-violet-400 to-orange-400 shadow-[0_0_18px_rgba(249,115,22,0.45)]" />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/live-calls")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-[1.1rem] bg-cyan-300 px-5 py-4 font-display font-black text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.35)] transition-transform hover:-translate-y-0.5"
            >
              Schedule daily ritual
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="section-shell"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="data-pill">Live calls panel</div>
                <h2 className="mt-3 text-2xl font-display font-black text-white">
                  Today&apos;s live call
                </h2>
              </div>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                Active
              </span>
            </div>

            <div className="rounded-[1.25rem] border border-blue-300/20 bg-blue-400/10 p-4">
              <div className="text-lg font-display font-black text-white">
                Daily Live Call - 3:00 PM EST
              </div>
              <div className="mt-3 flex items-center gap-2 text-cyan-300">
                <span className="h-px flex-1 bg-cyan-300/25" />
                <Radio className="h-5 w-5" />
                <span className="h-px flex-1 bg-cyan-300/25" />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => router.push("/live-calls")}
                  className="rounded-xl border border-cyan-300/25 bg-cyan-300/12 px-4 py-3 text-sm font-bold text-cyan-100 transition-colors hover:bg-cyan-300/20"
                >
                  Create first live call
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/live-calls")}
                  className="rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-cyan-200"
                >
                  Join live call
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {schedule.map((item) => (
                <div
                  key={`${item.day}-${item.time}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3"
                >
                  <div>
                    <div className="text-sm font-bold text-white">
                      {item.time} - {item.title}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">
                      {item.day}
                    </div>
                  </div>
                  <CalendarDays className="h-4 w-4 text-cyan-300" />
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="space-y-5"
          >
            <div className="section-shell">
              <div className="data-pill">Notifications panel</div>
              <div className="mt-4 space-y-3">
                {notifications.map(({ title, body, tone, icon: Icon, action }) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() =>
                      action === "Open map"
                        ? router.push("/war-map")
                        : action === "Claim"
                          ? router.push("/rewards")
                          : router.push("/profile")
                    }
                    className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-transform hover:-translate-y-0.5 ${tone}`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/20">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white">{title}</div>
                      <div className="mt-1 text-xs leading-5 text-slate-300">
                        {body}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-cyan-200">
                      {action}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="section-shell overflow-hidden">
              <div className="mb-4 flex items-center justify-between">
                <div className="data-pill">War map preview</div>
                <CountdownPill label="Pulse" target={liveCallPulse} tone="amber" />
              </div>
              <div className="relative overflow-hidden rounded-[1.25rem] border border-cyan-300/15 bg-black/25 p-3">
                <svg viewBox="0 0 520 190" className="h-40 w-full" aria-label="War map preview">
                  <path d="M35 110 L128 54 L224 76 L268 130 L198 166 L82 154 Z" fill="rgba(34,211,238,0.16)" stroke="#22d3ee" strokeWidth="4" />
                  <path d="M224 76 L330 54 L468 98 L424 156 L268 130 Z" fill="rgba(168,85,247,0.16)" stroke="#a855f7" strokeWidth="4" />
                  <path d="M198 166 L268 130 L424 156 L354 182 Z" fill="rgba(249,115,22,0.18)" stroke="#fb923c" strokeWidth="4" />
                  {([
                    [88, 122, "#22d3ee", "North: 65%"],
                    [230, 88, "#22d3ee", "Room 1"],
                    [340, 106, "#a855f7", "East: 65%"],
                    [390, 154, "#fb923c", "Central: 20%"],
                  ] as Array<[number, number, string, string]>).map(([cx, cy, color, label]) => (
                    <g key={`${cx}-${cy}`}>
                      <circle cx={cx} cy={cy} r="16" fill={`${color}22`} />
                      <circle cx={cx} cy={cy} r="7" fill={color} />
                      <text
                        x={Number(cx) + 16}
                        y={Number(cy) - 10}
                        fill="#e2e8f0"
                        fontSize="16"
                        fontWeight="700"
                      >
                        {label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </motion.section>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1.1fr]">
          <section className="section-shell">
            {loading ? (
              <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
                <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
                <p className="text-lg font-semibold text-white">
                  Pulling in your Discord servers
                </p>
                <p className="mt-2 max-w-md text-slate-400">
                  We are checking where you can launch a club.
                </p>
              </div>
            ) : guilds.length > 0 ? (
              <>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <div className="data-pill">Eligible servers</div>
                    <h2 className="mt-3 text-2xl font-display font-black text-white">
                      Choose your launchpad
                    </h2>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                    {guilds.length} server{guilds.length > 1 ? "s" : ""} ready
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {guilds.map((guild, index) => (
                    <motion.div
                      key={guild.id}
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.06 }}
                      className="surface-panel flex flex-col gap-4 p-4"
                    >
                      <div className="flex items-center gap-4">
                        {guild.icon ? (
                          <img
                            src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                            alt={guild.name}
                            className="h-14 w-14 rounded-[1.1rem] border border-white/10 object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-[1.1rem] border border-cyan-300/20 bg-cyan-300/10 text-xl font-display font-black text-cyan-100">
                            {guild.name[0]}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="truncate text-lg font-semibold text-white">
                            {guild.name}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            Discord ID: {guild.id}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCreateClub(guild)}
                        disabled={creating === guild.id}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/25 bg-primary/14 px-5 py-3 font-semibold text-white transition-all hover:border-primary/40 hover:bg-primary/18 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {creating === guild.id ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            Launch club
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div>
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-amber-400/18 bg-amber-400/10">
                  {isTwitchSession ? (
                    <FaTwitch className="h-9 w-9 text-[#a970ff]" />
                  ) : (
                    <Shield className="h-9 w-9 text-amber-300" />
                  )}
                </div>
                <h2 className="text-center text-2xl font-display font-black text-white">
                  {isTwitchSession
                    ? "Twitch creator access is connected"
                    : hasDiscordProvider
                      ? "Discord is connected. Choose your next setup step."
                      : "Choose how this community should start"}
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-center text-slate-300">
                  {guildSyncIssue ||
                    "Start with Discord server operations or Twitch live-community momentum. Nothing is broken; this is your setup runway."}
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleSwitchProvider}
                    className="rounded-[1.25rem] border border-[#7289DA]/25 bg-[#7289DA]/12 p-5 text-left transition-colors hover:bg-[#7289DA]/20"
                  >
                    <FaDiscord className="mb-4 h-6 w-6 text-[#8ea1ff]" />
                    <div className="font-display text-lg font-bold text-white">
                      Set up Discord
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Best for server admins, roles, and structured club
                      operations.
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={
                      isTwitchSession
                        ? () => router.push("/live-calls")
                        : handleSwitchProvider
                    }
                    className="rounded-[1.25rem] border border-[#a970ff]/25 bg-[#a970ff]/12 p-5 text-left transition-colors hover:bg-[#a970ff]/20"
                  >
                    <FaTwitch className="mb-4 h-6 w-6 text-[#c79cff]" />
                    <div className="font-display text-lg font-bold text-white">
                      Start with Twitch
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Best for creator-led live rituals and audience return
                      loops.
                    </p>
                  </button>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-[1.25rem] border border-cyan-300/18 bg-white/[0.045] px-5 py-4 text-sm text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="mr-3 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                  Trust strip
                </span>
                Virtual engagement only. No cash value. No financial return.
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                  Secure data
                </span>
                <span className="inline-flex items-center gap-2">
                  <Shield className="h-4 w-4 text-cyan-300" />
                  Privacy protected
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-cyan-300" />
                  Daily rituals
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
