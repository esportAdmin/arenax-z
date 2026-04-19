"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NAV_ITEMS = [
  { label: "Clubs", href: "/clubs" },
  { label: "Wars", href: "/wars" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Sign In", href: "/login" },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const accountHref = user ? "/dashboard" : "/login";
  const accountLabel = user ? "Dashboard" : "Sign In";

  const navigateTo = useCallback(
    (href: string) => {
      setIsMobileMenuOpen(false);
      router.push(href);
    },
    [router],
  );

  return (
    <nav className="pointer-events-auto absolute left-0 top-0 z-[90] isolate w-full px-4 py-4 sm:px-5 md:px-8 md:py-5">
      <div className="relative z-[1] mx-auto flex max-w-7xl items-center justify-between rounded-[1.4rem] border border-white/10 bg-slate-950/60 px-3 py-3 backdrop-blur-2xl sm:px-4 md:rounded-[1.6rem] md:px-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-12 w-[220px] overflow-hidden rounded-2xl border border-primary/20 bg-slate-950/45 shadow-[0_0_18px_rgba(77,243,255,0.1)] sm:h-[52px] sm:w-[238px]">
            <Image
              src="/brand/rallyguild-navbar.svg"
              alt="RallyGuild by ArenaX"
              fill
              sizes="(max-width: 640px) 220px, 238px"
              className="object-contain p-0.5"
              priority
            />
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {NAV_ITEMS.map((item) => {
            const href = item.href === "/login" ? accountHref : item.href;
            const label = item.href === "/login" ? accountLabel : item.label;
            const isActive = pathname === href;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => navigateTo(href)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
                    : "text-slate-300 hover:bg-white/6 hover:text-white"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="eyebrow-badge">
            <span className="h-2 w-2 rounded-full bg-success pulse-glow" />
            Live global map
          </div>

          <button
            type="button"
            onClick={() => navigateTo(accountHref)}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/12 px-4 py-2 text-sm font-semibold text-white transition-all hover:border-primary/35 hover:bg-primary/18"
          >
            {user ? "Open Dashboard" : "Enter Platform"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white md:hidden"
          onClick={() => setIsMobileMenuOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isMobileMenuOpen ? (
        <div className="mx-auto mt-3 max-w-7xl rounded-[1.5rem] border border-white/10 bg-slate-950/94 p-3 shadow-[0_24px_60px_rgba(2,6,23,0.42)] backdrop-blur-2xl md:hidden">
          <div className="mb-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            Open the platform from here, then keep the world state one tap away.
          </div>
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const href = item.href === "/login" ? accountHref : item.href;
              const label = item.href === "/login" ? accountLabel : item.label;
              const isActive = pathname === href;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => navigateTo(href)}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{label}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => navigateTo(accountHref)}
              className="mt-3 flex items-center justify-center gap-2 rounded-2xl border border-primary/25 bg-primary/14 px-4 py-3 text-sm font-semibold text-white"
            >
              {user ? "Open Dashboard" : "Enter Platform"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
