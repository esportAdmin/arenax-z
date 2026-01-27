import { Crown, TrendingUp, Check, Globe, Medal, Percent } from "lucide-react";
import type { ReactNode } from "react";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const premiumColors = {
  gold: "#E7C876",
  goldDeep: "#B88A22",
  blue: "#4AA9FF",
  blueDeep: "#2F6BFF",
  purple: "#B86BFF",
} as const;

/**
 * PremiumCardShell
 *
 * @example
 * <PremiumCardShell title="Title">...</PremiumCardShell>
 */
export function PremiumCardShell({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative rounded-[28px] border border-white/10 bg-gradient-to-b from-white/7 to-white/[0.02] backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.55)]",
        className,
      )}
    >
      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
}

/**
 * PremiumRibbonBadge
 *
 * @example
 * <PremiumRibbonBadge />
 */
export function PremiumRibbonBadge() {
  return (
    <div
      className="absolute -top-1 right-10 h-[86px] w-[56px] rounded-b-xl shadow-[0_12px_30px_rgba(231,200,118,0.25)]"
      style={{
        background: `linear-gradient(180deg, ${premiumColors.gold} 0%, ${premiumColors.goldDeep} 100%)`,
        clipPath: "polygon(0 0, 100% 0, 100% 86%, 50% 100%, 0 86%)",
      }}
    >
      <div className="flex h-[70px] w-full items-center justify-center">
        <Crown className="h-6 w-6" color="#1a1405" />
      </div>
    </div>
  );
}

/**
 * PremiumAvatarRing
 *
 * @example
 * <PremiumAvatarRing initials="EP" />
 */
export function PremiumAvatarRing({
  initials,
  className,
}: {
  initials: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto flex h-[120px] w-[120px] items-center justify-center rounded-full",
        className,
      )}
    >
      <div className="absolute inset-0 rounded-full bg-primary/30 blur-[10px]" />
      <div className="absolute inset-[6px] rounded-full bg-background" />
      <div className="absolute inset-[8px] rounded-full border border-primary/40" />
      <Avatar className="relative h-[96px] w-[96px]">
        <AvatarFallback className="bg-gradient-to-b from-white/10 to-white/5 text-2xl font-display">
          {initials}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

/**
 * PremiumMiniAvatar
 *
 * @example
 * <PremiumMiniAvatar initials="EP" />
 */
export function PremiumMiniAvatar({
  initials,
  className,
}: {
  initials: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative h-9 w-9 rounded-full",
        "shadow-[0_0_18px_rgba(74,169,255,0.12)]",
        className,
      )}
    >
      <div className="absolute inset-0 rounded-full bg-primary/15 blur-[6px]" />
      <div className="absolute inset-[1px] rounded-full border border-white/10 bg-white/5" />
      <div className="absolute inset-[3px] rounded-full border border-primary/25" />
      <Avatar className="relative h-full w-full">
        <AvatarFallback className="bg-transparent text-[11px] font-bold text-white/75">
          {initials}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

/**
 * PremiumGoldPill
 *
 * @example
 * <PremiumGoldPill>Professional</PremiumGoldPill>
 */
export function PremiumGoldPill({ children }: { children: ReactNode }) {
  return (
    <div
      className="inline-flex items-center rounded-full px-4 py-1 text-sm font-semibold"
      style={{
        background: `linear-gradient(180deg, rgba(231,200,118,0.20) 0%, rgba(184,138,34,0.12) 100%)`,
        border: "1px solid rgba(231,200,118,0.25)",
        color: premiumColors.gold,
      }}
    >
      {children}
    </div>
  );
}

/**
 * PremiumBluePillButton
 *
 * @example
 * <PremiumBluePillButton>Prédire</PremiumBluePillButton>
 */
export function PremiumBluePillButton({
  children,
  className,
  href,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
}) {
  const shared = {
    className: cn(
      "h-10 rounded-full px-6 font-semibold",
      "shadow-[0_0_22px_rgba(74,169,255,0.35)]",
      className,
    ),
    style: {
      background: `linear-gradient(90deg, ${premiumColors.blue} 0%, ${premiumColors.blueDeep} 100%)`,
    },
  } as const;

  if (href) {
    return (
      <Button asChild type="button" {...shared}>
        <Link href={href}>{children}</Link>
      </Button>
    );
  }

  return (
    <Button type="button" {...shared}>
      {children}
    </Button>
  );
}

/**
 * PremiumMetricTile
 *
 * @example
 * <PremiumMetricTile label="Total Score" value="8,450" icon={<TrendingUp />} />
 */
export function PremiumMetricTile({
  label,
  value,
  icon,
  href,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  href?: string;
}) {
  const body = (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.35)]",
        href
          ? "transition-colors hover:border-white/20 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          : undefined,
      )}
    >
      <div className="text-sm text-white/60">{label}</div>
      <div className="mt-1 flex items-end justify-between gap-3">
        <div className="text-2xl font-display font-bold text-white">{value}</div>
        <div className="text-white/40">{icon}</div>
      </div>
    </div>
  );

  if (!href) return body;
  return (
    <Link href={href} className="block">
      {body}
    </Link>
  );
}

/**
 * PremiumRingProgress
 *
 * @example
 * <PremiumRingProgress value={72} label="Précision" />
 */
export function PremiumRingProgress({
  value,
  label,
  color,
  href,
}: {
  value: number;
  label: string;
  color?: string;
  href?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const ringColor = color ?? premiumColors.gold;
  const body = (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.35)]",
        href
          ? "transition-colors hover:border-white/20 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          : undefined,
      )}
    >
      <div className="text-sm text-white/60">{label}:</div>
      <div className="mt-3 grid place-items-center">
        <div
          className="relative h-[46px] w-[46px] rounded-full"
          style={{
            background: `conic-gradient(${ringColor} ${clamped}%, rgba(255,255,255,0.12) 0)`,
          }}
        >
          <div className="absolute inset-[5px] rounded-full bg-[#0b1018]" />
          <div className="absolute inset-0 grid place-items-center text-sm font-bold text-white">
            {clamped}%
          </div>
        </div>
      </div>
    </div>
  );

  if (!href) return body;
  return (
    <Link href={href} className="block">
      {body}
    </Link>
  );
}

export const premiumIcons = {
  TrendingUp,
  Check,
  Globe,
  Medal,
  Percent,
} as const;
