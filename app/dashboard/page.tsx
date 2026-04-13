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
  "Pick the Discord server where you want your competitive identity to live.",
  "Create the club shell and lock in its home base inside ArenaX-Z.",
  "Bring in members, define your strategy, and start fighting for territory.",
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
                AX
              </span>
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">
                Club command center
              </div>
              <div className="text-xl font-display font-bold text-white">
                ArenaX-Z Dashboard
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
                The best retention engine in ArenaX-Z is social pressure. Pick
                your Discord server, create your club, and turn a group chat
                into a competitive home base.
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
                  Your existing server becomes the starting point, so onboarding
                  feels immediate instead of forced.
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
              <div className="section-shell text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.6rem] border border-amber-400/18 bg-amber-400/10">
                  {isTwitchSession ? (
                    <FaTwitch className="h-10 w-10 text-[#a970ff]" />
                  ) : (
                    <Shield className="h-10 w-10 text-amber-300" />
                  )}
                </div>
                <h2 className="text-2xl font-display font-bold text-white">
                  {isTwitchSession
                    ? "Twitch creator access is connected"
                    : hasDiscordProvider
                      ? "No eligible Discord servers found"
                      : "Connect Discord to launch a server club"}
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-slate-300">
                  {isTwitchSession
                    ? "Twitch is ready for live audience loops, creator rituals, and return-driving calls. To create a Discord-backed club, continue with a Discord account that has server admin access."
                    : hasDiscordProvider
                      ? "You need Discord administrator access on at least one server before you can launch a club identity here."
                      : "This dashboard creates clubs from Discord servers. Sign in with Discord when you are ready to connect a community server."}
                </p>
                <div className="mx-auto mt-4 max-w-lg rounded-[1.4rem] border border-white/10 bg-black/20 px-4 py-4 text-sm leading-6 text-slate-400">
                  {isTwitchSession
                    ? "Best demo path: show Twitch as the creator identity layer, then move into Live Calls, Rewards, and Leaderboard before connecting Discord for club operations."
                    : guildSyncIssue
                      ? guildSyncIssue
                    : hasDiscordProvider
                      ? "This empty state is healthy for demo use: it explains the requirement, points to the next action, and does not feel like a broken flow."
                      : "Nothing is broken here. ArenaX needs Discord permissions before it can list servers and create a club shell."}
                </div>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  {isTwitchSession ? (
                    <>
                      <button
                        type="button"
                        onClick={() => router.push("/live-calls")}
                        className="inline-flex items-center gap-2 rounded-full border border-[#a970ff]/35 bg-[#a970ff]/18 px-5 py-3 font-semibold text-white transition-colors hover:bg-[#a970ff]/24"
                      >
                        <FaTwitch className="h-5 w-5" />
                        Open live calls
                      </button>
                      <button
                        type="button"
                        onClick={handleSwitchToDiscord}
                        className="inline-flex items-center gap-2 rounded-full border border-[#7289DA]/35 bg-[#7289DA]/18 px-5 py-3 font-semibold text-white transition-colors hover:bg-[#7289DA]/24"
                      >
                        <FaDiscord className="h-5 w-5" />
                        Connect Discord server access
                      </button>
                    </>
                  ) : (
                    <a
                      href="https://discord.com/developers/applications"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-[#7289DA]/35 bg-[#7289DA]/18 px-5 py-3 font-semibold text-white transition-colors hover:bg-[#7289DA]/24"
                    >
                      <FaDiscord className="h-5 w-5" />
                      Manage Discord servers
                    </a>
                  )}
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
