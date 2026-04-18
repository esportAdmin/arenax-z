"use client";

import { useCallback, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Check,
  ChevronRight,
  Crown,
  Gem,
  HelpCircle,
  Loader2,
  Radio,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
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
type Accent = "cyan" | "violet" | "orange" | "gold";

type Plan = {
  id: PlanId;
  name: string;
  role: string;
  price: string;
  interval: string;
  accent: Accent;
  icon: LucideIcon;
  cta: string;
  features: string[];
  recommended?: boolean;
};

type ConfirmState = { open: false } | { open: true; planId: PaidPlanId };

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    role: "Community Essentials",
    price: "$0",
    interval: "/mo",
    accent: "cyan",
    icon: Users,
    cta: "Start Free",
    features: ["Basic club tools", "Limited war-room access", "Community activation", "Standard support"],
  },
  {
    id: "starter",
    name: "Starter",
    role: "Momentum Builder",
    price: "$29",
    interval: "/mo",
    accent: "violet",
    icon: Sparkles,
    cta: "Upgrade to Starter",
    features: ["Live ritual planning", "Club command tools", "War-room intro", "Member activation loops"],
  },
  {
    id: "pro",
    name: "Pro",
    role: "Retention Command",
    price: "$79",
    interval: "/mo",
    accent: "orange",
    icon: Crown,
    cta: "Upgrade to Pro",
    recommended: true,
    features: ["All Starter features", "Full club metrics", "Advanced war-room tracking", "Reward visibility"],
  },
  {
    id: "elite",
    name: "Elite",
    role: "Concierge Suite",
    price: "$149",
    interval: "/mo",
    accent: "gold",
    icon: Gem,
    cta: "Contact Sales",
    features: ["All Pro features", "Dedicated admin support", "Concierge onboarding", "SLA priority support"],
  },
];

const comparison = [
  ["Live ritual planning", true, true, true, true],
  ["Club command tools", true, true, true, true],
  ["War-room pressure tracking", false, true, true, true],
  ["Member activation loops", false, true, true, true],
  ["Advanced admin workflows", false, false, true, true],
  ["Priority support", false, false, true, true],
  ["Concierge onboarding", false, false, false, true],
] as const;

const faqs = [
  ["Is this a gambling platform?", "No. RallyGuild is a retention and community operations tool. There is no wagering, payout, betting, cash prize, or financial return."],
  ["How does billing work?", "Paid plans are prepared for Lemon Squeezy hosted checkout in production, with subscriptions managed by the merchant-of-record flow."],
  ["Can I switch plans?", "Yes. Plan changes should be handled from the billing portal once the live Lemon Squeezy setup is connected."],
  ["What is Launch Concierge?", "A one-time onboarding add-on for Discord/Twitch setup, role configuration, ritual planning, and launch support."],
] as const;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Returns the tactical color recipe used by command-tier cards.
 *
 * @example
 * const visuals = getPlanVisuals("orange");
 * console.log(visuals.border);
 */
function getPlanVisuals(accent: Accent) {
  const recipes = {
    cyan: {
      border: "border-cyan-300/35 shadow-[0_0_32px_rgba(34,211,238,0.18)]",
      glow: "from-cyan-300/22 via-cyan-300/6 to-transparent",
      text: "text-cyan-200",
      button: "from-cyan-300 to-cyan-500 text-slate-950 shadow-[0_0_22px_rgba(34,211,238,0.34)]",
      chip: "border-cyan-300/25 bg-cyan-300/10 text-cyan-100",
    },
    violet: {
      border: "border-violet-300/35 shadow-[0_0_32px_rgba(167,139,250,0.16)]",
      glow: "from-violet-400/20 via-violet-400/6 to-transparent",
      text: "text-violet-200",
      button: "from-cyan-300 to-violet-400 text-slate-950 shadow-[0_0_22px_rgba(167,139,250,0.28)]",
      chip: "border-violet-300/25 bg-violet-300/10 text-violet-100",
    },
    orange: {
      border: "border-orange-300/60 shadow-[0_0_42px_rgba(251,146,60,0.22)]",
      glow: "from-orange-300/24 via-cyan-300/8 to-transparent",
      text: "text-orange-200",
      button: "from-orange-300 to-amber-400 text-slate-950 shadow-[0_0_26px_rgba(251,146,60,0.38)]",
      chip: "border-orange-300/35 bg-orange-300/12 text-orange-100",
    },
    gold: {
      border: "border-amber-300/45 shadow-[0_0_34px_rgba(245,158,11,0.18)]",
      glow: "from-amber-300/22 via-orange-300/8 to-transparent",
      text: "text-amber-200",
      button: "from-cyan-300 to-amber-300 text-slate-950 shadow-[0_0_22px_rgba(245,158,11,0.30)]",
      chip: "border-amber-300/30 bg-amber-300/10 text-amber-100",
    },
  };

  return recipes[accent];
}

/**
 * Renders the RallyGuild subscription command center.
 *
 * @example
 * <PremiumSubscriptionHub />
 */
export default function PremiumSubscriptionHub() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { subscribed, tier, subscriptionEnd, loading, createCheckout } = useSubscription();
  const [confirm, setConfirm] = useState<ConfirmState>({ open: false });
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const currentTierId = (tier?.id?.toLowerCase() as PlanId | undefined) ?? "free";

  const openConfirm = useCallback(
    (planId: PlanId) => {
      if (planId === "free") {
        toast({
          title: "Free tier ready",
          description: "Use Discord or Twitch login, then launch your first community ritual.",
        });
        return;
      }

      setConfirm({ open: true, planId });
    },
    [toast],
  );

  const startCheckout = useCallback(async () => {
    if (!confirm.open) return;

    if (!user) {
      toast({
        title: "Sign-in required",
        description: "Connect Discord or Twitch before activating a paid command tier.",
        variant: "destructive",
      });
      setConfirm({ open: false });
      return;
    }

    const tierConfig = SUBSCRIPTION_TIERS[confirm.planId];
    const priceId = tierConfig?.price_id;

    if (!priceId || /_ID$/.test(priceId)) {
      toast({
        title: "Billing not live yet",
        description: "Add the Lemon Squeezy variant ID before opening production checkout.",
        variant: "destructive",
      });
      setConfirm({ open: false });
      return;
    }

    setCheckoutLoading(true);
    try {
      await createCheckout(priceId);
      setConfirm({ open: false });
    } finally {
      setCheckoutLoading(false);
    }
  }, [confirm, createCheckout, toast, user]);

  return (
    <div className="min-h-screen overflow-hidden bg-[#050b14] text-white">
      <Navbar />

      <main className="relative isolate pb-16 pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.045)_1px,transparent_1px)] bg-[size:72px_72px]" />
          <div className="absolute inset-0 bg-[radial-gradient(950px_circle_at_18%_16%,rgba(34,211,238,0.22),transparent_58%),radial-gradient(860px_circle_at_84%_25%,rgba(168,85,247,0.18),transparent_58%),radial-gradient(680px_circle_at_52%_54%,rgba(251,146,60,0.16),transparent_64%)]" />
          <div className="absolute left-0 right-0 top-40 h-28 bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.26),rgba(251,146,60,0.20),transparent)] blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.58)_82%)]" />
        </div>

        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <section className="relative rounded-[2rem] border border-cyan-300/15 bg-slate-950/38 px-5 py-10 text-center shadow-[0_0_70px_rgba(34,211,238,0.08)] backdrop-blur-xl sm:px-8">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/80 to-transparent" />
            <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.24em] text-cyan-100">
              <Radio className="h-4 w-4" />
              RallyGuild command tiers
            </p>
            <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
              Turn your community into a{" "}
              <span className="bg-gradient-to-r from-cyan-200 via-cyan-300 to-orange-200 bg-clip-text text-transparent">
                daily comeback loop.
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base text-slate-300 sm:text-lg">
              Upgrade your Discord/Twitch command center with retention tools, live rituals, club momentum, and premium admin workflows.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button className="h-12 rounded-xl bg-cyan-300 px-8 font-black text-slate-950 hover:bg-cyan-200">
                Choose your command tier
              </Button>
              <Button variant="outline" className="h-12 rounded-xl border-orange-300/45 bg-orange-300/10 px-8 font-black text-orange-100 hover:bg-orange-300/15">
                View launch-safe policy
              </Button>
            </div>
            <div className="mx-auto mt-7 flex max-w-4xl flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-bold text-slate-300">
              {["Discord/Twitch ready", "Community-first", "No cash value", "No financial return", "Built for retention"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full px-3 py-1">
                  <ShieldCheck className="h-4 w-4 text-cyan-200" />
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-4">
            {plans.map((plan) => {
              const visuals = getPlanVisuals(plan.accent);
              const Icon = plan.icon;
              const isCurrent = subscribed && currentTierId === plan.id;

              return (
                <article key={plan.id} className={cx("relative overflow-hidden rounded-[1.65rem] border bg-slate-950/62 p-5 backdrop-blur-xl transition hover:-translate-y-1", visuals.border, plan.recommended && "lg:-mt-4")}>
                  <div className={cx("absolute inset-x-0 top-0 h-28 bg-gradient-to-b", visuals.glow)} />
                  {plan.recommended ? (
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl border border-orange-300/40 bg-orange-300 px-4 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-950">
                      Recommended
                    </div>
                  ) : null}
                  <div className="relative pt-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className={cx("flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em]", visuals.text)}>
                          <Icon className="h-5 w-5" />
                          {plan.name}
                        </div>
                        <p className="mt-1 text-sm font-semibold text-slate-300">{plan.role}</p>
                      </div>
                      {isCurrent ? <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-100">Active</span> : null}
                    </div>
                    <div className="mt-6 flex items-end gap-2">
                      <span className="text-4xl font-black tracking-tight">{plan.price}</span>
                      <span className="pb-1 text-sm font-bold text-slate-400">{plan.interval}</span>
                    </div>
                    <ul className="mt-5 space-y-2.5">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button disabled={isCurrent || checkoutLoading} onClick={() => openConfirm(plan.id)} className={cx("mt-7 h-11 w-full rounded-xl bg-gradient-to-r font-black", visuals.button)}>
                      {isCurrent ? "Current tier" : plan.cta}
                      {!isCurrent ? <ChevronRight className="h-4 w-4" /> : null}
                    </Button>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[1.5rem] border border-cyan-300/25 bg-slate-950/58 p-5 shadow-[0_0_38px_rgba(34,211,238,0.12)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-black text-cyan-100">Command tier comparison</h2>
                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">
                  Monthly plans
                </span>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[620px] border-separate border-spacing-0 text-sm">
                  <thead className="text-left text-xs uppercase tracking-[0.18em] text-slate-400">
                    <tr>{["Feature", "Free", "Starter", "Pro", "Elite"].map((head) => <th key={head} className="border-b border-white/10 px-3 py-3">{head}</th>)}</tr>
                  </thead>
                  <tbody>
                    {comparison.map(([feature, free, starter, pro, elite]) => (
                      <tr key={feature} className="text-slate-300">
                        <td className="border-b border-white/8 px-3 py-3 font-semibold">{feature}</td>
                        {[free, starter, pro, elite].map((enabled, index) => (
                          <td key={`${feature}-${index}`} className="border-b border-white/8 px-3 py-3">
                            {enabled ? <Check className="h-4 w-4 text-cyan-200" /> : <span className="text-slate-600">—</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-[1.5rem] border border-orange-300/40 bg-orange-300/10 p-5 shadow-[0_0_34px_rgba(251,146,60,0.16)] backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-300/30 bg-orange-300/12">
                    <Bot className="h-6 w-6 text-orange-100" />
                  </div>
                  <div>
                    <h2 className="font-black text-orange-100">Launch Concierge</h2>
                    <p className="text-sm text-orange-50/70">One-time setup for Discord/Twitch community activation.</p>
                  </div>
                </div>
                <Button className="mt-5 h-11 w-full rounded-xl bg-gradient-to-r from-orange-300 to-amber-300 font-black text-slate-950">
                  Add Launch Concierge
                </Button>
              </div>
              <div className="rounded-[1.5rem] border border-amber-300/30 bg-slate-950/66 p-5 backdrop-blur-xl">
                <h2 className="flex items-center gap-2 font-black text-amber-100">
                  <Zap className="h-5 w-5" />
                  Launch-safe monetization
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Arena Points, badges, perks, and rewards are virtual engagement elements only. They have no cash value, no financial return, and cannot be redeemed for money.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-300 backdrop-blur-xl">
                <div className="font-black text-white">Status</div>
                <p className="mt-2">
                  {loading ? "Checking subscription..." : subscribed ? `Active tier: ${tier?.name ?? "Premium"}${subscriptionEnd ? ` until ${subscriptionEnd}` : ""}` : "No active paid tier yet."}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-7 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <h2 className="text-center text-xl font-black">Frequently Asked Questions</h2>
            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              {faqs.map(([question, answer]) => (
                <details key={question} className="group rounded-2xl border border-cyan-300/15 bg-slate-950/62 p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-cyan-100">
                    <span>{question}</span>
                    <HelpCircle className="h-4 w-4 shrink-0 transition group-open:rotate-45" />
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{answer}</p>
                </details>
              ))}
            </div>
          </section>

          <div className="mt-10">
            <Footer />
          </div>
        </div>
      </main>

      <Dialog open={confirm.open} onOpenChange={(open) => !open && setConfirm({ open: false })}>
        <DialogContent className="border-cyan-300/20 bg-slate-950/90 text-white shadow-[0_0_45px_rgba(34,211,238,0.15)] backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>Open Lemon Squeezy checkout</DialogTitle>
            <DialogDescription className="text-slate-300">
              You are activating a community command tier. No cash rewards, payouts, wagering, or financial return are offered.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/5" onClick={() => setConfirm({ open: false })}>
              Cancel
            </Button>
            <Button className="bg-cyan-300 font-black text-slate-950 hover:bg-cyan-200" onClick={startCheckout} disabled={checkoutLoading}>
              {checkoutLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
