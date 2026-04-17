"use client";

import Navigation from "@/components/landing/Navigation";
import { LeaderboardPrestige } from "@/components/rallyguild/leaderboard/LeaderboardPrestige";

/**
 * Renders the premium leaderboard route.
 *
 * Example:
 * ```tsx
 * <LeaderboardPage />
 * ```
 */
export default function LeaderboardPage() {
  return (
    <>
      <Navigation />
      <LeaderboardPrestige />
    </>
  );
}
