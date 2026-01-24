/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * HOOK REACT SÉCURISÉ - ARENA BALANCE
 * ================================================================
 * Hook personnalisé pour gérer l'ARENA balance de manière sécurisée
 * Utilise uniquement les fonctions RPC serveur-side
 * ================================================================
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { toast } from "sonner";

// ================================================================
// TYPES
// ================================================================

interface ArenaBalanceData {
  success: boolean;
  balance?: number;
  streak?: number;
  score?: number;
  last_transaction?: string;
  error?: string;
}

interface ArenaTransactionResult {
  success: boolean;
  new_balance?: number;
  new_streak?: number;
  error?: string;
}

interface PrizeRedemptionResult {
  success: boolean;
  new_balance?: number;
  prize_name?: string;
  redemption_id?: string;
  error?: string;
}

export interface UseArenaBalanceReturn {
  balance: number;
  streak: number;
  score: number;
  loading: boolean;
  error: string | null;
  refreshBalance: () => Promise<void>;
  completeDailyChallenge: (xpReward?: number) => Promise<boolean>;
  redeemPrize: (prizeId: number) => Promise<boolean>;
  addArena: (amount: number, source: string, description?: string) => Promise<boolean>;
  spendArena: (amount: number, source: string, description?: string) => Promise<boolean>;
}

export function useArenaBalance(): UseArenaBalanceReturn {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshBalance = useCallback(async () => {
    if (!user) {
      setBalance(0);
      setStreak(0);
      setScore(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      logger.debug("Fetching ARENA balance...");

      const { data, error: rpcError } = await (supabase.rpc as any)("get_arena_balance");

      if (rpcError) throw new Error(rpcError.message);
      const result = data as ArenaBalanceData;
      if (!result.success) throw new Error(result.error || "Failed to fetch balance");

      setBalance(result.balance || 0);
      setStreak(result.streak || 0);
      setScore(result.score || 0);
      logger.debug("Balance refreshed", {
        balance: result.balance,
        streak: result.streak,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      logger.error("Error refreshing balance", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  const completeDailyChallenge = useCallback(
    async (xpReward: number = 50): Promise<boolean> => {
      if (!user) {
        toast.error("Erreur", { description: "Vous devez être connecté" });
        return false;
      }

      try {
        logger.debug("Completing daily challenge...", { xpReward });
        const { data, error: rpcError } = await (supabase.rpc as any)("complete_daily_challenge_reward", {
          p_xp_reward: xpReward,
        });

        if (rpcError) throw new Error(rpcError.message);
        const result = data as ArenaTransactionResult;
        if (!result.success) throw new Error(result.error || "Failed to complete challenge");

        setBalance(result.new_balance || 0);
        setStreak(result.new_streak || 0);

        toast.success("🎉 Défi complété !", {
          description: `+${xpReward} ARENA ajoutés à votre solde`,
        });

        logger.info("Daily challenge completed", {
          xpReward,
          new_balance: result.new_balance,
          new_streak: result.new_streak,
        });

        return true;
      } catch (err) {
        logger.error("Error completing daily challenge", err);
        toast.error("Erreur", {
          description: "Impossible de compléter le défi",
        });
        return false;
      }
    },
    [user],
  );

  const redeemPrize = useCallback(
    async (prizeId: number): Promise<boolean> => {
      if (!user) {
        toast.error("Erreur", { description: "Vous devez être connecté" });
        return false;
      }

      try {
        logger.debug("Redeeming prize...", { prizeId });
        const { data, error: rpcError } = await (supabase.rpc as any)("redeem_prize_secure", {
          p_prize_id: prizeId,
        });

        if (rpcError) throw new Error(rpcError.message);
        const result = data as PrizeRedemptionResult;

        if (!result.success) {
          if (result.error?.includes("Insufficient balance")) {
            toast.error("Solde insuffisant", {
              description: "Vous n'avez pas assez d'ARENA pour ce prix",
            });
          } else if (result.error?.includes("out of stock")) {
            toast.error("Stock épuisé", {
              description: "Ce prix n'est plus disponible",
            });
          } else {
            toast.error("Erreur", {
              description: result.error || "Impossible de racheter le prix",
            });
          }
          return false;
        }

        setBalance(result.new_balance || 0);
        toast.success("🎁 Prix racheté !", {
          description: `${result.prize_name} ajouté à votre compte`,
        });

        logger.info("Prize redeemed", {
          prizeId,
          prize_name: result.prize_name,
          new_balance: result.new_balance,
        });

        return true;
      } catch (err) {
        logger.error("Error redeeming prize", err);
        toast.error("Erreur", {
          description: "Une erreur inattendue est survenue",
        });
        return false;
      }
    },
    [user],
  );

  const addArena = useCallback(
    async (amount: number, source: string, description?: string): Promise<boolean> => {
      if (!user) {
        toast.error("Erreur", { description: "Vous devez être connecté" });
        return false;
      }

      try {
        logger.debug("Adding ARENA...", { amount, source });
        const { data, error: rpcError } = await (supabase.rpc as any)("add_arena_secure", {
          p_amount: amount,
          p_source: source,
          p_description: description || null,
          p_reference_id: null,
        });

        if (rpcError) throw new Error(rpcError.message);
        const result = data as ArenaTransactionResult;
        if (!result.success) throw new Error(result.error || "Failed to add ARENA");

        setBalance(result.new_balance || 0);
        logger.info("ARENA added", { amount, new_balance: result.new_balance });
        return true;
      } catch (err) {
        logger.error("Error adding ARENA", err);
        return false;
      }
    },
    [user],
  );

  const spendArena = useCallback(
    async (amount: number, source: string, description?: string): Promise<boolean> => {
      if (!user) {
        toast.error("Erreur", { description: "Vous devez être connecté" });
        return false;
      }

      if (amount > balance) {
        toast.error("Solde insuffisant", {
          description: `Vous avez ${balance} ARENA, ${amount} requis`,
        });
        return false;
      }

      try {
        logger.debug("Spending ARENA...", { amount, source });
        const { data, error: rpcError } = await (supabase.rpc as any)("spend_arena_secure", {
          p_amount: amount,
          p_source: source,
          p_description: description || null,
          p_reference_id: null,
        });

        if (rpcError) throw new Error(rpcError.message);
        const result = data as ArenaTransactionResult;
        if (!result.success) throw new Error(result.error || "Failed to spend ARENA");

        setBalance(result.new_balance || 0);
        logger.info("ARENA spent", { amount, new_balance: result.new_balance });
        return true;
      } catch (err) {
        logger.error("Error spending ARENA", err);
        toast.error("Erreur", {
          description: "Impossible de dépenser les ARENA",
        });
        return false;
      }
    },
    [user, balance],
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

export function useArenaBalanceDisplay() {
  const { balance, loading, refreshBalance } = useArenaBalance();

  return {
    balance,
    loading,
    refresh: refreshBalance,
    formatted: new Intl.NumberFormat("en-US").format(balance),
  };
}
