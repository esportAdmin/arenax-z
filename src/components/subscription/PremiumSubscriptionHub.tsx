// src/components/subscription/PremiumSubscriptionHub.tsx
"use client";

import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  Crown,
  HelpCircle,
  Loader2,
  Shield,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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

import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { SUBSCRIPTION_TIERS } from "@/lib/subscriptionTiers";

type PlanId = "free" | "starter" | "pro" | "elite";
type PaidPlanId = Exclude<PlanId, "free">;

type Plan = {
  id: PaidPlanId;
  name: string;
  priceLabel: string;
  priceSubLabel: string;
  accent: "cyan" | "violet" | "amber";
  icon: typeof Crown;
  highlights: string[];
  includes: string[];
  cta: string;
  recommended?: boolean;
};

type FaqItem = {
  q: string;
  a: string;
};

type ConfirmState = { open: false } | { open: true; planId: PaidPlanId };

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * PremiumSubscriptionHub
 *
 * Subscription page (design pro). Checkout is intentionally stubbed.
 * Replace `startCheckout` with Stripe/Lemon-Squeezy adapter.
 *
 * @example
 * <PremiumSubscriptionHub />
 */
export default function PremiumSubscriptionHub() {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    subscribed,
    tier,
    subscriptionEnd,
    loading: subLoading,
    createCheckout,
  } = useSubscription();

  const [confirm, setConfirm] = useState<ConfirmState>({ open: false });
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);

  const plans: Plan[] = useMemo(
    () => [
      {
        id: "starter",
        name: "Starter",
        priceLabel: "€9",
        priceSubLabel: "/ mois",
        accent: "cyan",
        icon: Sparkles,
        highlights: ["Accès premium de base", "Bonus XP", "Support standard"],
        includes: [
          "Pronostics premium (limité)",
          "Accès clubs + chat",
          "Badges & cosmetics",
          "Bonus XP +10%",
        ],
        cta: "Passer Starter",
      },
      {
        id: "pro",
        name: "Pro",
        priceLabel: "€19",
        priceSubLabel: "/ mois",
        accent: "violet",
        icon: Star,
        highlights: [
          "Le meilleur rapport valeur",
          "Priorité features",
          "Rewards",
        ],
        includes: [
          "Pronostics premium (illimité)",
          "Accès challenges & wars",
          "Rewards mensuelles",
          "Bonus XP +25%",
          "Support prioritaire",
        ],
        cta: "Passer Pro",
        recommended: true,
      },
      {
        id: "elite",
        name: "Elite",
        priceLabel: "€39",
        priceSubLabel: "/ mois",
        accent: "amber",
        icon: Crown,
        highlights: ["Expérience complète", "VIP perks", "Max rewards"],
        includes: [
          "Tout Pro inclus",
          "Accès VIP & drops exclusifs",
          "Rewards mensuelles ++",
          "Bonus XP +50%",
          "Support VIP",
        ],
        cta: "Passer Elite",
      },
    ],
    [],
  );

  const faqs: FaqItem[] = useMemo(
    () => [
      {
        q: "Puis-je annuler quand je veux ?",
        a: "Oui. L’abonnement reste actif jusqu’à la fin de la période en cours. (À connecter au provider de paiement.)",
      },
      {
        q: "Comment fonctionne le paiement ?",
        a: "Le checkout doit être branché via Stripe ou Lemon Squeezy (port-adapter). Le bouton déclenche une session de paiement.",
      },
      {
        q: "Que se passe-t-il si je change de plan ?",
        a: "Le changement doit être géré côté provider (proration / upgrade / downgrade). L’UI est prête.",
      },
      {
        q: "J’ai un problème, qui contacter ?",
        a: "Support in-app (à connecter) + email support. L’abonnement “Elite” bénéficie d’une priorité.",
      },
    ],
    [],
  );

  const currentTierId: PlanId = useMemo(() => {
    const id = (tier?.id || "").toLowerCase();
    if (id === "elite") return "elite";
    if (id === "pro") return "pro";
    if (id === "starter") return "starter";
    return "free";
  }, [tier]);

  /**
   * startCheckout
   *
   * Creates a Stripe Checkout Session through the Supabase Edge Function
   * `create-checkout` and redirects the user to Stripe.
   *
   * @example
   * await startCheckout("pro");
   */
  const startCheckout = useCallback(
    async (planId: PaidPlanId) => {
      if (!user) {
        toast({
          title: "Connexion requise",
          description: "Connectez-vous pour activer un abonnement.",
          variant: "destructive",
        });
        return;
      }

      const tierConfig = SUBSCRIPTION_TIERS[planId];
      const priceId = tierConfig?.price_id;

      // Placeholder values in the repo use suffix "_ID" (ex: price_STARTER_ID).
      if (!priceId || /_ID$/.test(priceId)) {
        toast({
          title: "Billing non configuré",
          description:
            "Définis NEXT_PUBLIC_STRIPE_PRICE_* (Starter/Pro/Elite) puis redeploie.",
          variant: "destructive",
        });
        return;
      }

      setIsStartingCheckout(true);
      try {
        await createCheckout(priceId);
      } finally {
        setIsStartingCheckout(false);
      }
    },
    [createCheckout, toast, user],
  );

  const openConfirm = (planId: PaidPlanId) => {
    setConfirm({ open: true, planId });
  };

  const closeConfirm = () => setConfirm({ open: false });

  const accentStyles = (accent: Plan["accent"]) => {
    if (accent === "cyan") {
      return {
        ring: "ring-cyan-500/30",
        glow: "shadow-[0_0_30px_rgba(0,240,255,0.18)]",
        chip: "bg-cyan-500/15 text-cyan-200 border-cyan-500/30",
        cta: "from-cyan-400 to-blue-500",
        borderHover: "hover:border-cyan-500/35",
      };
    }
    if (accent === "amber") {
      return {
        ring: "ring-amber-500/25",
        glow: "shadow-[0_0_30px_rgba(245,158,11,0.16)]",
        chip: "bg-amber-500/15 text-amber-200 border-amber-500/30",
        cta: "from-amber-400 to-yellow-300",
        borderHover: "hover:border-amber-500/35",
      };
    }
    return {
      ring: "ring-purple-500/25",
      glow: "shadow-[0_0_30px_rgba(168,85,247,0.18)]",
      chip: "bg-purple-500/15 text-purple-200 border-purple-500/30",
      cta: "from-purple-500 to-fuchsia-500",
      borderHover: "hover:border-purple-500/35",
    };
  };

  return (
    <div className="min-h-screen bg-[#0A0B14] text-white">
      <Navbar />

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_circle_at_20%_25%,rgba(0,240,255,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_80%_35%,rgba(168,85,247,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
      </div>

      <main className="pt-24 pb-16">
        <div className="container-arena">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-[0.25em] text-white/60 backdrop-blur-md">
              <Shield className="h-4 w-4 text-cyan-200" />
              SUBSCRIPTION
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight md:text-6xl">
              Passez en{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(168,85,247,0.28)]">
                Premium
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base text-white/60 md:text-lg">
              Des fonctionnalités avancées, des rewards mensuelles et un accès
              VIP. Une hiérarchie claire, un design premium, et une UX rapide.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Badge className="border-white/15 bg-white/5 text-white/70">
                Lighthouse ≥ 95
              </Badge>
              <Badge className="border-white/15 bg-white/5 text-white/70">
                WCAG 2.2 AA
              </Badge>
              <Badge className="border-white/15 bg-white/5 text-white/70">
                Sans pleine largeur
              </Badge>
            </div>
          </motion.div>

          {/* Status strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/20">
                  <Zap className="h-5 w-5 text-cyan-200" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white">
                    Statut abonnement
                  </div>
                  <div className="mt-0.5 text-sm text-white/60">
                    {subLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
                      </span>
                    ) : subscribed ? (
                      <>
                        Actif •{" "}
                        <span className="font-semibold">
                          {tier?.name ?? "Premium"}
                        </span>
                        {subscriptionEnd ? (
                          <span className="text-white/45">
                            {" "}
                            • fin {subscriptionEnd}
                          </span>
                        ) : null}
                      </>
                    ) : (
                      "Aucun abonnement actif"
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  className="border-white/15 bg-transparent text-white hover:bg-white/5"
                  onClick={() => {
                    const el = document.getElementById("subscription-faq");
                    el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  <HelpCircle className="h-4 w-4" />
                  FAQ
                </Button>

                <Button
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 font-bold text-black"
                  onClick={() => {
                    const el = document.getElementById("subscription-plans");
                    el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  Voir les plans
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Plans */}
          <div id="subscription-plans" className="mt-10">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">
                  Plans
                </div>
                <div className="mt-1 text-xl font-extrabold">
                  Choisissez votre niveau
                </div>
              </div>
              <Badge className="border-white/15 bg-white/5 text-white/70">
                Paiement mensuel
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {plans.map((p, idx) => {
                const s = accentStyles(p.accent);
                const isCurrent = currentTierId === p.id;

                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * idx }}
                    className={cx(
                      "relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/65 to-slate-950/70 p-7 backdrop-blur-xl",
                      s.borderHover,
                      p.recommended && "ring-1 " + s.ring,
                      p.recommended && s.glow,
                    )}
                  >
                    <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-black/30 blur-3xl" />

                    <div className="relative">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
                            <p.icon className="h-6 w-6 text-white/80" />
                          </div>
                          <div>
                            <div className="text-lg font-extrabold">
                              {p.name}
                            </div>
                            <div className="mt-1 text-sm text-white/55">
                              {p.highlights[0]}
                            </div>
                          </div>
                        </div>

                        {p.recommended ? (
                          <Badge className={cx("border", s.chip)}>
                            Recommandé
                          </Badge>
                        ) : null}
                      </div>

                      <div className="mt-6 flex items-end gap-2">
                        <div className="text-5xl font-extrabold tracking-tight">
                          {p.priceLabel}
                        </div>
                        <div className="pb-2 text-sm font-semibold text-white/55">
                          {p.priceSubLabel}
                        </div>
                      </div>

                      <div className="mt-5 space-y-2">
                        {p.highlights.slice(1).map((h) => (
                          <div
                            key={h}
                            className="flex items-center gap-2 text-sm text-white/65"
                          >
                            <Check className="h-4 w-4 text-emerald-300" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">
                          Inclus
                        </div>
                        <div className="mt-3 space-y-2">
                          {p.includes.map((it) => (
                            <div
                              key={it}
                              className="flex items-start gap-2 text-sm text-white/70"
                            >
                              <span className="mt-[2px] h-2 w-2 shrink-0 rounded-full bg-white/35" />
                              <span>{it}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 space-y-3">
                        <Button
                          className={cx(
                            "h-12 w-full rounded-2xl font-extrabold text-black",
                            "bg-gradient-to-r " + s.cta,
                          )}
                          disabled={isCurrent || isStartingCheckout}
                          onClick={() => openConfirm(p.id)}
                          aria-label={`Choisir ${p.name}`}
                        >
                          {isStartingCheckout ? (
                            <span className="inline-flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Chargement…
                            </span>
                          ) : isCurrent ? (
                            "Plan actuel"
                          ) : (
                            p.cta
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          className="h-12 w-full rounded-2xl border-white/15 bg-transparent text-white hover:bg-white/5"
                          onClick={() => {
                            const el =
                              document.getElementById("subscription-faq");
                            el?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }}
                        >
                          Détails & FAQ
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* FAQ */}
          <div id="subscription-faq" className="mt-12">
            <div className="mb-4">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">
                FAQ
              </div>
              <div className="mt-1 text-xl font-extrabold">
                Questions fréquentes
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {faqs.map((f) => (
                <div
                  key={f.q}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/20">
                      <HelpCircle className="h-4 w-4 text-white/70" />
                    </div>
                    <div>
                      <div className="font-bold">{f.q}</div>
                      <div className="mt-1 text-sm text-white/60">{f.a}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm dialog */}
          <Dialog
            open={confirm.open}
            onOpenChange={(v) => !v && closeConfirm()}
          >
            <DialogContent className="border-white/10 bg-slate-950/80 text-white backdrop-blur-xl sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Confirmer l’abonnement</DialogTitle>
                <DialogDescription className="text-white/60">
                  Vous allez être redirigé vers le paiement pour activer votre
                  plan.
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
                <div className="flex items-center justify-between">
                  <span>Plan</span>
                  <span className="font-bold">
                    {confirm.open ? confirm.planId.toUpperCase() : ""}
                  </span>
                </div>
                <div className="mt-2 text-xs text-white/50">
                  {/* TODO-human: provider checkout */}
                  Le checkout est à connecter (Stripe/Lemon-Squeezy).
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  className="border-white/15 bg-transparent text-white hover:bg-white/5"
                  onClick={closeConfirm}
                  disabled={isStartingCheckout}
                >
                  Annuler
                </Button>

                <Button
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 font-extrabold text-black"
                  onClick={async () => {
                    if (!confirm.open) return;
                    await startCheckout(confirm.planId);
                    closeConfirm();
                  }}
                  disabled={isStartingCheckout}
                >
                  Continuer
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="mt-10">
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}
