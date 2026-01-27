import * as React from "react";

import { cn } from "@/lib/utils";

type TeamLogoProps = {
  name: string;
  /** Either an image URL/path (https://..., /images/...) OR a fallback emoji. */
  logo: string;
  size?: number;
  shape?: "full" | "lg";
  fit?: "cover" | "contain";
  className?: string;
};

/**
 * isImageLogo
 *
 * @example
 * isImageLogo("https://cdn.pandascore.co/images/team/image/1.png")
 */
function isImageLogo(value: string) {
  const v = (value ?? "").trim();
  if (!v) return false;
  // absolute URLs, protocol-relative URLs, data URLs, or local absolute paths
  return (
    /^https?:\/\//i.test(v) ||
    /^\/\//.test(v) ||
    /^data:image\//i.test(v) ||
    v.startsWith("/")
  );
}

/**
 * TeamLogo
 *
 * @example
 * <TeamLogo name="Team A" logo="https://cdn.pandascore.co/images/team/image/1.png" />
 */
export function TeamLogo({
  name,
  logo,
  size = 44,
  shape = "full",
  fit = "cover",
  className,
}: TeamLogoProps) {
  const px = `${size}px`;
  const radius = shape === "lg" ? "rounded-lg" : "rounded-full";

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden bg-white/5 ring-1 ring-white/10",
        radius,
        className,
      )}
      style={{ width: px, height: px }}
    >
      {isImageLogo(logo) ? (
        <img
          src={logo}
          alt={`${name} logo`}
          className={cn("h-full w-full", fit === "contain" ? "object-contain" : "object-cover")}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="text-2xl" aria-label={`${name} emblem`}>
          {logo || "🎮"}
        </span>
      )}
    </div>
  );
}
