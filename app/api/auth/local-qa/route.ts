import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { sanitizeRedirectPath } from "@/lib/auth-flow";
import {
  hasLocalQaBootstrap,
  LOCAL_QA_EMAIL,
  LOCAL_QA_PASSWORD,
  LOCAL_QA_USERNAME,
} from "@/lib/dev-auth";

async function findUserIdByEmail(admin: any, email: string) {
  let page = 1;

  while (page <= 5) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });

    if (error) {
      throw error;
    }

    const user = data.users.find(
      (candidate: { email?: string | null; id: string }) =>
        candidate.email?.toLowerCase() === email.toLowerCase(),
    );

    if (user) {
      return user.id;
    }

    if (data.users.length < 200) {
      break;
    }

    page += 1;
  }

  return null;
}

export async function GET(request: NextRequest) {
  if (!hasLocalQaBootstrap()) {
    return NextResponse.json(
      { error: "Local QA login is unavailable in this environment." },
      { status: 503 },
    );
  }

  const redirect = sanitizeRedirectPath(
    request.nextUrl.searchParams.get("redirect") ?? "/dashboard",
  );
  const response = NextResponse.redirect(new URL(redirect, request.url));

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const createResult = await admin.auth.admin.createUser({
    email: LOCAL_QA_EMAIL,
    password: LOCAL_QA_PASSWORD,
    email_confirm: true,
    user_metadata: {
      username: LOCAL_QA_USERNAME,
      full_name: "ArenaX QA Operator",
      preferred_username: LOCAL_QA_USERNAME,
      provider: "local-qa",
    },
    app_metadata: {
      provider: "local-qa",
      providers: ["local-qa"],
    },
  });

  if (createResult.error && !createResult.error.message.toLowerCase().includes("already")) {
    return NextResponse.json(
      { error: createResult.error.message },
      { status: 500 },
    );
  }

  let userId = createResult.data.user?.id ?? null;

  if (!userId) {
    userId = await findUserIdByEmail(admin, LOCAL_QA_EMAIL);
  }

  if (!userId) {
    return NextResponse.json(
      { error: "The local QA account could not be provisioned." },
      { status: 500 },
    );
  }

  await admin.auth.admin.updateUserById(userId, {
    password: LOCAL_QA_PASSWORD,
    email_confirm: true,
    user_metadata: {
      username: LOCAL_QA_USERNAME,
      full_name: "ArenaX QA Operator",
      preferred_username: LOCAL_QA_USERNAME,
      display_name: "ArenaX QA Operator",
    },
  });

  await admin.from("profiles").upsert(
    {
      id: userId,
      username: LOCAL_QA_USERNAME,
      display_name: "ArenaX QA Operator",
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
      avatar_url: null,
    },
    { onConflict: "id" },
  );

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

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: LOCAL_QA_EMAIL,
    password: LOCAL_QA_PASSWORD,
  });

  if (signInError) {
    return NextResponse.json({ error: signInError.message }, { status: 500 });
  }

  return response;
}
