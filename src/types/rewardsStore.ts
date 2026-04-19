export interface RewardsStoreItem {
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
