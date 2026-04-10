import type { Session, User } from "@supabase/supabase-js";

export const DEV_AUTH_COOKIE = "arenax_dev_session";
export const DEV_AUTH_COOKIE_VALUE = "local-qa";
export const DEV_AUTH_USER_ID = "11111111-1111-4111-8111-111111111111";
export const LOCAL_QA_EMAIL =
  process.env.QA_LOCAL_EMAIL ?? "qa.operator@local.arenax.dev";
export const LOCAL_QA_PASSWORD =
  process.env.QA_LOCAL_PASSWORD ?? "ArenaXLocalQA!2025";
export const LOCAL_QA_USERNAME =
  process.env.QA_LOCAL_USERNAME ?? "qa_operator";

export function isDevBypassAvailable() {
  return process.env.NODE_ENV !== "production";
}

export function hasLocalQaBootstrap() {
  return (
    isDevBypassAvailable() &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) &&
    process.env.SUPABASE_SERVICE_ROLE_KEY !== "REPLACE_ME"
  );
}

export function isLocalQaUser(
  user?: { app_metadata?: Record<string, unknown> | null } | null,
) {
  const provider = String(user?.app_metadata?.provider ?? "");
  return provider === "local-qa" || provider === "dev-bypass";
}

export function hasDevAuthCookie(cookieHeader?: string | null) {
  if (!cookieHeader) return false;

  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .some((part) => part === `${DEV_AUTH_COOKIE}=${DEV_AUTH_COOKIE_VALUE}`);
}

export function getDevAuthCookieOptions() {
  return {
    httpOnly: false,
    sameSite: "lax" as const,
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 8,
  };
}

export function getDevBypassUser(): User {
  const now = new Date().toISOString();

  return {
    id: DEV_AUTH_USER_ID,
    app_metadata: { provider: "dev-bypass", providers: ["dev-bypass"] },
    user_metadata: {
      name: "ArenaX QA Operator",
      full_name: "ArenaX QA Operator",
      preferred_username: "qa_operator",
      user_name: "qa_operator",
      display_name: "ArenaX QA Operator",
      avatar_url: null,
    },
    aud: "authenticated",
    confirmation_sent_at: now,
    confirmed_at: now,
    created_at: now,
    email: "qa@local.arenax",
    factors: [],
    identities: [],
    is_anonymous: false,
    last_sign_in_at: now,
    phone: "",
    role: "authenticated",
    updated_at: now,
  };
}

export function getDevBypassSession(): Session {
  const user = getDevBypassUser();

  return {
    access_token: "dev-bypass-access-token",
    refresh_token: "dev-bypass-refresh-token",
    token_type: "bearer",
    expires_in: 60 * 60 * 8,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
    user,
  };
}
