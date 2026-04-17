"use client";

import { ClubDetailExperience } from "@/components/rallyguild/club-detail/ClubDetailExperience";

interface Props {
  slug: string;
}

/**
 * Keeps the App Router legacy entry stable while the visual experience lives
 * in the RallyGuild reconstruction layer.
 */
export default function ClubDetail({ slug }: Props) {
  return <ClubDetailExperience slug={slug} />;
}
