import { NextResponse, type NextRequest } from "next/server";
import {
  DEV_AUTH_COOKIE,
  DEV_AUTH_COOKIE_VALUE,
  getDevAuthCookieOptions,
  isDevBypassAvailable,
} from "@/lib/dev-auth";
import { sanitizeRedirectPath } from "@/lib/auth-flow";

export async function GET(request: NextRequest) {
  if (!isDevBypassAvailable()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const redirect = sanitizeRedirectPath(
    request.nextUrl.searchParams.get("redirect") ?? "/dashboard",
  );
  const response = NextResponse.redirect(new URL(redirect, request.url));
  response.cookies.set(
    DEV_AUTH_COOKIE,
    DEV_AUTH_COOKIE_VALUE,
    getDevAuthCookieOptions(),
  );
  return response;
}

export async function DELETE(_request: NextRequest) {
  if (!isDevBypassAvailable()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(DEV_AUTH_COOKIE, "", {
    ...getDevAuthCookieOptions(),
    maxAge: 0,
  });
  return response;
}
