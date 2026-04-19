// Lemon Squeezy subscription tiers for RallyGuild community plans.

export type BillingCycle = "monthly" | "yearly";
export type PaidSubscriptionPlanId = "starter" | "pro" | "elite";

export interface SubscriptionTier {
  id: PaidSubscriptionPlanId;
  name: string;
  price_id: string; // Lemon Squeezy variant ID, kept as price_id for API compatibility.
  product_id: string; // Lemon Squeezy product ID, kept as product_id for API compatibility.
  price: number;
  currency: string;
  interval: "month" | "year";
  arenaPointsPerMonth: number;
  features: string[];
  popular?: boolean;
}

const productIds = {
  starter: process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_STARTER ?? "product_STARTER_ID",
  pro: process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_PRO ?? "product_PRO_ID",
  elite: process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_ELITE ?? "product_ELITE_ID",
} as const;

const variantIds = {
  starter: {
    monthly:
      process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_STARTER_MONTHLY ??
      "variant_STARTER_MONTHLY_ID",
    yearly:
      process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_STARTER_YEARLY ??
      "variant_STARTER_YEARLY_ID",
  },
  pro: {
    monthly:
      process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO_MONTHLY ??
      "variant_PRO_MONTHLY_ID",
    yearly:
      process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO_YEARLY ??
      "variant_PRO_YEARLY_ID",
  },
  elite: {
    monthly:
      process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ELITE_MONTHLY ??
      "variant_ELITE_MONTHLY_ID",
    yearly:
      process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ELITE_YEARLY ??
      "variant_ELITE_YEARLY_ID",
  },
} as const;

const features = {
  starter: ["Live ritual planning", "Club command tools", "Member activation loops"],
  pro: ["Full club metrics", "Advanced war-room tracking", "Reward visibility", "Priority support"],
  elite: ["Dedicated admin support", "Concierge onboarding", "SLA priority support", "Custom admin workflows"],
} as const;

const monthlyPrices = { starter: 29, pro: 79, elite: 149 } as const;
const arenaPoints = { starter: 500, pro: 1500, elite: 4000 } as const;
const names = { starter: "Starter", pro: "Pro", elite: "Elite" } as const;

/**
 * Builds a Lemon Squeezy subscription tier for a billing cycle.
 *
 * @example
 * const proYearly = buildTier("pro", "yearly");
 */
function buildTier(id: PaidSubscriptionPlanId, cycle: BillingCycle): SubscriptionTier {
  const isYearly = cycle === "yearly";

  return {
    id,
    name: names[id],
    price_id: variantIds[id][cycle],
    product_id: productIds[id],
    price: isYearly ? monthlyPrices[id] * 10 : monthlyPrices[id],
    currency: "USD",
    interval: isYearly ? "year" : "month",
    arenaPointsPerMonth: arenaPoints[id],
    features: [...features[id]],
    popular: id === "pro",
  };
}

export const SUBSCRIPTION_TIER_VARIANTS: Record<
  PaidSubscriptionPlanId,
  Record<BillingCycle, SubscriptionTier>
> = {
  starter: {
    monthly: buildTier("starter", "monthly"),
    yearly: buildTier("starter", "yearly"),
  },
  pro: {
    monthly: buildTier("pro", "monthly"),
    yearly: buildTier("pro", "yearly"),
  },
  elite: {
    monthly: buildTier("elite", "monthly"),
    yearly: buildTier("elite", "yearly"),
  },
};

export const SUBSCRIPTION_TIERS: Record<PaidSubscriptionPlanId, SubscriptionTier> = {
  starter: SUBSCRIPTION_TIER_VARIANTS.starter.monthly,
  pro: SUBSCRIPTION_TIER_VARIANTS.pro.monthly,
  elite: SUBSCRIPTION_TIER_VARIANTS.elite.monthly,
};

/**
 * Returns the exact Lemon Squeezy checkout variant for a plan and cycle.
 *
 * @example
 * const checkoutTier = getCheckoutTier("starter", "monthly");
 */
export function getCheckoutTier(
  planId: PaidSubscriptionPlanId,
  cycle: BillingCycle,
): SubscriptionTier {
  return SUBSCRIPTION_TIER_VARIANTS[planId][cycle];
}

export const getTierByPriceId = (priceId: string): SubscriptionTier | undefined =>
  Object.values(SUBSCRIPTION_TIER_VARIANTS)
    .flatMap((tier) => Object.values(tier))
    .find((tier) => tier.price_id === priceId);

export const getTierByProductId = (productId: string): SubscriptionTier | undefined =>
  Object.values(SUBSCRIPTION_TIERS).find((tier) => tier.product_id === productId);
