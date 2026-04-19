"use client";

import { LockKeyhole, type LucideIcon } from "lucide-react";

import { RouteButton } from "@/components/RouteButton";
import { cn } from "@/lib/utils";

interface ReturnNudgeCardProps {
  icon: LucideIcon;
  label: string;
  title: string;
  text: string;
  tone?: "cyan" | "amber" | "rose";
  lockedText?: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}

const accentClasses = {
  cyan: "border-cyan-400/18 bg-cyan-400/8",
  amber: "border-amber-400/18 bg-amber-400/8",
  rose: "border-rose-400/18 bg-rose-400/8",
};

const iconClasses = {
  cyan: "text-cyan-300",
  amber: "text-amber-300",
  rose: "text-rose-300",
};

export function ReturnNudgeCard({
  icon: Icon,
  label,
  title,
  text,
  tone = "cyan",
  lockedText,
  actionHref,
  actionLabel,
  className,
}: ReturnNudgeCardProps) {
  return (
    <div
      className={cn(
        "surface-panel hero-sheen h-full p-4 sm:p-5",
        accentClasses[tone],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {label}
          </div>
          <div className="mt-2 text-lg font-display font-bold text-white">
            {title}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5">
          <Icon className={cn("h-4 w-4", iconClasses[tone])} />
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>

      {lockedText ? (
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">
          <LockKeyhole className="h-3.5 w-3.5 text-white/70" />
          {lockedText}
        </div>
      ) : null}

      {actionHref && actionLabel ? (
        <RouteButton
          href={actionHref}
          variant="outline"
          size="sm"
          className="mt-4 w-full justify-between border-white/10 bg-white/5 text-slate-100 hover:border-primary/30 hover:bg-primary/10 hover:text-white"
        >
          {actionLabel}
        </RouteButton>
      ) : null}
    </div>
  );
}
