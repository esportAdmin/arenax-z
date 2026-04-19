"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  Clock,
  Coins,
  Gift,
  ShoppingCart,
} from "lucide-react";

import { AppLink } from "@/components/AppLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RewardsStoreItem } from "@/types/rewardsStore";

interface RewardsStorePrizeCardProps {
  isAuthenticated: boolean;
  isRedeeming: boolean;
  item: RewardsStoreItem;
  onRedeem: (item: RewardsStoreItem) => void;
  userBalance: number;
}

/**
 * Renders one reward item as a non-financial community perk card. The database
 * may still carry legacy valuation fields, but the UI intentionally avoids
 * displaying cash-equivalent language.
 */
export function RewardsStorePrizeCard({
  isAuthenticated,
  isRedeeming,
  item,
  onRedeem,
  userBalance,
}: RewardsStorePrizeCardProps) {
  const canAfford = userBalance >= item.price_arena;
  const isOutOfStock = item.stock === 0;
  const isUnlimited = item.stock === -1;

  return (
    <motion.div
      layout
      animate={{ opacity: 1, scale: 1 }}
      className="group overflow-hidden rounded-[1.5rem] border border-cyan-300/15 bg-white/[0.055] shadow-[0_24px_70px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)]"
      exit={{ opacity: 0, scale: 0.9 }}
      initial={{ opacity: 0, scale: 0.9 }}
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-cyan-400/20 via-blue-500/10 to-orange-500/14">
        {item.image_url ? (
          <img
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            src={item.image_url}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Gift className="h-16 w-16 text-cyan-200/35" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

        {item.category ? (
          <Badge className="absolute left-3 top-3 border border-cyan-300/25 bg-slate-950/70 text-cyan-100 backdrop-blur-sm">
            {item.category}
          </Badge>
        ) : null}

        {isOutOfStock ? (
          <Badge variant="destructive" className="absolute right-3 top-3">
            Locked
          </Badge>
        ) : !isUnlimited && item.stock && item.stock <= 5 ? (
          <Badge className="absolute right-3 top-3 border border-orange-300/25 bg-orange-500/20 text-orange-100">
            {item.stock} left
          </Badge>
        ) : null}
      </div>

      <div className="space-y-3 p-4">
        <h3 className="line-clamp-1 font-display text-lg font-black text-white">
          {item.name}
        </h3>
        <p className="min-h-[2.5rem] line-clamp-2 text-sm leading-5 text-slate-400">
          {item.description ||
            "A community perk designed for status, recognition, or access."}
        </p>

        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-cyan-300" />
            <span className="font-display text-xl font-black text-cyan-100">
              {item.price_arena.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-slate-500">AP</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Perk cost
          </span>
        </div>

        {isAuthenticated ? (
          <Button
            className="min-h-11 w-full justify-center gap-2 rounded-[0.95rem] text-sm font-black"
            disabled={!canAfford || isOutOfStock || isRedeeming}
            variant={canAfford && !isOutOfStock ? "hero" : "outline"}
            onClick={() => onRedeem(item)}
          >
            {isRedeeming ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                Claiming...
              </>
            ) : isOutOfStock ? (
              <>
                <AlertCircle className="h-4 w-4" />
                Locked
              </>
            ) : !canAfford ? (
              <>
                <AlertCircle className="h-4 w-4" />
                More AP needed
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Claim perk
              </>
            )}
          </Button>
        ) : (
          <AppLink className="block" href="/auth">
            <Button className="w-full" variant="outline">
              Sign in to claim
            </Button>
          </AppLink>
        )}
      </div>
    </motion.div>
  );
}
