"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  LogOut,
  Shield,
  Sparkles,
  Sword,
  User,
  Users,
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

const launchSteps = [
  "Choose the community home you want to activate first: Discord operations or Twitch live rituals.",
  "Create the club shell, live-call loop, and prestige path that make returning feel natural.",
  "Bring in members, define the weekly rhythm, and turn attention into territory momentum.",
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
            "Discord connected, but eligible server access could not be refreshed. You can continue exploring ArenaX while we retry later.",
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
    if (!user) {
      return;
    }

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

  const handleSwitchToDiscord = async () => {
    await signOut();
    router.push("/login?redirect=/dashboard");
  };

  const handleSwitchToTwitch = async () => {
    await signOut();
    router.push("/login?redirect=/dashboard");
  };

  const nextClubPulse = getHoursFromNow(4);
  const dailyReset = getNextUtcMidnight();
  const sessionProvider = String(session?.user?.app_metadata?.provider ?? "");
  const isTwitchSession = sessionProvider === "twitch";
  const hasDiscordProvider = sessionProvider === "discord";

  return (
    <div className="min-h-screen text-white">
      <Navigation />
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-[520px] w-[520px] rounded-full bg-indigo-500/12 blur-[150px]" />
        <div className="absolute left-1/2 top-1/3 h-[360px] w-[360px] rounded-full bg-amber-400/7 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-8 pt-28 sm:px-5 md:px-8 md:pb-10 md:pt-32">
        <div className="surface-panel mb-8 flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="hero-sheen flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/12">
              <span className="font-display text-sm font-bold tracking-[0.18em] text-white">
                RG
              </span>
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">
                Club command center
              </div>
              <div className="text-xl font-display font-bold text-white">
                RallyGuild Dashboard
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user ? (
              <div className="metal-chip">
                <User className="h-4 w-4 text-primary" />
                {user.email}
              </div>
            ) : null}

            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/16"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-shell"
          >
            <div className="eyebrow-badge">
              <Sparkles className="h-4 w-4 text-primary" />
              Build a club people rally behind
            </div>

            <div className="mt-6 max-w-3xl">
              <h1 className="text-balance text-4xl font-display font-black leading-tight text-white md:text-5xl">
                Launch a club identity
                <span className="gradient-text-primary"> worth coming back to</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                The best retention engine in RallyGuild is community pressure.
                Start with Discord for server operations or Twitch for live
                audience rituals, then turn attention into a competitive home
                base.
              </p>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              <div className="surface-panel p-4">
                <div className="mb-3 inline-flex rounded-2xl border border-white/10 bg-white/5 p-2.5">
                  <FaDiscord className="h-4 w-4 text-[#7289DA]" />
                </div>
                <div className="text-sm font-display font-bold uppercase tracking-[0.14em] text-white">
                  Native community layer
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Discord and Twitch become the starting points, so onboarding
                  feels familiar instead of administrative.
                </p>
              </div>
              <div className="surface-panel p-4">
                <div className="mb-3 inline-flex rounded-2xl border border-white/10 bg-white/5 p-2.5">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div className="text-sm font-display font-bold uppercase tracking-[0.14em] text-white">
                  Territory ownership
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Clubs are not just labels. They compete, defend, and build map
                  presence people can monitor.
                </p>
              </div>
              <div className="surface-panel p-4">
                <div className="mb-3 inline-flex rounded-2xl border border-white/10 bg-white/5 p-2.5">
                  <Users className="h-4 w-4 text-accent" />
                </div>
                <div className="text-sm font-display font-bold uppercase tracking-[0.14em] text-white">
                  Return-driving social pull
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Once members have status to defend together, churn drops and
                  habit starts to form.
                </p>
              </div>
            </div>

            <div className="mt-8 command-frame p-5">
              <div className="mb-4 flex items-center gap-3">
                <Sword className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Launch sequence
                  </div>
                  <div className="text-xl font-display font-bold text-white">
                    How to bring your club online
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {launchSteps.map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-4 rounded-2xl border border-white/8 bg-white/5 p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-sm font-display font-bold text-primary">
                      0{index + 1}
                    </div>
                    <p className="text-sm leading-6 text-slate-300">{step}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <CountdownPill label="Club pulse" target={nextClubPulse} tone="cyan" />
                <CountdownPill label="Daily reset" target={dailyReset} tone="amber" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-5"
          >
            {loading ? (
              <div className="section-shell flex min-h-[480px] flex-col items-center justify-center text-center">
                <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
                <p className="text-lg font-semibold text-white">
                  Pulling in your Discord servers
                </p>
                <p className="mt-2 max-w-md text-slate-400">
                  We are checking where you already have the authority to launch
                  a club.
                </p>
              </div>
            ) : null}

            {!loading && guilds.length === 0 ? (
              <div className="section-shell">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.6rem] border border-amber-400/18 bg-amber-400/10">
                  {isTwitchSession ? (
                    <FaTwitch className="h-10 w-10 text-[#a970ff]" />
                  ) : (
                    <Shield className="h-10 w-10 text-amber-300" />
                  )}
                </div>
                <h2 className="text-center text-2xl font-display font-bold text-white">
                  {isTwitchSession
                    ? "Twitch creator access is connected"
                    : hasDiscordProvider
                      ? "Discord is connected. Choose your next setup step."
                      : "Choose how this community should start"}
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-center text-slate-300">
                  {isTwitchSession
                    ? "Twitch is ready for live audience loops, creator rituals, and return-driving calls. Discord can be connected later when you want server-backed club operations."
                    : hasDiscordProvider
                      ? "We did not find a Discord server where this account can launch a club yet. You can reconnect with server admin access or continue with Twitch-style live activation."
                      : "RallyGuild works best when the first action is obvious: connect a Discord server or start with Twitch live-community momentum."}
                </p>
                <div className="mx-auto mt-4 max-w-lg rounded-[1.4rem] border border-white/10 bg-black/20 px-4 py-4 text-center text-sm leading-6 text-slate-400">
                  {isTwitchSession
                    ? "Recommended path: open Live Calls, show the daily ritual loop, then connect Discord when the community is ready for structured club operations."
                    : guildSyncIssue
                      ? guildSyncIssue
                    : hasDiscordProvider
                      ? "Nothing is broken. This account is signed in, but it needs server admin access before RallyGuild can create a Discord-backed club."
                      : "You can start from either side. Discord is best for server admins; Twitch is best for creators and live-audience operators."}
                </div>

                <div className="mt-7 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-[#7289DA]/25 bg-[#7289DA]/10 p-5 text-left shadow-[0_0_35px_rgba(114,137,218,0.08)]">
                    <div className="mb-4 inline-flex rounded-2xl border border-[#7289DA]/25 bg-[#7289DA]/15 p-3">
                      <FaDiscord className="h-6 w-6 text-[#8ea1ff]" />
                    </div>
                    <div className="text-lg font-display font-bold text-white">
                      Set up a Discord server
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Best for admins who want club identity, roles, territory
                      pressure, and a structured home base for members.
                    </p>
                    <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-5 text-slate-400">
                      Required: sign in with a Discord account that can manage
                      at least one server.
                    </div>
                    <button
                      type="button"
                      onClick={handleSwitchToDiscord}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#7289DA]/35 bg-[#7289DA]/20 px-5 py-3 font-semibold text-white transition-colors hover:bg-[#7289DA]/28"
                    >
                      <FaDiscord className="h-5 w-5" />
                      Reconnect Discord access
                    </button>
                  </div>

                  <div className="rounded-[1.5rem] border border-[#a970ff]/25 bg-[#a970ff]/10 p-5 text-left shadow-[0_0_35px_rgba(169,112,255,0.08)]">
                    <div className="mb-4 inline-flex rounded-2xl border border-[#a970ff]/25 bg-[#a970ff]/15 p-3">
                      <FaTwitch className="h-6 w-6 text-[#c79cff]" />
                    </div>
                    <div className="text-lg font-display font-bold text-white">
                      Start with Twitch community
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Best for creator-led audiences where the first habit is a
                      live call, reward chase, and daily comeback moment.
                    </p>
                    <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-5 text-slate-400">
                      Works even before a Discord server is ready. Discord can
                      be added later for deeper club operations.
                    </div>
                    <button
                      type="button"
                      onClick={
                        isTwitchSession
                          ? () => router.push("/live-calls")
                          : handleSwitchToTwitch
                      }
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#a970ff]/35 bg-[#a970ff]/20 px-5 py-3 font-semibold text-white transition-colors hover:bg-[#a970ff]/28"
                    >
                      <FaTwitch className="h-5 w-5" />
                      {isTwitchSession
                        ? "Open live calls"
                        : "Connect Twitch access"}
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => router.push("/leaderboard")}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10"
                  >
                    Preview rankings
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/rewards")}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10"
                  >
                    Preview rewards
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : null}

            {!loading && guilds.length > 0 ? (
              <div className="section-shell">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <div className="data-pill">Eligible servers</div>
                    <h2 className="mt-3 text-2xl font-display font-bold text-white">
                      Choose your launchpad
                    </h2>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                    {guilds.length} server{guilds.length > 1 ? "s" : ""} ready
                  </div>
                </div>

                <div className="space-y-4">
                  {guilds.map((guild, index) => (
                    <motion.div
                      key={guild.id}
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.06 }}
                      className="surface-panel flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        {guild.icon ? (
                          <img
                            src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                            alt={guild.name}
                            className="h-16 w-16 rounded-[1.25rem] border border-white/10 object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] border border-white/10 bg-gradient-to-br from-primary/20 to-secondary/20 text-2xl font-display font-bold text-white">
                            {guild.name[0]}
                          </div>
                        )}

                        <div>
                          <div className="text-lg font-semibold text-white">
                            {guild.name}
                          </div>
                          <div className="mt-1 text-sm text-slate-400">
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

                <div className="mt-5 rounded-[1.4rem] border border-white/10 bg-black/20 px-4 py-4 text-sm leading-6 text-slate-300">
                  Launching from an existing Discord server lowers friction and makes the first club session feel immediate instead of administrative.
                </div>
              </div>
            ) : null}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
