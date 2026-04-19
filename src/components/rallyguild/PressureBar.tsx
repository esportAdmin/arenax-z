import { cn } from "@/lib/utils";

interface PressureBarProps {
  className?: string;
  label?: string;
  tone?: "cyan" | "orange" | "emerald";
  value: number;
}

/**
 * Displays territory pressure as a glowing HUD progress bar.
 *
 * Example:
 * ```tsx
 * <PressureBar label="Pressure" value={78} tone="orange" />
 * ```
 */
export function PressureBar({
  className,
  label = "Pressure",
  tone = "cyan",
  value,
}: PressureBarProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));
  const fillClass = {
    cyan: "from-cyan-300 via-blue-300 to-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.48)]",
    orange: "from-cyan-300 via-orange-300 to-orange-500 shadow-[0_0_18px_rgba(249,115,22,0.46)]",
    emerald: "from-emerald-300 via-cyan-300 to-cyan-400 shadow-[0_0_16px_rgba(52,211,153,0.42)]",
  }[tone];

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between text-sm font-bold">
        <span className="text-slate-300">{label}</span>
        <span className={tone === "orange" ? "text-orange-100" : "text-cyan-100"}>
          {normalizedValue}%
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r", fillClass)}
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
    </div>
  );
}
