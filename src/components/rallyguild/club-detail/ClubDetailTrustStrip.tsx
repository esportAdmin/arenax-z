"use client";

import { BadgeCheck, CheckCircle2, Shield } from "lucide-react";

/**
 * Keeps the non-financial product guarantee visible at the bottom of the page.
 */
export function ClubDetailTrustStrip() {
  return (
    <div className="mt-6 flex flex-col gap-4 rounded-[1.3rem] border border-cyan-300/18 bg-white/[0.045] px-5 py-4 text-sm text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:flex-row sm:items-center sm:justify-between">
      <div>
        <span className="mr-3 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300">
          Trust strip
        </span>
        Arena Points are virtual engagement units. No cash value. No financial
        return.
      </div>
      <div className="flex gap-3 text-cyan-200">
        <Shield className="h-5 w-5" />
        <CheckCircle2 className="h-5 w-5" />
        <BadgeCheck className="h-5 w-5" />
      </div>
    </div>
  );
}
