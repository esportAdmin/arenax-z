import { Gift } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Prize } from "@/components/rewards/rewardCatalogData";
import { cn } from "@/lib/utils";

interface RewardStoreCardProps {
  onRedeem: () => void;
  prize: Prize;
}

/**
 * Renders one virtual reward catalog card for the rewards vault.
 *
 * Example:
 * ```tsx
 * <RewardStoreCard prize={prize} onRedeem={() => undefined} />
 * ```
 */
export function RewardStoreCard({ onRedeem, prize }: RewardStoreCardProps) {
  const inStock = (prize.stock ?? 0) > 0;

  return (
    <div
      className={cn(
        "surface-panel hero-sheen overflow-hidden border-white/10 p-4 transition-transform duration-200 hover:-translate-y-1",
        !inStock && "opacity-70",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-lg font-bold text-white">{prize.name}</div>
          {prize.description ? (
            <div className="mt-1 line-clamp-2 text-sm text-slate-400">
              {prize.description}
            </div>
          ) : null}
        </div>

        <div className="shrink-0 text-right">
          <div className="text-sm font-black text-cyan-300">
            {prize.price_arena.toLocaleString("en-US")} credits
          </div>
          <div className="text-[11px] text-slate-500">
            Stock: {(prize.stock ?? 0).toLocaleString("en-US")}
          </div>
        </div>
      </div>

      {prize.image_url ? (
        <img
          src={prize.image_url}
          alt={prize.name}
          className="mt-4 h-40 w-full rounded-2xl border border-white/10 object-cover"
        />
      ) : (
        <div className="mt-4 flex h-40 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <Gift className="h-8 w-8 text-muted-foreground" />
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="metal-chip">
          {inStock ? "Ready to redeem" : "Currently unavailable"}
        </div>

        <Button
          className="min-h-11 w-full min-w-[132px] rounded-full px-5 text-sm font-black uppercase tracking-[0.12em] sm:w-auto"
          disabled={!inStock}
          variant={inStock ? "default" : "outline"}
          onClick={onRedeem}
        >
          {inStock ? "Redeem" : "Out of stock"}
        </Button>
      </div>
    </div>
  );
}
