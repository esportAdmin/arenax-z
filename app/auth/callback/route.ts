import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { sanitizeRedirectPath } from "@/lib/auth-flow";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = sanitizeRedirectPath(requestUrl.searchParams.get("next"));
  const authError =
    requestUrl.searchParams.get("error_description") ??
    requestUrl.searchParams.get("error");
  const provider =
    requestUrl.searchParams.get("provider") ??
    requestUrl.searchParams.get("provider_token") ??
    requestUrl.searchParams.get("provider_id");

  const redirectToLoginWithError = (message: string) => {
    const url = new URL("/login", requestUrl.origin);
    url.searchParams.set("authError", message);
    url.searchParams.set("redirect", next);
    if (provider) {
      url.searchParams.set("provider", provider);
    }
    return NextResponse.redirect(url);
  };

  const response = NextResponse.redirect(new URL(next, requestUrl.origin));

  if (authError) {
    return redirectToLoginWithError(authError);
  }

  if (!code) {
    return redirectToLoginWithError("The sign-in response did not include a valid authorization code.");
  }

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

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return redirectToLoginWithError(error.message);
  }

  return response;
}
