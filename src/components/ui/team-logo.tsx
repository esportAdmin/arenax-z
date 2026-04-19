import * as React from "react";

import { cn } from "@/lib/utils";

type TeamLogoProps = {
  name: string;
  /** Either an image URL/path (https://..., /images/...) OR a short fallback label. */
  logo: string;
  size?: number;
  shape?: "full" | "lg";
  fit?: "cover" | "contain";
  className?: string;
};

function isImageLogo(value: string) {
  const v = (value ?? "").trim();
  if (!v) return false;

  return (
    /^https?:\/\//i.test(v) ||
    /^\/\//.test(v) ||
    /^data:image\//i.test(v) ||
    v.startsWith("/")
  );
}

function getInitials(name: string) {
  return (
    name
      ?.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "RG"
  );
}

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
  const fallback = logo && !isImageLogo(logo) && logo.length <= 4 ? logo : getInitials(name);

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
        <span
          className="max-w-full truncate px-1 text-center font-display text-sm font-black tracking-wide text-cyan-100"
          aria-label={`${name} emblem`}
        >
          {fallback}
        </span>
      )}
    </div>
  );
}
