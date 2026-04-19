"use client";

import Navigation from "@/components/landing/Navigation";
import { LiveCallsRitual } from "@/components/rallyguild/live-calls/LiveCallsRitual";

/**
 * Renders the live-calls ritual route.
 *
 * Example:
 * ```tsx
 * <Page />
 * ```
 */
export default function Page() {
  return (
    <>
      <Navigation />
      <LiveCallsRitual />
    </>
  );
}
