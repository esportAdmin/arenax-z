"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useArenaBalance } from "@/hooks/useArenaBalance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppLink } from "@/components/AppLink";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Gift,
  Coins,
  ShoppingCart,
  Package,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Gamepad2,
} from "lucide-react";
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
      className="glass-card overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
        {prize.image_url ? (
          <img
            src={prize.image_url}
            alt={prize.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Gift className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}

        {prize.category && (
          <Badge className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm">
            {prize.category}
          </Badge>
        )}

        {isOutOfStock ? (
          <Badge variant="destructive" className="absolute top-3 right-3">
            Épuisé
          </Badge>
        ) : !isUnlimited && prize.stock && prize.stock <= 5 ? (
          <Badge
            variant="secondary"
            className="absolute top-3 right-3 bg-accent/80"
          >
            {prize.stock} restants
          </Badge>
        ) : null}
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-display font-bold text-lg line-clamp-1">
          {prize.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {prize.description || "Aucune description"}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-accent" />
            <span className="font-display font-bold text-xl text-accent">
              {prize.price_arena.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">AP</span>
          </div>
          {prize.usd_value && (
            <span className="text-sm text-muted-foreground">
              ~{prize.usd_value}€
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
                <Clock className="w-4 h-4 animate-spin" />
                Échange en cours...
              </>
            ) : isOutOfStock ? (
              <>
                <AlertCircle className="w-4 h-4" />
                Épuisé
              </>
            ) : !canAfford ? (
              <>
                <AlertCircle className="w-4 h-4" />
                Solde insuffisant
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Échanger
              </>
            )}
          </Button>
        ) : (
          <AppLink href="/auth" className="block">
            <Button variant="outline" className="w-full">
              Connectez-vous pour échanger
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

      <main className="pt-20 lg:pt-24 pb-12">
        <div className="container-arena">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-accent/20 border border-accent/30">
                    <Gift className="w-6 h-6 text-accent" />
                  </div>
                  <h1 className="font-display font-bold text-3xl md:text-4xl">
                    <span className="text-foreground">Rewards </span>
                    <span className="gradient-text-accent">Store</span>
                  </h1>
                </div>
                <p className="text-muted-foreground">
                  Échangez vos Arena Points contre des récompenses exclusives
                </p>
              </div>

              {user && (
                <div className="glass-card px-6 py-4 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-accent/20">
                    <Coins className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Votre solde</p>
                    <p className="font-display font-bold text-2xl text-accent">
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
              onValueChange={(v) => setSelectedCategory(v === "all" ? null : v)}
            >
              <TabsList className="h-auto flex-wrap gap-2 bg-transparent p-0">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Tous
                </TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {category === "CS2 Skins" && (
                      <Gamepad2 className="w-4 h-4 mr-2" />
                    )}
                    {category === "Gift Cards" && (
                      <Gift className="w-4 h-4 mr-2" />
                    )}
                    {category === "Merch" && (
                      <Package className="w-4 h-4 mr-2" />
                    )}
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="glass-card h-80 animate-pulse">
                  <div className="h-48 bg-muted/50" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-muted/50 rounded w-3/4" />
                    <div className="h-4 bg-muted/50 rounded w-full" />
                    <div className="h-10 bg-muted/50 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPrizes.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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
            <div className="text-center py-12">
              <Gift className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl mb-2">
                Aucun prix disponible
              </h3>
              <p className="text-muted-foreground">
                Revenez bientôt pour découvrir de nouvelles récompenses !
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
            <DialogTitle>Confirmer l&apos;échange</DialogTitle>
            <DialogDescription>
              Voulez-vous échanger{" "}
              <strong>{confirmDialog?.price_arena.toLocaleString()} AP</strong>{" "}
              contre :
            </DialogDescription>
          </DialogHeader>

          {confirmDialog && (
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
              {confirmDialog.image_url ? (
                <img
                  src={confirmDialog.image_url}
                  alt={confirmDialog.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                  <Gift className="w-8 h-8 text-muted-foreground" />
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

          <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
            <p className="text-sm">
              <strong>Solde après échange :</strong>{" "}
              <span className="text-accent font-bold">
                {(
                  userBalance - (confirmDialog?.price_arena || 0)
                ).toLocaleString()}{" "}
                AP
              </span>
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog(null)}>
              Annuler
            </Button>
            <Button
              onClick={confirmRedeem}
              disabled={redeeming}
              className="gap-2"
            >
              {redeeming ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Échange en cours...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Confirmer l&apos;échange
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
