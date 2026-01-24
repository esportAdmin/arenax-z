"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

export type NavigateOptions = { replace?: boolean };

/**
 * Unified navigation for ArenaX.
 * Uses Next.js router so it's safe with App Router pages/components.
 *
 * @example
 * const navigate = useAppNavigate();
 * navigate("/dashboard");
 * navigate("/auth", { replace: true });
 */
export function useAppNavigate(): (to: string, opts?: NavigateOptions) => void {
  const router = useRouter();

  return useMemo(() => {
    return (to: string, opts?: NavigateOptions) => {
      if (opts?.replace) router.replace(to);
      else router.push(to);
    };
  }, [router]);
}
