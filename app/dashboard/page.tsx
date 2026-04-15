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
    tone: "border-orange-300/25 bg-orange-500/10",
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

const territorySignals = [
  {
    zone: "North Gate",
    status: "Stable rally",
    control: 65,
    members: "8 active",
    cardClass: "border-cyan-300/20 bg-cyan-300/10",
    dotClass: "bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.8)]",
    barClass: "bg-cyan-300",
    textClass: "text-cyan-200",
  },
  {
    zone: "East Reach",
    status: "Rival pressure",
    control: 72,
    members: "11 active",
    cardClass: "border-violet-300/20 bg-violet-400/10",
    dotClass: "bg-violet-300 shadow-[0_0_18px_rgba(168,85,247,0.8)]",
    barClass: "bg-violet-300",
    textClass: "text-violet-200",
  },
  {
    zone: "War Zone 7",
    status: "Critical window",
    control: 87,
    members: "Rally now",
    cardClass: "border-orange-300/25 bg-orange-500/12",
    dotClass: "bg-orange-300 shadow-[0_0_18px_rgba(251,146,60,0.85)]",
    barClass: "bg-orange-300",
    textClass: "text-orange-200",
  },
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
            <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(230px,260px)] xl:items-center">
              <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_45px_rgba(34,211,238,0.22)] sm:h-20 sm:w-20">
                  <User className="h-10 w-10 text-cyan-200" />
                </div>
                <div className="min-w-0 xl:max-w-[420px] 2xl:max-w-[500px]">
                  <h1 className="max-w-full break-words text-3xl font-display font-black leading-tight text-white md:text-4xl xl:text-[2.45rem] 2xl:text-5xl">
                    Welcome back,{" "}
                    <span className="inline-block max-w-full break-all bg-gradient-to-r from-cyan-200 to-violet-300 bg-clip-text text-transparent sm:break-words">
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

              <div className="grid gap-2.5 sm:grid-cols-2 xl:w-[250px] xl:grid-cols-1 xl:justify-self-end">
                <button
                  type="button"
                  onClick={() => router.push("/live-calls")}
                  className="inline-flex min-h-11 items-center justify-center gap-2.5 whitespace-normal rounded-[0.95rem] bg-cyan-300 px-4 py-3 text-center font-display text-xs font-black uppercase leading-tight tracking-[0.05em] text-slate-950 shadow-[0_0_22px_rgba(34,211,238,0.38)] transition-transform hover:-translate-y-0.5 hover:bg-cyan-200 sm:min-h-12"
                >
                  Start Live Call
                  <Radio className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/clubs")}
                  className="inline-flex min-h-11 items-center justify-center gap-2.5 whitespace-normal rounded-[0.95rem] border border-orange-300/45 bg-orange-500/16 px-4 py-3 text-center font-display text-xs font-black uppercase leading-tight tracking-[0.05em] text-orange-100 shadow-[0_0_20px_rgba(249,115,22,0.18)] transition-transform hover:-translate-y-0.5 hover:bg-orange-500/24 sm:min-h-12"
                >
                  Open Club Command
                  <Crown className="h-3.5 w-3.5" />
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

        <div className="grid items-start gap-5 xl:grid-cols-[1.05fr_0.95fr_0.95fr]">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="dashboard-card"
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

            <div className="relative mb-5 overflow-hidden rounded-[1.5rem] border border-cyan-300/25 bg-[radial-gradient(circle_at_18%_0%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_90%_82%,rgba(249,115,22,0.15),transparent_34%),linear-gradient(180deg,rgba(8,20,34,0.92),rgba(2,6,23,0.74))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_18px_46px_rgba(0,0,0,0.28)]">
              <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(34,211,238,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.35)_1px,transparent_1px)] [background-size:28px_28px]" />
              <div className="relative">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Territory control board
                    </div>
                    <div className="mt-1 font-display text-xl font-black text-white">
                      War Zone 7 is heating up
                    </div>
                  </div>
                  <div className="rounded-2xl border border-orange-300/25 bg-orange-500/12 px-3 py-2 text-right">
                    <div className="font-display text-2xl font-black text-orange-200">
                      87%
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange-100/70">
                      pressure
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {territorySignals.map((signal) => (
                    <div
                      key={signal.zone}
                      className={`rounded-2xl border p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${signal.cardClass}`}
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${signal.dotClass}`} />
                          <div className="min-w-0">
                            <div className="truncate text-sm font-black text-white">
                              {signal.zone}
                            </div>
                            <div className="text-xs text-slate-400">
                              {signal.status}
                            </div>
                          </div>
                        </div>
                        <div className={`text-right text-xs font-black ${signal.textClass}`}>
                          {signal.control}%
                          <div className="text-[10px] font-semibold text-slate-500">
                            {signal.members}
                          </div>
                        </div>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full ${signal.barClass}`}
                          style={{ width: `${signal.control}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-bold text-white">Next best action</span>
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-300">
                      Daily ritual
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-slate-300">
                    Start a live call to turn passive members into visible
                    momentum before the pressure window closes.
                  </p>
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
            className="dashboard-card"
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

            <div className="rounded-[1.35rem] border border-blue-300/25 bg-[linear-gradient(145deg,rgba(59,130,246,0.16),rgba(34,211,238,0.07),rgba(2,6,23,0.4))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_16px_42px_rgba(37,99,235,0.14)]">
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
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
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
            <div className="dashboard-card">
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
                    className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_32px_rgba(0,0,0,0.18)] transition-transform hover:-translate-y-0.5 ${tone}`}
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

            <div className="dashboard-card overflow-hidden">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <div className="data-pill">Live war snapshot</div>
                  <div className="mt-3 font-display text-xl font-black text-white">
                    Pressure rooms
                  </div>
                </div>
                <CountdownPill label="Pulse" target={liveCallPulse} tone="amber" />
              </div>
              <div className="space-y-3">
                {territorySignals.map((signal, index) => (
                  <button
                    key={`snapshot-${signal.zone}`}
                    type="button"
                    onClick={() => router.push(index === 2 ? "/war-map" : "/live-calls")}
                    className={`group w-full rounded-2xl border p-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_14px_34px_rgba(0,0,0,0.18)] transition-transform hover:-translate-y-0.5 ${signal.cardClass}`}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${signal.dotClass}`} />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-black text-white">
                            {signal.zone}
                          </div>
                          <div className="text-xs text-slate-400">
                            {signal.status}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className={`h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1 ${signal.textClass}`} />
                    </div>
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Community pressure</span>
                      <span className={`font-black ${signal.textClass}`}>
                        {signal.control}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full ${signal.barClass}`}
                        style={{ width: `${signal.control}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.section>
        </div>

        <div className="mt-5 grid items-start gap-5 xl:grid-cols-[1fr_1.1fr]">
          <section className="dashboard-card">
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
                      className="surface-panel flex flex-col gap-4 border-cyan-300/15 bg-[linear-gradient(145deg,rgba(34,211,238,0.09),rgba(15,23,42,0.72))] p-4"
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

          <section className="dashboard-card px-5 py-4 text-sm text-slate-300">
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
