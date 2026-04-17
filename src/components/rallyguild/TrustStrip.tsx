import { ShieldCheck } from "lucide-react";

interface TrustStripProps {
  labels?: string[];
}

/**
 * Shows the compliance and trust wording that keeps ArenaX non-gambling.
 *
 * Example:
 * ```tsx
 * <TrustStrip labels={["Discord/Twitch ready"]} />
 * ```
 */
export function TrustStrip({
  labels = ["Discord/Twitch ready", "Community-first", "Secure data", "Retention focused"],
}: TrustStripProps) {
  return (
    <section className="rounded-[1.6rem] border border-cyan-300/18 bg-slate-950/72 p-4">
      <div className="flex flex-col gap-4 text-sm text-slate-300 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-cyan-300" />
          <span className="font-black uppercase tracking-[0.16em] text-cyan-100">
            Trust strip
          </span>
          <span>Virtual engagement only. No cash value. No financial return.</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {labels.map((label) => (
            <span
              key={label}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
