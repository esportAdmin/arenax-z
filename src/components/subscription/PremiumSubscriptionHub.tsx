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
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
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
        priceLabel: "$29",
        priceSubLabel: "/ month",
        accent: "cyan",
        icon: Sparkles,
        highlights: ["Community launch kit", "XP boost", "Standard support"],
        includes: [
          "Live ritual planning",
          "Club access + command chat",
          "Badges and cosmetic status",
          "XP bonus +10%",
        ],
        cta: "Activate Starter",
      },
      {
        id: "pro",
        name: "Pro",
        priceLabel: "$79",
        priceSubLabel: "/ month",
        accent: "violet",
        icon: Star,
        highlights: ["Best value", "Retention loops", "Priority features"],
        includes: [
          "Unlimited live rituals",
          "Challenges and war-room access",
          "Monthly community perks",
          "XP bonus +25%",
          "Priority support",
        ],
        cta: "Activate Pro",
        recommended: true,
      },
      {
        id: "elite",
        name: "Elite",
        priceLabel: "$149",
        priceSubLabel: "/ month",
        accent: "amber",
        icon: Crown,
        highlights: ["Full command suite", "VIP perks", "Concierge priority"],
        includes: [
          "Everything in Pro",
          "VIP access & exclusive drops",
          "Enhanced monthly perks",
          "XP bonus +50%",
          "Priority concierge support",
        ],
        cta: "Activate Elite",
      },
    ],
    [],
  );

  const faqs: FaqItem[] = useMemo(
    () => [
      {
        q: "Can I cancel anytime?",
        a: "Yes. Your subscription stays active until the end of the current billing period. This still needs to be wired to the payment provider.",
      },
      {
        q: "How does billing work?",
        a: "Checkout is intended to run through Lemon Squeezy for US subscriptions. The button starts the hosted payment session once production billing is configured.",
      },
      {
        q: "What happens if I change plans?",
        a: "Plan changes should be handled by the billing provider. The UI is ready for that flow once production billing is connected.",
      },
      {
        q: "I have an issue. Who should I contact?",
        a: "In-app support plus support email. The Elite tier receives priority handling.",
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

  const startCheckout = useCallback(
    async (planId: PaidPlanId) => {
      if (!user) {
        toast({
          title: "Sign-in required",
          description: "Sign in to activate a subscription.",
          variant: "destructive",
        });
        return;
      }

      const tierConfig = SUBSCRIPTION_TIERS[planId];
      const priceId = tierConfig?.price_id;

      if (!priceId || /_ID$/.test(priceId)) {
        toast({
          title: "Billing not configured",
          description:
            "Connect Lemon Squeezy product IDs before enabling checkout.",
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

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_circle_at_20%_25%,rgba(0,240,255,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_80%_35%,rgba(168,85,247,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
      </div>

      <main className="pb-16 pt-24">
        <div className="container-arena">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-[0.25em] text-white/60 backdrop-blur-md">
              <Shield className="h-4 w-4 text-cyan-200" />
              COMMUNITY PLANS
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight md:text-6xl">
              Build the{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(168,85,247,0.28)]">
                Retention Engine
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base text-white/60 md:text-lg">
              Paid tiers for Discord and Twitch communities that want daily
              rituals, prestige loops, and cleaner member activation.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Badge className="border-white/15 bg-white/5 text-white/70">
                Discord/Twitch ready
              </Badge>
              <Badge className="border-white/15 bg-white/5 text-white/70">
                Community-first
              </Badge>
              <Badge className="border-white/15 bg-white/5 text-white/70">
                No cash rewards
              </Badge>
            </div>
          </motion.div>

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
                    Subscription status
                  </div>
                  <div className="mt-0.5 text-sm text-white/60">
                    {subLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                      </span>
                    ) : subscribed ? (
                      <>
                        Active •{" "}
                        <span className="font-semibold">
                          {tier?.name ?? "Premium"}
                        </span>
                        {subscriptionEnd ? (
                          <span className="text-white/45">
                            {" "}
                            • ends {subscriptionEnd}
                          </span>
                        ) : null}
                      </>
                    ) : (
                      "No active subscription"
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
                  View plans
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          <div id="subscription-plans" className="mt-10">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">
                  Plans
                </div>
                <div className="mt-1 text-xl font-extrabold">
                  Choose your tier
                </div>
              </div>
              <Badge className="border-white/15 bg-white/5 text-white/70">
                Monthly billing
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {plans.map((plan, index) => {
                const styles = accentStyles(plan.accent);
                const isCurrent = currentTierId === plan.id;

                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * index }}
                    className={cx(
                      "relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/65 to-slate-950/70 p-7 backdrop-blur-xl",
                      styles.borderHover,
                      plan.recommended && "ring-1 " + styles.ring,
                      plan.recommended && styles.glow,
                    )}
                  >
                    <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-black/30 blur-3xl" />

                    <div className="relative">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
                            <plan.icon className="h-6 w-6 text-white/80" />
                          </div>
                          <div>
                            <div className="text-lg font-extrabold">
                              {plan.name}
                            </div>
                            <div className="mt-1 text-sm text-white/55">
                              {plan.highlights[0]}
                            </div>
                          </div>
                        </div>

                        {plan.recommended ? (
                          <Badge className={cx("border", styles.chip)}>
                            Recommended
                          </Badge>
                        ) : null}
                      </div>

                      <div className="mt-6 flex items-end gap-2">
                        <div className="text-5xl font-extrabold tracking-tight">
                          {plan.priceLabel}
                        </div>
                        <div className="pb-2 text-sm font-semibold text-white/55">
                          {plan.priceSubLabel}
                        </div>
                      </div>

                      <div className="mt-5 space-y-2">
                        {plan.highlights.slice(1).map((highlight) => (
                          <div
                            key={highlight}
                            className="flex items-center gap-2 text-sm text-white/65"
                          >
                            <Check className="h-4 w-4 text-emerald-300" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">
                          Included
                        </div>
                        <div className="mt-3 space-y-2">
                          {plan.includes.map((item) => (
                            <div
                              key={item}
                              className="flex items-start gap-2 text-sm text-white/70"
                            >
                              <span className="mt-[2px] h-2 w-2 shrink-0 rounded-full bg-white/35" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 space-y-3">
                        <Button
                          className={cx(
                            "h-12 w-full rounded-2xl font-extrabold text-black",
                            "bg-gradient-to-r " + styles.cta,
                          )}
                          disabled={isCurrent || isStartingCheckout}
                          onClick={() => openConfirm(plan.id)}
                          aria-label={`Choose ${plan.name}`}
                        >
                          {isStartingCheckout ? (
                            <span className="inline-flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Loading...
                            </span>
                          ) : isCurrent ? (
                            "Current plan"
                          ) : (
                            plan.cta
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          className="h-12 w-full rounded-2xl border-white/15 bg-transparent text-white hover:bg-white/5"
                          onClick={() => {
                            const el = document.getElementById("subscription-faq");
                            el?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }}
                        >
                          Details & FAQ
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div id="subscription-faq" className="mt-12">
            <div className="mb-4">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">
                FAQ
              </div>
              <div className="mt-1 text-xl font-extrabold">
                Frequently asked questions
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/20">
                      <HelpCircle className="h-4 w-4 text-white/70" />
                    </div>
                    <div>
                      <div className="font-bold">{faq.q}</div>
                      <div className="mt-1 text-sm text-white/60">{faq.a}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Dialog open={confirm.open} onOpenChange={(open) => !open && closeConfirm()}>
            <DialogContent className="border-white/10 bg-slate-950/80 text-white backdrop-blur-xl sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm subscription</DialogTitle>
                <DialogDescription className="text-white/60">
                  You will be redirected to checkout to activate your plan.
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
                  Checkout still needs the live Lemon Squeezy connection.
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  className="border-white/15 bg-transparent text-white hover:bg-white/5"
                  onClick={closeConfirm}
                  disabled={isStartingCheckout}
                >
                  Cancel
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
                  Continue
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
