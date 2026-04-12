"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Coins,
  Gamepad2,
  Gift,
  Package,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

import { AppLink } from "@/components/AppLink";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useArenaBalance } from "@/hooks/useArenaBalance";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

interface Prize {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price_arena: number;
  usd_value: number | null;
  stock: number;
  category: string | null;
  active: boolean;
}

function PrizeCard({
  prize,
  onRedeem,
  userBalance,
  isAuthenticated,
  isRedeeming,
}: {
  prize: Prize;
  onRedeem: (prize: Prize) => void;
  userBalance: number;
  isAuthenticated: boolean;
  isRedeeming: boolean;
}) {
  const canAfford = userBalance >= prize.price_arena;
  const isOutOfStock = prize.stock === 0;
  const isUnlimited = prize.stock === -1;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-card group overflow-hidden"
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
        {prize.image_url ? (
          <img
            src={prize.image_url}
            alt={prize.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Gift className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}

        {prize.category && (
          <Badge className="absolute left-3 top-3 bg-background/80 backdrop-blur-sm">
            {prize.category}
          </Badge>
        )}

        {isOutOfStock ? (
          <Badge variant="destructive" className="absolute right-3 top-3">
            Sold out
          </Badge>
        ) : !isUnlimited && prize.stock && prize.stock <= 5 ? (
          <Badge
            variant="secondary"
            className="absolute right-3 top-3 bg-accent/80"
          >
            {prize.stock} left
          </Badge>
        ) : null}
      </div>

      <div className="space-y-3 p-4">
        <h3 className="line-clamp-1 font-display text-lg font-bold">
          {prize.name}
        </h3>
        <p className="min-h-[2.5rem] line-clamp-2 text-sm text-muted-foreground">
          {prize.description || "No description available"}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-accent" />
            <span className="font-display text-xl font-bold text-accent">
              {prize.price_arena.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">AP</span>
          </div>
          {prize.usd_value && (
            <span className="text-sm text-muted-foreground">
              ~${prize.usd_value}
            </span>
          )}
        </div>

        {isAuthenticated ? (
          <Button
            className="w-full gap-2"
            variant={canAfford && !isOutOfStock ? "hero" : "outline"}
            disabled={!canAfford || isOutOfStock || isRedeeming}
            onClick={() => onRedeem(prize)}
          >
            {isRedeeming ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                Redeeming...
              </>
            ) : isOutOfStock ? (
              <>
                <AlertCircle className="h-4 w-4" />
                Sold out
              </>
            ) : !canAfford ? (
              <>
                <AlertCircle className="h-4 w-4" />
                Insufficient balance
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Redeem
              </>
            )}
          </Button>
        ) : (
          <AppLink href="/auth" className="block">
            <Button variant="outline" className="w-full">
              Sign in to redeem
            </Button>
          </AppLink>
        )}
      </div>
    </motion.div>
  );
}

const RewardsStore = () => {
  const { user } = useAuth();
  const { balance: userBalance, redeemPrize } = useArenaBalance();

  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<Prize | null>(null);

  const fetchPrizes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("arena_prizes")
      .select("*")
      .eq("active", true)
      .order("price_arena", { ascending: true });

    if (error) {
      logger.error("Error fetching prizes:", error);
    } else {
      setPrizes((data || []) as Prize[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPrizes();
  }, [fetchPrizes]);

  const handleRedeem = (prize: Prize) => {
    setConfirmDialog(prize);
  };

  const confirmRedeem = async () => {
    if (!confirmDialog) return;

    setRedeeming(true);
    const success = await redeemPrize(confirmDialog.id);

    if (success) {
      await fetchPrizes();
    }

    setRedeeming(false);
    setConfirmDialog(null);
  };

  const categories = Array.from(
    new Set(prizes.map((p) => p.category).filter(Boolean)),
  ) as string[];

  const filteredPrizes = selectedCategory
    ? prizes.filter((p) => p.category === selectedCategory)
    : prizes;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pb-12 pt-20 lg:pt-24">
        <div className="container-arena">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-lg border border-accent/30 bg-accent/20 p-2">
                    <Gift className="h-6 w-6 text-accent" />
                  </div>
                  <h1 className="font-display text-3xl font-bold md:text-4xl">
                    <span className="text-foreground">Rewards </span>
                    <span className="gradient-text-accent">Store</span>
                  </h1>
                </div>
                <p className="text-muted-foreground">
                  Redeem your Arena Points for exclusive rewards
                </p>
              </div>

              {user && (
                <div className="glass-card flex items-center gap-4 px-6 py-4">
                  <div className="rounded-xl bg-accent/20 p-3">
                    <Coins className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Your balance
                    </p>
                    <p className="font-display text-2xl font-bold text-accent">
                      {userBalance.toLocaleString()} AP
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Tabs
              value={selectedCategory || "all"}
              onValueChange={(value) =>
                setSelectedCategory(value === "all" ? null : value)
              }
            >
              <TabsList className="h-auto flex-wrap gap-2 bg-transparent p-0">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  All
                </TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {category === "CS2 Skins" && (
                      <Gamepad2 className="mr-2 h-4 w-4" />
                    )}
                    {category === "Gift Cards" && (
                      <Gift className="mr-2 h-4 w-4" />
                    )}
                    {category === "Merch" && (
                      <Package className="mr-2 h-4 w-4" />
                    )}
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="glass-card h-80 animate-pulse">
                  <div className="h-48 bg-muted/50" />
                  <div className="space-y-3 p-4">
                    <div className="h-5 w-3/4 rounded bg-muted/50" />
                    <div className="h-4 w-full rounded bg-muted/50" />
                    <div className="h-10 rounded bg-muted/50" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPrizes.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredPrizes.map((prize) => (
                  <PrizeCard
                    key={prize.id}
                    prize={prize}
                    onRedeem={handleRedeem}
                    userBalance={userBalance}
                    isAuthenticated={!!user}
                    isRedeeming={redeeming}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="py-12 text-center">
              <Gift className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
              <h3 className="mb-2 font-display text-xl font-bold">
                No rewards available
              </h3>
              <p className="text-muted-foreground">
                Check back soon for new rewards!
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <Dialog
        open={!!confirmDialog}
        onOpenChange={() => setConfirmDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm redemption</DialogTitle>
            <DialogDescription>
              Do you want to redeem{" "}
              <strong>{confirmDialog?.price_arena.toLocaleString()} AP</strong>{" "}
              for:
            </DialogDescription>
          </DialogHeader>

          {confirmDialog && (
            <div className="flex items-center gap-4 rounded-lg bg-muted/30 p-4">
              {confirmDialog.image_url ? (
                <img
                  src={confirmDialog.image_url}
                  alt={confirmDialog.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                  <Gift className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <p className="font-display font-bold">{confirmDialog.name}</p>
                <p className="text-sm text-muted-foreground">
                  {confirmDialog.category}
                </p>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-accent/30 bg-accent/10 p-3">
            <p className="text-sm">
              <strong>Balance after redemption:</strong>{" "}
              <span className="font-bold text-accent">
                {(
                  userBalance - (confirmDialog?.price_arena || 0)
                ).toLocaleString()}{" "}
                AP
              </span>
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={confirmRedeem}
              disabled={redeeming}
              className="gap-2"
            >
              {redeeming ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Redeeming...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Confirm redemption
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RewardsStore;
