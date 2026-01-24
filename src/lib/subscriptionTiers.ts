// Subscription tiers configuration
// Replace price_id and product_id with actual Stripe IDs from your dashboard

export interface SubscriptionTier {
  id: string;
  name: string;
  price_id: string; // Replace with your Stripe price ID
  product_id: string; // Replace with your Stripe product ID
  price: number;
  currency: string;
  interval: 'month' | 'year';
  arenaPointsPerMonth: number;
  features: string[];
  popular?: boolean;
}

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price_id: 'price_STARTER_ID', // TODO: Replace with actual Stripe price ID
    product_id: 'prod_STARTER_ID', // TODO: Replace with actual Stripe product ID
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    arenaPointsPerMonth: 500,
    features: [
      '500 Arena Points / month',
      'Basic predictions',
      'Access to public clubs',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price_id: 'price_PRO_ID', // TODO: Replace with actual Stripe price ID
    product_id: 'prod_PRO_ID', // TODO: Replace with actual Stripe product ID
    price: 19.99,
    currency: 'USD',
    interval: 'month',
    arenaPointsPerMonth: 1500,
    features: [
      '1,500 Arena Points / month',
      'Priority predictions',
      'Create & manage clubs',
      'Exclusive badges',
    ],
    popular: true,
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    price_id: 'price_ELITE_ID', // TODO: Replace with actual Stripe price ID
    product_id: 'prod_ELITE_ID', // TODO: Replace with actual Stripe product ID
    price: 39.99,
    currency: 'USD',
    interval: 'month',
    arenaPointsPerMonth: 4000,
    features: [
      '4,000 Arena Points / month',
      'VIP predictions with analytics',
      'Create unlimited clubs',
      'Legendary badges',
      'Priority support',
    ],
  },
};

export const getTierByPriceId = (priceId: string): SubscriptionTier | undefined => {
  return Object.values(SUBSCRIPTION_TIERS).find(tier => tier.price_id === priceId);
};

export const getTierByProductId = (productId: string): SubscriptionTier | undefined => {
  return Object.values(SUBSCRIPTION_TIERS).find(tier => tier.product_id === productId);
};
