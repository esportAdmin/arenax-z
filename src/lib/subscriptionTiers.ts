// Subscription tiers configuration.
// Use Lemon Squeezy variant/product IDs for production billing.

export interface SubscriptionTier {
  id: string;
  name: string;
  price_id: string; // Lemon Squeezy variant ID, kept as price_id for API compatibility.
  product_id: string; // Lemon Squeezy product ID, kept as product_id for API compatibility.
  price: number;
  currency: string;
  interval: 'month' | 'year';
  arenaPointsPerMonth: number;
  features: string[];
  popular?: boolean;
}

const env = {
  starterPriceId:
    process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_STARTER ??
    process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER,
  proPriceId:
    process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO ??
    process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
  elitePriceId:
    process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ELITE ??
    process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE,
  starterProductId:
    process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_STARTER ??
    process.env.NEXT_PUBLIC_STRIPE_PRODUCT_STARTER,
  proProductId:
    process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_PRO ??
    process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PRO,
  eliteProductId:
    process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_ELITE ??
    process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ELITE,
} as const;

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price_id: env.starterPriceId ?? 'variant_STARTER_ID',
    product_id: env.starterProductId ?? 'product_STARTER_ID',
    price: 29,
    currency: 'USD',
    interval: 'month',
    arenaPointsPerMonth: 500,
    features: [
      'Live ritual planning',
      'Club command tools',
      'Member activation loops',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price_id: env.proPriceId ?? 'variant_PRO_ID',
    product_id: env.proProductId ?? 'product_PRO_ID',
    price: 79,
    currency: 'USD',
    interval: 'month',
    arenaPointsPerMonth: 1500,
    features: [
      'Full club metrics',
      'Advanced war-room tracking',
      'Reward visibility',
      'Priority support',
    ],
    popular: true,
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    price_id: env.elitePriceId ?? 'variant_ELITE_ID',
    product_id: env.eliteProductId ?? 'product_ELITE_ID',
    price: 149,
    currency: 'USD',
    interval: 'month',
    arenaPointsPerMonth: 4000,
    features: [
      'Dedicated admin support',
      'Concierge onboarding',
      'SLA priority support',
      'Custom admin workflows',
    ],
  },
};

export const getTierByPriceId = (priceId: string): SubscriptionTier | undefined => {
  return Object.values(SUBSCRIPTION_TIERS).find(tier => tier.price_id === priceId);
};

export const getTierByProductId = (productId: string): SubscriptionTier | undefined => {
  return Object.values(SUBSCRIPTION_TIERS).find(tier => tier.product_id === productId);
};
