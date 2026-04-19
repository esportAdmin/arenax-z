"use client";

import Navigation from "@/components/landing/Navigation";
import { ClubsDirectory } from "@/components/rallyguild/clubs/ClubsDirectory";

/**
 * Renders the premium club directory route.
 *
 * Example:
 * ```tsx
 * <ClubsPage />
 * ```
 */
export default function ClubsPage() {
  return (
    <>
      <Navigation />
      <ClubsDirectory />
    </>
  );
}
