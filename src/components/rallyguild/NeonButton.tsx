import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type NeonButtonTone = "cyan" | "orange" | "blue" | "ghost";

const toneClass: Record<NeonButtonTone, string> = {
  cyan: "border-cyan-200/45 bg-cyan-300 text-slate-950 shadow-[0_0_26px_rgba(34,211,238,0.38)] hover:bg-cyan-200",
  orange: "border-orange-300/45 bg-orange-500/16 text-orange-100 shadow-[0_0_22px_rgba(249,115,22,0.18)] hover:bg-orange-500/24",
  blue: "border-blue-300/35 bg-blue-500/16 text-blue-100 shadow-[0_0_22px_rgba(59,130,246,0.16)] hover:bg-blue-500/24",
  ghost: "border-white/12 bg-white/[0.045] text-slate-100 hover:bg-white/10",
};

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  tone?: NeonButtonTone;
}

/**
 * Renders the compact neon CTA style used in tactical HUD panels.
 *
 * Example:
 * ```tsx
 * <NeonButton tone="cyan">Rally members</NeonButton>
 * ```
 */
export function NeonButton({
  children,
  className,
  tone = "cyan",
  type = "button",
  ...props
}: NeonButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-xl border px-5 py-3 text-center",
        "font-display text-xs font-black uppercase leading-tight tracking-[0.12em] transition-transform duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/60 disabled:cursor-not-allowed disabled:opacity-55",
        "hover:-translate-y-0.5",
        toneClass[tone],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
