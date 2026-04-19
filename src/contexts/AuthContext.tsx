import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import {
  getUrlWithoutAuthArtifacts,
  sanitizeRedirectPath,
} from "@/lib/auth-flow";
import {
  getDevBypassSession,
  getDevBypassUser,
  hasDevAuthCookie,
  isDevBypassAvailable,
} from "@/lib/dev-auth";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isDevBypass: boolean;
  signUp: (
    email: string,
    password: string,
    nextPath?: string,
  ) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: (nextPath?: string) => Promise<{ error: Error | null }>;
  signInWithDiscord: (nextPath?: string) => Promise<{ error: Error | null }>;
  signInWithTwitch: (nextPath?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  getDiscordAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isDevBypass, setIsDevBypass] = useState(false);
  const [loading, setLoading] = useState(true);
  const sessionUserId = session?.user?.id;
  const sessionProvider = session?.user?.app_metadata?.provider;

  const applyDevBypassState = () => {
    if (typeof document === "undefined" || !isDevBypassAvailable()) {
      return false;
    }

    const active = hasDevAuthCookie(document.cookie);
    if (!active) {
      return false;
    }

    setSession(getDevBypassSession());
    setUser(getDevBypassUser());
    setIsDevBypass(true);
    setLoading(false);
    return true;
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        setUser(session.user ?? null);
        setIsDevBypass(false);
        setLoading(false);
        return;
      }

      if (applyDevBypassState()) {
        return;
      }

      setSession(null);
      setUser(null);
      setIsDevBypass(false);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session.user ?? null);
        setIsDevBypass(false);
        setLoading(false);
        return;
      }

      if (applyDevBypassState()) {
        return;
      }

      setSession(null);
      setUser(null);
      setIsDevBypass(false);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) return;

    if (sessionProvider !== "discord" && sessionProvider !== "twitch") return;

    void fetch("/api/auth/bootstrap-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch(() => undefined);
  }, [session?.user, sessionProvider, sessionUserId]);

  useEffect(() => {
    if (typeof window === "undefined" || !session?.user) return;

    const currentUrl = new URL(window.location.href);
    const shouldResumeDashboard =
      currentUrl.pathname === "/" &&
      (currentUrl.searchParams.has("code") ||
        currentUrl.searchParams.has("state") ||
        currentUrl.hash.includes("access_token"));

    if (shouldResumeDashboard) {
      window.location.replace("/dashboard");
      return;
    }

    const { changed, url } = getUrlWithoutAuthArtifacts(window.location.href);
    if (!changed) return;

    window.history.replaceState({}, "", url);
  }, [session?.user, sessionUserId]);

  const getOAuthRedirectUrl = (nextPath?: string) => {
    const safeNext = sanitizeRedirectPath(nextPath);
    const url = new URL("/auth/callback", window.location.origin);
    url.searchParams.set("next", safeNext);
    return url.toString();
  };

  const signUp = async (email: string, password: string, nextPath?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getOAuthRedirectUrl(nextPath),
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signInWithGoogle = async (nextPath?: string) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getOAuthRedirectUrl(nextPath),
      },
    });
    return { error };
  };

  const signInWithDiscord = async (nextPath?: string) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: getOAuthRedirectUrl(nextPath),
        scopes: "identify email guilds",
      },
    });
    return { error };
  };

  const signInWithTwitch = async (nextPath?: string) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "twitch",
      options: {
        redirectTo: getOAuthRedirectUrl(nextPath),
        scopes: "user:read:email",
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();

    if (isDevBypassAvailable()) {
      await fetch("/api/auth/dev-bypass", {
        method: "DELETE",
      }).catch(() => undefined);
    }

    setSession(null);
    setUser(null);
    setIsDevBypass(false);
  };

  const getDiscordAccessToken = () => {
    return session?.provider_token ?? null;
  };

  const value = {
    user,
    session,
    loading,
    isDevBypass,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithDiscord,
    signInWithTwitch,
    signOut,
    getDiscordAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
