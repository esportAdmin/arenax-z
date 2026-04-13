"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown, Loader2, Shield, Sparkles, TimerReset } from "lucide-react";
import { FaDiscord, FaTwitch } from "react-icons/fa";
import { CountdownPill } from "@/components/engagement/CountdownPill";
import Navigation from "@/components/landing/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { useToast } from "@/hooks/use-toast";
import {
  formatAuthIssue,
  getUrlWithoutAuthArtifacts,
  readAuthProviderFromLocation,
  readAuthIssueFromLocation,
  sanitizeRedirectPath,
} from "@/lib/auth-flow";
import { getNextUtcMidnight } from "@/lib/countdown";
import { isDevBypassAvailable } from "@/lib/dev-auth";
import { AppLink } from "@/components/AppLink";

function LoginPageContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailFallback, setShowEmailFallback] = useState(false);
  const twitchAuthEnabled =
    process.env.NEXT_PUBLIC_ENABLE_TWITCH_AUTH !== "false";
  const searchParams = useSearchParams();
  const { user, loading, signInWithDiscord, signInWithTwitch } = useAuth();
  const navigate = useAppNavigate();
  const { toast } = useToast();
  const redirectTarget = sanitizeRedirectPath(
    searchParams.get("redirect") ?? searchParams.get("next"),
  );
  const destinationLabel =
    redirectTarget === "/dashboard"
      ? "your dashboard"
      : redirectTarget === "/play"
        ? "the live queue"
        : redirectTarget === "/profile"
          ? "your profile"
          : redirectTarget === "/rewards"
            ? "the rewards vault"
            : redirectTarget === "/leaderboard"
              ? "the leaderboard"
              : "the platform";
  const showDevBypass = isDevBypassAvailable();

  useEffect(() => {
    if (user) {
      navigate(redirectTarget, { replace: true });
    }
  }, [user, navigate, redirectTarget]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const issue = formatAuthIssue(
      readAuthIssueFromLocation(window.location),
      readAuthProviderFromLocation(window.location),
    );
    if (!issue) return;

    toast({
      title: "Sign-in interrupted",
      description: issue,
      variant: "destructive",
    });

    const { changed, url } = getUrlWithoutAuthArtifacts(window.location.href);
    if (changed) {
      window.history.replaceState({}, "", url);
    }
  }, [toast]);

  if (loading || user) {
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <Navigation />
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="rounded-3xl border border-white/10 bg-[#0a0f1e]/90 px-8 py-10 text-center backdrop-blur-xl">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan-300" />
            <div className="mt-4 text-lg font-semibold text-white">
              Opening your command center...
            </div>
            <p className="mt-2 max-w-sm text-sm text-slate-400">
              Your session is already active, so we are taking you straight into {destinationLabel}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleDiscordLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithDiscord(redirectTarget);
      if (error) {
        toast({
          title: "Sign-in error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwitchLogin = async () => {
    if (!twitchAuthEnabled) {
      toast({
        title: "Twitch access is coming next",
        description:
          "Discord is the primary launch path while Twitch OAuth is being prepared.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signInWithTwitch(redirectTarget);
      if (error) {
        toast({
          title: "Sign-in error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    { icon: "Instant", text: "Fast account activation" },
    { icon: "Secure", text: "Trusted OAuth sign-in" },
    { icon: "Club", text: "Direct club and community access" },
    { icon: "Profile", text: "Automatic competitive profile sync" },
  ];

  const features = [
    {
      icon: "ID",
      title: "Unified Player Identity",
      description:
        "Your account, profile, and progression stay consistent across the platform.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: "Rank",
      title: "Prestige Rankings",
      description:
        "Measure your reads against top players and rise through a global competitive ladder.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: "Live",
      title: "Live Competitive Energy",
      description:
        "Jump into active matchups, real-time standings, and high-pressure moments as they happen.",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: "Club",
      title: "High-Signal Communities",
      description:
        "Join club spaces, take part in events, and compete alongside fans who actually show up.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: "Rewards",
      title: "Daily Reward Momentum",
      description:
        "Build a habit loop with daily activity, streaks, and premium reward progression.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: "Streak",
      title: "Win-Streak Status",
      description:
        "Chain accurate calls together, increase your visibility, and unlock harder-to-reach rewards.",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navigation />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-blue-500/20 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 h-[600px] w-[600px] rounded-full bg-purple-500/20 blur-[150px]" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] rounded-full bg-indigo-500/20 blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pb-20 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <div className="mb-6 inline-block">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                <FaDiscord className="h-10 w-10" />
              </div>
            </div>

            <div className="mb-4 flex justify-center">
              <CountdownPill label="Daily reset" target={getNextUtcMidnight()} tone="cyan" />
            </div>

            <h1 className="mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-4xl font-black text-transparent sm:text-5xl md:text-6xl">
              ACCESS THE PREMIUM COMPETITION LAYER
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-400">
              Sign in with the platforms your community already uses, then continue directly to {destinationLabel}.
            </p>
          </motion.div>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="group relative"
            >
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-50 blur-xl transition-opacity duration-500 group-hover:opacity-75" />

              <div className="relative rounded-3xl border border-white/10 bg-[#0a0f1e]/90 p-6 backdrop-blur-xl md:p-12">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                  </svg>
                </div>

                <h2 className="mb-3 text-center text-3xl font-bold">
                  Premium access, secured
                </h2>
                <p className="mb-8 text-center text-gray-400">
                  Use Discord first for server communities, then Twitch for creator-led operations and live audience overlap.
                </p>

                <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm leading-6 text-slate-300">
                  <div className="mb-2 flex items-center gap-2 font-semibold text-white">
                    <Shield className="h-4 w-4 text-cyan-300" />
                    Demo-ready trust signal
                  </div>
                  Use a familiar provider, land inside the product fast, and make the account step feel like the start of momentum, not paperwork.
                </div>

                <button
                  onClick={handleDiscordLogin}
                  disabled={isLoading}
                  className="group/btn relative mb-4 w-full"
                >
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#5865F2] to-[#7289DA] opacity-50 blur-lg transition-opacity duration-300 group-hover/btn:opacity-100" />

                  <div className="relative flex items-center justify-center gap-3 rounded-2xl bg-[#5865F2] px-6 py-4 font-bold text-white transition-all duration-300 group-hover/btn:scale-[1.02] hover:bg-[#4752C4]">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Opening secure sign-in...</span>
                      </>
                    ) : (
                      <>
                        <FaDiscord className="h-6 w-6" />
                        <span>Continue with Discord</span>
                        <svg
                          className="h-5 w-5 transition-transform group-hover/btn:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </>
                    )}
                  </div>
                </button>

                <button
                  onClick={handleTwitchLogin}
                  disabled={isLoading || !twitchAuthEnabled}
                  aria-disabled={!twitchAuthEnabled}
                  className="mb-4 flex w-full items-center justify-center gap-3 rounded-2xl border border-[#7d3cff]/40 bg-[#7d3cff]/20 px-6 py-4 font-semibold text-white transition-all duration-300 hover:border-[#7d3cff]/70 hover:bg-[#7d3cff]/28 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-slate-400 disabled:hover:bg-white/5"
                >
                  <FaTwitch className="h-5 w-5" />
                  <span>
                    {twitchAuthEnabled
                      ? "Continue with Twitch"
                      : "Twitch access coming next"}
                  </span>
                </button>

                {showDevBypass ? (
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = `/api/auth/local-qa?redirect=${encodeURIComponent(redirectTarget)}`;
                    }}
                    className="mb-4 flex w-full items-center justify-center gap-3 rounded-2xl border border-amber-400/35 bg-amber-400/12 px-6 py-4 font-semibold text-amber-100 transition-all duration-300 hover:border-amber-300/55 hover:bg-amber-400/18"
                  >
                    <Shield className="h-5 w-5" />
                    <span>Enter local QA session</span>
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={() => setShowEmailFallback((value) => !value)}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-medium text-slate-200 transition-colors hover:bg-white/8"
                >
                  <span>Admin email fallback</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${showEmailFallback ? "rotate-180" : ""}`}
                  />
                </button>

                {showEmailFallback ? (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-slate-300">
                    <div className="mb-2 font-semibold text-white">Fallback access only</div>
                    Use email/password only for internal support, QA, or admin recovery flows.
                    <div className="mt-4">
                      <AppLink href="/auth" className="font-semibold text-cyan-300 hover:underline">
                        Open email fallback screen
                      </AppLink>
                    </div>
                  </div>
                ) : null}

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-[#0a0f1e] px-4 text-gray-500">
                      Why this path works
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {benefits.map((benefit) => (
                    <div
                      key={benefit.text}
                      className="flex items-center gap-3 text-gray-300"
                    >
                      <span className="min-w-[54px] text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">
                        {benefit.icon}
                      </span>
                      <span>{benefit.text}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-center text-xs text-gray-500">
                    By signing in, you agree to our{" "}
                    <a href="/terms" className="text-blue-400 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-blue-400 hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <h3 className="mb-8 text-2xl font-bold">
                What opens up when you enter
              </h3>

              <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-slate-300">
                <div className="mb-2 flex items-center gap-2 font-semibold text-white">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Launch framing
                </div>
                This side should make the platform feel richer before sign-in, but still trustworthy and easy to understand on a first pass.
              </div>

              <div className="grid gap-4">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="group/feature relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:bg-white/10"
                  >
                    <div
                      className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 blur transition-opacity duration-300 group-hover/feature:opacity-20`}
                    />

                    <div className="relative flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-xs font-bold uppercase tracking-[0.16em] shadow-lg`}
                      >
                        {feature.icon}
                      </div>

                      <div className="flex-1">
                        <h4 className="mb-1 text-lg font-bold transition-colors group-hover/feature:text-white">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-gray-400 transition-colors group-hover/feature:text-gray-300">
                          {feature.description}
                        </p>
                      </div>

                      <svg
                        className="h-5 w-5 flex-shrink-0 text-gray-600 transition-all group-hover/feature:translate-x-1 group-hover/feature:text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <TimerReset className="h-6 w-6 text-cyan-300" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-bold">Built for momentum</h4>
                    <p className="text-sm text-gray-400">
                      Join more than 50,000 competitive fans already building their edge on ArenaX-Z.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20 border-t border-white/10 pt-12"
          >
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
              <div>
                <div className="mb-2 text-3xl font-bold text-yellow-400">50K+</div>
                <div className="text-sm text-gray-400">Competitive Fans</div>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold text-blue-400">1M+</div>
                <div className="text-sm text-gray-400">Live Calls Logged</div>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold text-purple-400">24/7</div>
                <div className="text-sm text-gray-400">Community Access</div>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold text-pink-400">100%</div>
                <div className="text-sm text-gray-400">Free to Enter</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050816] text-white">
          <Navigation />
          <div className="flex min-h-screen items-center justify-center px-4">
            <div className="rounded-3xl border border-white/10 bg-[#0a0f1e]/90 px-8 py-10 text-center backdrop-blur-xl">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan-300" />
              <div className="mt-4 text-lg font-semibold text-white">
                Loading secure access...
              </div>
              <p className="mt-2 max-w-sm text-sm text-slate-400">
                Preparing the sign-in experience for your community workspace.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
