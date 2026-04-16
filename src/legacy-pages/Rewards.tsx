"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Coins,
  Gift,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  TimerReset,
  Trophy,
  Zap,
} from "lucide-react";

import { CountdownPill } from "@/components/engagement/CountdownPill";
import { ReturnNudgeCard } from "@/components/engagement/ReturnNudgeCard";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { LevelRewardsGrid } from "@/components/rewards/LevelRewardsGrid";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { getHoursFromNow, getNextWeeklyReset } from "@/lib/countdown";
import { isLocalQaUser } from "@/lib/dev-auth";
import { cn } from "@/lib/utils";

type PrizeRow = Database["public"]["Tables"]["arena_prizes"]["Row"];

export type Prize = Omit<PrizeRow, "active"> & {
  active: boolean;
};

const FALLBACK_PRIZES: Prize[] = [
  {
    id: 1,
    sku: "qa-premium-pass",
    name: "Premium Command Pass",
    description: "A flagship reward card that keeps the vault feeling desirable.",
    price_arena: 1200,
    usd_value: 19,
    stock: 14,
    category: "premium",
    image_url: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updated_at: new Date().toISOString(),
    active: true,
  },
  {
    id: 2,
    sku: "qa-elite-badge",
    name: "Elite Club Crest",
    description: "A high-status cosmetic unlock for social proof inside the product.",
    price_arena: 850,
    usd_value: 12,
    stock: 32,
    category: "identity",
    image_url: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updated_at: new Date().toISOString(),
    active: true,
  },
  {
    id: 3,
    sku: "qa-drop-crate",
    name: "Weekly Drop Crate",
    description: "A repeatable vault reward that reinforces return behavior.",
    price_arena: 500,
    usd_value: 7,
    stock: 99,
    category: "drops",
    image_url: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updated_at: new Date().toISOString(),
    active: true,
  },
];

function normalizePrize(row: PrizeRow): Prize {
  return {
    ...row,
    active: row.active ?? false,
  };
}

export default function Rewards() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { profile } = useProfile();
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const isLocalQa = isLocalQaUser(user);

  const fetchPrizes = useCallback(async () => {
    if (isLocalQa) {
      setPrizes(FALLBACK_PRIZES);
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("arena_prizes")
      .select("*")
      .order("price_arena", { ascending: true });

    if (error) {
      setPrizes(FALLBACK_PRIZES);
      setLoading(false);
      return;
    }

    setPrizes((data ?? []).map(normalizePrize));
    setLoading(false);
  }, [isLocalQa]);

  useEffect(() => {
    fetchPrizes();
  }, [fetchPrizes]);

  const activePrizes = useMemo(
    () => prizes.filter((prize) => prize.active),
    [prizes],
  );

  const inStockPrizes = useMemo(
    () => activePrizes.filter((prize) => (prize.stock ?? 0) > 0),
    [activePrizes],
  );

  const nextStoreRefresh = getHoursFromNow(12);
  const nextVaultDrop = getNextWeeklyReset(5, 20);

  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[7%] top-[8%] h-[30rem] w-[30rem] rounded-full bg-amber-400/10 blur-[10rem]" />
        <div className="absolute right-[3%] top-[18%] h-[32rem] w-[32rem] rounded-full bg-cyan-400/10 blur-[10rem]" />
        <div className="absolute bottom-[5%] left-[28%] h-[24rem] w-[24rem] rounded-full bg-orange-500/10 blur-[9rem]" />
      </div>

      <main className="relative z-10 pb-12 pt-24">
        <div className="container-arena space-y-8">
          <section className="command-frame hero-sheen relative overflow-hidden px-6 py-8 lg:px-10 lg:py-10">
            <div className="subtle-noise absolute inset-0 opacity-50" />
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(255,191,87,0.18),transparent_55%)]" />

            <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
              <div className="space-y-5">
                <div className="eyebrow-badge">Progression vault</div>

                <div>
                  <h1 className="font-display text-4xl font-black tracking-tight text-white lg:text-6xl">
                    Turn momentum into{" "}
                    <span className="block bg-gradient-to-r from-amber-200 via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
                      rewards people want to protect.
                    </span>
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 lg:text-lg">
                    The reward vault should feel like a destination, not a
                    ledger. Keep unlocks visible, refreshes predictable, and the
                    next prize close enough to chase.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="surface-panel border-cyan-400/20 bg-cyan-400/10">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-cyan-200/70">
                      <Zap className="h-4 w-4" />
                      Current level
                    </div>
                    <div className="mt-3 text-3xl font-black text-white">
                      {profile?.current_level ?? "--"}
                    </div>
                  </div>

                  <div className="surface-panel border-emerald-400/20 bg-emerald-400/10">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-emerald-200/70">
                      <Coins className="h-4 w-4" />
                      Arena credits
                    </div>
                    <div className="mt-3 text-3xl font-black text-white">
                      {profile ? profile.arena_balance.toLocaleString("en-US") : "--"}
                    </div>
                  </div>

                  <div className="surface-panel border-amber-400/20 bg-amber-400/10">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-amber-200/70">
                      <ShoppingCart className="h-4 w-4" />
                      Store drops
                    </div>
                    <div className="mt-3 text-3xl font-black text-white">
                      {activePrizes.length}
                    </div>
                  </div>

                  <div className="surface-panel border-fuchsia-400/20 bg-fuchsia-400/10">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-fuchsia-200/70">
                      <ShieldCheck className="h-4 w-4" />
                      In stock
                    </div>
                    <div className="mt-3 text-3xl font-black text-white">
                      {inStockPrizes.length}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="min-h-12 w-full min-w-0 rounded-full px-5 text-center text-sm font-black uppercase tracking-[0.12em] sm:min-w-[210px] sm:w-auto"
                  >
                    <Link href="/profile" prefetch={false}>
                      Return to profile
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="min-h-12 w-full min-w-0 rounded-full px-5 text-center text-sm font-black uppercase tracking-[0.12em] sm:min-w-[190px] sm:w-auto"
                  >
                    <Link href="/live-calls" prefetch={false}>Open live calls</Link>
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <CountdownPill
                    label="Store refresh"
                    target={nextStoreRefresh}
                    tone="amber"
                  />
                  <CountdownPill
                    label="Vault drop"
                    target={nextVaultDrop}
                    tone="cyan"
                  />
                </div>
              </div>

              <div className="section-shell space-y-4">
                <div className="eyebrow-badge">Why players return</div>

                <div className="surface-panel">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Retention loop
                  </div>
                  <div className="mt-2 text-xl font-black text-white">
                    Visible unlocks beat invisible progression.
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Make the next claim obvious, the next tier desirable, and
                    the next session feel worth it before the player leaves.
                  </p>
                </div>

                {!user ? (
                  <div className="surface-panel border-white/10">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Sparkles className="h-4 w-4 text-cyan-300" />
                      Sign in to unlock claimable progression rewards
                    </div>
                    <p className="mt-2 text-sm text-slate-400">
                      Browsing the store is good. Seeing your own next reward is
                      better.
                    </p>
                    <Button asChild className="mt-4 min-h-12 w-full rounded-full">
                      <Link href="/login" prefetch={false}>Sign in</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="surface-panel">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Progress status
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xl font-black text-white">
                      <Trophy className="h-5 w-5 text-amber-300" />
                      {profile?.total_wins ?? 0} wins converted into value
                    </div>
                    <p className="mt-2 text-sm text-slate-400">
                      The more earned value is visible here, the stronger the
                      return habit becomes.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <ReturnNudgeCard
              icon={Gift}
              label="Claim urgency"
              title="Rewards feel stronger when they can expire"
              text="A visible claim window gives earned value more emotional weight than a static catalog ever will."
              tone="amber"
              lockedText="Flash reward crate opens on the next refresh"
            />
            <ReturnNudgeCard
              icon={LockKeyhole}
              label="Premium scarcity"
              title="Locked tiers make the vault feel desirable"
              text="Even when users cannot redeem yet, they should feel close enough to care."
              tone="rose"
              lockedText="Founder-grade reward lane unlocks above the next level"
            />
            <ReturnNudgeCard
              icon={TimerReset}
              label="Refresh rhythm"
              title="A cadence gives people a reason to check the vault daily"
              text="The more predictable the reward rhythm, the easier it becomes to build a return habit around it."
              tone="cyan"
              lockedText="Next premium stock rotation goes live after reset"
            />
          </section>

          <section className="section-shell">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10">
                  <ShieldCheck className="h-5 w-5 text-cyan-200" />
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-cyan-200">
                    Trust strip
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Arena credits and reward unlocks are virtual engagement
                    units only. No cash value. No financial return.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Community-first", "No wagering", "Discord/Twitch ready"].map(
                  (label) => (
                    <span
                      key={label}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-300"
                    >
                      {label}
                    </span>
                  ),
                )}
              </div>
            </div>
          </section>

          {profile ? (
            <section className="section-shell space-y-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="eyebrow-badge">Claim track</div>
                  <h2 className="mt-3 font-display text-3xl font-black text-white">
                    Your progression rewards
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    Keep this section rich and alive. It is one of the clearest
                    "come back tomorrow" surfaces in the entire product.
                  </p>
                </div>
              </div>

              <LevelRewardsGrid currentLevel={profile.current_level} />
            </section>
          ) : null}

          <section className="section-shell space-y-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="eyebrow-badge">Store redemptions</div>
                <h2 className="mt-3 font-display text-3xl font-black text-white">
                  Premium redemption catalog
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Premium perks create perceived value. Keep the catalog visible,
                  fresh, and obviously attainable without implying financial
                  return.
                </p>
              </div>

              <Button
                variant="outline"
                onClick={fetchPrizes}
                className="min-h-11 rounded-full px-5 text-sm font-black uppercase tracking-[0.12em]"
              >
                Refresh catalog
              </Button>
            </div>

            {loading ? (
              <div className="section-shell flex items-center justify-center gap-3 p-6">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  Loading rewards...
                </span>
              </div>
            ) : activePrizes.length === 0 ? (
              <div className="section-shell p-6 text-center">
                <Gift className="mx-auto mb-3 h-10 w-10 opacity-50" />
                <div className="font-medium text-white">No rewards available</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Rewards will be available soon.
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {activePrizes.map((prize) => {
                  const inStock = (prize.stock ?? 0) > 0;

                  return (
                    <div
                      key={prize.id}
                      className={cn(
                        "surface-panel hero-sheen overflow-hidden border-white/10 p-4 transition-transform duration-200 hover:-translate-y-1",
                        !inStock && "opacity-70",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-lg font-bold text-white">
                            {prize.name}
                          </div>
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
                          variant={inStock ? "default" : "outline"}
                          disabled={!inStock}
                          onClick={() => {
                            toast({
                              title: "Redemption flow pending",
                              description:
                                "Wire your real redemption flow here to turn this into a high-retention value loop.",
                            });
                          }}
                        >
                          {inStock ? "Redeem" : "Out of stock"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
