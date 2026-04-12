"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaDiscord, FaTwitch } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AppLink } from "@/components/AppLink";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import {
  formatAuthIssue,
  getUrlWithoutAuthArtifacts,
  readAuthProviderFromLocation,
  readAuthIssueFromLocation,
  sanitizeRedirectPath,
} from "@/lib/auth-flow";
import { isDevBypassAvailable } from "@/lib/dev-auth";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showEmailFallback, setShowEmailFallback] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const twitchAuthEnabled =
    process.env.NEXT_PUBLIC_ENABLE_TWITCH_AUTH === "true";

  const { user, loading, signUp, signIn, signInWithDiscord, signInWithTwitch } =
    useAuth();
  const searchParams = useSearchParams();
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
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/80 px-8 py-10 text-center backdrop-blur-xl">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan-300" />
          <h1 className="mt-4 text-2xl font-bold text-white">
            Re-opening your ArenaX session
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You are already authenticated, so we are sending you straight to {destinationLabel}.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;

        toast({
          title: "Welcome back",
          description: "Your session is opening now.",
        });
      } else {
        const { error } = await signUp(email, password, redirectTarget);
        if (error) throw error;

        toast({
          title: "Account created",
          description:
            "Check your inbox to confirm your email if required, then sign in with the same credentials.",
        });

        setIsLogin(true);
        setPassword("");
        setUsername("");
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

  const handleTwitchSignIn = async () => {
    if (!twitchAuthEnabled) {
      toast({
        title: "Twitch access is coming next",
        description:
          "Discord is the primary launch path while Twitch OAuth is being prepared.",
      });
      return;
    }

    const { error } = await signInWithTwitch(redirectTarget);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDiscordSignIn = async () => {
    const { error } = await signInWithDiscord(redirectTarget);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <AppLink href="/" className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center font-bold text-white">
            AX
          </div>
          <span className="font-bold text-2xl">
            Arena<span className="text-primary">X</span>
          </span>
        </AppLink>

        <h1 className="text-3xl font-bold mb-2">
          {isLogin ? "Enter through your community identity" : "Set up your ArenaX access"}
        </h1>
        <p className="text-muted-foreground mb-8">
          ArenaX is built for Discord communities and Twitch-native competition. Use the identity your audience already trusts, then continue directly to {destinationLabel}.
        </p>

        <Button
          type="button"
          size="lg"
          className="w-full h-14 mb-4 bg-indigo-600 hover:bg-indigo-500 text-white text-base font-semibold shadow-lg"
          onClick={handleDiscordSignIn}
          disabled={isLoading}
        >
          <FaDiscord className="w-5 h-5 mr-3" />
          Enter with Discord
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="w-full h-14 mb-6 text-base bg-[#7d3cff] text-white hover:bg-[#6f32e0] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-slate-400"
          onClick={handleTwitchSignIn}
          disabled={isLoading || !twitchAuthEnabled}
          aria-disabled={!twitchAuthEnabled}
        >
          <FaTwitch className="w-5 h-5 mr-3" />
          {twitchAuthEnabled ? "Continue with Twitch" : "Twitch access coming next"}
        </Button>

        {showDevBypass ? (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full h-14 mb-6 border-amber-400/35 bg-amber-400/10 text-amber-100 hover:bg-amber-400/18"
            onClick={() => {
              window.location.href = `/api/auth/local-qa?redirect=${encodeURIComponent(redirectTarget)}`;
            }}
          >
            <Shield className="w-5 h-5 mr-3" />
            Enter local QA session
          </Button>
        ) : null}

        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
          <div className="mb-2 flex items-center gap-2 font-semibold text-white">
            <Shield className="h-4 w-4 text-cyan-300" />
            Recommended path
          </div>
          Discord should be the primary sign-in for server admins. Twitch is the best secondary path for creators and live operators.
        </div>

        <button
          type="button"
          onClick={() => setShowEmailFallback((value) => !value)}
          className="mb-4 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-medium text-slate-200 transition-colors hover:bg-white/8"
        >
          <span>Admin email fallback</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${showEmailFallback ? "rotate-180" : ""}`}
          />
        </button>

        {showEmailFallback ? (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Fallback email access
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              )}

              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit" size="lg" className="w-full">
                {isLogin ? "Continue with Email" : "Create Account with Email"}
              </Button>
            </form>

            <p className="text-center mt-6 text-sm text-muted-foreground">
              {isLogin ? "Need an internal fallback account?" : "Already have fallback access?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-semibold"
              >
                {isLogin ? "Create your account" : "Sign in instead"}
              </button>
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Email/password remains available for internal fallback and admin troubleshooting only.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Auth;
