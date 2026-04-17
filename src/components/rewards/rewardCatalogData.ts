import type { Database } from "@/integrations/supabase/types";

type PrizeRow = Database["public"]["Tables"]["arena_prizes"]["Row"];

export type Prize = Omit<PrizeRow, "active"> & {
  active: boolean;
};

export const FALLBACK_PRIZES: Prize[] = [
  {
    id: 1,
    sku: "qa-premium-pass",
    name: "Premium Command Pass",
    description: "A flagship reward card that keeps the vault feeling desirable.",
    price_arena: 1200,
    usd_value: 19,
    stock: 14,
    category: "premium",
    image_url: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updated_at: new Date().toISOString(),
    active: true,
  },
  {
    id: 2,
    sku: "qa-elite-badge",
    name: "Elite Club Crest",
    description: "A high-status cosmetic unlock for social proof inside the product.",
    price_arena: 850,
    usd_value: 12,
    stock: 32,
    category: "identity",
    image_url: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updated_at: new Date().toISOString(),
    active: true,
  },
  {
    id: 3,
    sku: "qa-drop-crate",
    name: "Weekly Drop Crate",
    description: "A repeatable vault reward that reinforces return behavior.",
    price_arena: 500,
    usd_value: 7,
    stock: 99,
    category: "drops",
    image_url: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updated_at: new Date().toISOString(),
    active: true,
  },
];

/**
 * Normalizes Supabase prize rows into active catalog entries.
 *
 * Example:
 * ```ts
 * normalizePrize(row)
 * ```
 */
export function normalizePrize(row: PrizeRow): Prize {
  return {
    ...row,
    active: row.active ?? false,
  };
}
