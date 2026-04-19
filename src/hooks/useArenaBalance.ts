"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { isLocalQaUser } from "@/lib/dev-auth";

interface ArenaTransactionResult {
  success: boolean;
  new_balance?: number;
  new_streak?: number;
  error?: string;
}

interface UseArenaBalanceOptions {
  enabled?: boolean;
}

export function useArenaBalance(options: UseArenaBalanceOptions = {}) {
  const { enabled = true } = options;
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLocalQa = isLocalQaUser(user);

  const getSession = useCallback(async () => {
    const { data, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !data.session) return null;
    return data.session;
  }, []);

  const safeRpc = useCallback(
    async <T,>(fn: string, params?: unknown): Promise<T | null> => {
      if (!enabled) {
        return null;
      }

      const session = await getSession();
      const sessionIsLocalQa = isLocalQa || isLocalQaUser(session?.user);

      if (sessionIsLocalQa) {
        return null;
      }

      if (!session) {
        return null;
      }

      const { data, error: rpcError } = await (supabase.rpc as any)(fn, params);

      if (rpcError) {
        return null;
      }

      return data as T;
    },
    [enabled, getSession, isLocalQa],
  );

  const refreshBalance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!enabled) {
        setBalance(0);
        setStreak(0);
        setScore(0);
        return;
      }

      const session = await getSession();
      const sessionIsLocalQa = isLocalQa || isLocalQaUser(session?.user);

      if (sessionIsLocalQa) {
        setBalance(3275);
        setStreak(6);
        setScore(12450);
        return;
      }

      if (!session) {
        setBalance(0);
        setStreak(0);
        setScore(0);
        return;
      }

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("arena_balance, active_streak, arena_score")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profileError || !data) {
        setBalance(0);
        setStreak(0);
        setScore(0);
        return;
      }

      setBalance(Number(data.arena_balance ?? 0));
      setStreak(Number(data.active_streak ?? 0));
      setScore(Number(data.arena_score ?? 0));
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Unknown error";
      setError(message);
      setBalance(0);
      setStreak(0);
      setScore(0);
    } finally {
      setLoading(false);
    }
  }, [enabled, getSession, isLocalQa]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      setError(null);
      setBalance(0);
      setStreak(0);
      setScore(0);
      return;
    }

    refreshBalance();
  }, [enabled, refreshBalance]);

  const completeDailyChallenge = useCallback(
    async (xp = 50) => {
      const result = await safeRpc<ArenaTransactionResult>(
        "complete_daily_challenge_reward",
        { p_xp_reward: xp },
      );

      if (!result?.success) return false;

      setBalance(result.new_balance ?? 0);
      setStreak(result.new_streak ?? 0);
      toast.success(`+${xp} ARENA`);
      return true;
    },
    [safeRpc],
  );

  const redeemPrize = useCallback(
    async (prizeId: number) => {
      const result = await safeRpc<{
        success?: boolean;
        new_balance?: number;
        prize_name?: string;
      }>("redeem_prize_secure", {
        p_prize_id: prizeId,
      });

      if (!result?.success) return false;

      setBalance(result.new_balance ?? 0);
      toast.success(`Reward redeemed: ${result.prize_name}`);
      return true;
    },
    [safeRpc],
  );

  const addArena = useCallback(
    async (amount: number, source: string) => {
      const result = await safeRpc<ArenaTransactionResult>("add_arena_secure", {
        p_amount: amount,
        p_source: source,
        p_description: null,
        p_reference_id: null,
      });

      if (!result?.success) return false;

      setBalance(result.new_balance ?? 0);
      return true;
    },
    [safeRpc],
  );

  const spendArena = useCallback(
    async (amount: number, source: string) => {
      if (amount > balance) {
        toast.error("Insufficient balance");
        return false;
      }

      const result = await safeRpc<ArenaTransactionResult>("spend_arena_secure", {
        p_amount: amount,
        p_source: source,
        p_description: null,
        p_reference_id: null,
      });

      if (!result?.success) return false;

      setBalance(result.new_balance ?? 0);
      return true;
    },
    [balance, safeRpc],
  );

  return {
    balance,
    streak,
    score,
    loading,
    error,
    refreshBalance,
    completeDailyChallenge,
    redeemPrize,
    addArena,
    spendArena,
  };
}

export function useArenaBalanceDisplay(options: UseArenaBalanceOptions = {}) {
  const { balance, loading, refreshBalance } = useArenaBalance(options);

  return {
    balance,
    loading,
    refresh: refreshBalance,
    formatted: new Intl.NumberFormat("en-US").format(balance),
  };
}
