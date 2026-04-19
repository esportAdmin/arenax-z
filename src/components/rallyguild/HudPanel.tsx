import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type HudPanelTone = "cyan" | "orange" | "violet" | "emerald" | "neutral";

const toneClass: Record<HudPanelTone, string> = {
  cyan: "border-cyan-300/24 shadow-[0_0_46px_rgba(34,211,238,0.1)]",
  orange: "border-orange-300/28 shadow-[0_0_46px_rgba(249,115,22,0.12)]",
  violet: "border-violet-300/24 shadow-[0_0_46px_rgba(139,92,246,0.1)]",
  emerald: "border-emerald-300/24 shadow-[0_0_46px_rgba(52,211,153,0.1)]",
  neutral: "border-white/10 shadow-[0_0_42px_rgba(15,23,42,0.32)]",
};

interface HudPanelProps extends HTMLAttributes<HTMLElement> {
  as?: "article" | "aside" | "section" | "div";
  children: ReactNode;
  title?: string;
  eyebrow?: string;
  tone?: HudPanelTone;
}

/**
 * Provides the reusable glass HUD panel used by RallyGuild screens.
 *
 * Example:
 * ```tsx
 * <HudPanel eyebrow="Signal" title="War Room">Ready</HudPanel>
 * ```
 */
export function HudPanel({
  as: Component = "section",
  children,
  className,
  eyebrow,
  title,
  tone = "neutral",
  ...props
}: HudPanelProps) {
  return (
    <Component
      className={cn(
        "relative overflow-hidden rounded-[1.65rem] border bg-slate-950/72 p-5 backdrop-blur-2xl",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_38%,rgba(255,255,255,0.035))]",
        toneClass[tone],
        className,
      )}
      {...props}
    >
      <div className="relative z-10">
        {eyebrow || title ? (
          <div className="mb-4">
            {eyebrow ? (
              <div className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-cyan-200/72">
                {eyebrow}
              </div>
            ) : null}
            {title ? (
              <h2 className="mt-1 font-display text-xl font-black text-white">
                {title}
              </h2>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </Component>
  );
}
