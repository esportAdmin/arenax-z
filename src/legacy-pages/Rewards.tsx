// src/legacy-pages/Rewards.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Gift, Loader2, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type PrizeRow = Database["public"]["Tables"]["arena_prizes"]["Row"];

export type Prize = Omit<PrizeRow, "active"> & {
  active: boolean;
};

function normalizePrize(row: PrizeRow): Prize {
  return {
    ...row,
    active: row.active ?? false,
  };
}

export default function Rewards() {
  const { toast } = useToast();
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrizes = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      // FIX: table name is "arena_prizes" (not "prizes")
      .from("arena_prizes")
      .select("*")
      .order("price_arena", { ascending: true });

    if (error) {
      toast({
        title: "Erreur",
        description: error.message ?? "Impossible de charger les récompenses",
        variant: "destructive",
      });
      setPrizes([]);
      setLoading(false);
      return;
    }

    const normalized = (data ?? []).map(normalizePrize);
    setPrizes(normalized);
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchPrizes();
  }, [fetchPrizes]);

  const activePrizes = useMemo(() => prizes.filter((p) => p.active), [prizes]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container-arena py-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-white flex items-center gap-2">
              <Gift className="h-6 w-6 text-primary" />
              Rewards
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Échange tes points Arena contre des récompenses.
            </p>
          </div>

          <Button asChild variant="glass">
            <Link href="/profile" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Mon profil
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="glass-card p-6 flex items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">
              Chargement des récompenses…
            </span>
          </div>
        ) : activePrizes.length === 0 ? (
          <div className="glass-card p-6 text-center">
            <Gift className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <div className="text-white font-medium">Aucune récompense</div>
            <div className="text-sm text-muted-foreground mt-1">
              Les récompenses seront bientôt disponibles.
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activePrizes.map((p) => {
              const inStock = (p.stock ?? 0) > 0;

              return (
                <div
                  key={p.id}
                  className={cn(
                    "glass-card p-4 border border-white/5 overflow-hidden",
                    !inStock && "opacity-70",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-display font-bold text-white truncate">
                        {p.name}
                      </div>
                      {p.description && (
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {p.description}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="text-sm font-bold text-primary">
                        {p.price_arena.toLocaleString()} ARENA
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Stock: {(p.stock ?? 0).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {p.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="mt-3 w-full h-36 object-cover rounded-lg border border-white/5"
                    />
                  ) : (
                    <div className="mt-3 w-full h-36 rounded-lg border border-white/5 bg-white/5 flex items-center justify-center">
                      <Gift className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}

                  <div className="mt-4">
                    <Button
                      className="w-full"
                      variant={inStock ? "default" : "outline"}
                      disabled={!inStock}
                      onClick={() => {
                        toast({
                          title: "À implémenter",
                          description:
                            "Branche la logique d’achat (RPC / Stripe / etc.) ici.",
                        });
                      }}
                    >
                      {inStock ? "Échanger" : "Rupture de stock"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8">
          <Button variant="outline" onClick={fetchPrizes}>
            Rafraîchir
          </Button>
        </div>
      </div>
    </div>
  );
}
