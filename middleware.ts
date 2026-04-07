/**
 * middleware.ts — racine du projet
 * ─────────────────────────────────────────────────────────────────────
 * Fusionne l'ancien app/admin/middleware.ts (protection /admin/*)
 * avec la couche complète : auth, onboarding, RGPD, sécurité HTTP.
 *
 * Migration :
 *   1. Placer CE fichier à la racine : middleware.ts
 *   2. Supprimer : app/admin/middleware.ts
 *   3. La logique admin existante est intégralement préservée.
 * ─────────────────────────────────────────────────────────────────────
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────

/** Routes accessibles sans session */
const PUBLIC_PATHS = new Set([
  "/",
  "/auth",
  "/auth/callback",
  "/login",
  "/register",
  "/terms",
  "/privacy",
  "/onboarding",
  "/account-pending-deletion",
]);

/** Préfixes API publics (pas de session requise) */
const PUBLIC_API_PREFIXES = ["/api/auth", "/api/health"];

/** Routes UI + API qui nécessitent une session valide */
const AUTH_REQUIRED_PREFIXES = [
  "/play",
  "/match",
  "/profile",
  "/leaderboard",
  "/replays",
  "/wars",
  "/api/queue",
  "/api/friends",
  "/api/analytics",
  "/api/onboarding",
  "/api/gdpr",
  "/api/profile",
  "/api/notifications",
];

// ─────────────────────────────────────────────
// CONTENT SECURITY POLICY
// ─────────────────────────────────────────────

function buildCSP(): string {
  const dev        = process.env.NODE_ENV === "development";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

  const directives: Record<string, string[]> = {
    "default-src":     ["'self'"],
    "script-src":      ["'self'", "'unsafe-inline'", dev ? "'unsafe-eval'" : ""].filter(Boolean),
    "style-src":       ["'self'", "'unsafe-inline'"],
    "img-src":         ["'self'", "data:", "blob:", "https:"],
    "font-src":        ["'self'", "data:"],
    "connect-src":     ["'self'", supabaseUrl, "wss:"].filter(Boolean),
    "media-src":       ["'self'", "blob:"],
    "worker-src":      ["'self'", "blob:"],
    "frame-ancestors": ["'none'"],
    "base-uri":        ["'self'"],
    "form-action":     ["'self'"],
    "upgrade-insecure-requests": [],
  };

  return Object.entries(directives)
    .map(([k, v]) => v.length ? `${k} ${v.join(" ")}` : k)
    .join("; ");
}

function addSecurityHeaders(res: NextResponse, isApi = false): NextResponse {
  res.headers.set("Content-Security-Policy",        buildCSP());
  res.headers.set("Strict-Transport-Security",      "max-age=63072000; includeSubDomains; preload");
  res.headers.set("X-Frame-Options",                "DENY");
  res.headers.set("X-Content-Type-Options",         "nosniff");
  res.headers.set("X-DNS-Prefetch-Control",         "off");
  res.headers.set("Referrer-Policy",                "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy",             "camera=(), microphone=(), geolocation=()");

  if (isApi) {
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? "*";
    res.headers.set("Access-Control-Allow-Origin",  origin);
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }

  return res;
}

// ─────────────────────────────────────────────
// MIDDLEWARE PRINCIPAL
// ─────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api");

  // ── Preflight CORS ───────────────────────────────────────────────
  if (request.method === "OPTIONS") {
    return addSecurityHeaders(new NextResponse(null, { status: 204 }), isApi);
  }

  // ── Assets statiques — bypass total ─────────────────────────────
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    /\.(svg|png|jpg|jpeg|gif|webp|ico|woff2?)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // ── Routes publiques exactes ─────────────────────────────────────
  if (PUBLIC_PATHS.has(pathname)) {
    return addSecurityHeaders(NextResponse.next(), isApi);
  }

  // ── Préfixes API publics ─────────────────────────────────────────
  if (PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))) {
    return addSecurityHeaders(NextResponse.next(), isApi);
  }

  // ── Client Supabase avec propagation des cookies ─────────────────
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          for (const { name, value, options } of cookies) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  // ── Auth gating ──────────────────────────────────────────────────
  const needsAuth = AUTH_REQUIRED_PREFIXES.some((p) => pathname.startsWith(p));

  if (needsAuth && !user) {
    if (isApi) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        isApi,
      );
    }
    const url = new URL("/auth", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // ── Onboarding + RGPD gating (UI uniquement) ─────────────────────
  if (user && needsAuth && !isApi && pathname !== "/onboarding") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed, data_deletion_requested_at")
      .eq("id", user.id)
      .maybeSingle();

    // Compte en cours de suppression RGPD
    if (profile?.data_deletion_requested_at) {
      return NextResponse.redirect(
        new URL("/account-pending-deletion", request.url),
      );
    }

    // Onboarding incomplet ou pas de profil
    if (!profile || !profile.onboarding_completed) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  // ── Protection /admin/* — logique de l'ancien middleware préservée ──
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    // Option A — app_metadata (recommandé, pas de DB call supplémentaire)
    const role = user.app_metadata?.role as string | undefined;
    if (role === "admin") {
      return addSecurityHeaders(response);
    }

    // Option B — fallback via profiles.role (comportement original conservé)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      // Redirection home — pas de 403 qui expose l'existence de la route
      return NextResponse.redirect(new URL("/", request.url));
    }

    return addSecurityHeaders(response);
  }

  return addSecurityHeaders(response, isApi);
}

export const config = {
  // Reprend le matcher de l'ancien middleware + toutes les routes du projet
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
