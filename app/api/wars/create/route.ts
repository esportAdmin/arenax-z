import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient as createServerSupabaseClient } from "@/integrations/supabase/server";

const createWarBodySchema = z.object({
  clubId: z.string().uuid("clubId must be a valid UUID"),
});

export async function POST(req: Request) {
  const supabase = createServerSupabaseClient();

  try {
    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON payload",
        },
        { status: 400 },
      );
    }

    const parsed = createWarBodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body",
        },
        { status: 400 },
      );
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 },
      );
    }

    const { clubId } = parsed.data;

    const { data, error } = await supabase.rpc("create_war", {
      p_club: clubId,
    });

    if (error) {
      console.error("WAR_CREATE_RPC_FAILED", {
        userId: user.id,
        clubId,
        code: error.code,
        message: error.message,
      });

      const message = error.message ?? "Failed to create war";

      if (
        message.includes("Not authenticated") ||
        message.includes("Not allowed")
      ) {
        return NextResponse.json(
          {
            success: false,
            error: message,
          },
          { status: 403 },
        );
      }

      if (
        message.includes("already in an active war") ||
        message.includes("No opponent available") ||
        message.includes("No territory available")
      ) {
        return NextResponse.json(
          {
            success: false,
            error: message,
          },
          { status: 409 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: "Failed to create war",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        war: data,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("WAR_CREATE_UNEXPECTED_ERROR", {
      error: err instanceof Error ? err.message : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        error: "Unexpected server error",
      },
      { status: 500 },
    );
  }
}
