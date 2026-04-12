"use client";

import { useTierPromotion } from "@/hooks/useTierPromotion";
import { TierUpgradeModal } from "@/components/modals/TierUpgradeModal";

export function TierPromotionListener() {
  const { open, tier, close } = useTierPromotion();

  return <TierUpgradeModal isOpen={open} tier={tier ?? ""} onClose={close} />;
}
