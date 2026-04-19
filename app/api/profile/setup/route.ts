/**
 * app/api/profile/setup/route.ts
 * Appelé par OnboardingFlow.tsx:49 — POST /api/profile/setup
 * Délègue à l'implémentation réelle dans /api/onboarding (POST).
 *
 * Référencée par : src/components/onboarding/OnboardingFlow.tsx:49
 */

import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest): Promise<Response> {
  const body = await req.text();

  // Déléguer à /api/onboarding qui contient l'implémentation complète
  const base     = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const upstream = await fetch(`${base}/api/onboarding`, {
    method:  "POST",
    headers: {
      "Content-Type": "application/json",
      // Propager le cookie de session
      cookie: req.headers.get("cookie") ?? "",
    },
    body,
  });

  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
